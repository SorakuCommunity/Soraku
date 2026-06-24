export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { ok, SERVER_ERROR } from '@/lib/api'

export async function GET() {
  try {
    const db = adminDb().schema('soraku')

    const { count: totalThreads } = await db
      .from('forum_threads')
      .select('*', { count: 'exact', head: true })

    const { count: totalReplies } = await db
      .from('forum_replies')
      .select('*', { count: 'exact', head: true })

    return ok({
      totalThreads: totalThreads ?? 0,
      totalReplies: totalReplies ?? 0,
    })
  } catch (e) {
    console.error('[forum stats]', e)
    return SERVER_ERROR()
  }
}
