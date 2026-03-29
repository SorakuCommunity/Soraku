-- ================================================================
-- Tambah kolom welcome settings ke table guilds (bot schema)
-- ================================================================

ALTER TABLE bot.guilds
  ADD COLUMN IF NOT EXISTS welcome_enabled    BOOLEAN   DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS welcome_channel_id TEXT      DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS welcome_message    TEXT      DEFAULT NULL;

COMMENT ON COLUMN bot.guilds.welcome_enabled    IS 'Apakah welcome message aktif';
COMMENT ON COLUMN bot.guilds.welcome_channel_id IS 'ID channel untuk kirim welcome';
COMMENT ON COLUMN bot.guilds.welcome_message    IS 'Template pesan welcome (support variabel)';
