import type { DiscordStats } from '@/types'

export async function fetchDiscordStats(): Promise<DiscordStats> {
  const token = process.env.DISCORD_BOT_TOKEN
  const serverId = process.env.DISCORD_SERVER_ID
  if (!token || !serverId) return { memberCount: 0, onlineCount: 0 }

  try {
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${serverId}?with_counts=true`,
      {
        headers: { Authorization: `Bot ${token}` },
        next: { revalidate: 300 },
      }
    )
    if (!res.ok) return { memberCount: 0, onlineCount: 0 }
    const data = await res.json()
    return {
      memberCount: data.approximate_member_count ?? 0,
      onlineCount: data.approximate_presence_count ?? 0,
    }
  } catch {
    return { memberCount: 0, onlineCount: 0 }
  }
}

export async function sendDiscordWebhook(payload: {
  title: string
  description?: string | null
  startDate?: string
  endDate?: string
}): Promise<void> {
  const url = process.env.DISCORD_WEBHOOK_URL
  if (!url) return

  const embed = {
    title: `🎉 Event Baru: ${payload.title}`,
    description: payload.description ?? '',
    color: 0x7c3aed,
    fields: [
      ...(payload.startDate
        ? [{ name: '📅 Mulai', value: payload.startDate, inline: true }]
        : []),
      ...(payload.endDate
        ? [{ name: '📅 Selesai', value: payload.endDate, inline: true }]
        : []),
    ],
    footer: { text: 'Soraku Community' },
    timestamp: new Date().toISOString(),
  }

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] }),
  }).catch(console.error)
}
