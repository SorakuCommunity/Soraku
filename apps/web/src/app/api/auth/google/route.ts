import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/env'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { origin, searchParams } = new URL(req.url)
  const next = searchParams.get('next') ?? '/profile/me'

  const pendingCookies: { name: string; value: string; options: CookieOptions }[] = []

  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_KEY, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
        pendingCookies.push(...cookiesToSet)
      },
    },
  })

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
      scopes: 'openid email profile',
    },
  })

  if (error || !data.url) {
    console.error('[auth/google] OAuth init error:', error?.message)
    return NextResponse.redirect(new URL('/login?error=google_oauth_failed', origin))
  }

  const response = NextResponse.redirect(data.url)
  pendingCookies.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, {
      ...options,
      sameSite: 'lax',
      secure: true,
    })
  )

  return response
}
