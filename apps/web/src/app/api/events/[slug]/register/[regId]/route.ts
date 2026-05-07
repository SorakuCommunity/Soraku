export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, NOT_FOUND, SERVER_ERROR } from '@/lib/api'
import { sendDiscordWebhook } from '@/lib/discord-webhook'
import { z } from 'zod'

const ReviewSchema = z.object({
  status: z.enum(['approved', 'rejected']),
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
    const body = await req.json()
    const parsed = ReviewSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    const { data: reg } = await adminDb()
      .from('eventregistrations')
      .select(
        'id, teamname, teamlogourl, contactdiscord, activeplayers, events:eventid(title, slug)'
      )
      .eq('id', regId)
      .maybeSingle()

    if (!reg) return NOT_FOUND()

    const { data, error } = await adminDb()
      .from('eventregistrations')
      .update({
        status: parsed.data.status,
        rejectreason: parsed.data.rejectreason || null,
        reviewedby: session.id,
        reviewedat: new Date().toISOString(),
        updatedat: new Date().toISOString(),
      })
      .eq('id', regId)
      .select('id, teamname, status')
      .single()

    if (error) return err(error.message)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.soraku.id'
    const eventTitle = (reg.events as any)?.title ?? 'Event Soraku'
    const eventSlug = (reg.events as any)?.slug ?? slug
    const isApproved = parsed.data.status === 'approved'
    const shortId = regId.slice(0, 8).toUpperCase()

    // ── Player preview (max 5) ──
    const players = (reg.activeplayers as any[]) ?? []
    const playerPreview = players
      .slice(0, 5)
      .map((p: any, i: number) => `\`${i + 1}.\` ${p.name}${p.role ? ` *[${p.role}]*` : ''}`)
      .join('\n')

    const fields: Array<{ name: string; value: string; inline?: boolean }> = [
      { name: '🏆 Tim', value: `**${reg.teamname}**`, inline: true },
      {
        name: '👤 Direview oleh',
        value: session.displayname ?? session.username ?? '—',
        inline: true,
      },
      { name: '🆔 ID', value: `\`${shortId}\``, inline: true },
    ]

    if (playerPreview) {
      fields.push({
        name: `👥 Anggota Tim (${players.length} orang)`,
        value:
          playerPreview + (players.length > 5 ? `\n*... dan ${players.length - 5} lainnya*` : ''),
        inline: false,
      })
    }

    if (reg.contactdiscord) {
      fields.push({ name: '📬 Discord Tim', value: reg.contactdiscord, inline: false })
    }

    if (!isApproved && parsed.data.rejectreason) {
      fields.push({ name: '❌ Alasan Penolakan', value: parsed.data.rejectreason, inline: false })
    }

    await sendDiscordWebhook('discord_registration_webhook_url', {
      username: 'Soraku Events',
      avatar_url: `${siteUrl}/logo.png`,
      embeds: [
        {
          author: {
            name: isApproved ? '✅ Pendaftaran DITERIMA' : '❌ Pendaftaran DITOLAK',
            icon_url: `${siteUrl}/logo.png`,
          },
          title: `${isApproved ? '🎉' : '😔'} ${reg.teamname}`,
          description: isApproved
            ? `Selamat! Tim **${reg.teamname}** berhasil diterima di event **[${eventTitle}](${siteUrl}/events/${eventSlug})**!\n\nSilakan pantau Discord untuk informasi lebih lanjut.\n\n━━━━━━━━━━━━━━━━━━━━━━`
            : `Maaf, pendaftaran tim **${reg.teamname}** untuk event **[${eventTitle}](${siteUrl}/events/${eventSlug})** tidak dapat diterima.\n\n━━━━━━━━━━━━━━━━━━━━━━`,
          color: isApproved ? 0x57f287 : 0xed4245,
          fields,
            footer: {
              text: `Soraku · ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })} WIB`,
              icon_url: `${siteUrl}/logo.png`,
            },
          timestamp: new Date().toISOString(),
          ...(reg.teamlogourl ? { thumbnail: { url: reg.teamlogourl } } : {}),
        },
      ],
    })

    return ok(data)
  } catch {
    return SERVER_ERROR()
  }
}
