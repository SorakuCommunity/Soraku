-- ============================================================
-- Fix: bot.* tabel tidak punya kolom 'id'
-- Bot query .eq('id', guild_id) → "column X.id does not exist"
-- Fix: GENERATED ALWAYS AS column id = guild_id / user_id / channel_id
-- Date   : 2026-03-17
-- Author : Bubu
-- Applied: langsung via Supabase MCP
-- ============================================================

-- Tabel dengan guild_id sebagai PK (12 tabel)
ALTER TABLE bot.guilds         ADD COLUMN IF NOT EXISTS id TEXT GENERATED ALWAYS AS (guild_id) STORED;
ALTER TABLE bot.music247       ADD COLUMN IF NOT EXISTS id TEXT GENERATED ALWAYS AS (guild_id) STORED;
ALTER TABLE bot.invite_settings ADD COLUMN IF NOT EXISTS id TEXT GENERATED ALWAYS AS (guild_id) STORED;
ALTER TABLE bot.autorespond    ADD COLUMN IF NOT EXISTS id TEXT GENERATED ALWAYS AS (guild_id) STORED;
ALTER TABLE bot.autorole       ADD COLUMN IF NOT EXISTS id TEXT GENERATED ALWAYS AS (guild_id) STORED;
ALTER TABLE bot.antilink       ADD COLUMN IF NOT EXISTS id TEXT GENERATED ALWAYS AS (guild_id) STORED;
ALTER TABLE bot.antinuke       ADD COLUMN IF NOT EXISTS id TEXT GENERATED ALWAYS AS (guild_id) STORED;
ALTER TABLE bot.antispam       ADD COLUMN IF NOT EXISTS id TEXT GENERATED ALWAYS AS (guild_id) STORED;
ALTER TABLE bot.afk            ADD COLUMN IF NOT EXISTS id TEXT GENERATED ALWAYS AS (guild_id) STORED;
ALTER TABLE bot.ignorechan     ADD COLUMN IF NOT EXISTS id TEXT GENERATED ALWAYS AS (guild_id) STORED;
ALTER TABLE bot.roles          ADD COLUMN IF NOT EXISTS id TEXT GENERATED ALWAYS AS (guild_id) STORED;
ALTER TABLE bot.ticket_counters ADD COLUMN IF NOT EXISTS id TEXT GENERATED ALWAYS AS (guild_id) STORED;
ALTER TABLE bot.welcome        ADD COLUMN IF NOT EXISTS id TEXT GENERATED ALWAYS AS (guild_id) STORED;

-- Tabel dengan user_id sebagai PK
ALTER TABLE bot.blacklist ADD COLUMN IF NOT EXISTS id TEXT GENERATED ALWAYS AS (user_id) STORED;
ALTER TABLE bot.noprefix  ADD COLUMN IF NOT EXISTS id TEXT GENERATED ALWAYS AS (user_id) STORED;

-- Tabel dengan channel_id sebagai PK
ALTER TABLE bot.snipe ADD COLUMN IF NOT EXISTS id TEXT GENERATED ALWAYS AS (channel_id) STORED;

INSERT INTO soraku._migrations (name, checksum) VALUES
  ('20260317_bot_add_id_alias_columns', md5('bot_id_alias_v1')),
  ('20260317_bot_add_id_user_channel_alias', md5('bot_id_user_channel_v1'))
ON CONFLICT (name) DO NOTHING;
