-- ============================================================
-- SORAKU COMMUNITY PLATFORM — MIGRATION v1.0.a3.1
-- Safe to re-run (idempotent)
-- ============================================================

-- ─── Add theme_mode to users table ──────────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'users'
      AND column_name  = 'theme_mode'
  ) THEN
    ALTER TABLE public.users
      ADD COLUMN theme_mode TEXT DEFAULT 'dark'
        CHECK (theme_mode IN ('dark', 'light', 'auto'));
  END IF;
END $$;

-- ─── Add theme palette keys to site_settings ───────────────────────────────

INSERT INTO public.site_settings (key, value) VALUES
  ('primary_color',    '#4FA3D1'),
  ('dark_base_color',  '#1C1E22'),
  ('secondary_color',  '#6E8FA6'),
  ('light_base_color', '#D9DDE3'),
  ('accent_color',     '#E8C2A8'),
  ('theme_mode',       'dark')
ON CONFLICT (key) DO NOTHING;

-- ─── End of migration v1.0.a3.1 ─────────────────────────────────────────────
