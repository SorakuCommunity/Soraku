-- ============================================================
-- Soraku — Consolidated Schema Migration
-- Schema  : soraku
-- Version : v1.5.1 (2026-03-29)
-- Run via : Supabase SQL Editor (Dashboard)
-- Note    : Uses IF NOT EXISTS / IF EXISTS for idempotency
-- ============================================================

-- ═══════════════════════════════════════════════════════════════
-- SCHEMA & TYPES
-- ═══════════════════════════════════════════════════════════════

CREATE SCHEMA IF NOT EXISTS soraku;

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

-- ═══════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION soraku.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updatedat = NOW();
  RETURN NEW;
END;
$$;

-- ═══════════════════════════════════════════════════════════════
-- TABLES
-- ═══════════════════════════════════════════════════════════════

-- ── Users ──────────────────────────────────────────────────────
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

CREATE INDEX IF NOT EXISTS idx_users_username ON soraku.users(username);
CREATE INDEX IF NOT EXISTS idx_users_role     ON soraku.users(role);

-- ── Posts (Blog) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.posts (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT        NOT NULL UNIQUE,
  title       TEXT        NOT NULL,
  excerpt     TEXT,
  content     TEXT,
  coverurl    TEXT,
  tags        TEXT[]      NOT NULL DEFAULT '{}',
  viewcount   INTEGER     NOT NULL DEFAULT 0,
  likecount   INTEGER     NOT NULL DEFAULT 0,
  ispublished BOOLEAN     NOT NULL DEFAULT false,
  publishedat TIMESTAMPTZ,
  authorid    UUID REFERENCES soraku.users(id) ON DELETE SET NULL,
  createdat   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedat   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_slug        ON soraku.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_ispublished ON soraku.posts(ispublished);
CREATE INDEX IF NOT EXISTS idx_posts_createdat   ON soraku.posts(createdat DESC);

-- ── Post Likes ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.postlikes (
  id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  postid    UUID        NOT NULL REFERENCES soraku.posts(id) ON DELETE CASCADE,
  userid    UUID        REFERENCES soraku.users(id) ON DELETE SET NULL,
  ipaddr    TEXT,
  createdat TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_postlikes_post_user
  ON soraku.postlikes(postid, userid) WHERE userid IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_postlikes_postid ON soraku.postlikes(postid);

-- ── Post Comments ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.postcomments (
  id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  postid    UUID        NOT NULL REFERENCES soraku.posts(id) ON DELETE CASCADE,
  parentid  UUID        REFERENCES soraku.postcomments(id) ON DELETE CASCADE,
  userid    UUID        REFERENCES soraku.users(id) ON DELETE SET NULL,
  guestname TEXT,
  content   TEXT        NOT NULL,
  isdeleted BOOLEAN     NOT NULL DEFAULT false,
  createdat TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedat TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_postcomments_postid   ON soraku.postcomments(postid);
CREATE INDEX IF NOT EXISTS idx_postcomments_parentid ON soraku.postcomments(parentid);

-- ── Events ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.events (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT        NOT NULL UNIQUE,
  title            TEXT        NOT NULL,
  description      TEXT,
  coverurl         TEXT,
  startdate        TIMESTAMPTZ NOT NULL,
  enddate          TIMESTAMPTZ,
  location         TEXT,
  isonline         BOOLEAN     NOT NULL DEFAULT false,
  ispublished      BOOLEAN     NOT NULL DEFAULT false,
  status           TEXT        NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('online','pending','selesai')),
  tags             TEXT[]      NOT NULL DEFAULT '{}',
  registrationurl  TEXT,
  discordchannelid TEXT,
  ispaid           BOOLEAN     NOT NULL DEFAULT false,
  price            BIGINT,
  paymentmethods   JSONB       NOT NULL DEFAULT '[]',
  registrationopen BOOLEAN     NOT NULL DEFAULT true,
  gametype         TEXT,
  createdby        UUID REFERENCES soraku.users(id) ON DELETE SET NULL,
  createdat        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedat        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_slug      ON soraku.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_startdate ON soraku.events(startdate DESC);

-- ── Event Registrations ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.eventregistrations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eventid         UUID NOT NULL REFERENCES soraku.events(id) ON DELETE CASCADE,
  teamname        TEXT NOT NULL,
  teamlogourl     TEXT,
  activeplayers   JSONB NOT NULL DEFAULT '[]',
  reserveplayers  JSONB NOT NULL DEFAULT '[]',
  contactname     TEXT,
  contactdiscord  TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','approved','rejected')),
  rejectreason    TEXT,
  notes           TEXT,
  reviewedby      UUID REFERENCES soraku.users(id) ON DELETE SET NULL,
  reviewedat      TIMESTAMPTZ,
  paymentproofurl TEXT,
  paidamount      BIGINT,
  paidstatus      TEXT DEFAULT 'unpaid'
                    CHECK (paidstatus IN ('unpaid','pending','paid','refunded')),
  createdat       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedat       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_eventregs_eventid ON soraku.eventregistrations(eventid);

-- ── Gallery ────────────────────────────────────────────────────
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

CREATE INDEX IF NOT EXISTS idx_gallery_status    ON soraku.gallery(status);
CREATE INDEX IF NOT EXISTS idx_gallery_createdat ON soraku.gallery(createdat DESC);

-- ── Notifications ──────────────────────────────────────────────
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

CREATE INDEX IF NOT EXISTS idx_notifications_userid       ON soraku.notifications(userid);
CREATE INDEX IF NOT EXISTS idx_notifications_userid_read  ON soraku.notifications(userid, isread);
CREATE INDEX IF NOT EXISTS idx_notifications_createdat    ON soraku.notifications(createdat DESC);

-- ── VTubers ────────────────────────────────────────────────────
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

CREATE INDEX IF NOT EXISTS idx_vtubers_slug     ON soraku.vtubers(slug);
CREATE INDEX IF NOT EXISTS idx_vtubers_isactive ON soraku.vtubers(isactive);

-- ── Donatur ────────────────────────────────────────────────────
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

-- ── Music Tracks ───────────────────────────────────────────────
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

-- ── Follows ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.follows (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  followerid  UUID NOT NULL REFERENCES soraku.users(id) ON DELETE CASCADE,
  followingid UUID NOT NULL REFERENCES soraku.users(id) ON DELETE CASCADE,
  createdat   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(followerid, followingid),
  CHECK (followerid <> followingid)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower  ON soraku.follows(followerid);
CREATE INDEX IF NOT EXISTS idx_follows_following ON soraku.follows(followingid);

-- ── Partnerships ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.partnerships (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  logourl     TEXT        NOT NULL,
  website     TEXT,
  category    TEXT        NOT NULL DEFAULT 'partner',
  description TEXT,
  isactive    BOOLEAN     NOT NULL DEFAULT true,
  sortorder   INT         NOT NULL DEFAULT 0,
  createdby   UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  createdat   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedat   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Site Settings (Webhooks, Config) ───────────────────────────
CREATE TABLE IF NOT EXISTS soraku.sitesettings (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT        NOT NULL UNIQUE,
  value       TEXT,
  label       TEXT,
  category    TEXT        NOT NULL DEFAULT 'general',
  description TEXT,
  updatedat   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedby   UUID        REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ── Level System ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.userlevels (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userid          UUID NOT NULL UNIQUE REFERENCES soraku.users(id) ON DELETE CASCADE,
  level           INTEGER NOT NULL DEFAULT 1,
  xpcurrent       INTEGER NOT NULL DEFAULT 0,
  xprequired      INTEGER NOT NULL DEFAULT 100,
  reputationscore INTEGER NOT NULL DEFAULT 0,
  updatedat       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_userlevels_userid ON soraku.userlevels(userid);

-- ── Badge System ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.userbadges (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userid    UUID NOT NULL REFERENCES soraku.users(id) ON DELETE CASCADE,
  badgename TEXT NOT NULL,
  badgeicon TEXT NOT NULL,
  badgecls  TEXT,
  createdat TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_userbadges_userid ON soraku.userbadges(userid);

-- ═══════════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════════

-- Auto-update updatedat
DROP TRIGGER IF EXISTS trg_users_updatedat         ON soraku.users;
DROP TRIGGER IF EXISTS trg_posts_updatedat         ON soraku.posts;
DROP TRIGGER IF EXISTS trg_events_updatedat        ON soraku.events;
DROP TRIGGER IF EXISTS trg_gallery_updatedat       ON soraku.gallery;
DROP TRIGGER IF EXISTS trg_postcomments_updatedat  ON soraku.postcomments;
DROP TRIGGER IF EXISTS trg_eventregs_updatedat     ON soraku.eventregistrations;
DROP TRIGGER IF EXISTS trg_partnerships_updatedat  ON soraku.partnerships;

CREATE TRIGGER trg_users_updatedat         BEFORE UPDATE ON soraku.users               FOR EACH ROW EXECUTE FUNCTION soraku.set_updated_at();
CREATE TRIGGER trg_posts_updatedat         BEFORE UPDATE ON soraku.posts               FOR EACH ROW EXECUTE FUNCTION soraku.set_updated_at();
CREATE TRIGGER trg_events_updatedat        BEFORE UPDATE ON soraku.events              FOR EACH ROW EXECUTE FUNCTION soraku.set_updated_at();
CREATE TRIGGER trg_gallery_updatedat       BEFORE UPDATE ON soraku.gallery             FOR EACH ROW EXECUTE FUNCTION soraku.set_updated_at();
CREATE TRIGGER trg_postcomments_updatedat  BEFORE UPDATE ON soraku.postcomments        FOR EACH ROW EXECUTE FUNCTION soraku.set_updated_at();
CREATE TRIGGER trg_eventregs_updatedat     BEFORE UPDATE ON soraku.eventregistrations  FOR EACH ROW EXECUTE FUNCTION soraku.set_updated_at();
CREATE TRIGGER trg_partnerships_updatedat  BEFORE UPDATE ON soraku.partnerships        FOR EACH ROW EXECUTE FUNCTION soraku.set_updated_at();

-- Auto-create user on auth signup
CREATE OR REPLACE FUNCTION soraku.handle_new_auth_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = soraku, auth, public
AS $$
DECLARE
  v_username    TEXT;
  v_displayname TEXT;
  v_avatarurl   TEXT;
BEGIN
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'user_name',
    NEW.raw_user_meta_data->>'preferred_username',
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'name', ''), ' ', '_')),
    SPLIT_PART(NEW.email, '@', 1)
  );
  v_username := LOWER(REGEXP_REPLACE(LEFT(v_username, 30), '[^a-z0-9_]', '', 'g'));
  IF v_username = '' THEN
    v_username := SPLIT_PART(NEW.email, '@', 1);
  END IF;

  v_displayname := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', v_username);
  v_avatarurl   := COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture');

  INSERT INTO soraku.users (id, username, displayname, avatarurl, role, isprivate, isbanned, sociallinks, createdat, updatedat)
  VALUES (NEW.id, v_username, LEFT(v_displayname, 50), v_avatarurl, 'USER'::soraku.user_role, false, false, '{}'::jsonb, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION soraku.handle_new_auth_user();

-- Auto-create level row for new user
CREATE OR REPLACE FUNCTION soraku.create_default_level()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO soraku.userlevels (userid) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_create_default_level ON soraku.users;
CREATE TRIGGER trg_create_default_level
  AFTER INSERT ON soraku.users
  FOR EACH ROW EXECUTE FUNCTION soraku.create_default_level();

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE soraku.users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.posts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.postlikes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.postcomments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.events             ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.eventregistrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.gallery            ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.notifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.vtubers            ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.donatur            ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.music_tracks       ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.follows            ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.userlevels         ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.userbadges         ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.sitesettings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.partnerships       ENABLE ROW LEVEL SECURITY;

-- Users
DROP POLICY IF EXISTS "users_select_public" ON soraku.users;
DROP POLICY IF EXISTS "users_select_own"    ON soraku.users;
DROP POLICY IF EXISTS "users_update_own"    ON soraku.users;
CREATE POLICY "users_select_public" ON soraku.users FOR SELECT USING (isprivate = false OR auth.uid() = id);
CREATE POLICY "users_select_own"    ON soraku.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own"    ON soraku.users FOR UPDATE USING (auth.uid() = id);

-- Posts
DROP POLICY IF EXISTS "posts_select_public" ON soraku.posts;
CREATE POLICY "posts_select_public" ON soraku.posts FOR SELECT USING (ispublished = true);

-- Post Likes
DROP POLICY IF EXISTS "postlikes_select" ON soraku.postlikes;
DROP POLICY IF EXISTS "postlikes_insert" ON soraku.postlikes;
DROP POLICY IF EXISTS "postlikes_delete" ON soraku.postlikes;
CREATE POLICY "postlikes_select" ON soraku.postlikes FOR SELECT USING (true);
CREATE POLICY "postlikes_insert" ON soraku.postlikes FOR INSERT WITH CHECK (true);
CREATE POLICY "postlikes_delete" ON soraku.postlikes FOR DELETE USING (auth.uid() = userid);

-- Post Comments
DROP POLICY IF EXISTS "postcomments_select" ON soraku.postcomments;
DROP POLICY IF EXISTS "postcomments_insert" ON soraku.postcomments;
DROP POLICY IF EXISTS "postcomments_update" ON soraku.postcomments;
CREATE POLICY "postcomments_select" ON soraku.postcomments FOR SELECT USING (isdeleted = false);
CREATE POLICY "postcomments_insert" ON soraku.postcomments FOR INSERT WITH CHECK (true);
CREATE POLICY "postcomments_update" ON soraku.postcomments FOR UPDATE USING (auth.uid() = userid);

-- Events
DROP POLICY IF EXISTS "events_select_public" ON soraku.events;
CREATE POLICY "events_select_public" ON soraku.events FOR SELECT USING (ispublished = true);

-- Event Registrations
DROP POLICY IF EXISTS "eventregs_insert_public" ON soraku.eventregistrations;
DROP POLICY IF EXISTS "eventregs_select_public" ON soraku.eventregistrations;
DROP POLICY IF EXISTS "eventregs_service_all"   ON soraku.eventregistrations;
CREATE POLICY "eventregs_insert_public" ON soraku.eventregistrations FOR INSERT WITH CHECK (true);
CREATE POLICY "eventregs_select_public" ON soraku.eventregistrations FOR SELECT USING (
  EXISTS (SELECT 1 FROM soraku.events e WHERE e.id = eventregistrations.eventid AND e.ispublished = true)
);
CREATE POLICY "eventregs_service_all" ON soraku.eventregistrations FOR ALL USING (true) WITH CHECK (true);

-- Gallery
DROP POLICY IF EXISTS "gallery_select_public" ON soraku.gallery;
DROP POLICY IF EXISTS "gallery_insert_auth"   ON soraku.gallery;
CREATE POLICY "gallery_select_public" ON soraku.gallery FOR SELECT USING (status = 'approved');
CREATE POLICY "gallery_insert_auth"   ON soraku.gallery FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Notifications
DROP POLICY IF EXISTS "notif_select_own"   ON soraku.notifications;
DROP POLICY IF EXISTS "notif_update_own"   ON soraku.notifications;
DROP POLICY IF EXISTS "notif_service_all"  ON soraku.notifications;
CREATE POLICY "notif_select_own"  ON soraku.notifications FOR SELECT USING (auth.uid() = userid);
CREATE POLICY "notif_update_own"  ON soraku.notifications FOR UPDATE USING (auth.uid() = userid);
CREATE POLICY "notif_service_all" ON soraku.notifications FOR ALL USING (true) WITH CHECK (true);

-- VTubers
DROP POLICY IF EXISTS "vtubers_select_public" ON soraku.vtubers;
CREATE POLICY "vtubers_select_public" ON soraku.vtubers FOR SELECT USING (ispublished = true);

-- Donatur
DROP POLICY IF EXISTS "donatur_select_public" ON soraku.donatur;
CREATE POLICY "donatur_select_public" ON soraku.donatur FOR SELECT USING (ispublic = true);

-- Music
DROP POLICY IF EXISTS "music_select_active" ON soraku.music_tracks;
CREATE POLICY "music_select_active" ON soraku.music_tracks FOR SELECT USING (isactive = true);

-- Follows
DROP POLICY IF EXISTS "follows_read"   ON soraku.follows;
DROP POLICY IF EXISTS "follows_insert" ON soraku.follows;
DROP POLICY IF EXISTS "follows_delete" ON soraku.follows;
CREATE POLICY "follows_read"   ON soraku.follows FOR SELECT USING (true);
CREATE POLICY "follows_insert" ON soraku.follows FOR INSERT WITH CHECK (auth.uid() = followerid);
CREATE POLICY "follows_delete" ON soraku.follows FOR DELETE USING (auth.uid() = followerid);

-- User Levels & Badges
DROP POLICY IF EXISTS "userlevels_public_read" ON soraku.userlevels;
DROP POLICY IF EXISTS "userlevels_svc_all"     ON soraku.userlevels;
CREATE POLICY "userlevels_public_read" ON soraku.userlevels FOR SELECT USING (true);
CREATE POLICY "userlevels_svc_all"     ON soraku.userlevels FOR ALL USING (true);

DROP POLICY IF EXISTS "userbadges_public_read" ON soraku.userbadges;
DROP POLICY IF EXISTS "userbadges_svc_all"     ON soraku.userbadges;
CREATE POLICY "userbadges_public_read" ON soraku.userbadges FOR SELECT USING (true);
CREATE POLICY "userbadges_svc_all"     ON soraku.userbadges FOR ALL USING (true);

-- Site Settings (service role only)
DROP POLICY IF EXISTS "sitesettings_svc" ON soraku.sitesettings;
CREATE POLICY "sitesettings_svc" ON soraku.sitesettings FOR ALL USING (true);

-- Grants
GRANT ALL ON soraku.postlikes    TO service_role, authenticated, anon;
GRANT ALL ON soraku.postcomments TO service_role, authenticated, anon;

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════════════════════════════

-- Default webhook entries
INSERT INTO soraku.sitesettings (key, label, category, description) VALUES
  ('discordBlogWebhookUrl',         'Webhook Blog',         'discord', 'Discord webhook URL untuk notifikasi artikel baru'),
  ('discordEventWebhookUrl',        'Webhook Event',        'discord', 'Discord webhook URL untuk announce event baru'),
  ('discordRegistrationWebhookUrl', 'Webhook Pendaftaran',  'discord', 'Discord webhook URL untuk notifikasi pendaftaran event'),
  ('discordFeedbackWebhookUrl',     'Webhook Feedback',     'discord', 'Discord webhook URL untuk notifikasi feedback dari user')
ON CONFLICT (key) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- DONE
-- ═══════════════════════════════════════════════════════════════
