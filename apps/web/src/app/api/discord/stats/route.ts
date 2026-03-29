import { env } from '@/env'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const code = env.DISCORD_INVITE_CODE ?? 'qm3XJvRa6B'
    const res = await fetch(`https://discord.com/api/v10/invites/${code}?with_counts=true`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error('Discord API error')
    const data = await res.json()
    return NextResponse.json({
      memberCount: data.approximate_member_count ?? 500,
      onlineCount: data.approximate_presence_count ?? 120,
    })
  } catch {
    return NextResponse.json({ memberCount: 500, onlineCount: 120 })
  }
}
