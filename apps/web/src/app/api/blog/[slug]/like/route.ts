export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { ok, NOT_FOUND, SERVER_ERROR } from '@/lib/api'

// GET /api/blog/[slug]/like — get like+dislike count + user's reaction
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session  = await getSession()

    const { data: post } = await adminDb()
      .from('posts').select('id,likecount').eq('slug', slug).eq('ispublished', true).maybeSingle()
    if (!post) return NOT_FOUND()

    // Get dislike count from postlikes where type='dislike'
    const { count: dislikeCount } = await adminDb()
      .from('postlikes').select('*', { count: 'exact', head: true })
      .eq('postid', post.id).eq('ipaddr', 'dislike') // repurpose ipaddr as type flag

    let reaction: 'like' | 'dislike' | null = null
    if (session?.id) {
      const { data: lk } = await adminDb()
        .from('postlikes').select('ipaddr').eq('postid', post.id).eq('userid', session.id).maybeSingle()
      if (lk) reaction = lk.ipaddr === 'dislike' ? 'dislike' : 'like'
    }

    return ok({ likecount: post.likecount ?? 0, dislikecount: dislikeCount ?? 0, reaction })
  } catch { return SERVER_ERROR() }
}

// POST /api/blog/[slug]/like — toggle like or dislike
// body: { type: 'like' | 'dislike' }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug }  = await params
    const session   = await getSession()
    const body      = await req.json().catch(() => ({}))
    const type      = body?.type === 'dislike' ? 'dislike' : 'like'

    const { data: post } = await adminDb()
      .from('posts').select('id,likecount').eq('slug', slug).eq('ispublished', true).maybeSingle()
    if (!post) return NOT_FOUND()

    if (session?.id) {
      const { data: existing } = await adminDb()
        .from('postlikes').select('id,ipaddr').eq('postid', post.id).eq('userid', session.id).maybeSingle()

      if (existing) {
        if (existing.ipaddr === type) {
          // Same reaction → remove (toggle off)
          await adminDb().from('postlikes').delete().eq('id', existing.id)
          if (type === 'like') {
            const newCount = Math.max(0, (post.likecount ?? 0) - 1)
            await adminDb().from('posts').update({ likecount: newCount }).eq('id', post.id)
            const { count: dc } = await adminDb().from('postlikes').select('*', { count: 'exact', head: true }).eq('postid', post.id).eq('ipaddr', 'dislike')
            return ok({ likecount: newCount, dislikecount: dc ?? 0, reaction: null })
          } else {
            const { count: dc } = await adminDb().from('postlikes').select('*', { count: 'exact', head: true }).eq('postid', post.id).eq('ipaddr', 'dislike')
            return ok({ likecount: post.likecount ?? 0, dislikecount: Math.max(0, (dc ?? 0) - 1), reaction: null })
          }
        } else {
          // Switch reaction
          await adminDb().from('postlikes').update({ ipaddr: type }).eq('id', existing.id)
          let newLike = post.likecount ?? 0
          if (type === 'like') newLike = newLike + 1
          else newLike = Math.max(0, newLike - 1)
          await adminDb().from('posts').update({ likecount: newLike }).eq('id', post.id)
          const { count: dc } = await adminDb().from('postlikes').select('*', { count: 'exact', head: true }).eq('postid', post.id).eq('ipaddr', 'dislike')
          return ok({ likecount: newLike, dislikecount: dc ?? 0, reaction: type })
        }
      } else {
        // New reaction
        await adminDb().from('postlikes').insert({ postid: post.id, userid: session.id, ipaddr: type })
        let newLike = post.likecount ?? 0
        if (type === 'like') newLike = newLike + 1
        await adminDb().from('posts').update({ likecount: newLike }).eq('id', post.id)
        const { count: dc } = await adminDb().from('postlikes').select('*', { count: 'exact', head: true }).eq('postid', post.id).eq('ipaddr', 'dislike')
        return ok({ likecount: newLike, dislikecount: dc ?? 0, reaction: type })
      }
    } else {
      // Guest like only
      if (type === 'like') {
        const newCount = (post.likecount ?? 0) + 1
        await adminDb().from('posts').update({ likecount: newCount }).eq('id', post.id)
        return ok({ likecount: newCount, dislikecount: 0, reaction: 'like' })
      }
      return ok({ likecount: post.likecount ?? 0, dislikecount: 0, reaction: null })
    }
  } catch { return SERVER_ERROR() }
}
