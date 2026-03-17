-- Tambah kolom registrationopen ke events
-- Date: 2026-03-18 | Author: Bubu | Applied: via Supabase MCP
ALTER TABLE soraku.events
  ADD COLUMN IF NOT EXISTS registrationopen BOOLEAN NOT NULL DEFAULT false;

INSERT INTO soraku._migrations (name, checksum)
VALUES ('20260318_events_add_registration_open_flag', md5('reg_open_v1'))
ON CONFLICT (name) DO NOTHING;
