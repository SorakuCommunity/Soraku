import { adminDb } from '@/lib/supabase/admin'
import { ok, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/agensi?type=vtuber|kreator|...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const tag = searchParams.get('tag')

    let query = adminDb()
      .from('vtubers')
      .select(
        'id,slug,name,charactername,avatarurl,coverurl,description,debutdate,tags,sociallinks,isactive,islive,liveurl,subscribercount'
      )
      .eq('isactive', true)
      .eq('ispublished', true)
      .order('name', { ascending: true })

    if (type) query = query.contains('tags', [type])
    if (tag) query = query.contains('tags', [tag])

    const { data, error } = await query
    if (error) return SERVER_ERROR()
    return ok(data)
  } catch {
    return SERVER_ERROR()
  }
}
