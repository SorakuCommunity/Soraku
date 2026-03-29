-- Fix: permission denied for table eventregistrations
-- + tambah kolom gametype ke events
-- Date: 2026-03-17 | Author: Bubu | Applied: via Supabase MCP

-- Grant eksplisit ke semua roles (RLS policy saja tidak cukup)
GRANT ALL ON soraku.eventregistrations TO service_role;
GRANT ALL ON soraku.eventregistrations TO authenticated;
GRANT ALL ON soraku.eventregistrations TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA soraku TO service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA soraku TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA soraku TO anon;

-- Tambah gametype ke events
ALTER TABLE soraku.events
  ADD COLUMN IF NOT EXISTS gametype TEXT
    CHECK (gametype IN ('ml','valorant','freefire','pubg','chess','other') OR gametype IS NULL);

INSERT INTO soraku._migrations (name, checksum)
VALUES ('20260317_fix_eventregistrations_permissions_and_gametype', md5('eventregs_perms_gametype_v1'))
ON CONFLICT (name) DO NOTHING;
