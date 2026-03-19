export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { ok, SERVER_ERROR } from '@/lib/api'

// GET /api/home — data for homepage (events, blogs, partnerships)
export async function GET(_req: NextRequest) {
  try {
    // Events — upcoming first
    const { data: events } = await adminDb()
      .from('events')
      .select('id,slug,title,description,coverurl,startdate,isonline')
      .eq('ispublished', true)
      .order('startdate', { ascending: true })
      .limit(4)

    // Posts — latest 4 with author
    const { data: posts } = await adminDb()
      .from('posts')
      .select('id,slug,title,excerpt,coverurl,publishedat,authorid,viewcount,likecount')
      .eq('ispublished', true)
      .order('publishedat', { ascending: false })
      .limit(4)

    // Get author info for posts
    const authorIds = [...new Set((posts ?? []).filter(p => p.authorid).map(p => p.authorid!))]
    let authorsMap: Record<string, any> = {}
    if (authorIds.length > 0) {
      const { data: users } = await adminDb()
        .from('users').select('id,username,displayname,avatarurl').in('id', authorIds)
      if (users) authorsMap = Object.fromEntries(users.map(u => [u.id, u]))
    }

    const blogs = (posts ?? []).map(p => ({
      id:          p.id,
      slug:        p.slug,
      title:       p.title,
      excerpt:     p.excerpt,
      coverurl:    p.coverurl,
      publishedat: p.publishedat,
      viewcount:   p.viewcount ?? 0,
      likecount:   p.likecount ?? 0,
      author:      p.authorid ? authorsMap[p.authorid] ?? null : null,
    }))

    // Format events with status
    const now = new Date()
    const formattedEvents = (events ?? []).map(e => ({
      id:          e.id,
      slug:        e.slug,
      title:       e.title,
      description: e.description,
      coverurl:    e.coverurl,
      startdate:   e.startdate,
      status:      new Date(e.startdate) > now ? 'online' : 'selesai',
      author:      null,
    }))

    // Partnerships
    const { data: partnerships } = await adminDb()
      .from('partnerships')
      .select('id,name,logourl,website,category,description')
      .eq('isactive', true)
      .limit(8)

    return ok({ events: formattedEvents, blogs, partnerships: partnerships ?? [] })
  } catch { return SERVER_ERROR() }
}
