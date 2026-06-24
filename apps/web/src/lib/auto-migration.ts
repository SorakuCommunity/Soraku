/**
 * auto-migration.ts — Soraku Database Auto Setup
 * Dijalankan sekali saat server start via instrumentation.ts.
 * Semua DDL menggunakan IF NOT EXISTS — aman dijalankan berulang.
 */
import { createClient } from '@supabase/supabase-js'

const OWNER_DISCORD_ID = '1020644780075659356' // Riu

// SQL dijalankan setiap startup (idempotent)
const MIGRATION_SQL = `
-- ─── Schema ───────────────────────────────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS soraku;

-- ─── Extensions ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.users (
  id            UUID PRIMARY KEY,
  username      TEXT UNIQUE,
  displayname   TEXT,
  avatarurl     TEXT,
  bio           TEXT,
  coverurl      TEXT,
  role          TEXT NOT NULL DEFAULT 'USER',
  supporterrole TEXT,
  supportersince TIMESTAMPTZ,
  supporteruntil TIMESTAMPTZ,
  supportersource TEXT,
  sociallinks   JSONB NOT NULL DEFAULT '{}',
  isprivate     BOOLEAN NOT NULL DEFAULT false,
  isbanned      BOOLEAN NOT NULL DEFAULT false,
  createdat     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedat     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Posts ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  excerpt     TEXT,
  content     TEXT,
  coverurl    TEXT,
  tags        TEXT[] NOT NULL DEFAULT '{}',
  ispublished BOOLEAN NOT NULL DEFAULT false,
  publishedat TIMESTAMPTZ,
  authorid    UUID REFERENCES soraku.users(id) ON DELETE SET NULL,
  createdat   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedat   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Events ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  coverurl    TEXT,
  startdate   TIMESTAMPTZ NOT NULL,
  enddate     TIMESTAMPTZ,
  location    TEXT,
  isonline    BOOLEAN NOT NULL DEFAULT true,
  ispublished BOOLEAN NOT NULL DEFAULT false,
  tags        TEXT[] NOT NULL DEFAULT '{}',
  createdby   UUID REFERENCES soraku.users(id) ON DELETE SET NULL,
  createdat   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedat   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Gallery ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.gallery (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploadedby       UUID REFERENCES soraku.users(id) ON DELETE SET NULL,
  imageurl         TEXT NOT NULL,
  title            TEXT,
  description      TEXT,
  tags             TEXT[] NOT NULL DEFAULT '{}',
  status           TEXT NOT NULL DEFAULT 'pending',
  reviewedby       UUID REFERENCES soraku.users(id) ON DELETE SET NULL,
  rejectionreason  TEXT,
  createdat        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedat        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── VTubers ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.vtubers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  charactername   TEXT,
  avatarurl       TEXT,
  coverurl        TEXT,
  description     TEXT,
  debutdate       DATE,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  sociallinks     JSONB NOT NULL DEFAULT '{}',
  isactive        BOOLEAN NOT NULL DEFAULT true,
  ispublished     BOOLEAN NOT NULL DEFAULT true,
  islive          BOOLEAN NOT NULL DEFAULT false,
  liveurl         TEXT,
  subscribercount INTEGER,
  userid          UUID REFERENCES soraku.users(id) ON DELETE SET NULL,
  createdat       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedat       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Donatur ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.donatur (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userid      UUID REFERENCES soraku.users(id) ON DELETE SET NULL,
  displayname TEXT NOT NULL,
  amount      NUMERIC NOT NULL DEFAULT 0,
  tier        TEXT,
  message     TEXT,
  ispublic    BOOLEAN NOT NULL DEFAULT true,
  createdat   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Music Tracks ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.musictracks (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title     TEXT NOT NULL,
  artist    TEXT NOT NULL,
  anime     TEXT,
  coverurl  TEXT,
  srcurl    TEXT NOT NULL,
  duration  INTEGER,
  ordernum  INTEGER NOT NULL DEFAULT 0,
  isactive  BOOLEAN NOT NULL DEFAULT true,
  createdat TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Partnerships ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.partnerships (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name      TEXT NOT NULL,
  logourl   TEXT,
  website   TEXT,
  category  TEXT NOT NULL DEFAULT 'komunitas',
  isactive  BOOLEAN NOT NULL DEFAULT true,
  sortorder INTEGER NOT NULL DEFAULT 0,
  createdat TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedat TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Notifications ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.notifications (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userid    UUID NOT NULL REFERENCES soraku.users(id) ON DELETE CASCADE,
  type      TEXT NOT NULL DEFAULT 'info',
  title     TEXT NOT NULL,
  body      TEXT,
  href      TEXT,
  isread    BOOLEAN NOT NULL DEFAULT false,
  createdat TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Forum Threads ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.forum_threads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  content     TEXT,
  category    TEXT NOT NULL DEFAULT 'general',
  authorid    UUID REFERENCES soraku.users(id) ON DELETE SET NULL,
  ispinned    BOOLEAN NOT NULL DEFAULT false,
  islocked    BOOLEAN NOT NULL DEFAULT false,
  replycount  INTEGER NOT NULL DEFAULT 0,
  viewcount   INTEGER NOT NULL DEFAULT 0,
  lastactivity TIMESTAMPTZ NOT NULL DEFAULT now(),
  createdat   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedat   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_forum_threads_category ON soraku.forum_threads(category);
CREATE INDEX IF NOT EXISTS idx_forum_threads_lastactivity ON soraku.forum_threads(lastactivity DESC);
CREATE INDEX IF NOT EXISTS idx_forum_threads_pinned ON soraku.forum_threads(ispinned) WHERE ispinned = true;

-- ─── Forum Replies ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.forum_replies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  threadid    UUID NOT NULL REFERENCES soraku.forum_threads(id) ON DELETE CASCADE,
  authorid    UUID REFERENCES soraku.users(id) ON DELETE SET NULL,
  content     TEXT NOT NULL,
  createdat   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_forum_replies_thread ON soraku.forum_replies(threadid);

-- ─── Follows ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.follows (
  followerid  UUID NOT NULL REFERENCES soraku.users(id) ON DELETE CASCADE,
  followingid UUID NOT NULL REFERENCES soraku.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (followerid, followingid)
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_posts_ispublished   ON soraku.posts(ispublished);
CREATE INDEX IF NOT EXISTS idx_posts_publishedat   ON soraku.posts(publishedat DESC);
CREATE INDEX IF NOT EXISTS idx_events_startdate    ON soraku.events(startdate DESC);
CREATE INDEX IF NOT EXISTS idx_events_ispublished  ON soraku.events(ispublished);
CREATE INDEX IF NOT EXISTS idx_gallery_status      ON soraku.gallery(status);
CREATE INDEX IF NOT EXISTS idx_notifs_userid       ON soraku.notifications(userid);
CREATE INDEX IF NOT EXISTS idx_users_username      ON soraku.users(username);

-- ─── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE soraku.users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.posts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.gallery        ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.vtubers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.donatur        ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.musictracks    ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.partnerships   ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.notifications  ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.forum_threads  ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.forum_replies  ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.follows        ENABLE ROW LEVEL SECURITY;

-- ─── RLS Policies ─────────────────────────────────────────────────────────────
DO $$ BEGIN
  -- Users: public read non-private, self write
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='users_public_read' AND tablename='users' AND schemaname='soraku') THEN
    CREATE POLICY users_public_read ON soraku.users FOR SELECT USING (NOT isprivate OR auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='users_self_update' AND tablename='users' AND schemaname='soraku') THEN
    CREATE POLICY users_self_update ON soraku.users FOR UPDATE USING (auth.uid() = id);
  END IF;
  -- Posts: public read published
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='posts_public_read' AND tablename='posts' AND schemaname='soraku') THEN
    CREATE POLICY posts_public_read ON soraku.posts FOR SELECT USING (ispublished = true);
  END IF;
  -- Events: public read published
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='events_public_read' AND tablename='events' AND schemaname='soraku') THEN
    CREATE POLICY events_public_read ON soraku.events FOR SELECT USING (ispublished = true);
  END IF;
  -- Gallery: public read approved
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='gallery_public_read' AND tablename='gallery' AND schemaname='soraku') THEN
    CREATE POLICY gallery_public_read ON soraku.gallery FOR SELECT USING (status = 'approved');
  END IF;
  -- Partnerships: public read active
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='partnerships_public_read' AND tablename='partnerships' AND schemaname='soraku') THEN
    CREATE POLICY partnerships_public_read ON soraku.partnerships FOR SELECT USING (isactive = true);
  END IF;
  -- Notifications: user owns
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='notifs_user_read' AND tablename='notifications' AND schemaname='soraku') THEN
    CREATE POLICY notifs_user_read   ON soraku.notifications FOR SELECT USING (auth.uid() = userid);
    CREATE POLICY notifs_user_update ON soraku.notifications FOR UPDATE USING (auth.uid() = userid);
    CREATE POLICY notifs_svc_insert  ON soraku.notifications FOR INSERT WITH CHECK (true);
    CREATE POLICY notifs_svc_delete  ON soraku.notifications FOR DELETE USING (true);
  END IF;
  -- Forum Threads: public read
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='forum_threads_public_read' AND tablename='forum_threads' AND schemaname='soraku') THEN
    CREATE POLICY forum_threads_public_read ON soraku.forum_threads FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='forum_replies_public_read' AND tablename='forum_replies' AND schemaname='soraku') THEN
    CREATE POLICY forum_replies_public_read ON soraku.forum_replies FOR SELECT USING (true);
  END IF;
END $$;

-- ─── Seed Forum Discussions ───────────────────────────────────────────────────
INSERT INTO soraku.forum_threads (title, content, category, ispinned, replycount, viewcount, lastactivity, createdat) VALUES
('Selamat Datang di Forum Soraku! 👋', 'Forum ini adalah tempat diskusi untuk seluruh anggota komunitas Soraku. Silakan perkenalkan diri kalian di sini! Jangan lupa baca aturan komunitas sebelum posting ya.', 'general', true, 12, 245, now() - interval '2 hours', now() - interval '3 days'),
('Aturan Komunitas & Panduan Diskusi 📋', 'Harap baca aturan ini sebelum berpartisipasi: 1) Hormati sesama anggota, 2) No spam/self-promo berlebihan, 3) Konten NSFW tidak diperbolehkan, 4) Gunakan bahasa yang sopan, 5) Laporkan pelanggaran ke moderator.', 'general', true, 5, 189, now() - interval '1 day', now() - interval '7 days'),
('Rekomendasi Anime Summer 2026? 🎬', 'Musim panas 2026 udah dekat! Ada rekomendasi anime yang wajib ditonton? Aku lagi nonton ulang One Piece dan pengen coba series baru. Ada yang bisa kasih saran?', 'anime', false, 34, 567, now() - interval '30 minutes', now() - interval '2 days'),
('Share Hasil Fanart Terbaru Kalian! 🎨', 'Yuk share fanart terbaru kalian di sini! Ini hasil gambar Karina dari ALSTELM yg baru aku selesaiin. Kritik dan saran sangat diterima! 🔥', 'creative', false, 28, 423, now() - interval '1 hour', now() - interval '1 day'),
('VTuber Model Design Tips & Tricks ✨', 'Halo para VTuber enthusiast! Aku mau mulai bikin model VTuber sendiri pakai VRoid. Ada tips buat pemula? Share pengalaman kalian dong!', 'vtuber', false, 21, 312, now() - interval '3 hours', now() - interval '3 days'),
('Diskusi: Manga VS Anime, Mana Lebih Baik? 🤔', 'Menurut kalian lebih enak baca manga atau nonton anime? Aku pribadi lebih suka manga karena ceritanya lebih lengkap, tapi anime punya kelebihan di animasi dan musik. Diskusi yuk!', 'general', false, 17, 278, now() - interval '5 hours', now() - interval '4 days'),
('Belajar Bahasa Jepang - Week 12 📚', 'Welcome to week 12 of our Japanese study group! Minggu ini kita bahas pola kalimat ~te kudasai. Share catatan kalian di sini ya!', 'general', false, 15, 198, now() - interval '6 hours', now() - interval '5 days'),
('Cosplay Meetup Jakarta Agustus 2026 📸', 'Ada yang berminat ikut cosplay meetup di Jakarta bulan Agustus? Rencananya bakal ada photoshoot bareng di Monas dan GBK. Drop komen kalau mau join!', 'general', false, 23, 345, now() - interval '4 hours', now() - interval '6 days'),
('Review: Anime Terbaru Musim Ini 📝', 'Baru selesai nonton episode terakhir "Kage no Jitsuryokusha" season 2. Menurutku season ini lebih bagus dari season 1! Ada yang sependapat?', 'anime', false, 19, 289, now() - interval '8 hours', now() - interval '2 days'),
('Tech & Dev: Project Web Barengan 💻', 'Ada yang tertarik bikin project web development bareng? Aku punya ide buat bikin website database anime untuk komunitas. Looking for frontend & backend devs!', 'tech', false, 11, 156, now() - interval '12 hours', now() - interval '7 days')
ON CONFLICT DO NOTHING;
`

