-- ============================================================
-- Migration: 20260312_services_api_setup
-- Tujuan   : Setup tabel untuk services/api standalone
-- Applied  : 2026-03-12 via Supabase MCP
-- ============================================================

-- ── 1. STREAM CONTENT ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.streamcontent (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text        UNIQUE NOT NULL,
  title         text        NOT NULL,
  description   text,
  thumbnailurl  text,
  hlsurl        text,
  duration      integer,
  type          text        NOT NULL DEFAULT 'vod'
                            CHECK (type IN ('vod', 'live', 'clip')),
  status        text        NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft', 'published', 'archived')),
  vtuberid      uuid        REFERENCES soraku.vtubers(id) ON DELETE SET NULL,
  tags          text[]      DEFAULT '{}',
  viewcount     integer     NOT NULL DEFAULT 0,
  ispremium     boolean     DEFAULT false,
  metadata      jsonb       DEFAULT '{}',
  createdat     timestamptz DEFAULT now(),
  updatedat     timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_streamcontent_slug     ON soraku.streamcontent(slug);
CREATE INDEX IF NOT EXISTS idx_streamcontent_vtuberid ON soraku.streamcontent(vtuberid);
CREATE INDEX IF NOT EXISTS idx_streamcontent_status   ON soraku.streamcontent(status);
CREATE INDEX IF NOT EXISTS idx_streamcontent_type     ON soraku.streamcontent(type);

ALTER TABLE soraku.streamcontent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "streamcontent_public_read" ON soraku.streamcontent
  FOR SELECT USING (status = 'published' AND ispremium = false);

CREATE POLICY "streamcontent_premium_read" ON soraku.streamcontent
  FOR SELECT USING (
    status = 'published' AND ispremium = true AND
    EXISTS (
      SELECT 1 FROM soraku.users
      WHERE id = auth.uid()
      AND supporterrole IS NOT NULL
      AND (supporteruntil IS NULL OR supporteruntil > now())
    )
  );

CREATE POLICY "streamcontent_staff_all" ON soraku.streamcontent
  FOR ALL USING (soraku.is_staff(auth.uid()));

CREATE TRIGGER set_streamcontent_updatedat
  BEFORE UPDATE ON soraku.streamcontent
  FOR EACH ROW EXECUTE FUNCTION soraku.set_updated_at();


-- ── 2. API KEYS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soraku.apikeys (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  keyhash     text        UNIQUE NOT NULL,
  prefix      text        NOT NULL,
  client      text        NOT NULL DEFAULT 'web'
              CHECK (client IN ('web', 'bot', 'stream', 'mobile', 'internal')),
  permissions jsonb       NOT NULL DEFAULT '["read"]',
  lastusedат  timestamptz,
  expiresat   timestamptz,
  isactive    boolean     NOT NULL DEFAULT true,
  createdat   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_apikeys_prefix   ON soraku.apikeys(prefix);
CREATE INDEX IF NOT EXISTS idx_apikeys_client   ON soraku.apikeys(client);
CREATE INDEX IF NOT EXISTS idx_apikeys_isactive ON soraku.apikeys(isactive);

ALTER TABLE soraku.apikeys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "apikeys_staff_only" ON soraku.apikeys
  FOR ALL USING (soraku.is_staff(auth.uid()));


-- ── 3. TRACK ──────────────────────────────────────────────────
INSERT INTO soraku._migrations (name, checksum) VALUES
  ('20260312_services_api_setup', md5('streamcontent+apikeys'))
ON CONFLICT (name) DO NOTHING;
