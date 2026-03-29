export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, FORBIDDEN, SERVER_ERROR } from '@/lib/api'

// GET /api/admin/stats — satu endpoint untuk dashboard overview
export async function GET() {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    const db = adminDb()

    const [
      { count: blogCount },
      { count: eventCount },
      { count: galleryPending },
      { count: memberCount },
      { data: recentPosts },
      { data: pendingGallery },
    ] = await Promise.all([
      db.from('posts').select('*', { count: 'exact', head: true }).eq('ispublished', true),
      db.from('events').select('*', { count: 'exact', head: true }),
      db.from('gallery').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      db.from('users').select('*', { count: 'exact', head: true }).eq('isbanned', false),
      db
        .from('posts')
        .select('id,title,slug,ispublished,createdat')
        .order('createdat', { ascending: false })
        .limit(5),
      db
        .from('gallery')
        .select('id,title,imageurl,tags,createdat')
        .eq('status', 'pending')
        .order('createdat', { ascending: false })
        .limit(5),
    ])

    return ok({
      blog_count: blogCount ?? 0,
      event_count: eventCount ?? 0,
      gallery_pending: galleryPending ?? 0,
      member_count: memberCount ?? 0,
      recent_posts: recentPosts ?? [],
      pending_gallery: pendingGallery ?? [],
    })
  } catch {
    return SERVER_ERROR()
  }
}
