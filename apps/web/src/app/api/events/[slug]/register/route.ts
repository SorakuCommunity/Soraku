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
      .select('id, title, ispublished, registrationurl, gametype')
      .eq('slug', slug)
      .eq('ispublished', true)
      .maybeSingle()

    if (eventErr || !event) return NOT_FOUND()

    const body   = await req.json()
    const parsed = RegisterSchema.safeParse(body)
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
        status: 'pending',
      })
      .select('id, teamname, createdat')
      .single()

    if (error) return err(error.message)

    // Hitung total pendaftar
    const { count } = await adminDb()
      .from('eventregistrations')
      .select('*', { count: 'exact', head: true })
      .eq('eventid', event.id)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soraku.vercel.app'

    const activeFmt = parsed.data.activeplayers.map((p, i) =>
      `\`${i + 1}.\` **${p.name}**${p.nickname ? ` *(${p.nickname})*` : ''}${p.role ? ` — ${p.role}` : ''}`
    ).join('\n')

    const reserveFmt = parsed.data.reserveplayers.length > 0
      ? parsed.data.reserveplayers.map((p, i) =>
          `\`C${i + 1}.\` ${p.name}${p.nickname ? ` *(${p.nickname})*` : ''}${p.role ? ` — ${p.role}` : ''}`
        ).join('\n')
      : null

    const fields: Array<{ name: string; value: string; inline?: boolean }> = [
      { name: '⚔️ Nama Tim',        value: parsed.data.teamname,          inline: true  },
      { name: '📋 Total Pendaftar', value: `${count ?? 1} tim`,           inline: true  },
      { name: `👥 Pemain Aktif (${parsed.data.activeplayers.length})`, value: activeFmt, inline: false },
    ]
    if (reserveFmt) fields.push({ name: `🔄 Cadangan (${parsed.data.reserveplayers.length})`, value: reserveFmt, inline: false })
    if (parsed.data.contactname || parsed.data.contactdiscord) {
      const contact = [parsed.data.contactname, parsed.data.contactdiscord].filter(Boolean).join(' · ')
      fields.push({ name: '📬 Kontak PIC', value: contact, inline: false })
    }
    if (parsed.data.notes) fields.push({ name: '📝 Catatan', value: parsed.data.notes, inline: false })

    // Kirim notif Discord (await — bukan fire & forget supaya error terlog)
    await sendDiscordWebhook('discord_registration_webhook_url', {
      username:   'Soraku Registrasi',
      avatar_url: `${siteUrl}/logo.png`,
      content:    `🎮 Tim baru mendaftar untuk **${event.title}**!`,
      embeds: [{
        title:       `📝 Pendaftaran Baru`,
        description: `Tim **${parsed.data.teamname}** mendaftar ke [${event.title}](${siteUrl}/events/${slug})`,
        color:       0x57F287,
        fields,
        footer:      { text: `ID: ${data.id.slice(0, 8).toUpperCase()} · Soraku Community` },
        timestamp:   new Date().toISOString(),
        ...(parsed.data.teamlogourl ? { thumbnail: { url: parsed.data.teamlogourl } } : {}),
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
