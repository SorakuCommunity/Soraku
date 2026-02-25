import { DiscordStats } from '@/types'

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
  } catch { return { memberCount: 0, onlineCount: 0 } }
}

export async function sendDiscordWebhook(content: {
  title: string
  description: string
  startDate: string
  endDate: string
}): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) return

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [{
        title: `🎉 Event Baru: ${content.title}`,
        description: content.description ?? '',
        color: 0x7C3AED,
        fields: [
          { name: '📅 Mulai', value: content.startDate, inline: true },
          { name: '📅 Selesai', value: content.endDate, inline: true },
        ],
        footer: { text: 'Soraku Community' },
      }],
    }),
  }).catch(console.error)
}
