-- Soraku — Event Registration ML
-- Date   : 2026-03-17 | Author: Bubu | Applied: via Supabase MCP

-- Tambah kolom ke events
ALTER TABLE soraku.events
  ADD COLUMN IF NOT EXISTS registrationurl  TEXT,
  ADD COLUMN IF NOT EXISTS discordchannelid TEXT;

-- Tabel pendaftaran event
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
  notes           TEXT,
  createdat       TIMESTAMPTZ DEFAULT NOW(),
  updatedat       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eventregistrations_eventid
  ON soraku.eventregistrations(eventid);

ALTER TABLE soraku.eventregistrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "eventregs_insert_public"  ON soraku.eventregistrations FOR INSERT WITH CHECK (true);
CREATE POLICY "eventregs_select_public"  ON soraku.eventregistrations FOR SELECT USING (
  EXISTS (SELECT 1 FROM soraku.events e WHERE e.id = eventregistrations.eventid AND e.ispublished = true)
);
CREATE POLICY "eventregs_service_all" ON soraku.eventregistrations FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER eventregs_set_updated_at
  BEFORE UPDATE ON soraku.eventregistrations
  FOR EACH ROW EXECUTE FUNCTION soraku.set_updated_at();

INSERT INTO soraku._migrations (name, checksum)
VALUES ('20260317_add_event_registration_ml', md5('event_reg_ml_v1'))
ON CONFLICT (name) DO NOTHING;
