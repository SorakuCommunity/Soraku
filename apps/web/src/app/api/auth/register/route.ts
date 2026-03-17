import { createClient } from '@/lib/supabase/server'
import { adminDb } from '@/lib/supabase/admin'
import { ok, err, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { env } from '@/env'
import { sendDiscordWebhook } from '@/lib/discord-webhook'

export const dynamic = 'force-dynamic'

const RegisterSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/, 'Username hanya huruf kecil, angka, dan underscore'),
})

// POST /api/auth/register
export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = RegisterSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    const { email, password, username } = parsed.data

    // Cek username sudah dipakai
    const { data: existing } = await adminDb()
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle()

    if (existing) return err('Username sudah dipakai', 409)

    // Daftar ke Supabase Auth
    const supabase = await createClient()
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: username },
      },
    })

    if (authErr || !authData.user) return err(authErr?.message ?? 'Gagal mendaftar')

    // Insert ke soraku.users
    const { error: dbErr } = await adminDb()
      .from('users')
      .upsert({
        id:          authData.user.id,
        username,
        displayname: username,
        role:        'USER',
      }, { onConflict: 'id' })

    if (dbErr) return err(dbErr.message)


    // Kirim notif pendaftaran ke Discord channel
    await sendDiscordWebhook('discord_registration_webhook_url', {
      username: 'Soraku Community',
      embeds: [{
        title: '🌸 Anggota Baru Mendaftar!',
        color: 8142077,
        fields: [
          { name: '👤 Username', value: `@${username}`, inline: true },
          { name: '📧 Email',    value: authData.user.email ?? '-', inline: true },
          { name: '📅 Waktu',   value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false },
        ],
        footer:    { text: 'Soraku Community • Sistem Pendaftaran' },
        timestamp: new Date().toISOString(),
      }],
    })
    return ok({
      id:       authData.user.id,
      email:    authData.user.email,
      username,
      // Jika email confirmation aktif, user belum langsung login
      confirmed: authData.user.email_confirmed_at != null,
    }, 201)
  } catch { return SERVER_ERROR() }
}
