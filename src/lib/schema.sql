-- =============================================
-- SORAKU COMMUNITY PLATFORM - DATABASE SCHEMA
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USER ROLES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('MANAGER', 'AGENSI', 'ADMIN', 'USER')),
  username TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- VTUBERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS vtubers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  generation INTEGER NOT NULL DEFAULT 1,
  slug TEXT UNIQUE NOT NULL,
  agency TEXT,
  social_links JSONB DEFAULT '{}',
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BLOG POSTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT,
  featured_image TEXT,
  author_id TEXT NOT NULL,
  author_name TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EVENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  banner_image TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'ended')),
  discord_event_id TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- GALLERY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  uploaded_by TEXT NOT NULL,
  uploader_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- APP SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default settings
INSERT INTO app_settings (key, value) VALUES ('maintenance_mode', 'false') ON CONFLICT (key) DO NOTHING;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vtubers ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read vtubers" ON vtubers FOR SELECT USING (true);
CREATE POLICY "Public read published blogs" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read approved gallery" ON gallery FOR SELECT USING (status = 'approved');
CREATE POLICY "Public read settings" ON app_settings FOR SELECT USING (true);

-- Service role full access (for admin operations via supabaseAdmin)
CREATE POLICY "Service role all vtubers" ON vtubers USING (true) WITH CHECK (true);
CREATE POLICY "Service role all blogs" ON blog_posts USING (true) WITH CHECK (true);
CREATE POLICY "Service role all events" ON events USING (true) WITH CHECK (true);
CREATE POLICY "Service role all gallery" ON gallery USING (true) WITH CHECK (true);
CREATE POLICY "Service role all settings" ON app_settings USING (true) WITH CHECK (true);
CREATE POLICY "Service role all user_roles" ON user_roles USING (true) WITH CHECK (true);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vtubers_updated_at BEFORE UPDATE ON vtubers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA (optional)
-- =============================================

-- Sample vtubers generation 1
INSERT INTO vtubers (name, bio, generation, slug, created_by, social_links) VALUES
('Sakura Hana', 'VTuber energik dari Generasi 1 Soraku. Suka gaming dan menyanyi!', 1, 'sakura-hana', 'system', '{"twitter": "https://twitter.com/", "youtube": "https://youtube.com/"}'),
('Mizuki Aoi', 'Idol virtual yang ceria dan selalu membawa semangat! 🌊', 1, 'mizuki-aoi', 'system', '{"twitter": "https://twitter.com/", "youtube": "https://youtube.com/"}'),
('Yuki Tsuki', 'Malam yang tenang, bintang yang bersinar – itulah Yuki! 🌙', 1, 'yuki-tsuki', 'system', '{"twitter": "https://twitter.com/"}')
ON CONFLICT (slug) DO NOTHING;

-- Sample blog post
INSERT INTO blog_posts (title, slug, content, excerpt, author_id, author_name, status) VALUES
('Selamat Datang di Soraku Community!', 'selamat-datang-di-soraku', '# Selamat Datang!\n\nSoraku Community Platform adalah rumah bagi para penggemar VTuber dan komunitas virtual Indonesia. Bergabunglah bersama kami!', 'Platform komunitas VTuber Indonesia yang baru dan modern.', 'system', 'Soraku Admin', 'published')
ON CONFLICT (slug) DO NOTHING;

-- Sample event
INSERT INTO events (title, slug, description, start_date, status, created_by) VALUES
('Soraku Community Launch', 'soraku-community-launch', 'Event perdana Soraku Community Platform! Bergabunglah dan rayakan bersama kami.', NOW() + INTERVAL '7 days', 'upcoming', 'system')
ON CONFLICT (slug) DO NOTHING;
