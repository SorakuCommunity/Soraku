export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { ok, err, UNAUTHORIZED, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

const MarkReadSchema = z.union([
  z.object({ ids: z.array(z.string().uuid()).min(1), all: z.undefined() }),
  z.object({ all: z.literal(true), ids: z.undefined() }),
])

// GET /api/notifications — list notif user (polling / Realtime trigger)
export async function GET() {
  try {
    const session = await getSession()
    if (!session) return UNAUTHORIZED()
    const { data, error } = await adminDb()
      .from('notifications')
      .select('id,type,title,body,href,isread,createdat')
      .eq('userid', session.id)
      .order('createdat', { ascending: false })
      .limit(30)
    if (error) return SERVER_ERROR()
    return ok(data ?? [])
  } catch {
    return SERVER_ERROR()
  }
}

// PATCH /api/notifications — mark as read (specific ids atau semua)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return UNAUTHORIZED()
    const body = await req.json()
    const parsed = MarkReadSchema.safeParse(body)
    if (!parsed.success) return err('Payload tidak valid')

    let query = adminDb().from('notifications').update({ isread: true }).eq('userid', session.id)

    if (parsed.data.all) {
      query = query.eq('isread', false)
    } else {
      query = (query as typeof query).in('id', parsed.data.ids!)
    }

    const { error } = await query
    if (error) return SERVER_ERROR()
    return ok({ updated: true })
  } catch {
    return SERVER_ERROR()
  }
}
