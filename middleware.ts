// middleware.ts - SORAKU 1.0.a3.1 FINAL CORRECT
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Cookie } from '@/types'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({  // ✅ LET, bukan const
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: Cookie[]) => {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            if (options) {
              request.cookies.set(name, value, options)
            }
          })
        },
      },
    }
  )

  // Auth check untuk Soraku RLS routes
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect routes
  const pathname = request.nextUrl.pathname
  const isProtected = pathname.startsWith('/profile') || pathname.startsWith('/admin')
  
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Pass user info ke client
  if (user) {
    response.headers.set('x-user-id', user.id)
    response.headers.set('x-user-role', user.user_metadata?.role || '')
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
