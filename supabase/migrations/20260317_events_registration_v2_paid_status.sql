-- Events v2: Free/Paid + registration review system
-- Date: 2026-03-17 | Author: Bubu | Applied: via Supabase MCP

ALTER TABLE soraku.events
  ADD COLUMN IF NOT EXISTS ispaid     BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS price      INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS priceinfo  TEXT;

ALTER TABLE soraku.eventregistrations
  ADD COLUMN IF NOT EXISTS userid         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS paymentstatus  TEXT NOT NULL DEFAULT 'none'
    CHECK (paymentstatus IN ('none','pending','confirmed','rejected')),
  ADD COLUMN IF NOT EXISTS paymentproof   TEXT,
  ADD COLUMN IF NOT EXISTS reviewedby     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewedat     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejectreason   TEXT;

CREATE INDEX IF NOT EXISTS idx_eventregistrations_userid
  ON soraku.eventregistrations(userid);

INSERT INTO soraku._migrations (name, checksum)
VALUES ('20260317_events_registration_v2_paid_status', md5('events_reg_v2_v1'))
ON CONFLICT (name) DO NOTHING;
