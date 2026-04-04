import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { pathname, searchParams, origin } = request.nextUrl

  // ── OAuth error redirect — Supabase mengirim error params ke Site URL (/) ──
  // Contoh: /?error=invalid_request&error_code=bad_oauth_callback&...
  if (pathname === '/') {
    const hasOauthError = ['error', 'error_code', 'error_description'].some((p) =>
      searchParams.has(p)
    )
    if (hasOauthError) {
      const desc =
        searchParams.get('error_description') ?? searchParams.get('error') ?? 'oauth_error'
      const loginUrl = new URL('/login', origin)
      loginUrl.searchParams.set('error', desc)
      return NextResponse.redirect(loginUrl)
    }
  }

  // ── Permanent redirects — deprecated routes ──────────────────────────────

  if (pathname === '/social' || pathname.startsWith('/social/')) {
    return NextResponse.redirect(new URL('/', request.url), 301)
  }
  if (pathname === '/agensi/vtuber' || pathname.startsWith('/agensi/vtuber/')) {
    return NextResponse.redirect(
      new URL(pathname.replace('/agensi/vtuber', '/vtubers'), request.url),
      301
    )
  }
  if (pathname === '/premium/donatur' || pathname.startsWith('/premium/donatur/')) {
    return NextResponse.redirect(new URL('/donate/leaderboard', request.url), 301)
  }
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(
      new URL(pathname.replace('/dashboard', '/profile/me'), request.url),
      301
    )
  }

  // ── Auth guards ──────────────────────────────────────────────────────────

  // /* — harus login
  if (pathname.startsWith('/profile/me') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // /admin/* — harus OWNER / MANAGER / ADMIN
  // Pakai maybeSingle() agar tidak crash jika row belum ada
  if (pathname.startsWith('/admin')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))

    try {
      const { data } = await supabase
        .schema('soraku')
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      // Kalau row belum ada → fallback ke USER → forbidden
      if (!['OWNER', 'MANAGER', 'ADMIN'].includes(data?.role ?? '')) {
        return NextResponse.redirect(new URL('/profile/me', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/profile/me', request.url))
    }
  }

  // /login /register — sudah login → redirect ke dashboard
  if ((pathname === '/login' || pathname === '/register') && user) {
    return NextResponse.redirect(new URL('/profile/me', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
