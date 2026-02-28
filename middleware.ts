// middleware.ts — SORAKU v1.0.a3.4
// /Admin route with role guard; /Soraku_Admin redirects for backward compat
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_ROLES = ['OWNER', 'MANAGER', 'ADMIN', 'AGENSI'] as const

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Redirect legacy /Soraku_Admin → /Admin
  if (pathname.startsWith('/Soraku_Admin')) {
    const newPath = pathname.replace('/Soraku_Admin', '/Admin')
    return NextResponse.redirect(new URL(newPath, request.url))
  }

  // Auth-required routes
  const requiresAuth =
    pathname.startsWith('/profile') ||
    pathname.startsWith('/edit') ||
    pathname.startsWith('/gallery/upload') ||
    pathname.startsWith('/Admin')

  if (requiresAuth && !user) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url))
  }

  // Admin role guard
  if (pathname.startsWith('/Admin') && user) {
    const { data: profile } = await supabase
      .from('users').select('role').eq('id', user.id).single()
    const role = profile?.role as string | undefined
    if (!role || !(ADMIN_ROLES as readonly string[]).includes(role)) {
      return NextResponse.redirect(new URL('/?error=unauthorized', request.url))
    }
  }

  if (user) response.headers.set('x-user-id', user.id)
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
