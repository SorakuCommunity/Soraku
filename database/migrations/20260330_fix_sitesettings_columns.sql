-- Fix sitesettings: sync dengan data existing (snake_case keys, double-quoted values)
-- Kolom value adalah jsonb, jadi harus cast ke text untuk LIKE/TRIM

-- Tambah kolom jika belum ada
DO $$ BEGIN
  ALTER TABLE soraku.sitesettings ADD COLUMN IF NOT EXISTS label TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE soraku.sitesettings ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Rename key snake_case → camelCase
UPDATE soraku.sitesettings SET key = 'discordRegistrationWebhookUrl' WHERE key = 'discord_registration_webhook_url';
UPDATE soraku.sitesettings SET key = 'discordEventWebhookUrl' WHERE key = 'discord_event_webhook_url';
UPDATE soraku.sitesettings SET key = 'discordBlogWebhookUrl' WHERE key = 'discord_blog_webhook_url';
UPDATE soraku.sitesettings SET key = 'discordFeedbackWebhookUrl' WHERE key = 'discord_feedback_webhook_url';

-- Bersihkan double-quote di value webhook (value adalah jsonb, cast ke text dulu)
-- Hapus kutip ganda literal di awal/akhir string, lalu simpan kembali sebagai jsonb
UPDATE soraku.sitesettings
SET value = to_jsonb(TRIM(BOTH '"' FROM (value #>> '{}')))
WHERE value #>> '{}' LIKE '"%discord%webhooks%';

-- Set label dan category untuk discord webhooks
UPDATE soraku.sitesettings SET label = 'Webhook Pendaftaran', category = 'discord' WHERE key = 'discordRegistrationWebhookUrl';
UPDATE soraku.sitesettings SET label = 'Webhook Event', category = 'discord' WHERE key = 'discordEventWebhookUrl';
UPDATE soraku.sitesettings SET label = 'Webhook Blog', category = 'discord' WHERE key = 'discordBlogWebhookUrl';
UPDATE soraku.sitesettings SET label = 'Webhook Feedback', category = 'discord' WHERE key = 'discordFeedbackWebhookUrl';

-- Set category untuk config lainnya
UPDATE soraku.sitesettings SET label = 'Social Links', category = 'config' WHERE key = 'social_links';
UPDATE soraku.sitesettings SET label = 'Auth Background', category = 'config' WHERE key = 'auth_background';

-- Seed rows yang belum ada (INSERT ... ON CONFLICT DO NOTHING)
INSERT INTO soraku.sitesettings (key, label, category, description) VALUES
  ('discordBlogWebhookUrl',         'Webhook Blog',         'discord', 'Discord webhook URL untuk notifikasi artikel baru'),
  ('discordEventWebhookUrl',        'Webhook Event',        'discord', 'Discord webhook URL untuk announce event baru'),
  ('discordRegistrationWebhookUrl', 'Webhook Pendaftaran',  'discord', 'Discord webhook URL untuk notifikasi pendaftaran event'),
  ('discordFeedbackWebhookUrl',     'Webhook Feedback',     'discord', 'Discord webhook URL untuk notifikasi feedback dari user')
ON CONFLICT (key) DO NOTHING;
