export const dynamic = 'force-dynamic'
import { env } from '@/env'
import { sendDiscordWebhook } from '@/lib/discord-webhook'

import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

const EventSchema = z.object({
  slug:             z.string().min(1),
  title:            z.string().min(1),
  description:      z.string().optional(),
  coverurl:         z.string().url().optional(),
  startdate:        z.string(),
  enddate:          z.string().optional(),
  location:         z.string().optional(),
  isonline:         z.boolean().default(true),
  ispublished:      z.boolean().default(false),
  tags:             z.array(z.string()).default([]),
  registrationurl:  z.string().url().optional().or(z.literal('')).transform(v => v || undefined),
  gametype:         z.enum(['ml','valorant','freefire','pubg','chess','other']).optional(),
  ispaid:           z.boolean().default(false),
  price:            z.number().int().min(0).default(0).optional(),
  priceinfo:        z.string().max(500).optional(),
  paymentmethods:   z.array(z.any()).default([]).optional(),
})

/** Kirim Discord embed event baru */
async function sendDiscordEventEmbed(event: {
  title: string; description?: string; slug: string; startdate: string
  enddate?: string; location?: string; isonline: boolean; tags: string[]
  coverurl?: string; registrationurl?: string; ispaid?: boolean; price?: number
}) {
  const siteUrl   = env.NEXT_PUBLIC_SITE_URL ?? 'https://soraku.vercel.app'
  const eventUrl  = `${siteUrl}/events/${event.slug}`
  const daftarUrl = `${siteUrl}/events/${event.slug}/daftar`

  const startStr = new Date(event.startdate).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta',
  }) + ' WIB'

  const endStr = event.enddate
    ? new Date(event.enddate).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta',
      }) + ' WIB'
    : null

  const fields: { name: string; value: string; inline?: boolean }[] = [
    { name: '📅 Waktu Mulai', value: startStr, inline: false },
  ]
  if (endStr) fields.push({ name: '🏁 Waktu Selesai', value: endStr, inline: false })
  fields.push({ name: '🌐 Tipe', value: event.isonline ? 'Online' : `Offline${event.location ? ` — ${event.location}` : ''}`, inline: true })
  fields.push({ name: '💰 Biaya', value: event.ispaid ? (event.price ? `Rp ${event.price.toLocaleString('id-ID')}` : 'Berbayar') : 'Gratis 🎟️', inline: true })
  if (event.tags?.length) fields.push({ name: '🏷️ Tags', value: event.tags.map(t => `\`${t}\``).join(' '), inline: false })

  const regLink = event.registrationurl
    ? `[📝 Daftar Eksternal](${event.registrationurl})`
    : `[⚔️ Daftar Sekarang](${daftarUrl})`

  await sendDiscordWebhook('discord_event_webhook_url', {
    username:   'Soraku Events',
    avatar_url: `${siteUrl}/logo.png`,
    content:    `@everyone 🎉 **Event baru dari Soraku Community!**`,
    embeds: [{
      author: {
        name:     '🎮 Event Baru Telah Dibuka!',
        icon_url: `${siteUrl}/logo.png`,
      },
      title:       event.title,
      url:         eventUrl,
      description: (event.description?.slice(0, 300) ?? 'Event baru dari Soraku Community!') +
        `

━━━━━━━━━━━━━━━━━━━━━━
[🔗 Lihat Detail Event](${eventUrl})  •  ${regLink}`,
      color:       0x4FA3D1,
      fields,
      image:       event.coverurl ? { url: event.coverurl } : undefined,
      footer: {
        text:     `Soraku Community · soraku.id`,
        icon_url: `${siteUrl}/logo.png`,
      },
      timestamp: new Date().toISOString(),
    }],
  })
}

// GET /api/admin/events
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()
    const limit = Math.min(Number(new URL(req.url).searchParams.get('limit') ?? '100'), 200)
    const { data, error } = await adminDb()
      .from('events')
      .select('id,slug,title,startdate,enddate,isonline,ispublished,tags,registrationurl,gametype,ispaid,price,paymentmethods,registrationopen,createdat')
      .order('startdate', { ascending: false })
      .limit(limit)
    if (error) return SERVER_ERROR()
    return ok(data ?? [])
  } catch { return SERVER_ERROR() }
}

// POST /api/admin/events
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()
    const body   = await req.json()
    const parsed = EventSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    const { data, error } = await adminDb()
      .from('events')
      .insert({ ...parsed.data, createdby: session.id })
      .select().single()
    if (error) return err(error.message)

    if (parsed.data.ispublished) {
      // 1. Discord embed via webhook
      sendDiscordEventEmbed({ ...parsed.data })
      // 2. Bot legacy webhook
      if (env.BOT_WEBHOOK_URL && env.BOT_WEBHOOK_SECRET) {
        fetch(`${env.BOT_WEBHOOK_URL}/announce/event`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-webhook-secret': env.BOT_WEBHOOK_SECRET },
          body: JSON.stringify({ title: parsed.data.title, eventUrl: `${env.NEXT_PUBLIC_SITE_URL}/events/${parsed.data.slug}` }),
        }).catch(() => {})
      }
    }
    return ok(data, 201)
  } catch { return SERVER_ERROR() }
}
