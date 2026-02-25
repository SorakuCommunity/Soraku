-- ============================================================
-- SORAKU v1.0.a3 – Complete Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUM TYPES
-- ============================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('OWNER','MANAGER','ADMIN','AGENSI','PREMIUM','DONATE','USER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE gallery_status AS ENUM ('pending','approved','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE blog_status AS ENUM ('draft','published');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             TEXT,
  display_name      TEXT,
  username          TEXT UNIQUE,
  avatar_url        TEXT,
  bio               TEXT,
  role              user_role NOT NULL DEFAULT 'USER',
  -- Platform links
  official_website  TEXT,
  generation_page   TEXT,
  talent_profile    TEXT,
  lore_archive      TEXT,
  schedule_page     TEXT,
  -- Socials
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
  -- Support / Fan zone
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
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-insert user on first OAuth login
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  base_name TEXT;
  gen_username TEXT;
BEGIN
  base_name := LOWER(REGEXP_REPLACE(
    COALESCE(NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'full_name', 'user'),
    '[^a-z0-9]', '', 'g'
  ));
  IF LENGTH(base_name) < 3 THEN base_name := 'user'; END IF;
  gen_username := SUBSTRING(base_name, 1, 16) || '_' || SUBSTRING(gen_random_uuid()::TEXT, 1, 4);
  INSERT INTO public.users (id, email, display_name, username, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    gen_username,
    NEW.raw_user_meta_data->>'avatar_url',
    'USER'
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- GALLERY
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  caption     TEXT,
  description TEXT,
  hashtags    TEXT[] DEFAULT '{}',
  status      gallery_status NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS gallery_status_idx ON gallery(status);
CREATE INDEX IF NOT EXISTS gallery_user_idx ON gallery(user_id);
CREATE INDEX IF NOT EXISTS gallery_hashtags_idx ON gallery USING GIN(hashtags);

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  thumbnail   TEXT,
  content     TEXT NOT NULL,
  tags        TEXT[] DEFAULT '{}',
  status      blog_status NOT NULL DEFAULT 'draft',
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS blog_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_status_idx ON blog_posts(status);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT,
  banner_url  TEXT,
  start_date  TIMESTAMPTZ NOT NULL,
  end_date    TIMESTAMPTZ NOT NULL,
  created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ANIME PROFILES (formerly vtubers)
-- ============================================================
CREATE TABLE IF NOT EXISTS anime_profiles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  generation  TEXT,
  avatar_url  TEXT,
  cover_url   TEXT,
  description TEXT,
  bio         TEXT,
  twitter     TEXT,
  youtube     TEXT,
  twitch      TEXT,
  instagram   TEXT,
  tiktok      TEXT,
  website     TEXT,
  tags        TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS anime_slug_idx ON anime_profiles(slug);

-- Keep old vtubers alias for compatibility
CREATE TABLE IF NOT EXISTS vtubers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE,
  generation  TEXT,
  avatar_url  TEXT,
  description TEXT,
  twitter     TEXT,
  youtube     TEXT,
  twitch      TEXT,
  instagram   TEXT,
  tiktok      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- SITE SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert defaults
INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'Soraku'),
  ('tagline', 'Komunitas Anime & Manga'),
  ('logo_url', ''),
  ('primary_color', '#7C3AED'),
  ('accent_color', '#EC4899'),
  ('maintenance_mode', 'false'),
  ('maintenance_message', 'Sedang dalam perbaikan...'),
  ('enable_registration', 'true'),
  ('enable_github_discussion', 'true'),
  ('enable_spotify', 'true'),
  ('enable_discord_stats', 'true'),
  ('login_background_image', ''),
  ('login_illustration_enabled', 'true'),
  ('oauth_spotify_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_public_read" ON users;
DROP POLICY IF EXISTS "users_self_update" ON users;
DROP POLICY IF EXISTS "admins_all" ON users;
CREATE POLICY "users_public_read" ON users FOR SELECT USING (true);
CREATE POLICY "users_self_update" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "admins_all" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('OWNER','MANAGER','ADMIN'))
);

-- Gallery
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gallery_public_approved" ON gallery;
DROP POLICY IF EXISTS "gallery_self_upload" ON gallery;
DROP POLICY IF EXISTS "gallery_admin_all" ON gallery;
CREATE POLICY "gallery_public_approved" ON gallery FOR SELECT USING (status = 'approved');
CREATE POLICY "gallery_self_upload" ON gallery FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "gallery_self_view" ON gallery FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "gallery_admin_all" ON gallery FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('OWNER','MANAGER','ADMIN'))
);

-- Blog posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "blog_public_read" ON blog_posts;
DROP POLICY IF EXISTS "blog_admin_write" ON blog_posts;
CREATE POLICY "blog_public_read" ON blog_posts FOR SELECT USING (status = 'published' AND deleted_at IS NULL);
CREATE POLICY "blog_admin_write" ON blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('OWNER','MANAGER','ADMIN'))
);

-- Events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "events_public_read" ON events;
DROP POLICY IF EXISTS "events_admin_write" ON events;
CREATE POLICY "events_public_read" ON events FOR SELECT USING (true);
CREATE POLICY "events_admin_write" ON events FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('OWNER','MANAGER','ADMIN','AGENSI'))
);

-- Anime profiles
ALTER TABLE anime_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anime_public_read" ON anime_profiles;
DROP POLICY IF EXISTS "anime_agensi_write" ON anime_profiles;
CREATE POLICY "anime_public_read" ON anime_profiles FOR SELECT USING (true);
CREATE POLICY "anime_agensi_write" ON anime_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('OWNER','MANAGER','ADMIN','AGENSI'))
);

-- Site settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "settings_public_read" ON site_settings;
DROP POLICY IF EXISTS "settings_admin_write" ON site_settings;
CREATE POLICY "settings_public_read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "settings_admin_write" ON site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('OWNER','MANAGER','ADMIN'))
);

-- ============================================================
-- STORAGE POLICY (run separately if needed)
-- ============================================================
-- CREATE POLICY "auth_upload_gallery" ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'gallery' AND auth.uid() IS NOT NULL);
-- CREATE POLICY "public_read_gallery" ON storage.objects FOR SELECT
--   USING (bucket_id = 'gallery');

-- ============================================================
-- DONE ✅
-- ============================================================
