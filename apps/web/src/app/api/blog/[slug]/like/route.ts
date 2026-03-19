export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { ok, NOT_FOUND, SERVER_ERROR } from '@/lib/api'

// GET /api/blog/[slug]/like — get like count + user's status
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

    let liked = false
    if (session?.id) {
      const { data } = await adminDb()
        .from('post_likes').select('id').eq('postid', post.id).eq('userid', session.id).maybeSingle()
      liked = !!data
    }

    return ok({ likecount: post.likecount ?? 0, liked })
  } catch { return SERVER_ERROR() }
}

// POST /api/blog/[slug]/like — toggle like
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session  = await getSession()

    const { data: post } = await adminDb()
      .from('posts').select('id,likecount').eq('slug', slug).eq('ispublished', true).maybeSingle()
    if (!post) return NOT_FOUND()

    if (session?.id) {
      // Check if already liked
      const { data: existing } = await adminDb()
        .from('post_likes').select('id').eq('postid', post.id).eq('userid', session.id).maybeSingle()

      if (existing) {
        // Unlike
        await adminDb().from('post_likes').delete().eq('id', existing.id)
        const newCount = Math.max(0, (post.likecount ?? 0) - 1)
        await adminDb().from('posts').update({ likecount: newCount }).eq('id', post.id)
        return ok({ likecount: newCount, liked: false })
      } else {
        // Like
        await adminDb().from('post_likes').insert({ postid: post.id, userid: session.id })
        const newCount = (post.likecount ?? 0) + 1
        await adminDb().from('posts').update({ likecount: newCount }).eq('id', post.id)
        return ok({ likecount: newCount, liked: true })
      }
    } else {
      // Guest — just increment, no tracking
      const newCount = (post.likecount ?? 0) + 1
      await adminDb().from('posts').update({ likecount: newCount }).eq('id', post.id)
      return ok({ likecount: newCount, liked: true })
    }
  } catch { return SERVER_ERROR() }
}
