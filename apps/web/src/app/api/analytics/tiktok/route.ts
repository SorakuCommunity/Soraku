/**
 * TikTok Events API — Server-side (S2S)
 * Lebih akurat dari pixel client-side:
 * - Tidak terblokir ad-blocker / browser privacy
 * - Kirim data IP + user agent langsung dari server
 * - Deduplicate dengan client-side pixel via event_id
 *
 * POST /api/analytics/tiktok
 */
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

const PIXEL_ID = 'D6UQBU3C77UFTE0HO0R0'
const ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN
const API_URL = 'https://business-api.tiktok.com/open_api/v1.3/event/track/'

interface EventBody {
  event: string
  event_id?: string
  properties?: {
    content_id?: string
    content_name?: string
    content_type?: string
    query?: string
    value?: number
    currency?: string
  }
}

export async function POST(req: NextRequest) {
  if (!ACCESS_TOKEN) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  try {
    const body: EventBody = await req.json()
    if (!body.event)
      return NextResponse.json({ ok: false, error: 'event required' }, { status: 400 })

    const session = await getSession()
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ''
    const userAgent = req.headers.get('user-agent') ?? ''
    const referer = req.headers.get('referer') ?? 'https://www.soraku.id'
    const now = Math.floor(Date.now() / 1000)
    const eventId =
      body.event_id ?? `${body.event}-${now}-${Math.random().toString(36).slice(2, 8)}`

    // Build contents array jika ada content_id
    const contents = body.properties?.content_id
      ? [
          {
            content_id: body.properties.content_id,
            content_name: body.properties.content_name ?? '',
            content_type: body.properties.content_type ?? 'product',
            quantity: 1,
          },
        ]
      : undefined

    const data = [
      {
        event: body.event,
        event_id: eventId,
        event_time: now,
        user: {
          ...(ip && { ip }),
          ...(userAgent && { user_agent: userAgent }),
          ...(session?.id && { external_id: session.id }),
        },
        page: {
          url: referer,
        },
        properties: {
          ...(contents && { contents }),
          ...(body.properties?.query && { query: body.properties.query }),
          ...(body.properties?.value && { value: body.properties.value }),
          ...(body.properties?.currency && { currency: body.properties.currency }),
        },
      },
    ]

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': ACCESS_TOKEN,
      },
      body: JSON.stringify({
        pixel_code: PIXEL_ID,
        data,
        test_event_code: process.env.NODE_ENV !== 'production' ? 'TEST12345' : undefined,
      }),
    })

    const result = await res.json()

    if (result.code !== 0) {
      console.error('[TikTok S2S]', result.message)
      return NextResponse.json({ ok: false, error: result.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, event_id: eventId })
  } catch (err: any) {
    console.error('[TikTok S2S]', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
