-- ============================================================
-- Soraku — Full Sync Fix Migration
-- Tanggal : 2026-03-12
-- Author  : Kaizo (Back-end)
-- Tujuan  : Fix semua inkonsistensi DB, duplikat policy/trigger,
--           fungsi lama, dan sinkronisasi schema dengan web
-- ============================================================

-- FIX 1: Hapus fungsi lama handle_new_user (referensi kolom snake_case)
DROP FUNCTION IF EXISTS soraku.handle_new_user() CASCADE;

-- FIX 2: Standardize trigger timestamp ke set_updated_at()
DROP TRIGGER IF EXISTS partnerships_updatedat ON soraku.partnerships;
CREATE OR REPLACE TRIGGER partnerships_set_updated_at
  BEFORE UPDATE ON soraku.partnerships
  FOR EACH ROW EXECUTE FUNCTION soraku.set_updated_at();
DROP FUNCTION IF EXISTS soraku.set_updatedat() CASCADE;

-- FIX 3: Hapus duplicate RLS policies
DROP POLICY IF EXISTS "donatur_select_public" ON soraku.donatur;
DROP POLICY IF EXISTS "events_select_public" ON soraku.events;
DROP POLICY IF EXISTS "gallery_select_public" ON soraku.gallery;
DROP POLICY IF EXISTS "gallery_insert_auth" ON soraku.gallery;
DROP POLICY IF EXISTS "posts_select_public" ON soraku.posts;
DROP POLICY IF EXISTS "users_select_own" ON soraku.users;
DROP POLICY IF EXISTS "users_select_public" ON soraku.users;
DROP POLICY IF EXISTS "users_update_own" ON soraku.users;
DROP POLICY IF EXISTS "vtubers_select_public" ON soraku.vtubers;

-- FIX 4: Fix notifications policies (hapus duplikat, recreate bersih)
DROP POLICY IF EXISTS "notif: service role" ON soraku.notifications;
DROP POLICY IF EXISTS "notif: staff insert" ON soraku.notifications;
DROP POLICY IF EXISTS "notif: user own read" ON soraku.notifications;
DROP POLICY IF EXISTS "notif: user own update" ON soraku.notifications;
DROP POLICY IF EXISTS "service_insert_notifs" ON soraku.notifications;
DROP POLICY IF EXISTS "service_delete_notifs" ON soraku.notifications;
DROP POLICY IF EXISTS "user_select_own_notifs" ON soraku.notifications;
DROP POLICY IF EXISTS "user_update_own_notifs" ON soraku.notifications;
CREATE POLICY "notif_select_own" ON soraku.notifications
  FOR SELECT USING (auth.uid() = userid);
CREATE POLICY "notif_update_own" ON soraku.notifications
  FOR UPDATE USING (auth.uid() = userid);
CREATE POLICY "notif_service_all" ON soraku.notifications
  FOR ALL USING (true) WITH CHECK (true);

-- FIX 5: Notifications.body nullable
ALTER TABLE soraku.notifications ALTER COLUMN body DROP NOT NULL;

-- FIX 6: Konsolidasi CHECK constraint events.status
ALTER TABLE soraku.events DROP CONSTRAINT IF EXISTS events_status_check;
ALTER TABLE soraku.events ADD CONSTRAINT events_status_check
  CHECK (status IN ('online', 'pending', 'selesai'));

-- FIX 7: Sync role Riu jika berubah
UPDATE soraku.users
SET role = 'OWNER'::soraku.user_role, updatedat = NOW()
WHERE id = 'fe60b0f9-9c65-4109-852a-8bf004f2f35a'
  AND role != 'OWNER';

-- Track migrations
INSERT INTO soraku._migrations (name)
VALUES ('20260311_notifications'), ('20260312_fix_sync_cleanup_all')
ON CONFLICT DO NOTHING;
