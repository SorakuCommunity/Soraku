/**
 * Ambil Discord webhook URL dari DB (sitesettings) atau ENV sebagai fallback.
 * Ini memungkinkan URL di-update tanpa redeploy.
 */

import { adminDb } from '@/lib/supabase/admin'
import { env } from '@/env'

const _cache: Record<string, { url: string; ts: number }> = {}
const CACHE_TTL = 60_000 // 60 detik

export async function getWebhookUrl(
  key: 'discord_event_webhook_url' | 'discord_registration_webhook_url'
): Promise<string | null> {
  const now = Date.now()

  // Cache hit
  if (_cache[key] && now - _cache[key].ts < CACHE_TTL) {
    return _cache[key].url || null
  }

  // Coba ambil dari DB
  try {
    const { data } = await adminDb()
      .from('sitesettings')
      .select('value')
      .eq('key', key)
      .maybeSingle()

    if (data?.value) {
      const url = typeof data.value === 'string' ? data.value : String(data.value)
      // Skip placeholder
      if (url && !url.includes('PASTE_DISCORD') && url.startsWith('https://discord')) {
        _cache[key] = { url, ts: now }
        return url
      }
    }
  } catch { /* fallback ke ENV */ }

  // Fallback ke ENV
  const envUrl = key === 'discord_event_webhook_url'
    ? env.DISCORD_EVENT_WEBHOOK_URL
    : env.DISCORD_REGISTRATION_WEBHOOK_URL

  if (envUrl) {
    _cache[key] = { url: envUrl, ts: now }
    return envUrl
  }

  return null
}

/** Kirim ke Discord webhook dengan error logging */
export async function sendDiscordWebhook(
  key: 'discord_event_webhook_url' | 'discord_registration_webhook_url',
  payload: object
): Promise<{ ok: boolean; error?: string }> {
  const url = await getWebhookUrl(key)

  if (!url) {
    console.warn(`[Discord] Webhook '${key}' tidak di-set. Set di DB sitesettings atau ENV.`)
    return { ok: false, error: 'webhook_url_not_set' }
  }

  try {
    const res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error(`[Discord] Webhook '${key}' gagal: ${res.status} ${body}`)
      return { ok: false, error: `http_${res.status}` }
    }

    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error(`[Discord] Webhook '${key}' error: ${msg}`)
    return { ok: false, error: msg }
  }
}
