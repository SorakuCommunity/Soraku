import { createClient } from '@/lib/supabase/server'
import { adminDb } from '@/lib/supabase/admin'
import { ok, err, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// POST /api/auth/login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = LoginSchema.safeParse(body)
    if (!parsed.success) return err('Email atau password tidak valid')

    const { email, password } = parsed.data

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.user) {
      // Jangan bocorkan info "email tidak terdaftar" vs "password salah"
      return err('Email atau password salah', 401)
    }

    // Ambil profile dari DB
    const { data: profile } = await adminDb()
      .from('users')
      .select('username, displayname, avatarurl, role, supporterrole')
      .eq('id', data.user.id)
      .single()

    const meta = data.user.user_metadata ?? {}

    return ok({
      id: data.user.id,
      email: data.user.email,
      username: profile?.username ?? meta.user_name ?? null,
      displayname: profile?.displayname ?? meta.full_name ?? null,
      avatarurl: profile?.avatarurl ?? meta.avatar_url ?? null,
      role: profile?.role ?? 'USER',
      supporterrole: profile?.supporterrole ?? null,
      issupporter: profile?.supporterrole != null,
    })
  } catch {
    return SERVER_ERROR()
  }
}
