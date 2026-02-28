// middleware.ts - LINE 13-18 TYPE FIX
import { createMiddlewareClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Cookie } from '@/types'  // ✅ Import Cookie type

export async function middleware(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createMiddlewareClient({ 
    request,
    response: supabaseResponse,
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet: Cookie[]) => {  // ✅ FIXED: Cookie[] type
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
  })

  // ... rest middleware logic
}
