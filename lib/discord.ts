/**
 * lib/discord.ts — Discord API integration
 */

import { cacheGet, cacheSet } from './redis'

const DISCORD_API = 'https://discord.com/api/v10'
const CACHE_TTL   = 300

export interface DiscordGuildStats {
  id:                         string
  name:                       string
  icon:                       string | null
  approximate_member_count:   number
  approximate_presence_count: number
}

export interface DiscordWebhookPayload {
  content?:  string
  username?: string
  embeds?:   DiscordEmbed[]
}

export interface DiscordEmbed {
  title?:       string
  description?: string
  color?:       number
  url?:         string
  timestamp?:   string
  footer?:      { text: string; icon_url?: string }
  thumbnail?:   { url: string }
  image?:       { url: string }
  author?:      { name: string; icon_url?: string; url?: string }
  fields?:      { name: string; value: string; inline?: boolean }[]
}

// ─── Get Guild Stats ──────────────────────────────────────────────────────────
export async function getDiscordStats(): Promise<DiscordGuildStats | null> {
  const guildId = process.env.DISCORD_GUILD_ID
  if (!guildId) return null

  const cacheKey = `discord:stats:${guildId}`
  const cached = await cacheGet<DiscordGuildStats>(cacheKey)
  if (cached) return cached

  try {
    const res = await fetch(`${DISCORD_API}/guilds/${guildId}?with_counts=true`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN ?? ''}` },
    })
    if (!res.ok) return null
    const data = await res.json() as DiscordGuildStats
    await cacheSet(cacheKey, data, CACHE_TTL)
    return data
  } catch { return null }
}

// Aliases
export const fetchDiscordStats      = getDiscordStats
export const getDiscordGuildStats   = getDiscordStats
export const fetchDiscordGuildStats = getDiscordStats

// ─── Send Webhook ─────────────────────────────────────────────────────────────
export async function sendDiscordWebhook(
  payload: DiscordWebhookPayload,
  webhookUrl?: string
): Promise<boolean> {
  const url = webhookUrl ?? process.env.DISCORD_WEBHOOK_URL
  if (!url) return false
  try {
    const res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
    return res.ok
  } catch { return false }
}

// Alias
export const sendWebhook = sendDiscordWebhook

// ─── Notifications ────────────────────────────────────────────────────────────
export async function notifyNewUser(username: string, role: string) {
  await sendDiscordWebhook({
    username: 'Soraku Bot',
    embeds: [{
      title:       '👤 Member Baru!',
      description: `**${username}** baru saja bergabung ke Soraku.`,
      color:       0x4FA3D1,
      timestamp:   new Date().toISOString(),
      footer:      { text: `Role: ${role}` },
    }],
  })
}

export async function notifyGalleryUpload(username: string, title: string, imageUrl?: string) {
  await sendDiscordWebhook({
    username: 'Soraku Bot',
    embeds: [{
      title:       '🖼️ Gallery Baru',
      description: `**${username}** mengunggah: *${title}*`,
      color:       0xE8C2A8,
      timestamp:   new Date().toISOString(),
      ...(imageUrl ? { thumbnail: { url: imageUrl } } : {}),
    }],
  })
}

export async function notifyNewPost(title: string, slug: string, author: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soraku.vercel.app'
  await sendDiscordWebhook({
    username: 'Soraku Bot',
    embeds: [{
      title:       `📝 Artikel Baru: ${title}`,
      description: `Ditulis oleh **${author}**`,
      url:         `${siteUrl}/blog/${slug}`,
      color:       0x6E8FA6,
      timestamp:   new Date().toISOString(),
    }],
  })
}
