-- Tambah kolom status ke events (Online, Pending, Selesai)
ALTER TABLE soraku.events 
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('online','pending','selesai'));

-- Sinkronkan status dari isonline yang ada
UPDATE soraku.events SET status = 'online' WHERE isonline = true AND ispublished = true;

-- Tambah description ke partnerships jika belum ada
ALTER TABLE soraku.partnerships
  ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE soraku.partnerships
  ADD COLUMN IF NOT EXISTS createdby UUID REFERENCES auth.users(id) ON DELETE SET NULL;

INSERT INTO soraku._migrations (name) VALUES ('20260311_events_status_homepage') ON CONFLICT DO NOTHING;
