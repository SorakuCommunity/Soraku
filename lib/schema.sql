-- ============================================================
-- SORAKU COMMUNITY PLATFORM — FULL DATABASE SCHEMA
-- Version: v1.0.a3
-- Engine: Supabase PostgreSQL (Postgres 15+)
-- ============================================================
-- SINGLE SOURCE OF TRUTH — Run once on fresh Supabase project.
-- Safe to re-run (IF NOT EXISTS / OR REPLACE / ON CONFLICT).
-- ============================================================

-- ─── 0. EXTENSIONS ──────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- ─── USERS ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.users (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email            TEXT,
  display_name     TEXT,
  username         TEXT UNIQUE,
  avatar_url       TEXT,
  bio              TEXT,
  role             TEXT NOT NULL DEFAULT 'USER'
    CHECK (role IN ('OWNER', 'MANAGER', 'ADMIN', 'AGENSI', 'PREMIUM', 'DONATE', 'USER')),

  -- Social / profile links
  official_website  TEXT,
  generation_page   TEXT,
  talent_profile    TEXT,
  lore_archive      TEXT,
  schedule_page     TEXT,
  twitter           TEXT,
  instagram         TEXT,
  tiktok            TEXT,
  youtube           TEXT,
  twitch            TEXT,
  facebook          TEXT,
  discord_invite    TEXT,
  threads           TEXT,
  reddit            TEXT,
  spotify           TEXT,

  -- Support / fan zone
  saweria           TEXT,
  trakteer          TEXT,
  sociabuzz         TEXT,
  kofi              TEXT,
  patreon           TEXT,
  streamlabs        TEXT,
  paypal            TEXT,
  fanart_gallery    TEXT,
  fan_submission    TEXT,
  merchandise       TEXT,

  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── USER_ROLES (multi-role junction, future-ready) ─────────────────────────

CREATE TABLE IF NOT EXISTS public.user_roles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL
    CHECK (role IN ('OWNER','MANAGER','ADMIN','AGENSI','PREMIUM','DONATE','USER')),
  granted_by  UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- ─── GALLERY ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.gallery (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  caption     TEXT,
  description TEXT,
  hashtags    JSONB DEFAULT '[]',
  status      TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BLOG POSTS ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id        UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  thumbnail        TEXT,
  content          TEXT NOT NULL DEFAULT '',
  excerpt          TEXT,
  tags             JSONB DEFAULT '[]',
  status           TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published')),
  spotify_track_id TEXT,
  deleted_at       TIMESTAMPTZ DEFAULT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── EVENTS ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT,
  banner_url  TEXT,
  start_date  TIMESTAMPTZ NOT NULL,
  end_date    TIMESTAMPTZ NOT NULL,
  created_by  UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── VTUBERS ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.vtubers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE,
  generation  TEXT,
  avatar_url  TEXT,
  description TEXT,
  bio         TEXT,
  social_links JSONB DEFAULT '{}',

  -- Shorthand columns (preserved from older schema)
  twitter     TEXT,
  youtube     TEXT,
  twitch      TEXT,
  instagram   TEXT,
  tiktok      TEXT,

  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── VTUBER_SOCIALS (normalized; DB-level premium limit) ────────────────────

CREATE TABLE IF NOT EXISTS public.vtuber_socials (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vtuber_id   UUID NOT NULL REFERENCES public.vtubers(id) ON DELETE CASCADE,
  platform    TEXT NOT NULL,
  url         TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vtuber_id, platform)
);

-- ─── SITE SETTINGS ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── WEBHOOK_SETTINGS (server-side only) ────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.webhook_settings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  url         TEXT NOT NULL,
  events      JSONB NOT NULL DEFAULT '[]',
  enabled     BOOLEAN NOT NULL DEFAULT true,
  secret      TEXT,
  created_by  UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SPOTIFY_TOKENS (service role only) ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.spotify_tokens (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  access_token  TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DEFAULT DATA
-- ============================================================

INSERT INTO public.site_settings (key, value) VALUES
  ('site_name',               'Soraku'),
  ('tagline',                 'Komunitas Anime & Manga'),
  ('logo_url',                ''),
  ('primary_color',           '#7C3AED'),
  ('accent_color',            '#EC4899'),
  ('neon_enabled',            'true'),
  ('enable_glass',            'true'),
  ('maintenance_mode',        'false'),
  ('maintenance_message',     'Sedang dalam perbaikan...'),
  ('enable_registration',     'true'),
  ('default_role',            'USER'),
  ('enable_github_discussion','true'),
  ('enable_spotify',          'true'),
  ('enable_discord_stats',    'true'),
  ('login_bg_url',            ''),
  ('discord_invite',          'https://discord.gg/CJJ7KEJMbg'),
  ('founder_name',            ''),
  ('founder_bio',             ''),
  ('founder_avatar',          ''),
  ('enable_premium',          'true'),
  ('premium_social_limit',    '2')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_users_username      ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_role          ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_user     ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_status      ON public.gallery(status);
CREATE INDEX IF NOT EXISTS idx_gallery_user_id     ON public.gallery(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_created     ON public.gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_status         ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_deleted        ON public.blog_posts(deleted_at);
CREATE INDEX IF NOT EXISTS idx_blog_slug           ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_spotify        ON public.blog_posts(spotify_track_id);
CREATE INDEX IF NOT EXISTS idx_events_dates        ON public.events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_vtubers_slug        ON public.vtubers(slug);
CREATE INDEX IF NOT EXISTS idx_vtuber_socials_vt   ON public.vtuber_socials(vtuber_id);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- ─── public.has_role(role_name) ─────────────────────────────────────────────
-- Returns TRUE if the current user has at least the given role level.
-- Hierarchy: OWNER(7) > MANAGER(6) > ADMIN(5) > AGENSI(4) > PREMIUM(3) > DONATE(2) > USER(1)

CREATE OR REPLACE FUNCTION public.has_role(role_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_uid          UUID;
  v_role         TEXT;
  required_level INTEGER;
  user_level     INTEGER;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN RETURN FALSE; END IF;

  SELECT role INTO v_role FROM public.users WHERE id = v_uid;
  IF v_role IS NULL THEN RETURN FALSE; END IF;

  required_level := CASE role_name
    WHEN 'OWNER'   THEN 7
    WHEN 'MANAGER' THEN 6
    WHEN 'ADMIN'   THEN 5
    WHEN 'AGENSI'  THEN 4
    WHEN 'PREMIUM' THEN 3
    WHEN 'DONATE'  THEN 2
    WHEN 'USER'    THEN 1
    ELSE 999
  END;

  user_level := CASE v_role
    WHEN 'OWNER'   THEN 7
    WHEN 'MANAGER' THEN 6
    WHEN 'ADMIN'   THEN 5
    WHEN 'AGENSI'  THEN 4
    WHEN 'PREMIUM' THEN 3
    WHEN 'DONATE'  THEN 2
    WHEN 'USER'    THEN 1
    ELSE 0
  END;

  RETURN user_level >= required_level;
END;
$$;

-- ─── set_updated_at() ──────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

-- ─── handle_new_user() — auto-create user profile on OAuth ──────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      'User'
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    'USER'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- ─── vtuber_auto_slug() ─────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.vtuber_auto_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
  END IF;
  RETURN NEW;
END;
$$;

-- ─── check_social_limit() — Premium enforcement at DB layer ─────────────────

CREATE OR REPLACE FUNCTION public.check_social_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count     INTEGER;
  v_premium   BOOLEAN;
BEGIN
  SELECT public.has_role('PREMIUM') INTO v_premium;

  IF NOT v_premium THEN
    SELECT COUNT(*) INTO v_count
      FROM public.vtuber_socials
      WHERE vtuber_id = NEW.vtuber_id;

    IF v_count >= 2 THEN
      RAISE EXCEPTION
        'Social link limit reached (max 2). Upgrade to PREMIUM for unlimited links.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto create user profile on new auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto slug for vtubers
DROP TRIGGER IF EXISTS trg_vtuber_slug ON public.vtubers;
CREATE TRIGGER trg_vtuber_slug
  BEFORE INSERT ON public.vtubers
  FOR EACH ROW EXECUTE FUNCTION public.vtuber_auto_slug();

-- Premium social link limit
DROP TRIGGER IF EXISTS trg_check_social_limit ON public.vtuber_socials;
CREATE TRIGGER trg_check_social_limit
  BEFORE INSERT ON public.vtuber_socials
  FOR EACH ROW EXECUTE FUNCTION public.check_social_limit();

-- updated_at auto-update
DROP TRIGGER IF EXISTS trg_users_updated ON public.users;
CREATE TRIGGER trg_users_updated
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_blog_updated ON public.blog_posts;
CREATE TRIGGER trg_blog_updated
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_vtubers_updated ON public.vtubers;
CREATE TRIGGER trg_vtubers_updated
  BEFORE UPDATE ON public.vtubers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_webhook_updated ON public.webhook_settings;
CREATE TRIGGER trg_webhook_updated
  BEFORE UPDATE ON public.webhook_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vtubers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vtuber_socials   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spotify_tokens   ENABLE ROW LEVEL SECURITY;

-- ─── USERS ──────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "users_public_read"    ON public.users;
DROP POLICY IF EXISTS "users_own_insert"     ON public.users;
DROP POLICY IF EXISTS "users_own_update"     ON public.users;
DROP POLICY IF EXISTS "admin_update_users"   ON public.users;
DROP POLICY IF EXISTS "admin_delete_users"   ON public.users;

-- Public can read all user profiles
CREATE POLICY "users_public_read" ON public.users
  FOR SELECT USING (true);

-- Users can create own profile (OAuth callback)
CREATE POLICY "users_own_insert" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update own profile
CREATE POLICY "users_own_update" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- ADMIN+ can update any user
CREATE POLICY "admin_update_users" ON public.users
  FOR UPDATE USING (public.has_role('ADMIN'));

-- MANAGER+ can delete users
CREATE POLICY "admin_delete_users" ON public.users
  FOR DELETE USING (public.has_role('MANAGER'));

-- ─── USER_ROLES ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "user_roles_self_read"     ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_admin_insert"  ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_admin_delete"  ON public.user_roles;

CREATE POLICY "user_roles_self_read" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid() OR public.has_role('ADMIN'));

CREATE POLICY "user_roles_admin_insert" ON public.user_roles
  FOR INSERT WITH CHECK (public.has_role('ADMIN'));

CREATE POLICY "user_roles_admin_delete" ON public.user_roles
  FOR DELETE USING (public.has_role('ADMIN'));

-- ─── GALLERY ────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "gallery_select"            ON public.gallery;
DROP POLICY IF EXISTS "gallery_auth_insert"       ON public.gallery;
DROP POLICY IF EXISTS "gallery_own_pending_update" ON public.gallery;
DROP POLICY IF EXISTS "gallery_admin_delete"      ON public.gallery;

-- Approved items are public; owner can see own; ADMIN+ sees all
CREATE POLICY "gallery_select" ON public.gallery
  FOR SELECT USING (
    status = 'approved'
    OR user_id = auth.uid()
    OR public.has_role('ADMIN')
  );

-- Any authenticated user can upload
CREATE POLICY "gallery_auth_insert" ON public.gallery
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Owner can edit own pending; ADMIN+ can edit any
CREATE POLICY "gallery_own_pending_update" ON public.gallery
  FOR UPDATE USING (
    (user_id = auth.uid() AND status = 'pending')
    OR public.has_role('ADMIN')
  );

-- ADMIN+ can delete
CREATE POLICY "gallery_admin_delete" ON public.gallery
  FOR DELETE USING (public.has_role('ADMIN'));

-- ─── BLOG POSTS ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "blog_public_read"    ON public.blog_posts;
DROP POLICY IF EXISTS "blog_admin_insert"   ON public.blog_posts;
DROP POLICY IF EXISTS "blog_admin_update"   ON public.blog_posts;
DROP POLICY IF EXISTS "blog_admin_delete"   ON public.blog_posts;

-- Public can read published posts; ADMIN+ sees all
CREATE POLICY "blog_public_read" ON public.blog_posts
  FOR SELECT USING (
    (status = 'published' AND deleted_at IS NULL)
    OR public.has_role('ADMIN')
  );

CREATE POLICY "blog_admin_insert" ON public.blog_posts
  FOR INSERT WITH CHECK (public.has_role('ADMIN'));

CREATE POLICY "blog_admin_update" ON public.blog_posts
  FOR UPDATE USING (public.has_role('ADMIN'));

CREATE POLICY "blog_admin_delete" ON public.blog_posts
  FOR DELETE USING (public.has_role('ADMIN'));

-- ─── EVENTS ─────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "events_public_read"    ON public.events;
DROP POLICY IF EXISTS "events_admin_insert"   ON public.events;
DROP POLICY IF EXISTS "events_admin_update"   ON public.events;
DROP POLICY IF EXISTS "events_manager_delete" ON public.events;

CREATE POLICY "events_public_read" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "events_admin_insert" ON public.events
  FOR INSERT WITH CHECK (public.has_role('ADMIN'));

CREATE POLICY "events_admin_update" ON public.events
  FOR UPDATE USING (public.has_role('ADMIN'));

CREATE POLICY "events_manager_delete" ON public.events
  FOR DELETE USING (public.has_role('MANAGER'));

-- ─── VTUBERS ────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "vtubers_public_read"    ON public.vtubers;
DROP POLICY IF EXISTS "vtubers_agensi_insert"  ON public.vtubers;
DROP POLICY IF EXISTS "vtubers_agensi_update"  ON public.vtubers;
DROP POLICY IF EXISTS "vtubers_admin_delete"   ON public.vtubers;

CREATE POLICY "vtubers_public_read" ON public.vtubers
  FOR SELECT USING (true);

-- AGENSI+ can insert/update VTubers
CREATE POLICY "vtubers_agensi_insert" ON public.vtubers
  FOR INSERT WITH CHECK (public.has_role('AGENSI'));

CREATE POLICY "vtubers_agensi_update" ON public.vtubers
  FOR UPDATE USING (public.has_role('AGENSI'));

-- Only ADMIN+ can delete
CREATE POLICY "vtubers_admin_delete" ON public.vtubers
  FOR DELETE USING (public.has_role('ADMIN'));

-- ─── VTUBER_SOCIALS ─────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "vtuber_socials_public_read"   ON public.vtuber_socials;
DROP POLICY IF EXISTS "vtuber_socials_agensi_insert" ON public.vtuber_socials;
DROP POLICY IF EXISTS "vtuber_socials_agensi_update" ON public.vtuber_socials;
DROP POLICY IF EXISTS "vtuber_socials_admin_delete"  ON public.vtuber_socials;

CREATE POLICY "vtuber_socials_public_read" ON public.vtuber_socials
  FOR SELECT USING (true);

CREATE POLICY "vtuber_socials_agensi_insert" ON public.vtuber_socials
  FOR INSERT WITH CHECK (public.has_role('AGENSI'));

CREATE POLICY "vtuber_socials_agensi_update" ON public.vtuber_socials
  FOR UPDATE USING (public.has_role('AGENSI'));

CREATE POLICY "vtuber_socials_admin_delete" ON public.vtuber_socials
  FOR DELETE USING (public.has_role('ADMIN'));

-- ─── SITE_SETTINGS ──────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "settings_public_read"   ON public.site_settings;
DROP POLICY IF EXISTS "settings_admin_update"  ON public.site_settings;
DROP POLICY IF EXISTS "settings_owner_insert"  ON public.site_settings;

-- Anyone can read settings (theme, site name etc.)
CREATE POLICY "settings_public_read" ON public.site_settings
  FOR SELECT USING (true);

-- ADMIN+ can update settings
CREATE POLICY "settings_admin_update" ON public.site_settings
  FOR UPDATE USING (public.has_role('ADMIN'));

-- Only OWNER can create new setting keys
CREATE POLICY "settings_owner_insert" ON public.site_settings
  FOR INSERT WITH CHECK (public.has_role('OWNER'));

-- ─── WEBHOOK_SETTINGS ───────────────────────────────────────────────────────

DROP POLICY IF EXISTS "webhook_admin_all" ON public.webhook_settings;

-- ADMIN+ only — never exposed to client-side
CREATE POLICY "webhook_admin_all" ON public.webhook_settings
  FOR ALL USING (public.has_role('ADMIN'));

-- ─── SPOTIFY_TOKENS ─────────────────────────────────────────────────────────
-- No anon / authenticated policies — service role only via backend.
-- Intentionally left with no policies (service_role bypasses RLS).

-- ============================================================
-- STORAGE BUCKET (run in Supabase Dashboard or via CLI)
-- ============================================================
-- 1. Create bucket named 'gallery' as Public
-- 2. Then run:
--
-- CREATE POLICY "auth_upload_gallery" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'gallery'
--     AND auth.uid() IS NOT NULL
--     AND (storage.foldername(name))[2] = auth.uid()::text
--   );
--
-- CREATE POLICY "public_read_gallery" ON storage.objects
--   FOR SELECT USING (bucket_id = 'gallery');
--
-- CREATE POLICY "owner_delete_gallery" ON storage.objects
--   FOR DELETE USING (
--     bucket_id = 'gallery'
--     AND auth.uid()::text = (storage.foldername(name))[2]
--   );

-- ============================================================
-- END OF SCHEMA — Soraku v1.0.a3
-- ============================================================
