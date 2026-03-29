-- ============================================================
-- Migration: 20260315_bot_rename_tables_add_discordid
-- Applied  : 2026-03-15 via Supabase MCP
-- ============================================================

-- 1. Rename bot.bot_* → bot.* (tanpa prefix)
ALTER TABLE bot.bot_guilds      RENAME TO guilds;
ALTER TABLE bot.bot_antinuke    RENAME TO antinuke;
ALTER TABLE bot.bot_antilink    RENAME TO antilink;
ALTER TABLE bot.bot_antispam    RENAME TO antispam;
ALTER TABLE bot.bot_autorole    RENAME TO autorole;
ALTER TABLE bot.bot_autorespond RENAME TO autorespond;
ALTER TABLE bot.bot_autoreact   RENAME TO autoreact;
ALTER TABLE bot.bot_welcome     RENAME TO welcome;
ALTER TABLE bot.bot_afk         RENAME TO afk;
ALTER TABLE bot.bot_playlists   RENAME TO playlists;
ALTER TABLE bot.bot_247         RENAME TO music247;
ALTER TABLE bot.bot_roles       RENAME TO roles;
ALTER TABLE bot.bot_blacklist   RENAME TO blacklist;
ALTER TABLE bot.bot_noprefix    RENAME TO noprefix;
ALTER TABLE bot.bot_ignorechan  RENAME TO ignorechan;
ALTER TABLE bot.bot_snipe       RENAME TO snipe;

GRANT ALL ON ALL TABLES    IN SCHEMA bot TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA bot TO service_role;

-- 2. Tambah discordid ke soraku.users
ALTER TABLE soraku.users ADD COLUMN IF NOT EXISTS discordid TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_users_discordid ON soraku.users(discordid);

-- 3. Backfill discordid dari auth.users
UPDATE soraku.users u
SET discordid = au.raw_user_meta_data->>'provider_id'
FROM auth.users au
WHERE u.id = au.id
  AND au.raw_app_meta_data->>'provider' = 'discord'
  AND au.raw_user_meta_data->>'provider_id' IS NOT NULL
  AND u.discordid IS NULL;

-- 4. Track
INSERT INTO soraku._migrations (name, checksum) VALUES
  ('20260315_bot_rename_tables_add_discordid', md5('rename_bot_tables+discordid'))
ON CONFLICT (name) DO NOTHING;
