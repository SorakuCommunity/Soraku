export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, NOT_FOUND, SERVER_ERROR } from '@/lib/api'
import { sendDiscordWebhook } from '@/lib/discord-webhook'
import { z } from 'zod'

const PlayerSchema = z.object({
  name:     z.string().min(1).max(50),
  role:     z.string().max(30).optional(),
  nickname: z.string().max(30).optional(),
})

const RegisterSchema = z.object({
  teamname:       z.string().min(2).max(60),
  teamlogourl:    z.string().optional().or(z.literal('')),
  activeplayers:  z.array(PlayerSchema).min(1).max(10),
  reserveplayers: z.array(PlayerSchema).max(5).default([]),
  contactname:    z.string().max(60).optional(),
  contactdiscord: z.string().max(60).optional(),
  notes:          z.string().max(500).optional(),
  paymentproof:   z.string().optional().or(z.literal('')),
})

// POST /api/events/[slug]/register
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const { data: event, error: eventErr } = await adminDb()
      .from('events')
      .select('id, title, ispublished, registrationurl, gametype, ispaid, price')
      .eq('slug', slug)
      .eq('ispublished', true)
      .maybeSingle()

    if (eventErr || !event) return NOT_FOUND()

    const session = await getSession()
    const body    = await req.json()
    const parsed  = RegisterSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Data tidak valid')

    const { data, error } = await adminDb()
      .from('eventregistrations')
      .insert({
        eventid:        event.id,
        teamname:       parsed.data.teamname,
        teamlogourl:    parsed.data.teamlogourl || null,
        activeplayers:  parsed.data.activeplayers,
        reserveplayers: parsed.data.reserveplayers,
        contactname:    parsed.data.contactname    || null,
        contactdiscord: parsed.data.contactdiscord || null,
        notes:          parsed.data.notes          || null,
        paymentproof:   parsed.data.paymentproof   || null,
        userid:         session?.id ?? null,
        status: 'pending',
      })
      .select('id, teamname, createdat')
      .single()

    if (error) return err(error.message)

    const { count } = await adminDb()
      .from('eventregistrations')
      .select('*', { count: 'exact', head: true })
      .eq('eventid', event.id)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soraku.vercel.app'
    const regId   = data.id.slice(0, 8).toUpperCase()
    const d       = parsed.data

    // ── Build player list (compact, max 10 rows Discord limit) ──
    const playerLines = d.activeplayers
      .slice(0, 10)
      .map((p, i) => {
        const role = p.role ? ` *[${p.role}]*` : ''
        return `\`${String(i + 1).padStart(2, ' ')}.\` **${p.name}**${role}`
      })
      .join('\n')

    const reserveLines = d.reserveplayers.length > 0
      ? d.reserveplayers
          .map((p, i) => `\`C${i + 1}.\` ${p.name}${p.role ? ` *[${p.role}]*` : ''}`)
          .join('\n')
      : null

    // ── Fields ──
    const fields: Array<{ name: string; value: string; inline?: boolean }> = [
      {
        name:   '🏆 Tim',
        value:  `**${d.teamname}**`,
        inline: true,
      },
      {
        name:   '📊 Total Pendaftar',
        value:  `**${count ?? 1}** tim`,
        inline: true,
      },
      {
        name:   '🆔 ID Registrasi',
        value:  `\`${regId}\``,
        inline: true,
      },
      {
        name:   `👥 Pemain Aktif — ${d.activeplayers.length} orang`,
        value:  playerLines || '—',
        inline: false,
      },
    ]

    if (reserveLines) {
      fields.push({
        name:   `🔄 Cadangan — ${d.reserveplayers.length} orang`,
        value:  reserveLines,
        inline: false,
      })
    }

    if (d.contactname || d.contactdiscord) {
      fields.push({
        name:   '📬 Kontak PIC',
        value:  [d.contactname, d.contactdiscord].filter(Boolean).join(' · '),
        inline: false,
      })
    }

    if (d.notes) {
      fields.push({ name: '📝 Catatan', value: d.notes, inline: false })
    }

    if (d.paymentproof) {
      fields.push({
        name:   '💳 Bukti Pembayaran',
        value:  `[Lihat Bukti ↗](${d.paymentproof})`,
        inline: false,
      })
    }

    if ((event as any).ispaid && (event as any).price) {
      fields.push({
        name:   '💰 Biaya',
        value:  `Rp ${((event as any).price as number).toLocaleString('id-ID')}`,
        inline: true,
      })
    }

    await sendDiscordWebhook('discord_registration_webhook_url', {
      username:   'Soraku Events',
      avatar_url: `${siteUrl}/logo.png`,
      embeds: [{
        author: {
          name:     '📝 Pendaftaran Baru Masuk!',
          icon_url: `${siteUrl}/logo.png`,
        },
        title:       `⚔️ ${d.teamname}`,
        description: `Tim **${d.teamname}** mendaftar untuk event **[${event.title}](${siteUrl}/events/${slug})**\n\n━━━━━━━━━━━━━━━━━━━━━━`,
        color:       0x57F287, // hijau
        fields,
        footer: {
          text:     `Soraku Community · ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })} WIB`,
          icon_url: `${siteUrl}/logo.png`,
        },
        timestamp: new Date().toISOString(),
        ...(d.teamlogourl ? { thumbnail: { url: d.teamlogourl } } : {}),
      }],
    })

    return ok(data, 201)
  } catch { return SERVER_ERROR() }
}

// GET /api/events/[slug]/register — admin list
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    const { slug } = await params
    const { data: event } = await adminDb()
      .from('events')
      .select('id, title')
      .eq('slug', slug)
      .maybeSingle()

    if (!event) return NOT_FOUND()

    const { data, error } = await adminDb()
      .from('eventregistrations')
      .select('*')
      .eq('eventid', event.id)
      .order('createdat', { ascending: true })

    if (error) return SERVER_ERROR()
    return ok({ event, registrations: data ?? [] })
  } catch { return SERVER_ERROR() }
}
