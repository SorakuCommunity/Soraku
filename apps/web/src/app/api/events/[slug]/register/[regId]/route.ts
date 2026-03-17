export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, NOT_FOUND, SERVER_ERROR } from '@/lib/api'
import { sendDiscordWebhook } from '@/lib/discord-webhook'
import { z } from 'zod'

const ReviewSchema = z.object({
  status:       z.enum(['approved', 'rejected']),
  rejectreason: z.string().max(300).optional(),
})

// PATCH /api/events/[slug]/register/[regId] — admin: terima/tolak
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; regId: string }> }
) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    const { slug, regId } = await params
    const body   = await req.json()
    const parsed = ReviewSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    const { data: reg } = await adminDb()
      .from('eventregistrations')
      .select('id, teamname, teamlogourl, contactdiscord, events:eventid(title, slug)')
      .eq('id', regId)
      .maybeSingle()

    if (!reg) return NOT_FOUND()

    const { data, error } = await adminDb()
      .from('eventregistrations')
      .update({
        status:       parsed.data.status,
        rejectreason: parsed.data.rejectreason || null,
        reviewedby:   session.id,
        reviewedat:   new Date().toISOString(),
        updatedat:    new Date().toISOString(),
      })
      .eq('id', regId)
      .select('id, teamname, status')
      .single()

    if (error) return err(error.message)

    const siteUrl    = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soraku.vercel.app'
    const eventTitle = (reg.events as any)?.title ?? 'Event Soraku'
    const eventSlug  = (reg.events as any)?.slug  ?? slug
    const isApproved = parsed.data.status === 'approved'

    await sendDiscordWebhook('discord_registration_webhook_url', {
      username:   'Soraku Registrasi',
      avatar_url: `${siteUrl}/logo.png`,
      embeds: [{
        title:       isApproved ? `✅ Pendaftaran DITERIMA` : `❌ Pendaftaran DITOLAK`,
        description: `Tim **${reg.teamname}** untuk event [${eventTitle}](${siteUrl}/events/${eventSlug})`,
        color:       isApproved ? 0x57F287 : 0xED4245,
        fields: [
          { name: '⚔️ Tim',    value: reg.teamname,                                   inline: true },
          { name: '👤 Admin',  value: session.displayname ?? session.username ?? '—', inline: true },
          ...(parsed.data.rejectreason ? [{ name: '📝 Alasan', value: parsed.data.rejectreason, inline: false }] : []),
          ...(reg.contactdiscord ? [{ name: '📬 Discord Tim', value: reg.contactdiscord, inline: false }] : []),
        ],
        footer:    { text: `ID: ${regId.slice(0,8).toUpperCase()} · Soraku` },
        timestamp: new Date().toISOString(),
        ...(reg.teamlogourl ? { thumbnail: { url: reg.teamlogourl } } : {}),
      }],
    })

    return ok(data)
  } catch { return SERVER_ERROR() }
}
