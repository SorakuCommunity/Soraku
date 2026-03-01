-- ============================================================
--  SORAKU COMMUNITY — Database Schema v1.0.a3.2
--  Supabase PostgreSQL with RLS
-- ============================================================

-- ─── Extensions ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Enums ──────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('USER', 'DONATE', 'PREMIUM', 'AGENSI', 'ADMIN', 'MANAGER', 'OWNER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE theme_mode AS ENUM ('dark', 'light', 'auto');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE event_status AS ENUM ('draft', 'active', 'upcoming', 'ended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── users ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username     TEXT UNIQUE NOT NULL,
  email        TEXT UNIQUE,
  bio          TEXT CHECK (length(bio) <= 300),
  avatar_url   TEXT,
  cover_url    TEXT,
  role         user_role NOT NULL DEFAULT 'USER',
  theme_mode   theme_mode NOT NULL DEFAULT 'dark',
  socials      JSONB DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Public read safe fields" ON users
  FOR SELECT USING (true);

CREATE POLICY "Owner update own profile" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM users WHERE id = auth.uid()));

CREATE POLICY "Admin moderate" ON users
  FOR UPDATE USING (public.has_role('ADMIN'));

-- ─── has_role function ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.has_role(role_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role_val user_role;
  required_role user_role;
  role_rank_map INT[];
BEGIN
  IF auth.uid() IS NULL THEN RETURN FALSE; END IF;
  SELECT role INTO user_role_val FROM users WHERE id = auth.uid();
  IF user_role_val IS NULL THEN RETURN FALSE; END IF;
  
  -- Rank check: OWNER > MANAGER > ADMIN > AGENSI > PREMIUM > DONATE > USER
  RETURN CASE user_role_val
    WHEN 'OWNER'   THEN TRUE
    WHEN 'MANAGER' THEN role_name NOT IN ('OWNER')
    WHEN 'ADMIN'   THEN role_name NOT IN ('OWNER', 'MANAGER')
    WHEN 'AGENSI'  THEN role_name NOT IN ('OWNER', 'MANAGER', 'ADMIN')
    WHEN 'PREMIUM' THEN role_name NOT IN ('OWNER', 'MANAGER', 'ADMIN', 'AGENSI')
    WHEN 'DONATE'  THEN role_name NOT IN ('OWNER', 'MANAGER', 'ADMIN', 'AGENSI', 'PREMIUM')
    WHEN 'USER'    THEN role_name = 'USER'
    ELSE FALSE
  END;
END;
$$;

-- ─── Social limit trigger ────────────────────────────────────
CREATE OR REPLACE FUNCTION check_social_limit()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  social_count INT;
  user_role_val user_role;
BEGIN
  SELECT role INTO user_role_val FROM users WHERE id = NEW.id;
  SELECT COUNT(*) INTO social_count FROM jsonb_object_keys(NEW.socials);
  
  IF user_role_val = 'USER' AND social_count > 2 THEN
    RAISE EXCEPTION 'USER role can only have 2 social links. Upgrade to PREMIUM for unlimited.';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER enforce_social_limit
  BEFORE INSERT OR UPDATE OF socials ON users
  FOR EACH ROW EXECUTE FUNCTION check_social_limit();

-- ─── site_settings ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin write site_settings" ON site_settings
  FOR ALL USING (public.has_role('ADMIN'));

-- Default theme palette
INSERT INTO site_settings (key, value) VALUES
  ('primary_color',    '#4FA3D1'),
  ('dark_base_color',  '#1C1E22'),
  ('secondary_color',  '#6E8FA6'),
  ('light_base_color', '#D9DDE3'),
  ('accent_color',     '#E8C2A8'),
  ('theme_mode',       'dark')
ON CONFLICT (key) DO NOTHING;

-- ─── blog_posts ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  content     TEXT,
  excerpt     TEXT,
  cover_image TEXT,
  spotify_id  TEXT,
  published   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published posts" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Author manage own posts" ON blog_posts
  FOR ALL USING (auth.uid() = author_id);

CREATE POLICY "Admin manage all posts" ON blog_posts
  FOR ALL USING (public.has_role('ADMIN'));

-- ─── vtubers ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vtubers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  agency      TEXT,
  avatar_url  TEXT,
  cover_url   TEXT,
  socials     JSONB DEFAULT '{}',
  active      BOOLEAN DEFAULT TRUE,
  created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_vtubers_slug ON vtubers(slug);

ALTER TABLE vtubers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active vtubers" ON vtubers
  FOR SELECT USING (active = true);

CREATE POLICY "Agensi manage vtubers" ON vtubers
  FOR ALL USING (public.has_role('AGENSI'));

-- ─── gallery ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  image_url   TEXT NOT NULL,
  tags        TEXT[] DEFAULT '{}',
  approved    BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read approved gallery" ON gallery
  FOR SELECT USING (approved = true);

CREATE POLICY "Owner manage own gallery" ON gallery
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin approve gallery" ON gallery
  FOR ALL USING (public.has_role('ADMIN'));

-- ─── events ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE,
  description TEXT,
  cover_url   TEXT,
  start_date  TIMESTAMPTZ,
  end_date    TIMESTAMPTZ,
  type        TEXT DEFAULT 'online',
  status      event_status DEFAULT 'draft',
  created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read events" ON events
  FOR SELECT USING (status != 'draft');

CREATE POLICY "Admin manage events" ON events
  FOR ALL USING (public.has_role('ADMIN'));

-- ─── Trigger: auto-create user on auth signup ────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  INSERT INTO users (id, username, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      'https://cdn.discordapp.com/embed/avatars/' || (floor(random()*5)::int) || '.png'
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Indexes for performance ─────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vtubers_active       ON vtubers(active);
CREATE INDEX IF NOT EXISTS idx_gallery_approved     ON gallery(approved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_status        ON events(status, start_date ASC);
CREATE INDEX IF NOT EXISTS idx_users_username       ON users(username);

-- ─── Additional indexes for gallery sorting (v1.0.a3.3) ─────────────────────
CREATE INDEX IF NOT EXISTS idx_gallery_title       ON gallery(title);
CREATE INDEX IF NOT EXISTS idx_gallery_likes       ON gallery(likes DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_created     ON gallery(created_at DESC);

-- ─── likes column on gallery (idempotent) ───────────────────────────────────
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- ─── webhook_settings ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS webhook_settings (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  url        TEXT NOT NULL,
  events     TEXT[] DEFAULT '{}',
  active     BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE webhook_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Admin manage webhook_settings" ON webhook_settings
    FOR ALL USING (public.has_role('ADMIN'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── spotify_tokens ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS spotify_tokens (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  access_token  TEXT NOT NULL,
  refresh_token TEXT,
  expires_at    TIMESTAMPTZ,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE spotify_tokens ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Admin manage spotify_tokens" ON spotify_tokens
    FOR ALL USING (public.has_role('ADMIN'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── user_socials ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_socials (
  id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url      TEXT NOT NULL,
  UNIQUE(user_id, platform)
);

ALTER TABLE user_socials ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public read user_socials" ON user_socials
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Owner manage own socials" ON user_socials
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Premium social limit trigger (max 2 for USER role) ─────────────────────────
CREATE OR REPLACE FUNCTION enforce_social_limit()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  user_role_val user_role;
  social_count  INTEGER;
BEGIN
  SELECT role INTO user_role_val FROM users WHERE id = NEW.user_id;
  SELECT COUNT(*) INTO social_count FROM user_socials WHERE user_id = NEW.user_id;

  IF user_role_val = 'USER' AND social_count >= 2 THEN
    RAISE EXCEPTION 'USER role is limited to 2 social links. Upgrade to Premium for unlimited.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_social_limit ON user_socials;
CREATE TRIGGER trg_social_limit
  BEFORE INSERT ON user_socials
  FOR EACH ROW EXECUTE FUNCTION enforce_social_limit();

-- ─── user_roles (supplemental role audit table) ───────────────────────────────
CREATE TABLE IF NOT EXISTS user_roles (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role       user_role NOT NULL DEFAULT 'USER',
  granted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Admin read user_roles" ON user_roles
    FOR SELECT USING (public.has_role('ADMIN'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin manage user_roles" ON user_roles
    FOR ALL USING (public.has_role('ADMIN'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── vtuber_socials ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vtuber_socials (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vtuber_id  UUID NOT NULL REFERENCES vtubers(id) ON DELETE CASCADE,
  platform   TEXT NOT NULL CHECK (platform IN ('youtube','twitter','tiktok','twitch','instagram','facebook','website','other')),
  url        TEXT NOT NULL CHECK (length(url) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE vtuber_socials ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public read vtuber_socials" ON vtuber_socials
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Agensi manage vtuber_socials" ON vtuber_socials
    FOR ALL USING (public.has_role('AGENSI'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_vtuber_socials_vtuber ON vtuber_socials(vtuber_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);

-- ─── Storage bucket for image uploads (v1.0.a3.5) ────────────────────────────
-- NOTE: Run this via Supabase dashboard Storage → New bucket, OR via:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true)
-- ON CONFLICT (id) DO NOTHING;

-- RLS for storage.objects (gallery folder)
DO $$ BEGIN
  CREATE POLICY "Authenticated upload to gallery folder" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'uploads' AND (storage.foldername(name))[1] = 'gallery');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read uploads" ON storage.objects
    FOR SELECT USING (bucket_id = 'uploads');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Owner delete own upload" ON storage.objects
    FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[2]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- approved_by column (idempotent, v1.0.a3.5)
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id) ON DELETE SET NULL;
