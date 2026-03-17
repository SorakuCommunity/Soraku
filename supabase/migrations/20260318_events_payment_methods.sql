-- Events: payment methods JSONB column
-- Date: 2026-03-18 | Author: Rey | Applied: via Supabase MCP
-- Structure per item:
--   { type: 'bank', bank: 'BCA'|'BRI'|'BTN'|'Seabank', account: string, name: string }
--   { type: 'ewallet', provider: 'dana', account: string, name: string }
--   { type: 'qris', provider: 'gopay', qrisImageUrl: string }

ALTER TABLE soraku.events
  ADD COLUMN IF NOT EXISTS paymentmethods JSONB DEFAULT '[]'::jsonb;

INSERT INTO soraku._migrations (name, checksum)
VALUES ('20260318_events_payment_methods', md5('events_payment_methods_v1'))
ON CONFLICT (name) DO NOTHING;
