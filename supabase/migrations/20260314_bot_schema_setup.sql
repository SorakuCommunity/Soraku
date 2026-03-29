-- ================================================================
-- SorakuBot — Supabase Migration
-- Schema: bot (terpisah dari soraku yang dipakai apps/web)
-- Run ini di Supabase SQL Editor
-- ================================================================

CREATE SCHEMA IF NOT EXISTS bot;

-- Guild settings (prefix, dll)
CREATE TABLE IF NOT EXISTS bot.bot_guilds (
  guild_id      TEXT PRIMARY KEY,
  prefix        TEXT NOT NULL DEFAULT '!',
  embed_color   TEXT NOT NULL DEFAULT '2b2d31',
  log_channel   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Antinuke
CREATE TABLE IF NOT EXISTS bot.bot_antinuke (
  guild_id        TEXT PRIMARY KEY,
  is_enabled      BOOLEAN DEFAULT FALSE,
  extra_owners    TEXT[] DEFAULT '{}',
  whitelist_users TEXT[] DEFAULT '{}',
  whitelist_roles TEXT[] DEFAULT '{}',
  log_channel_id  TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Antilink
CREATE TABLE IF NOT EXISTS bot.bot_antilink (
  guild_id         TEXT PRIMARY KEY,
  is_enabled       BOOLEAN DEFAULT FALSE,
  whitelist_users  TEXT[] DEFAULT '{}',
  whitelist_roles  TEXT[] DEFAULT '{}',
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Antispam
CREATE TABLE IF NOT EXISTS bot.bot_antispam (
  guild_id           TEXT PRIMARY KEY,
  is_enabled         BOOLEAN DEFAULT FALSE,
  message_threshold  INT DEFAULT 5,
  timeframe          INT DEFAULT 10,
  whitelist_users    TEXT[] DEFAULT '{}',
  whitelist_roles    TEXT[] DEFAULT '{}',
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Autorole
CREATE TABLE IF NOT EXISTS bot.bot_autorole (
  guild_id     TEXT PRIMARY KEY,
  human_roles  TEXT[] DEFAULT '{}',
  bot_roles    TEXT[] DEFAULT '{}',
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Autorespond triggers
CREATE TABLE IF NOT EXISTS bot.bot_autorespond (
  id          BIGSERIAL PRIMARY KEY,
  guild_id    TEXT NOT NULL,
  trigger     TEXT NOT NULL,
  response    TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guild_id, trigger)
);

-- Autoreact
CREATE TABLE IF NOT EXISTS bot.bot_autoreact (
  id          BIGSERIAL PRIMARY KEY,
  guild_id    TEXT NOT NULL,
  keyword     TEXT NOT NULL,
  emoji       TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guild_id, keyword)
);

-- Welcome system
CREATE TABLE IF NOT EXISTS bot.bot_welcome (
  guild_id      TEXT PRIMARY KEY,
  is_enabled    BOOLEAN DEFAULT FALSE,
  channel_id    TEXT,
  content       TEXT,
  embed_title   TEXT,
  embed_desc    TEXT,
  embed_color   TEXT DEFAULT '#7c3aed',
  embed_image   TEXT,
  embed_thumb   TEXT,
  embed_footer  TEXT,
  auto_del      INT DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- AFK
CREATE TABLE IF NOT EXISTS bot.bot_afk (
  guild_id    TEXT NOT NULL,
  user_id     TEXT NOT NULL,
  reason      TEXT DEFAULT 'Tidak ada alasan',
  since       TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (guild_id, user_id)
);

-- Playlists
CREATE TABLE IF NOT EXISTS bot.bot_playlists (
  id          BIGSERIAL PRIMARY KEY,
  user_id     TEXT NOT NULL,
  name        TEXT NOT NULL,
  tracks      JSONB DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- 24/7 music
CREATE TABLE IF NOT EXISTS bot.bot_247 (
  guild_id          TEXT PRIMARY KEY,
  text_channel_id   TEXT NOT NULL,
  voice_channel_id  TEXT NOT NULL,
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Roles setup
CREATE TABLE IF NOT EXISTS bot.bot_roles (
  guild_id    TEXT PRIMARY KEY,
  req_role    TEXT,
  official    TEXT,
  friend      TEXT,
  guest       TEXT,
  girl        TEXT,
  vip         TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Blacklist users
CREATE TABLE IF NOT EXISTS bot.bot_blacklist (
  user_id     TEXT PRIMARY KEY,
  reason      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Noprefix users
CREATE TABLE IF NOT EXISTS bot.bot_noprefix (
  user_id     TEXT PRIMARY KEY,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Ignore channels (prefix diabaikan)
CREATE TABLE IF NOT EXISTS bot.bot_ignorechan (
  guild_id    TEXT NOT NULL,
  channel_id  TEXT NOT NULL,
  PRIMARY KEY (guild_id, channel_id)
);

-- Snipe cache (1 per channel, overwrite)
CREATE TABLE IF NOT EXISTS bot.bot_snipe (
  channel_id   TEXT PRIMARY KEY,
  content      TEXT,
  author_tag   TEXT,
  author_avatar TEXT,
  deleted_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- RLS Policies — bot pakai service role key, tidak butuh RLS
-- Tapi tambahkan GRANT agar supabase service role bisa akses
-- ================================================================

GRANT ALL ON SCHEMA bot TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA bot TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA bot TO service_role;


INSERT INTO soraku._migrations (name, checksum) VALUES
  ('20260314_bot_schema_setup', md5('bot_schema_16_tables'))
ON CONFLICT (name) DO NOTHING;
