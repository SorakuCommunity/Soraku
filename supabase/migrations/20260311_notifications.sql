-- =============================================================================
-- Migration: tabel notifications
-- Tanggal  : 2026-03-11
-- Owner    : Sora
-- =============================================================================

-- Tabel notifications (polling 30s dari client, siap upgrade ke Realtime)
CREATE TABLE IF NOT EXISTS soraku.notifications (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userid    UUID NOT NULL REFERENCES soraku.users(id) ON DELETE CASCADE,
  type      TEXT NOT NULL DEFAULT 'info',       -- 'info' | 'success' | 'warning' | 'system'
  title     TEXT NOT NULL,
  body      TEXT,
  href      TEXT,                                -- link yang diklik saat notif dibuka
  isread    BOOLEAN NOT NULL DEFAULT false,
  createdat TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index untuk query cepat
CREATE INDEX IF NOT EXISTS idx_notifications_userid     ON soraku.notifications(userid);
CREATE INDEX IF NOT EXISTS idx_notifications_userid_read ON soraku.notifications(userid, isread);
CREATE INDEX IF NOT EXISTS idx_notifications_createdat  ON soraku.notifications(createdat DESC);

-- Enable RLS
ALTER TABLE soraku.notifications ENABLE ROW LEVEL SECURITY;

-- User hanya bisa lihat/update notif sendiri
CREATE POLICY "user_select_own_notifs" ON soraku.notifications
  FOR SELECT USING (auth.uid() = userid);

CREATE POLICY "user_update_own_notifs" ON soraku.notifications
  FOR UPDATE USING (auth.uid() = userid);

-- Hanya service role (adminDb) yang bisa insert/delete
CREATE POLICY "service_insert_notifs" ON soraku.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "service_delete_notifs" ON soraku.notifications
  FOR DELETE USING (true);
