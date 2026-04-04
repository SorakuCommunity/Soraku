import { env } from '@/env'
import { adminDb, createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const Schema = z.object({
  discordId: z.string(),
  discordRoles: z.array(z.string()),
})

// POST /api/discord/role-sync — dipanggil Discord bot
export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-soraku-secret')
    if (secret !== env.SORAKU_SECRET)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 })

    const { discordId, discordRoles } = parsed.data

    // Cari user berdasarkan discord provider_id
    const {
      data: { users },
    } = await createAdminClient().auth.admin.listUsers()
    const authUser = users.find(
      (u) => u.app_metadata?.provider === 'discord' && u.user_metadata?.provider_id === discordId
    )
    if (!authUser) return NextResponse.json({ synced: false, reason: 'User tidak ditemukan' })

    // Ambil mapping discord role → supporter tier
    const { data: mappings } = await adminDb()
      .from('discordrolemappings')
      .select('discordroleid, supporterrole')
      .eq('autosync', true)

    const tierOrder: Record<string, number> = { VVIP: 3, VIP: 2, DONATUR: 1 }
    let highestTier: string | null = null
    let highestScore = 0

    for (const m of mappings ?? []) {
      if (discordRoles.includes(m.discordroleid)) {
        const score = tierOrder[m.supporterrole] ?? 0
        if (score > highestScore) {
          highestScore = score
          highestTier = m.supporterrole
        }
      }
    }

    await adminDb()
      .from('users')
      .update({
        supporterrole: highestTier,
        supportersince: highestTier ? new Date().toISOString() : null,
        supporteruntil: null,
        supportersource: highestTier ? 'discord' : null,
      })
      .eq('id', authUser.id)

    return NextResponse.json({ synced: true, tier: highestTier })
  } catch (e) {
    console.error('[discord/role-sync]', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
