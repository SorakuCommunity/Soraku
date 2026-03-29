-- ─── Level System ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.userlevels (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userid           UUID NOT NULL UNIQUE REFERENCES soraku.users(id) ON DELETE CASCADE,
  level            INTEGER NOT NULL DEFAULT 1,
  xpcurrent        INTEGER NOT NULL DEFAULT 0,
  xprequired       INTEGER NOT NULL DEFAULT 100,
  reputationscore  INTEGER NOT NULL DEFAULT 0,
  updatedat        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Badge System ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.userbadges (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userid    UUID NOT NULL REFERENCES soraku.users(id) ON DELETE CASCADE,
  badgename TEXT NOT NULL,
  badgeicon TEXT NOT NULL,
  badgecls  TEXT,
  createdat TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_userlevels_userid ON soraku.userlevels(userid);
CREATE INDEX IF NOT EXISTS idx_userbadges_userid ON soraku.userbadges(userid);

-- ─── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE soraku.userlevels ENABLE ROW LEVEL SECURITY;
ALTER TABLE soraku.userbadges ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='userlevels_public_read' AND tablename='userlevels' AND schemaname='soraku') THEN
    CREATE POLICY userlevels_public_read ON soraku.userlevels FOR SELECT USING (true);
    CREATE POLICY userlevels_svc_all     ON soraku.userlevels FOR ALL   USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='userbadges_public_read' AND tablename='userbadges' AND schemaname='soraku') THEN
    CREATE POLICY userbadges_public_read ON soraku.userbadges FOR SELECT USING (true);
    CREATE POLICY userbadges_svc_all     ON soraku.userbadges FOR ALL   USING (true);
  END IF;
END $$;

-- ─── Auto-create level row trigger ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION soraku.create_default_level()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO soraku.userlevels (userid) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_create_default_level ON soraku.users;
CREATE TRIGGER trg_create_default_level
  AFTER INSERT ON soraku.users
  FOR EACH ROW EXECUTE FUNCTION soraku.create_default_level();
