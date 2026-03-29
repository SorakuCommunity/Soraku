-- ============================================================
-- Soraku Community — Supabase Schema Migration
-- Schema  : soraku
-- Version : 2026-03-11
-- Run via : Supabase SQL Editor (Dashboard) atau CLI
-- ============================================================

CREATE SCHEMA IF NOT EXISTS soraku;

-- ── Enum types ──────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE soraku.user_role AS ENUM (
    'OWNER','MANAGER','ADMIN','AGENSI','KREATOR','USER'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE soraku.supporter_role AS ENUM ('DONATUR','VIP','VVIP');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE soraku.gallery_status AS ENUM ('pending','approved','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Table: users ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT UNIQUE,
  displayname     TEXT,
  avatarurl       TEXT,
  coverurl        TEXT,
  bio             TEXT,
  role            soraku.user_role    NOT NULL DEFAULT 'USER',
  supporterrole   soraku.supporter_role,
  supportersince  TIMESTAMPTZ,
  supporteruntil  TIMESTAMPTZ,
  supportersource TEXT,
  sociallinks     JSONB               NOT NULL DEFAULT '{}',
  isprivate       BOOLEAN             NOT NULL DEFAULT false,
  isbanned        BOOLEAN             NOT NULL DEFAULT false,
  createdat       TIMESTAMPTZ         NOT NULL DEFAULT now(),
  updatedat       TIMESTAMPTZ         NOT NULL DEFAULT now()
);

-- Tambah kolom yang mungkin belum ada (idempotent)
ALTER TABLE soraku.users
  ADD COLUMN IF NOT EXISTS coverurl       TEXT,
  ADD COLUMN IF NOT EXISTS bio            TEXT,
  ADD COLUMN IF NOT EXISTS sociallinks    JSONB    NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS isprivate      BOOLEAN  NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS isbanned       BOOLEAN  NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS supportersince TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS supporteruntil TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS supportersource TEXT;

-- Pastikan sociallinks tidak null pada baris yang sudah ada
UPDATE soraku.users SET sociallinks = '{}' WHERE sociallinks IS NULL;

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_users_username ON soraku.users(username);
CREATE INDEX IF NOT EXISTS idx_users_role     ON soraku.users(role);

-- ── Table: posts (blog) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.posts (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT        NOT NULL UNIQUE,
  title       TEXT        NOT NULL,
  excerpt     TEXT,
  content     TEXT,
  coverurl    TEXT,
  tags        TEXT[]      NOT NULL DEFAULT '{}',
  ispublished BOOLEAN     NOT NULL DEFAULT false,
  publishedat TIMESTAMPTZ,
  authorid    UUID REFERENCES soraku.users(id) ON DELETE SET NULL,
  createdat   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedat   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE soraku.posts
  ADD COLUMN IF NOT EXISTS excerpt    TEXT,
  ADD COLUMN IF NOT EXISTS coverurl   TEXT,
  ADD COLUMN IF NOT EXISTS publishedat TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_posts_slug        ON soraku.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_ispublished ON soraku.posts(ispublished);
CREATE INDEX IF NOT EXISTS idx_posts_createdat   ON soraku.posts(createdat DESC);

-- ── Table: events ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.events (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT        NOT NULL UNIQUE,
  title       TEXT        NOT NULL,
  description TEXT,
  coverurl    TEXT,
  startdate   TIMESTAMPTZ NOT NULL,
  enddate     TIMESTAMPTZ,
  location    TEXT,
  isonline    BOOLEAN     NOT NULL DEFAULT false,
  ispublished BOOLEAN     NOT NULL DEFAULT false,
  tags        TEXT[]      NOT NULL DEFAULT '{}',
  createdby   UUID REFERENCES soraku.users(id) ON DELETE SET NULL,
  createdat   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedat   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE soraku.events
  ADD COLUMN IF NOT EXISTS coverurl   TEXT,
  ADD COLUMN IF NOT EXISTS enddate    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS location   TEXT,
  ADD COLUMN IF NOT EXISTS isonline   BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_events_slug      ON soraku.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_startdate ON soraku.events(startdate DESC);

-- ── Table: gallery ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.gallery (
  id              UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  uploadedby      UUID REFERENCES soraku.users(id) ON DELETE SET NULL,
  imageurl        TEXT              NOT NULL,
  title           TEXT,
  description     TEXT,
  tags            TEXT[]            NOT NULL DEFAULT '{}',
  status          soraku.gallery_status NOT NULL DEFAULT 'pending',
  reviewedby      UUID REFERENCES soraku.users(id) ON DELETE SET NULL,
  rejectionreason TEXT,
  createdat       TIMESTAMPTZ       NOT NULL DEFAULT now(),
  updatedat       TIMESTAMPTZ       NOT NULL DEFAULT now()
);

ALTER TABLE soraku.gallery
  ADD COLUMN IF NOT EXISTS title           TEXT,
  ADD COLUMN IF NOT EXISTS description     TEXT,
  ADD COLUMN IF NOT EXISTS rejectionreason TEXT;

CREATE INDEX IF NOT EXISTS idx_gallery_status    ON soraku.gallery(status);
CREATE INDEX IF NOT EXISTS idx_gallery_createdat ON soraku.gallery(createdat DESC);

-- ── Table: vtubers ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.vtubers (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT        NOT NULL UNIQUE,
  name            TEXT        NOT NULL,
  charactername   TEXT,
  avatarurl       TEXT,
  coverurl        TEXT,
  description     TEXT,
  debutdate       DATE,
  tags            TEXT[]      NOT NULL DEFAULT '{}',
  sociallinks     JSONB       NOT NULL DEFAULT '{}',
  isactive        BOOLEAN     NOT NULL DEFAULT true,
  ispublished     BOOLEAN     NOT NULL DEFAULT false,
  islive          BOOLEAN     NOT NULL DEFAULT false,
  liveurl         TEXT,
  subscribercount INT,
  userid          UUID REFERENCES soraku.users(id) ON DELETE SET NULL,
  createdat       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedat       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vtubers_slug      ON soraku.vtubers(slug);
CREATE INDEX IF NOT EXISTS idx_vtubers_isactive  ON soraku.vtubers(isactive);

-- ── Table: donatur ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.donatur (
  id          UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  userid      UUID REFERENCES soraku.users(id) ON DELETE SET NULL,
  displayname TEXT              NOT NULL,
  amount      BIGINT            NOT NULL DEFAULT 0,
  tier        soraku.supporter_role,
  message     TEXT,
  ispublic    BOOLEAN           NOT NULL DEFAULT true,
  createdat   TIMESTAMPTZ       NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_donatur_amount    ON soraku.donatur(amount DESC);
CREATE INDEX IF NOT EXISTS idx_donatur_createdat ON soraku.donatur(createdat DESC);

-- ── Table: music_tracks ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.music_tracks (
  id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title     TEXT        NOT NULL,
  artist    TEXT        NOT NULL,
  anime     TEXT,
  coverurl  TEXT,
  srcurl    TEXT        NOT NULL,
  duration  INT,
  ordernum  INT         NOT NULL DEFAULT 0,
  isactive  BOOLEAN     NOT NULL DEFAULT true,
  createdat TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Table: partnerships ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.partnerships (
  id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name      TEXT        NOT NULL,
  logourl   TEXT        NOT NULL,
  website   TEXT,
  category  TEXT        NOT NULL DEFAULT 'partner',
  isactive  BOOLEAN     NOT NULL DEFAULT true,
  sortorder INT         NOT NULL DEFAULT 0,
  createdat TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── RLS Policies ─────────────────────────────────────────────
-- Enable RLS
ALTER TABLE soraku.users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.gallery     ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.vtubers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.donatur     ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.music_tracks ENABLE ROW LEVEL SECURITY;

-- Users: bisa baca sendiri, service role bypass semua
DROP POLICY IF EXISTS "users_select_own"   ON soraku.users;
DROP POLICY IF EXISTS "users_select_public" ON soraku.users;
CREATE POLICY "users_select_public" ON soraku.users
  FOR SELECT USING (isprivate = false OR auth.uid() = id);
CREATE POLICY "users_select_own" ON soraku.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON soraku.users
  FOR UPDATE USING (auth.uid() = id);

-- Posts: publik bisa baca yang ispublished, semua via service_role
DROP POLICY IF EXISTS "posts_select_public" ON soraku.posts;
CREATE POLICY "posts_select_public" ON soraku.posts
  FOR SELECT USING (ispublished = true);

-- Events: publik bisa baca yang ispublished
DROP POLICY IF EXISTS "events_select_public" ON soraku.events;
CREATE POLICY "events_select_public" ON soraku.events
  FOR SELECT USING (ispublished = true);

-- Gallery: publik bisa baca yang approved
DROP POLICY IF EXISTS "gallery_select_public" ON soraku.gallery;
CREATE POLICY "gallery_select_public" ON soraku.gallery
  FOR SELECT USING (status = 'approved');
CREATE POLICY "gallery_insert_auth" ON soraku.gallery
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Vtubers: publik bisa baca yang ispublished
DROP POLICY IF EXISTS "vtubers_select_public" ON soraku.vtubers;
CREATE POLICY "vtubers_select_public" ON soraku.vtubers
  FOR SELECT USING (ispublished = true);

-- Donatur: publik bisa baca yang ispublic
DROP POLICY IF EXISTS "donatur_select_public" ON soraku.donatur;
CREATE POLICY "donatur_select_public" ON soraku.donatur
  FOR SELECT USING (ispublic = true);

-- Music tracks: semua bisa baca yang isactive
DROP POLICY IF EXISTS "music_select_active" ON soraku.music_tracks;
CREATE POLICY "music_select_active" ON soraku.music_tracks
  FOR SELECT USING (isactive = true);

-- ── Set Owner role untuk Riu ─────────────────────────────────
-- Jalankan setelah Riu login pertama kali via Discord
-- (auto-upsert di /api/auth/callback sudah handle ini)
-- Tapi ini sebagai safety fallback jika row sudah ada:
UPDATE soraku.users
SET role = 'OWNER', updatedat = now()
WHERE id IN (
  SELECT id FROM auth.users
  WHERE raw_user_meta_data->>'provider_id' = '1020644780075659356'
     OR raw_user_meta_data->>'sub'         = '1020644780075659356'
);

-- ── Done ─────────────────────────────────────────────────────
-- Jalankan SQL ini di Supabase Dashboard > SQL Editor
-- URL: https://supabase.com/dashboard/project/_/sql
