// app/api/discord/stats/route.ts — SORAKU v1.0.a3.5
// Returns guild stats + online member list from Discord Widget API

import { NextResponse } from 'next/server'
import { fetchDiscordStats } from '@/lib/discord'

interface WidgetMember {
  id: string
  username: string
  status: string
  avatar_url: string
}

interface WidgetResponse {
  id: string
  name: string
  members?: WidgetMember[]
}

export async function GET() {
  const stats = await fetchDiscordStats()
  if (!stats) {
    return NextResponse.json(
      { error: 'Tidak dapat mengambil data Discord' },
      { status: 503 }
    )
  }

  // Fetch online members from public widget endpoint (no auth required)
  let onlineMembers: WidgetMember[] = []
  const guildId = process.env.DISCORD_GUILD_ID
  if (guildId) {
    try {
      const widgetRes = await fetch(
        `https://discord.com/api/guilds/${guildId}/widget.json`,
        { next: { revalidate: 60 } }
      )
      if (widgetRes.ok) {
        const widget = (await widgetRes.json()) as WidgetResponse
        onlineMembers = (widget.members ?? []).slice(0, 20).map((m) => ({
          id:         m.id,
          username:   m.username,
          status:     m.status,
          avatar_url: m.avatar_url,
        }))
      }
    } catch {
      // widget may be disabled — graceful degradation
    }
  }

  return NextResponse.json(
    {
      stats: {
        ...stats,
        icon_url: stats.icon
          ? `https://cdn.discordapp.com/icons/${stats.id}/${stats.icon}.png?size=256`
          : null,
        online_members: onlineMembers,
      },
    },
    { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } }
  )
}
