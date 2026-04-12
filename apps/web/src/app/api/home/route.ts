export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { ok, SERVER_ERROR } from '@/lib/api'

export async function GET(_req: NextRequest) {
  try {
    const now = new Date()

    const { data: events } = await adminDb()
      .from('events')
      .select('id,slug,title,description,coverurl,startdate,enddate,isonline,tags')
      .eq('ispublished', true)
      .order('startdate', { ascending: true })
      .limit(6)

    const { data: posts } = await adminDb()
      .from('posts')
      .select('id,slug,title,excerpt,coverurl,publishedat,authorid,viewcount,likecount,tags')
      .eq('ispublished', true)
      .order('publishedat', { ascending: false })
      .limit(6)

    // Author info
    const authorIds = [...new Set((posts ?? []).filter(p => p.authorid).map(p => p.authorid!))]
    let authorsMap: Record<string, any> = {}
    if (authorIds.length > 0) {
      const { data: users } = await adminDb()
        .from('users').select('id,username,displayname,avatarurl').in('id', authorIds)
      if (users) authorsMap = Object.fromEntries(users.map(u => [u.id, u]))
    }

    // Comment counts per post
    const postIds = (posts ?? []).map(p => p.id)
    let commentMap: Record<string, number> = {}
    if (postIds.length > 0) {
      const { data: comments } = await adminDb()
        .from('postcomments')
        .select('postid')
        .in('postid', postIds)
        .eq('isdeleted', false)
      if (comments) {
        commentMap = comments.reduce((acc: Record<string, number>, c: any) => {
          acc[c.postid] = (acc[c.postid] ?? 0) + 1
          return acc
        }, {})
      }
    }

    const blogs = (posts ?? []).map(p => ({
      id: p.id, slug: p.slug, title: p.title,
      excerpt: p.excerpt, coverurl: p.coverurl,
      publishedat: p.publishedat,
      viewcount: p.viewcount ?? 0,
      likecount: p.likecount ?? 0,
      commentcount: commentMap[p.id] ?? 0,
      tags: p.tags ?? [],
      author: p.authorid ? (authorsMap[p.authorid] ?? null) : null,
    }))

    const formattedEvents = (events ?? []).map(e => {
      const start = new Date(e.startdate)
      const end   = e.enddate ? new Date(e.enddate) : null
      let status = 'upcoming'
      if (now >= start && (!end || now <= end)) status = 'live'
      else if (end && now > end) status = 'selesai'
      else if (start > now) status = 'upcoming'
      return {
        id: e.id, slug: e.slug, title: e.title,
        description: e.description, coverurl: e.coverurl,
        startdate: e.startdate, enddate: e.enddate ?? null,
        isonline: e.isonline, tags: e.tags ?? [], status,
      }
    })

    // Gallery items (approved, latest 8)
    const { data: galleryItems } = await adminDb()
      .from('gallery')
      .select('id,imageurl,title,tags,uploadedby,createdat')
      .eq('status', 'approved')
      .order('createdat', { ascending: false })
      .limit(8)

    const { data: partnerships } = await adminDb()
      .from('partnerships')
      .select('id,name,logourl,website,category,description')
      .eq('isactive', true)
      .order('sortorder', { ascending: true })
      .limit(12)

    const allPartners = partnerships ?? []
    const partnersOnly = allPartners.filter(p => p.category !== 'sponsor')
    const sponsorsOnly = allPartners.filter(p => p.category === 'sponsor')

    return ok({ events: formattedEvents, blogs, gallery: galleryItems ?? [], partnerships: partnersOnly, sponsorships: sponsorsOnly })
  } catch { return SERVER_ERROR() }
}
