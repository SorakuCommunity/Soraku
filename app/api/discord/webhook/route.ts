import { NextRequest, NextResponse } from 'next/server'
import { sendDiscordWebhook } from '@/lib/discord'
import { createClient } from '@/lib/supabase/server'
import { hasRole } from '@/lib/roles'
import type { Role } from '@/lib/roles'
import { z } from 'zod'

const webhookSchema = z.object({
  content:    z.string().max(2000).optional(),
  username:   z.string().max(80).optional(),
  embeds:     z.array(z.record(z.unknown())).max(10).optional(),
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: me } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (!hasRole(me?.role as Role, 'ADMIN'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body   = await req.json()
  const parsed = webhookSchema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const ok = await sendDiscordWebhook(parsed.data)
  if (!ok) return NextResponse.json({ error: 'Failed to send webhook' }, { status: 500 })

  return NextResponse.json({ success: true })
}
