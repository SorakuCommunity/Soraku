export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { ok, err, NOT_FOUND, SERVER_ERROR } from '@/lib/api'
import { z } from 'zod'

const ReplySchema = z.object({
<<<<<<< HEAD
  content: z.string().min(1).max(2000),
})

function normalizeComment(c: any) {
  return {
    id:        c.id ?? '',
    parentid:  c.parentid ?? null,
    userid:    c.userid ?? c.authorid ?? null,
    guestname: c.guestname ?? null,
    content:   c.content ?? '',
    createdat: c.createdat ?? new Date().toISOString(),
    author:    null,
    replies:   [],
  }
}

// POST /api/blog/[slug]/comments/[commentId]/reply — requires login
=======
  content:   z.string().min(1).max(2000),
  guestname: z.string().max(50).optional(),
})

<<<<<<< HEAD
// POST /api/blog/[slug]/comments/[commentId]/reply
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
=======
>>>>>>> 8a05456 (fix+feat(blog): comments fix, like animation, hapus hashtags, related posts)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; commentId: string }> }
) {
  try {
    const { slug, commentId } = await params
    const session = await getSession()
<<<<<<< HEAD

    if (!session?.id) return err('Harus login untuk membalas.', 401)

    const body   = await req.json()
    const parsed = ReplySchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    // Get post
=======
    const body    = await req.json()
    const parsed  = ReplySchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
    const { data: post } = await adminDb()
      .from('posts').select('id').eq('slug', slug).eq('ispublished', true).maybeSingle()
    if (!post) return NOT_FOUND()

<<<<<<< HEAD
    // Verify parent comment exists
    const { data: parent } = await adminDb()
      .from('postcomments').select('id').eq('id', commentId).maybeSingle()
    if (!parent) return NOT_FOUND()

    // Insert reply with minimal columns
    const { data, error } = await adminDb()
      .from('postcomments')
      .insert({
        postid:   post.id,
        parentid: commentId,
        userid:   session.id,
        content:  parsed.data.content.trim(),
      })
      .select('*')
      .single()

    if (error) {
      console.error('[reply POST]', error.message)
      return err(error.message)
    }

    const { data: u } = await adminDb()
      .from('users').select('username,displayname,avatarurl').eq('id', session.id).maybeSingle()

    return ok({ ...normalizeComment(data), author: u ?? null }, 201)
  } catch (e: any) {
    console.error('[reply POST exception]', e)
    return SERVER_ERROR()
  }
=======
    const { data: parent } = await adminDb()
      .from('post_comments').select('id').eq('id', commentId).eq('postid', post.id).maybeSingle()
    if (!parent) return NOT_FOUND()

    if (!session && !parsed.data.guestname?.trim()) {
      return err('Nama wajib diisi untuk komentar tamu.')
    }

    let displayName = parsed.data.guestname?.trim() || 'Anonim'
    let avatarUrl: string | null = null

    if (session?.id) {
      const { data: u } = await adminDb()
        .from('users').select('username,displayname,avatarurl').eq('id', session.id).maybeSingle()
      displayName = u?.displayname ?? u?.username ?? displayName
      avatarUrl   = u?.avatarurl ?? null
    }

    const { data, error } = await adminDb()
      .from('post_comments')
      .insert({
        postid:    post.id,
        parentid:  commentId,
        userid:    session?.id ?? null,
        username:  displayName,
        avatarurl: avatarUrl,
        content:   parsed.data.content.trim(),
        isdeleted: false,
      })
      .select('id,parentid,userid,username,avatarurl,content,createdat')
      .single()

    if (error) return err(error.message)

    return ok({
      id:        data.id,
      parentid:  data.parentid,
      userid:    data.userid,
      guestname: data.username,
      content:   data.content,
      createdat: data.createdat,
      author:    data.userid
        ? { username: data.username, displayname: data.username, avatarurl: data.avatarurl }
        : null,
      replies: [],
    }, 201)
  } catch { return SERVER_ERROR() }
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
}
