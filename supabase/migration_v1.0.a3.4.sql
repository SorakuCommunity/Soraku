-- ============================================================
--  SORAKU COMMUNITY — Migration v1.0.a3.4
--  Run in Supabase SQL Editor after schema.sql (lib/schema.sql)
--  All statements are IDEMPOTENT — safe to re-run
-- ============================================================

-- ─── Ensure gallery.likes column exists ─────────────────────
DO $$ BEGIN
  ALTER TABLE gallery ADD COLUMN likes INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Backfill nulls
UPDATE gallery SET likes = 0 WHERE likes IS NULL;

-- ─── Ensure events table has cover_image ─────────────────────
DO $$ BEGIN
  ALTER TABLE events ADD COLUMN cover_image TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- ─── Ensure blog_posts.published_at exists ──────────────────
-- (some older schemas may have only published BOOLEAN + created_at)
DO $$ BEGIN
  ALTER TABLE blog_posts ADD COLUMN published_at TIMESTAMPTZ;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Backfill published_at from created_at for already-published posts
UPDATE blog_posts
SET published_at = created_at
WHERE published = true AND published_at IS NULL;

-- ─── Ensure user_socials table exists ───────────────────────
CREATE TABLE IF NOT EXISTS user_socials (
  id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('discord','instagram','tiktok','twitter','youtube','website')),
  url      TEXT NOT NULL CHECK (length(url) <= 500),
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

-- ─── Premium social limit trigger ───────────────────────────
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

-- ─── Ensure webhook_settings exists ─────────────────────────
CREATE TABLE IF NOT EXISTS webhook_settings (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  url        TEXT NOT NULL,
  secret     TEXT,
  active     BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE webhook_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Admin manage webhook_settings" ON webhook_settings
    FOR ALL USING (public.has_role('ADMIN'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── Ensure spotify_tokens exists ───────────────────────────
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

-- ─── Ensure user_roles exists ───────────────────────────────
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

-- ─── Ensure handle_new_user trigger exists ──────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  raw_base  TEXT;
  base_name TEXT;
  new_uname TEXT;
BEGIN
  raw_base  := COALESCE(
    NEW.raw_user_meta_data->>'user_name',
    NEW.raw_user_meta_data->>'preferred_username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    'user'
  );
  base_name := lower(regexp_replace(raw_base, '[^a-zA-Z0-9]', '', 'g'));
  base_name := left(CASE WHEN length(base_name) = 0 THEN 'user' ELSE base_name END, 20);
  new_uname := base_name || '_' || substr(gen_random_uuid()::text, 1, 4);

  INSERT INTO public.users (id, email, username, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    new_uname,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    'USER'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Indexes for performance ─────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_gallery_likes       ON gallery(likes DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_created     ON gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_published_at   ON blog_posts(published_at DESC) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_events_status_date  ON events(status, date ASC);
CREATE INDEX IF NOT EXISTS idx_user_socials_user   ON user_socials(user_id);

-- ─── Done ────────────────────────────────────────────────────
-- Migration v1.0.a3.4 complete.
-- All statements idempotent — safe to re-run.
