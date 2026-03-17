export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, NOT_FOUND, SERVER_ERROR } from '@/lib/api'
import { env } from '@/env'
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

/** Kirim notif pendaftaran ke Discord channel via webhook */
async function notifyDiscordRegistration(params: {
  eventTitle:     string
  eventSlug:      string
  teamname:       string
  teamlogourl?:   string
  activeplayers:  Array<{ name: string; role?: string; nickname?: string }>
  reserveplayers: Array<{ name: string; role?: string; nickname?: string }>
  contactname?:   string
  contactdiscord?: string
  regId:          string
  totalRegistrations: number
}) {
  const webhookUrl = env.DISCORD_REGISTRATION_WEBHOOK_URL
  if (!webhookUrl) return

  const siteUrl   = env.NEXT_PUBLIC_SITE_URL ?? 'https://soraku.vercel.app'
  const eventUrl  = `${siteUrl}/events/${params.eventSlug}`

  const activeFmt = params.activeplayers.map((p, i) =>
    `\`${i + 1}.\` **${p.name}**${p.nickname ? ` *(${p.nickname})*` : ''}${p.role ? ` — ${p.role}` : ''}`
  ).join('\n')

  const reserveFmt = params.reserveplayers.length > 0
    ? params.reserveplayers.map((p, i) =>
        `\`C${i + 1}.\` ${p.name}${p.nickname ? ` *(${p.nickname})*` : ''}${p.role ? ` — ${p.role}` : ''}`
      ).join('\n')
    : '—'

  const fields: Array<{ name: string; value: string; inline?: boolean }> = [
    { name: '⚔️ Tim',            value: params.teamname,              inline: true  },
    { name: '📋 Total Pendaftar', value: `${params.totalRegistrations} tim`, inline: true },
    { name: `👥 Pemain Aktif (${params.activeplayers.length})`, value: activeFmt, inline: false },
  ]

  if (params.reserveplayers.length > 0) {
    fields.push({ name: `🔄 Pemain Cadangan (${params.reserveplayers.length})`, value: reserveFmt, inline: false })
  }
  if (params.contactname || params.contactdiscord) {
    const contact = [params.contactname, params.contactdiscord].filter(Boolean).join(' · ')
    fields.push({ name: '📬 Kontak PIC', value: contact, inline: false })
  }

  const embed = {
    title:       `📝 Pendaftaran Baru — ${params.eventTitle}`,
    description: `Tim **${params.teamname}** telah mendaftar.\n[🔗 Lihat Event](${eventUrl})`,
    color:       0x57F287, // Discord green
    fields,
    footer:      { text: `ID: ${params.regId.slice(0, 8).toUpperCase()} · Soraku Community` },
    timestamp:   new Date().toISOString(),
    ...(params.teamlogourl ? { thumbnail: { url: params.teamlogourl } } : {}),
  }

  try {
    await fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username:   'Soraku Registrasi',
        avatar_url: `${siteUrl}/logo.png`,
        content:    `🎮 Tim baru mendaftar untuk event **${params.eventTitle}**!`,
        embeds:     [embed],
      }),
    })
  } catch { /* webhook gagal — tidak block response */ }
}

// ─── POST /api/events/[slug]/register ─────────────────────────────────────

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Pastikan event exists + published
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

    // Hitung total pendaftar untuk embed
    const { count } = await adminDb()
      .from('eventregistrations')
      .select('*', { count: 'exact', head: true })
      .eq('eventid', event.id)

    // Kirim notif Discord (fire & forget)
    notifyDiscordRegistration({
      eventTitle:     event.title,
      eventSlug:      slug,
      teamname:       parsed.data.teamname,
      teamlogourl:    parsed.data.teamlogourl || undefined,
      activeplayers:  parsed.data.activeplayers,
      reserveplayers: parsed.data.reserveplayers,
      contactname:    parsed.data.contactname,
      contactdiscord: parsed.data.contactdiscord,
      regId:          data.id,
      totalRegistrations: count ?? 1,
    })

    return ok(data, 201)
  } catch { return SERVER_ERROR() }
}

// ─── GET /api/events/[slug]/register — admin list ─────────────────────────

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
