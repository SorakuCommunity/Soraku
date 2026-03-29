import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/env'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Buat response redirect dulu agar cookies bisa di-set ke sini
  const response = NextResponse.json({ signedOut: true })

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          // Tulis semua cookie (termasuk yang di-clear) ke response
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.signOut()

  // Hapus manual semua cookie Supabase yang mungkin tersisa di browser
  // Pola nama cookie Supabase: sb-<ref>-auth-token, sb-<ref>-auth-token.0, dll
  req.cookies.getAll().forEach(({ name }) => {
    if (name.startsWith('sb-') || name.includes('supabase')) {
      response.cookies.set(name, '', { maxAge: 0, path: '/' })
    }
  })

  return response
}
