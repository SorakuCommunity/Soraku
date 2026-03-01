// app/api/discord/stats/route.ts — SORAKU v1.0.a3.4
// Extended to return online_members[] for DiscordHeroCard component
import { NextResponse } from 'next/server'

const DISCORD_API = 'https://discord.com/api/v10'
const INVITE_URL  = 'https://discord.gg/CJJ7KEJMbg'

async function fetchGuildStats() {
  const guildId  = process.env.DISCORD_GUILD_ID
  const botToken = process.env.DISCORD_BOT_TOKEN
  if (!guildId || !botToken) return null

  // 1. Guild with counts
  const guildRes = await fetch(`${DISCORD_API}/guilds/${guildId}?with_counts=true`, {
    headers: { Authorization: `Bot ${botToken}` },
    next:    { revalidate: 300 },
  })
  if (!guildRes.ok) return null
  const guild = await guildRes.json()

  // 2. Online members via guild preview
  let onlineMembers: { id: string; username: string; avatar_url: string | null }[] = []
  try {
    const previewRes = await fetch(`${DISCORD_API}/guilds/${guildId}/members?limit=100`, {
      headers: { Authorization: `Bot ${botToken}` },
      next:    { revalidate: 300 },
    })
    if (previewRes.ok) {
      const members = await previewRes.json()
      // Filter members with user data; avatar from member or user
      onlineMembers = (members as Record<string, unknown>[])
        .filter((m) => m.user)
        .slice(0, 20)
        .map((m) => {
          const user = m.user as { id: string; username: string; avatar: string | null }
          const memberAvatar = (m.avatar as string | null)
          const avatarHash   = memberAvatar ?? user.avatar
          return {
            id:         user.id,
            username:   user.username,
            avatar_url: avatarHash
              ? `https://cdn.discordapp.com/guilds/${guildId}/users/${user.id}/avatars/${avatarHash}.png?size=64`
              : (user.avatar
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
                : null),
          }
        })
    }
  } catch {
    // members endpoint may not be available without privileged intents
    onlineMembers = []
  }

  return {
    guild_id:       guild.id,
    guild_name:     guild.name,
    guild_icon:     guild.icon ?? null,
    online_count:   guild.approximate_presence_count ?? 0,
    member_count:   guild.approximate_member_count ?? 0,
    invite_url:     INVITE_URL,
    online_members: onlineMembers,
  }
}

export async function GET() {
  try {
    const data = await fetchGuildStats()
    if (!data) {
      return NextResponse.json(
        { error: 'Discord data tidak tersedia' },
        { status: 503, headers: { 'Cache-Control': 's-maxage=60' } }
      )
    }
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' },
    })
  } catch (err) {
    console.error('[discord/stats]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
