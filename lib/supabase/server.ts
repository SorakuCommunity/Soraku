// lib/supabase/server.ts - SORAKU 1.0.a3.1 ADMIN CLIENT
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Cookie type untuk strict mode
interface Cookie {
  name: string
  value: string
  options?: {
    httpOnly?: boolean
    secure?: boolean
    sameSite?: 'lax' | 'strict' | 'none'
    maxAge?: number
    path?: string
  }
}

// Regular client untuk public/user routes
export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: Cookie[]) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component session refresh
          }
        },
      },
    }
  )
}

export async function createAdminClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // ✅ Service role key (bypass RLS)
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: Cookie[]) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component session refresh
          }
        },
      },
    }
  )
}
