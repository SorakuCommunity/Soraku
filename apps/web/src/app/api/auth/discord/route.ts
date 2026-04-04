import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/env'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { origin, searchParams } = new URL(req.url)
  const next = searchParams.get('next') ?? '/profile/me'

  // Kumpulkan cookies PKCE dulu — baru set ke response setelah URL Discord diketahui
  const pendingCookies: { name: string; value: string; options: CookieOptions }[] = []

  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_KEY, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
        // Kumpulkan dulu — jangan set ke response sebelum URL diketahui
        pendingCookies.push(...cookiesToSet)
      },
    },
  })

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: `${origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
      scopes: 'identify email guilds',
    },
  })

  if (error || !data.url) {
    console.error('[auth/discord] OAuth init error:', error?.message)
    return NextResponse.redirect(new URL('/login?error=discord_oauth_failed', origin))
  }

  // Buat response redirect ke Discord URL yang benar
  // Set cookies PKCE ke response INI agar browser menyimpannya sebelum redirect ke Discord
  const response = NextResponse.redirect(data.url)
  pendingCookies.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, {
      ...options,
      // Pastikan cookie bisa dibaca saat callback dari Discord (cross-site)
      sameSite: 'lax',
      secure: true,
    })
  )

  return response
}
