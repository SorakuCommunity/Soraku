export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { ok, NOT_FOUND, SERVER_ERROR } from '@/lib/api'

// GET /api/blog/[slug]/like
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

    let reaction: 'like' | 'dislike' | null = null
    if (session?.id) {
      // Check if user has liked this post
      const { data: lk } = await adminDb()
        .from('postlikes')
        .select('id')
        .eq('postid', post.id)
        .eq('userid', session.id)
        .maybeSingle()
      if (lk) reaction = 'like'
    }

    // Dislike count = total - likes (simplified: just use likes only for now)
    return ok({ likecount: post.likecount ?? 0, dislikecount: 0, reaction })
  } catch { return SERVER_ERROR() }
}

// POST /api/blog/[slug]/like — toggle like (requires login)
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

    if (!session?.id) {
      // Guest: just return current count, no tracking
      return ok({ likecount: post.likecount ?? 0, dislikecount: 0, reaction: null })
    }

    // Check if user already liked
    const { data: existing } = await adminDb()
      .from('postlikes')
      .select('id')
      .eq('postid', post.id)
      .eq('userid', session.id)
      .maybeSingle()

    if (existing) {
      // Already liked → unlike (toggle off)
      await adminDb().from('postlikes').delete().eq('id', existing.id)
      const newCount = Math.max(0, (post.likecount ?? 0) - 1)
      await adminDb().from('posts').update({ likecount: newCount }).eq('id', post.id)
      return ok({ likecount: newCount, dislikecount: 0, reaction: null })
    } else {
      // Not yet liked → like
      await adminDb().from('postlikes').insert({ postid: post.id, userid: session.id })
      const newCount = (post.likecount ?? 0) + 1
      await adminDb().from('posts').update({ likecount: newCount }).eq('id', post.id)
      return ok({ likecount: newCount, dislikecount: 0, reaction: 'like' })
    }
  } catch { return SERVER_ERROR() }
}
