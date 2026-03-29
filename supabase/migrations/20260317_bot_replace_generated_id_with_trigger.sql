-- ============================================================
-- Fix: GENERATED ALWAYS AS id → trigger-based sync
-- Error 428C9: "cannot insert non-DEFAULT value into generated column"
-- Bot upsert dengan { id: guildId, ... } tapi GENERATED ALWAYS menolak
-- 
-- Solusi: Drop GENERATED ALWAYS, ganti dengan kolom TEXT biasa
-- + Trigger BEFORE INSERT OR UPDATE: sync id ↔ guild_id / user_id / channel_id
-- Date   : 2026-03-17 | Author: Bubu | Applied: via Supabase MCP
-- ============================================================

-- 1. DROP generated columns
ALTER TABLE bot.guilds         DROP COLUMN id;
ALTER TABLE bot.music247       DROP COLUMN id;
ALTER TABLE bot.invitesettings DROP COLUMN id;
ALTER TABLE bot.autorole       DROP COLUMN id;
ALTER TABLE bot.antilink       DROP COLUMN id;
ALTER TABLE bot.antinuke       DROP COLUMN id;
ALTER TABLE bot.antispam       DROP COLUMN id;
ALTER TABLE bot.afk            DROP COLUMN id;
ALTER TABLE bot.ignorechan     DROP COLUMN id;
ALTER TABLE bot.roles          DROP COLUMN id;
ALTER TABLE bot.ticketcounters DROP COLUMN id;
ALTER TABLE bot.welcome        DROP COLUMN id;
ALTER TABLE bot.blacklist      DROP COLUMN id;
ALTER TABLE bot.noprefix       DROP COLUMN id;
ALTER TABLE bot.snipe          DROP COLUMN id;

-- 2. Re-add sebagai kolom TEXT biasa
ALTER TABLE bot.guilds         ADD COLUMN id TEXT;
ALTER TABLE bot.music247       ADD COLUMN id TEXT;
ALTER TABLE bot.invitesettings ADD COLUMN id TEXT;
ALTER TABLE bot.autorole       ADD COLUMN id TEXT;
ALTER TABLE bot.antilink       ADD COLUMN id TEXT;
ALTER TABLE bot.antinuke       ADD COLUMN id TEXT;
ALTER TABLE bot.antispam       ADD COLUMN id TEXT;
ALTER TABLE bot.afk            ADD COLUMN id TEXT;
ALTER TABLE bot.ignorechan     ADD COLUMN id TEXT;
ALTER TABLE bot.roles          ADD COLUMN id TEXT;
ALTER TABLE bot.ticketcounters ADD COLUMN id TEXT;
ALTER TABLE bot.welcome        ADD COLUMN id TEXT;
ALTER TABLE bot.blacklist      ADD COLUMN id TEXT;
ALTER TABLE bot.noprefix       ADD COLUMN id TEXT;
ALTER TABLE bot.snipe          ADD COLUMN id TEXT;

-- 3. Trigger functions
CREATE OR REPLACE FUNCTION bot.sync_id_guild() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.id IS NOT NULL AND NEW.guild_id IS NULL THEN NEW.guild_id := NEW.id; END IF;
  IF NEW.guild_id IS NOT NULL AND NEW.id IS NULL THEN NEW.id := NEW.guild_id; END IF;
  RETURN NEW;
END;$$;

CREATE OR REPLACE FUNCTION bot.sync_id_user() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.id IS NOT NULL AND NEW.user_id IS NULL THEN NEW.user_id := NEW.id; END IF;
  IF NEW.user_id IS NOT NULL AND NEW.id IS NULL THEN NEW.id := NEW.user_id; END IF;
  RETURN NEW;
END;$$;

CREATE OR REPLACE FUNCTION bot.sync_id_channel() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.id IS NOT NULL AND NEW.channel_id IS NULL THEN NEW.channel_id := NEW.id; END IF;
  IF NEW.channel_id IS NOT NULL AND NEW.id IS NULL THEN NEW.id := NEW.channel_id; END IF;
  RETURN NEW;
END;$$;

-- 4. Attach triggers
CREATE TRIGGER sync_id_guilds         BEFORE INSERT OR UPDATE ON bot.guilds         FOR EACH ROW EXECUTE FUNCTION bot.sync_id_guild();
CREATE TRIGGER sync_id_music247       BEFORE INSERT OR UPDATE ON bot.music247       FOR EACH ROW EXECUTE FUNCTION bot.sync_id_guild();
CREATE TRIGGER sync_id_invitesettings BEFORE INSERT OR UPDATE ON bot.invitesettings FOR EACH ROW EXECUTE FUNCTION bot.sync_id_guild();
CREATE TRIGGER sync_id_autorole       BEFORE INSERT OR UPDATE ON bot.autorole       FOR EACH ROW EXECUTE FUNCTION bot.sync_id_guild();
CREATE TRIGGER sync_id_antilink       BEFORE INSERT OR UPDATE ON bot.antilink       FOR EACH ROW EXECUTE FUNCTION bot.sync_id_guild();
CREATE TRIGGER sync_id_antinuke       BEFORE INSERT OR UPDATE ON bot.antinuke       FOR EACH ROW EXECUTE FUNCTION bot.sync_id_guild();
CREATE TRIGGER sync_id_antispam       BEFORE INSERT OR UPDATE ON bot.antispam       FOR EACH ROW EXECUTE FUNCTION bot.sync_id_guild();
CREATE TRIGGER sync_id_afk            BEFORE INSERT OR UPDATE ON bot.afk            FOR EACH ROW EXECUTE FUNCTION bot.sync_id_guild();
CREATE TRIGGER sync_id_ignorechan     BEFORE INSERT OR UPDATE ON bot.ignorechan     FOR EACH ROW EXECUTE FUNCTION bot.sync_id_guild();
CREATE TRIGGER sync_id_roles          BEFORE INSERT OR UPDATE ON bot.roles          FOR EACH ROW EXECUTE FUNCTION bot.sync_id_guild();
CREATE TRIGGER sync_id_ticketcounters BEFORE INSERT OR UPDATE ON bot.ticketcounters FOR EACH ROW EXECUTE FUNCTION bot.sync_id_guild();
CREATE TRIGGER sync_id_welcome        BEFORE INSERT OR UPDATE ON bot.welcome        FOR EACH ROW EXECUTE FUNCTION bot.sync_id_guild();
CREATE TRIGGER sync_id_blacklist      BEFORE INSERT OR UPDATE ON bot.blacklist      FOR EACH ROW EXECUTE FUNCTION bot.sync_id_user();
CREATE TRIGGER sync_id_noprefix       BEFORE INSERT OR UPDATE ON bot.noprefix       FOR EACH ROW EXECUTE FUNCTION bot.sync_id_user();
CREATE TRIGGER sync_id_snipe          BEFORE INSERT OR UPDATE ON bot.snipe          FOR EACH ROW EXECUTE FUNCTION bot.sync_id_channel();

INSERT INTO soraku._migrations (name, checksum)
VALUES ('20260317_bot_replace_generated_id_with_trigger', md5('bot_trigger_id_sync_v1'))
ON CONFLICT (name) DO NOTHING;
