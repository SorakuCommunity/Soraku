// lib/supabase/server.ts — SORAKU v1.0.a3.5 — Build-safe env guard
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Build-safe fallbacks — real values come from environment at runtime
const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? 'https://placeholder.supabase.co'
// A syntactically valid JWT placeholder (3 base64 segments) so @supabase/ssr doesn't throw during build
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIn0.placeholder'
const SUPABASE_SRK  = process.env.SUPABASE_SERVICE_ROLE_KEY
  ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJzZXJ2aWNlX3JvbGUifQ.placeholder'

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

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet: Cookie[]) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch { /* read-only in Server Components */ }
      },
    },
  })
}

export async function createAdminClient() {
  const cookieStore = await cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_SRK, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet: Cookie[]) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch { /* read-only in Server Components */ }
      },
    },
  })
}
