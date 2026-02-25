-- ========================================
-- SORAKU V1.0 – DATABASE SCHEMA
-- Run in Supabase SQL Editor
-- ========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------
-- USERS
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('OWNER', 'MANAGER', 'ADMIN', 'AGENSI', 'USER')),
  official_website TEXT, generation_page TEXT, talent_profile TEXT,
  lore_archive TEXT, schedule_page TEXT,
  twitter TEXT, instagram TEXT, tiktok TEXT, youtube TEXT, twitch TEXT,
  facebook TEXT, discord_invite TEXT, threads TEXT, reddit TEXT, spotify TEXT,
  saweria TEXT, trakteer TEXT, sociabuzz TEXT, kofi TEXT, patreon TEXT,
  streamlabs TEXT, paypal TEXT, fanart_gallery TEXT, fan_submission TEXT, merchandise TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------
-- GALLERY
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  description TEXT,
  hashtags JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------
-- BLOG POSTS
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  thumbnail TEXT,
  content TEXT NOT NULL DEFAULT '',
  tags JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------
-- EVENTS
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  banner_url TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------
-- VTUBERS
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.vtubers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  generation TEXT,
  avatar_url TEXT,
  description TEXT,
  twitter TEXT,
  youtube TEXT,
  twitch TEXT,
  instagram TEXT,
  tiktok TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------
-- SITE SETTINGS
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('site_name', 'Soraku'),
  ('tagline', 'Komunitas Anime & Manga'),
  ('logo_url', ''),
  ('primary_color', '#7C3AED'),
  ('accent_color', '#EC4899'),
  ('neon_enabled', 'true'),
  ('enable_glass', 'true'),
  ('maintenance_mode', 'false'),
  ('maintenance_message', 'Sedang dalam perbaikan...'),
  ('enable_registration', 'true'),
  ('default_role', 'USER'),
  ('enable_github_discussion', 'true'),
  ('enable_spotify', 'true'),
  ('enable_discord_stats', 'true')
ON CONFLICT (key) DO NOTHING;

-- ----------------------------------------
-- INDEXES
-- ----------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_gallery_status ON public.gallery(status);
CREATE INDEX IF NOT EXISTS idx_gallery_user_id ON public.gallery(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_created ON public.gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_deleted ON public.blog_posts(deleted_at);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_events_dates ON public.events(start_date, end_date);

-- ----------------------------------------
-- ROW LEVEL SECURITY
-- ----------------------------------------

-- Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_public_read" ON public.users FOR SELECT USING (true);
CREATE POLICY "users_own_insert" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_own_update" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "admin_update_users" ON public.users FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('OWNER')));

-- Gallery
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery_public_approved" ON public.gallery FOR SELECT
  USING (status = 'approved' OR user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('OWNER', 'MANAGER', 'ADMIN')));
CREATE POLICY "gallery_auth_insert" ON public.gallery FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "gallery_own_update" ON public.gallery FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "gallery_admin_update" ON public.gallery FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('OWNER', 'MANAGER', 'ADMIN')));

-- Blog
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog_public_read" ON public.blog_posts FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('OWNER', 'MANAGER', 'ADMIN')));
CREATE POLICY "blog_admin_all" ON public.blog_posts FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('OWNER', 'MANAGER', 'ADMIN')));

-- Events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_public_read" ON public.events FOR SELECT USING (true);
CREATE POLICY "events_admin_all" ON public.events FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('OWNER', 'MANAGER')));

-- VTubers
ALTER TABLE public.vtubers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vtubers_public_read" ON public.vtubers FOR SELECT USING (true);
CREATE POLICY "vtubers_admin_all" ON public.vtubers FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('OWNER', 'MANAGER', 'ADMIN', 'AGENSI')));

-- Site Settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_public_read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "settings_owner_only" ON public.site_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'OWNER'));

-- ----------------------------------------
-- STORAGE BUCKET POLICIES (run in Dashboard)
-- ----------------------------------------
-- 1. Create bucket 'gallery' as Public
-- 2. Then run:
-- CREATE POLICY "auth_upload_gallery" ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'gallery' AND auth.uid() IS NOT NULL AND (storage.foldername(name))[2] = auth.uid()::text);
-- CREATE POLICY "public_read_gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');

-- ----------------------------------------
-- TRIGGER: Auto create user on OAuth
-- ----------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url, role)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    NEW.raw_user_meta_data->>'avatar_url', 'USER'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
