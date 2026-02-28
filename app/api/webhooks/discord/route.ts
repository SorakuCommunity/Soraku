import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// Discord webhook receiver (untuk integrasi Discord → Soraku)
export async function POST(req: NextRequest) {
  // Verify webhook secret
  const secret = req.headers.get('x-webhook-secret')
  if (secret !== process.env.DISCORD_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const supabase = createServerSupabaseClient()

  // Handle Discord event creation webhook
  if (body.type === 'event_create') {
    await supabase.from('events').insert({
      title:      body.name,
      description: body.description ?? '',
      start_date: body.scheduled_start_time,
      end_date:   body.scheduled_end_time ?? null,
      type:       'online',
      status:     'upcoming',
      created_at: new Date().toISOString(),
    })
  }

  // Handle new member join
  if (body.type === 'member_join') {
    // Log discord member join
    console.log('Discord member joined:', body.user?.username)
  }

  return NextResponse.json({ received: true })
}
