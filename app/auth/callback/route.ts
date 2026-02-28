// app/auth/callback/route.ts — SORAKU v1.0.a3.3
// Handles Google, Discord OAuth code exchange + user creation guard

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Ensure user record exists (idempotent insert)
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existing) {
      const meta = user.user_metadata ?? {}
      const rawBase = (
        meta.user_name ?? meta.preferred_username ?? meta.full_name ?? meta.name ?? 'user'
      ) as string
      const base = rawBase.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || 'user'
      const username = `${base}_${Math.random().toString(36).slice(2, 6)}`

      await supabase.from('users').insert({
        id:         user.id,
        email:      user.email ?? '',
        username,
        avatar_url: (meta.avatar_url ?? meta.picture ?? null),
        role:       'USER',
      })
    }
  }

  // Avoid open redirect — only allow relative paths
  const safePath = next.startsWith('/') ? next : '/'
  return NextResponse.redirect(`${origin}${safePath}`)
}
