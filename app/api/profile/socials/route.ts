// app/api/profile/socials/route.ts — SORAKU v1.0.a3.4
// Save a single social link — enforces USER=2 limit, PREMIUM=unlimited
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const PREMIUM_ROLES = ['PREMIUM', 'DONATE', 'AGENSI', 'MANAGER', 'ADMIN', 'OWNER'] as const

const schema = z.object({
  platform: z.enum(['discord', 'instagram', 'tiktok', 'twitter', 'youtube', 'website']),
  url: z.string().max(500),
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 })

  const { platform, url } = parsed.data

  // Get role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'USER'
  const isPremium = (PREMIUM_ROLES as readonly string[]).includes(role)

  // If clearing (empty url), allow always
  if (!url.trim()) {
    await supabase
      .from('user_socials')
      .delete()
      .eq('user_id', user.id)
      .eq('platform', platform)
    return NextResponse.json({ ok: true })
  }

  // Check limit for USER
  if (!isPremium) {
    const { count } = await supabase
      .from('user_socials')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Check if this platform already exists (update is fine)
    const { data: existing } = await supabase
      .from('user_socials')
      .select('id')
      .eq('user_id', user.id)
      .eq('platform', platform)
      .single()

    if (!existing && (count ?? 0) >= 2) {
      return NextResponse.json({ error: 'Limit reached. Upgrade to PREMIUM.' }, { status: 403 })
    }
  }

  // Upsert
  const { error } = await supabase
    .from('user_socials')
    .upsert(
      { user_id: user.id, platform, url: url.trim() },
      { onConflict: 'user_id,platform' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
