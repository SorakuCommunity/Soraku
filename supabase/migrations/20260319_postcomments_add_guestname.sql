-- Add guestname column to postcomments table
-- Date: 2026-03-19 | Author: Rey

ALTER TABLE soraku.postcomments
  ADD COLUMN IF NOT EXISTS guestname TEXT;

INSERT INTO soraku._migrations (name, checksum)
VALUES ('20260319_postcomments_add_guestname', md5('postcomments_guestname_v1'))
ON CONFLICT (name) DO NOTHING;