// SQL untuk set role OWNER berdasarkan Discord ID dari auth.users
const OWNER_SYNC_SQL = `
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Cari user dengan Discord provider_id = Riu's Discord ID
  SELECT au.id INTO v_user_id
  FROM auth.users au
  WHERE au.raw_user_meta_data->>'provider_id' = '${OWNER_DISCORD_ID}'
     OR au.raw_user_meta_data->>'sub' = '${OWNER_DISCORD_ID}'
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    -- Upsert ke soraku.users dengan role OWNER
    INSERT INTO soraku.users (id, role, createdat, updatedat)
    VALUES (v_user_id, 'OWNER', now(), now())
    ON CONFLICT (id) DO UPDATE SET role = 'OWNER', updatedat = now()
    WHERE soraku.users.role != 'OWNER';
  END IF;
END $$;
`

export async function runAutoMigration() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) {
    console.warn('[auto-migration] Missing Supabase ENV — skip')
    return
  }

  const client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  try {
    // Jalankan schema setup
    const { error: schemaErr } = await client.rpc('exec_sql', { sql: MIGRATION_SQL }).single()
    if (schemaErr) {
      // Supabase tidak expose exec_sql by default — pakai REST SQL endpoint
      await runViaSqlEndpoint(url, key, MIGRATION_SQL)
    }
  } catch {
    try {
      await runViaSqlEndpoint(url, key, MIGRATION_SQL)
    } catch (e2) {
      console.warn('[auto-migration] Schema setup failed:', e2)
    }
  }

  try {
    await runViaSqlEndpoint(url, key, OWNER_SYNC_SQL)
  } catch (e) {
    console.warn('[auto-migration] Owner sync failed:', e)
  }

  console.log('[auto-migration] ✓ Done')
}

async function runViaSqlEndpoint(url: string, key: string, sql: string) {
  const endpoint = `${url}/rest/v1/rpc/exec_sql`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      apikey: key,
    },
    body: JSON.stringify({ sql }),
  })
  if (!response.ok) {
    // Coba via pg REST direct SQL (Supabase has this)
    const direct = await fetch(`${url}/pg/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}`, apikey: key },
      body: JSON.stringify({ query: sql }),
    })
    if (!direct.ok) throw new Error(`SQL failed: ${await response.text()}`)
  }
}
