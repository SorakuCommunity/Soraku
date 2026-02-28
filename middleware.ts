// middleware.ts - SORAKU 1.0.a3.1 FINAL CORRECT COOKIES API
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Cookie } from '@/types'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
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
        },
      },
    }
  )

  // Soraku RLS auth check
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  
  // Protect Soraku routes
  if ((pathname.startsWith('/profile') || pathname.startsWith('/admin')) && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Pass user data to client components
  if (user) {
    response.headers.set('x-user-id', user.id || '')
    response.headers.set('x-user-role', (user.user_metadata as any)?.role || '')
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
