import { env } from '@/env'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const Schema = z.object({
  title: z.string(),
  description: z.string().optional(),
  startAt: z.string(),
  eventUrl: z.string().optional(),
})

/**
 * POST /api/bot/announce
 * Web → trigger bot untuk announce event ke channel Discord.
 * Dipanggil otomatis setelah event baru dibuat di /admin/events.
 */
export async function POST(req: NextRequest) {
  // Auth: hanya OWNER / MANAGER / ADMIN atau internal secret
  const secret = req.headers.get('x-soraku-secret')
  const isInternal = secret === env.SORAKU_SECRET

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

    if (!['OWNER', 'MANAGER', 'ADMIN'].includes(profile?.role ?? '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 })

  const botUrl = env.BOT_WEBHOOK_URL
  if (!botUrl) {
    // Tidak error — bot mungkin belum deploy, log saja
    console.warn('[api/bot/announce] BOT_WEBHOOK_URL not set, skipping bot announcement')
    return NextResponse.json({ announced: false, reason: 'bot not configured' })
  }

  try {
    const res = await fetch(`${botUrl}/webhook/event-announce`, {
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
    console.error('[api/bot/announce]', err)
    // Jangan fail seluruh request hanya karena bot tidak respond
    return NextResponse.json({ announced: false, error: String(err) })
  }
}
