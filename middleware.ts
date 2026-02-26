import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

type Cookie = { name: string; value: string; options?: Record<string, unknown> }

const PROTECTED_ROUTES = ['/edit/profile', '/gallery/upload']
const ADMIN_ROUTES = ['/Soraku_Admin']
const ADMIN_ROLES = ['OWNER', 'MANAGER', 'ADMIN', 'AGENSI']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cs: Cookie[]) {
          cs.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cs.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Auth-required routes
  const isProtected = PROTECTED_ROUTES.some(r => path.startsWith(r))
  if (isProtected && !user) {
    return NextResponse.redirect(new URL(`/auth?next=${encodeURIComponent(path)}`, request.url))
  }

  // Admin routes
  const isAdmin = ADMIN_ROUTES.some(r => path.startsWith(r))
  if (isAdmin) {
    if (!user) {
      return NextResponse.redirect(new URL(`/auth?next=${encodeURIComponent(path)}`, request.url))
    }
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!data || !ADMIN_ROLES.includes(data.role)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
