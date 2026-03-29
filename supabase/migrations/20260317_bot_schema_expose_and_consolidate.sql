-- ============================================================
-- Soraku Bot — Schema Expose + Table Consolidation
-- Date   : 2026-03-17
-- Author : Bubu (Front-end/DB support), atas request Riu
-- Fix    : PGRST205 bot.* + deduplication tabel duplikat
-- Applied: langsung via Supabase MCP
-- ============================================================

-- ── 1. EXPOSE bot schema ke PostgREST ────────────────────────
-- Root cause semua PGRST205: schema 'bot' belum terdaftar
ALTER ROLE authenticator SET pgrst.db_schemas TO 'public, soraku, bot';
NOTIFY pgrst, 'reload config';

-- ── 2. CONSOLIDATE premium tables ────────────────────────────
-- Sebelum : guild_premium (0 rows), user_premium (0 rows), premium (tabel kanonik)
-- Sesudah : premium = BASE TABLE, guild_premium + user_premium = VIEW
DROP TABLE IF EXISTS bot.guild_premium;
DROP TABLE IF EXISTS bot.user_premium;

CREATE OR REPLACE VIEW bot.guild_premium AS
SELECT
  p.target_id                              AS guild_id,
  p.type                                   AS premium_type,
  p.granted_by,
  EXTRACT(EPOCH FROM p.created_at)::bigint AS granted_at,
  EXTRACT(EPOCH FROM p.expires_at)::bigint AS expires_at,
  p.reason, p.active, p.created_at,
  p.created_at AS updated_at
FROM bot.premium p
WHERE p.type IN ('guild', 'guild_basic', 'guild_pro');

CREATE OR REPLACE VIEW bot.user_premium AS
SELECT
  p.target_id                              AS user_id,
  p.type                                   AS premium_type,
  p.granted_by,
  EXTRACT(EPOCH FROM p.created_at)::bigint AS granted_at,
  EXTRACT(EPOCH FROM p.expires_at)::bigint AS expires_at,
  p.reason, p.active, p.created_at,
  p.created_at AS updated_at
FROM bot.premium p
WHERE p.type IN ('user', 'user_basic', 'user_pro');

-- ── 3. CONSOLIDATE invite tables ──────────────────────────────
-- Sebelum : invite_data (kanonik), invite_members (duplikat), member_invites (duplikat) semua 0 rows
-- Sesudah : invite_data = BASE TABLE, invite_members + member_invites = VIEW
DROP TABLE IF EXISTS bot.invite_members;
DROP TABLE IF EXISTS bot.member_invites;

CREATE OR REPLACE VIEW bot.invite_members AS
SELECT id, guild_id, user_id, inviter_id, invite_code,
  real_invites AS regular, bonus_invites AS bonus,
  fake_invites AS fake, left_invites AS left_count, created_at
FROM bot.invite_data;

CREATE OR REPLACE VIEW bot.member_invites AS
SELECT id, guild_id, user_id,
  real_invites AS invites, left_invites AS left_count,
  fake_invites AS fake_count, inviter_id, invite_code,
  created_at, updated_at
FROM bot.invite_data;

-- ── 4. CONSOLIDATE reminder tables ───────────────────────────
-- Sebelum : reminders (kanonik, uuid, timestamp), reminds (duplikat, bigint, epoch) semua 0 rows
-- Sesudah : reminders = BASE TABLE, reminds = VIEW
DROP TABLE IF EXISTS bot.reminds;

CREATE OR REPLACE VIEW bot.reminds AS
SELECT id, guild_id, channel_id, user_id, message,
  EXTRACT(EPOCH FROM remind_at)::bigint  AS remind_at,
  done                                    AS reminded,
  EXTRACT(EPOCH FROM created_at)::bigint AS created_at
FROM bot.reminders;

INSERT INTO soraku._migrations (name, checksum) VALUES
  ('20260317_bot_schema_expose_and_consolidate', md5('bot_schema_expose_consolidate_v1'))
ON CONFLICT (name) DO NOTHING;
