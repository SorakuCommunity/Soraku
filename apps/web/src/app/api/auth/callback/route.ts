import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { adminDb } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/env'

export const dynamic = 'force-dynamic'

const OWNER_DISCORD_IDS = new Set([
  '1020644780075659356', // Riu
  ...(env.OWNER_DISCORD_IDS ?? '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean),
])

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/profile/me'

  // Error dari Supabase/OAuth provider (mis. bad_oauth_state)
  const oauthError = searchParams.get('error')
  if (oauthError) {
    const desc = searchParams.get('error_description') ?? oauthError
    console.error('[auth/callback] OAuth error dari provider:', desc)
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(desc)}`, origin))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', origin))
  }

  // Response yang akan kita kembalikan — session cookies ditulis langsung ke sini
  const response = NextResponse.redirect(new URL(next, origin))

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Exchange code → session (membutuhkan PKCE code_verifier dari cookie)
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    console.error('[auth/callback] exchangeCodeForSession error:', error?.message)
    return NextResponse.redirect(new URL('/login?error=auth_callback_failed', origin))
  }

  const user = data.user
  const meta = user.user_metadata ?? {}

  // Role logic
  const discordId = meta.provider_id ?? meta.sub ?? ''
  const isOwner = OWNER_DISCORD_IDS.has(discordId)
  const username =
    meta.user_name ??
    meta.preferred_username ??
    meta.name?.toLowerCase().replace(/\s+/g, '_') ??
    null
  const displayname = meta.full_name ?? meta.name ?? meta.user_name ?? null
  const avatarurl = meta.avatar_url ?? meta.picture ?? null

  try {
    const { data: existing } = await adminDb()
      .from('users')
      .select('id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (existing) {
      if (isOwner && existing.role !== 'OWNER') {
        await adminDb()
          .from('users')
          .update({ role: 'OWNER', updatedat: new Date().toISOString() })
          .eq('id', user.id)
      }
    } else {
      await adminDb()
        .from('users')
        .upsert(
          {
            id: user.id,
            username: username?.slice(0, 30) ?? null,
            displayname: displayname?.slice(0, 50) ?? null,
            avatarurl,
            role: isOwner ? 'OWNER' : 'USER',
            sociallinks: {},
            isprivate: false,
            isbanned: false,
            createdat: new Date().toISOString(),
            updatedat: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )
    }
  } catch (dbErr) {
    console.error('[auth/callback] DB error:', dbErr)
    // Jangan block login meski DB error
  }

  // Session cookies sudah ada di response, redirect ke halaman tujuan
  return response
}
