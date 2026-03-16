-- Migration: 20260316_aerox_full_schema
-- Applied: 2026-03-16 via Supabase MCP
-- Rebuild schema bot.* untuk AeroX AIO V3 (mengganti SorakuBot lama)
-- Lihat migration lengkap di Supabase dashboard
INSERT INTO soraku._migrations (name, checksum) VALUES
  ('20260316_aerox_full_schema', md5('aerox_full_schema_v1'))
ON CONFLICT (name) DO NOTHING;
