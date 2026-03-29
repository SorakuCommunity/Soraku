import { env } from '@/env'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const Schema = z.object({
  discordId: z.string(),
  message: z.string().max(2000),
})

/**
 * POST /api/bot/notify
 * Web → trigger bot untuk kirim DM ke user Discord.
 * Dipanggil setelah: donasi Trakteer, approval galeri, role update, dll.
 */
export async function POST(req: NextRequest) {
  // Hanya bisa dipanggil dari dalam (server-side atau dengan secret)
  const secret = req.headers.get('x-soraku-secret')
  const isInternal = secret === env.SORAKU_API_SECRET

  // Atau dari admin yang sudah login
  if (!isInternal) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .schema('soraku')
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const allowed = ['OWNER', 'MANAGER', 'ADMIN']
    if (!allowed.includes(profile?.role ?? '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 })

  const botUrl = env.BOT_WEBHOOK_URL
  if (!botUrl)
    return NextResponse.json({ error: 'BOT_WEBHOOK_URL not configured' }, { status: 503 })

  try {
    const res = await fetch(`${botUrl}/webhook/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-soraku-secret': env.BOT_WEBHOOK_SECRET!,
      },
      body: JSON.stringify(parsed.data),
    })

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[api/bot/notify]', err)
    return NextResponse.json({ error: 'Failed to reach bot' }, { status: 502 })
  }
}
