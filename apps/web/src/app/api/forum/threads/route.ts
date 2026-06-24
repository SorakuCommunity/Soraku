export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { ok, err, SERVER_ERROR } from '@/lib/api'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 50)
    const offset = (page - 1) * limit

    const db = adminDb().schema('soraku')

    let query = db
      .from('forum_threads')
      .select('*', { count: 'exact' })
      .order('ispinned', { ascending: false })
      .order('lastactivity', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category && category !== 'semua') {
      query = query.eq('category', category)
    }

    const { data, error, count } = await query

    if (error) return err(error.message, 500)

    return ok(data ?? [], 200, { total: count ?? 0, page, limit })
  } catch (e) {
    console.error('[forum threads]', e)
    return SERVER_ERROR()
  }
}
