// middleware.ts — SORAKU v1.0.a3.2 — Fixed cookie forwarding (logout fix)
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          // Apply to request first
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          // Re-create response so Set-Cookie headers reach the browser (fixes ghost session on logout)
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

  // Protect authenticated routes
  if ((pathname.startsWith('/profile') || pathname.startsWith('/admin') || pathname.startsWith('/Soraku_Admin')) && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user) {
    response.headers.set('x-user-id', user.id || '')
    response.headers.set('x-user-role', (user.user_metadata as Record<string, string>)?.role || '')
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
