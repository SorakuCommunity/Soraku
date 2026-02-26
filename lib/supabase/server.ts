import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// ✅ TYPE DEFINITION untuk Next.js 15 strict mode
type Cookie = {
  name: string
  value: string
  options?: any
}

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        // ✅ FIXED LINE 12: Explicit Cookie[] type
        setAll(cookiesToSet: Cookie[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}