// app/api/profile/socials/route.ts — SORAKU v1.0.a3.5
// Tier-based platform access:
//   USER    → instagram, twitter (2 platforms max)
//   DONATE  → +tiktok, youtube, discord, website, facebook, twitch (8 platforms)
//   PREMIUM / AGENSI / ADMIN / MANAGER / OWNER → +trakteer, kofi (10 platforms)
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const ALL_PLATFORMS = [
  'instagram', 'twitter',
  'tiktok', 'youtube', 'discord', 'website', 'facebook', 'twitch',
  'trakteer', 'kofi',
] as const

type Platform = typeof ALL_PLATFORMS[number]

const USER_PLATFORMS:    Platform[] = ['instagram', 'twitter']
const DONATE_PLATFORMS:  Platform[] = ['instagram', 'twitter', 'tiktok', 'youtube', 'discord', 'website', 'facebook', 'twitch']
const PREMIUM_PLATFORMS: Platform[] = [...DONATE_PLATFORMS, 'trakteer', 'kofi']

const ROLE_TIER: Record<string, Platform[]> = {
  USER:    USER_PLATFORMS,
  DONATE:  DONATE_PLATFORMS,
  PREMIUM: PREMIUM_PLATFORMS,
  AGENSI:  PREMIUM_PLATFORMS,
  ADMIN:   PREMIUM_PLATFORMS,
  MANAGER: PREMIUM_PLATFORMS,
  OWNER:   PREMIUM_PLATFORMS,
}

const schema = z.object({
  platform: z.enum(ALL_PLATFORMS),
  url:      z.string().max(500),
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Platform tidak valid' }, { status: 400 })

  const { platform, url } = parsed.data

  const { data: profile } = await supabase
    .from('users').select('role').eq('id', user.id).single()
  const role    = (profile?.role ?? 'USER') as string
  const allowed = ROLE_TIER[role] ?? USER_PLATFORMS

  // Check tier access
  if (!(allowed as string[]).includes(platform)) {
    const tierName = role === 'USER' ? 'Donatur' : 'Premium'
    return NextResponse.json(
      { error: `Platform "${platform}" memerlukan upgrade ke ${tierName}.` },
      { status: 403 }
    )
  }

  // Clearing — always allowed
  if (!url.trim()) {
    await supabase.from('user_socials').delete()
      .eq('user_id', user.id).eq('platform', platform)
    return NextResponse.json({ ok: true })
  }

  // USER max 2 platforms
  if (role === 'USER') {
    const { data: existing } = await supabase
      .from('user_socials').select('id')
      .eq('user_id', user.id).eq('platform', platform).single()

    if (!existing) {
      const { count } = await supabase
        .from('user_socials').select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
      if ((count ?? 0) >= 2) {
        return NextResponse.json(
          { error: 'Limit 2 platform untuk User. Upgrade ke Donatur untuk lebih banyak.' },
          { status: 403 }
        )
      }
    }
  }

  const { error } = await supabase.from('user_socials').upsert(
    { user_id: user.id, platform, url: url.trim() },
    { onConflict: 'user_id,platform' }
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
