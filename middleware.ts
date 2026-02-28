// middleware.ts - SORAKU 1.0.a3.1 CORRECTED
import { createServerClient } from '@supabase/ssr'  // ✅ CORRECT import
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Cookie } from '@/types'

export async function middleware(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(  // ✅ createServerClient, BUKAN createMiddlewareClient
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: Cookie[]) => {  // ✅ Cookie[] typing
          cookiesToSet.forEach(({ name, value }) => 
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            if (options) {
              request.cookies.set(name, value, options)
            }
          })
        },
      },
    }
  )

  // Auth check logic (sesuai Soraku RLS)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Route protection logic
  const isAuthRoute = request.nextUrl.pathname.startsWith('/profile')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if (isAuthRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Pass user to headers untuk client components
  supabaseResponse.headers.set('x-user-id', user?.id || '')

  return supabaseResponse
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
