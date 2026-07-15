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

  // ── OAuth error redirect ──
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

  // ── Auth guards ──

  // /admin/* — harus OWNER / MANAGER / ADMIN
  if (pathname.startsWith('/admin')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))

    try {
      const { data } = await supabase
        .schema('soraku')
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (!['OWNER', 'MANAGER', 'ADMIN'].includes(data?.role ?? '')) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // /login /register — sudah login → redirect ke home
  if ((pathname === '/login' || pathname === '/register') && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // /settings/* — harus login
  if (pathname.startsWith('/settings') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
