/**
 * Ambil Discord webhook URL dari DB (sitesettings) atau ENV sebagai fallback.
 * Key format: camelCase tanpa underscore (discordBlogWebhookUrl, dst)
 */

import { adminDb } from '@/lib/supabase/admin'
import { env } from '@/env'

const _cache: Record<string, { url: string; ts: number }> = {}
const CACHE_TTL = 60_000 // 60 detik

// Mapping: old key format → new key format
const KEY_MAP: Record<string, string> = {
  discord_event_webhook_url: 'discordEventWebhookUrl',
  discord_registration_webhook_url: 'discordRegistrationWebhookUrl',
  discord_blog_webhook_url: 'discordBlogWebhookUrl',
  discord_feedback_webhook_url: 'discordFeedbackWebhookUrl',
}

type WebhookKey =
  | 'discordEventWebhookUrl'
  | 'discordRegistrationWebhookUrl'
  | 'discordBlogWebhookUrl'
  | 'discordFeedbackWebhookUrl'
  | 'discord_event_webhook_url'
  | 'discord_registration_webhook_url'
  | 'discord_blog_webhook_url'

export async function getWebhookUrl(key: WebhookKey): Promise<string | null> {
  const now = Date.now()

  // Normalize to new key format
  const normalizedKey = KEY_MAP[key] ?? key

  // Cache hit
  if (_cache[normalizedKey] && now - _cache[normalizedKey].ts < CACHE_TTL) {
    return _cache[normalizedKey].url || null
  }

  // Coba ambil dari DB
  try {
    const { data } = await adminDb()
      .from('sitesettings')
      .select('value')
      .eq('key', normalizedKey)
      .maybeSingle()

    if (data?.value) {
      let url: string
      if (typeof data.value === 'string') {
        url = data.value
      } else if (typeof data.value === 'object' && data.value !== null) {
        url = (data.value as any).url ?? (data.value as any).value ?? String(data.value)
      } else {
        url = String(data.value)
      }
      // Bersihkan kutip ganda yang mungkin tersisa dari penyimpanan lama
      url = url.replace(/^"+|"+$/g, '').trim()
      if (
        url &&
        !url.includes('PASTE_DISCORD') &&
        (url.includes('discord.com/api/webhooks') || url.includes('discordapp.com/api/webhooks'))
      ) {
        _cache[normalizedKey] = { url, ts: now }
        return url
      }
    }
  } catch {
    /* fallback ke ENV */
  }

  // Fallback ke ENV
  let envUrl: string | undefined
  switch (normalizedKey) {
    case 'discordEventWebhookUrl':
      envUrl = env.DISCORD_EVENT_WEBHOOK_URL
      break
    case 'discordBlogWebhookUrl':
      envUrl = env.DISCORD_BLOG_WEBHOOK_URL
      break
    case 'discordRegistrationWebhookUrl':
      envUrl = env.DISCORD_REGISTRATION_WEBHOOK_URL
      break
    case 'discordFeedbackWebhookUrl':
      envUrl = env.DISCORD_FEEDBACK_WEBHOOK_URL
      break
  }

  if (envUrl) {
    _cache[normalizedKey] = { url: envUrl, ts: now }
    return envUrl
  }

  return null
}

/** Kirim ke Discord webhook dengan error logging */
export async function sendDiscordWebhook(
  key: WebhookKey,
  payload: object
): Promise<{ ok: boolean; error?: string }> {
  const url = await getWebhookUrl(key)

  if (!url) {
    console.warn(`[Discord] Webhook '${key}' tidak di-set. Set di admin panel atau ENV.`)
    return { ok: false, error: 'webhook_url_not_set' }
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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
