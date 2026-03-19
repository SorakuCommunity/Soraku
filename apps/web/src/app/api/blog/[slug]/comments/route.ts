export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { ok, err, NOT_FOUND, SERVER_ERROR } from '@/lib/api'
import { z } from 'zod'

const CommentSchema = z.object({
<<<<<<< HEAD
  content:  z.string().min(1).max(2000),
})

function normalizeComment(c: any) {
  return {
    id:        c.id ?? '',
    parentid:  c.parentid ?? null,
    userid:    c.userid ?? c.authorid ?? null,
    guestname: c.guestname ?? c.username ?? null,
    content:   c.content ?? '',
    createdat: c.createdat ?? c.createdat ?? new Date().toISOString(),
    author:    null,
    replies:   [],
  }
}

=======
  content:   z.string().min(1).max(2000),
  parentid:  z.string().uuid().optional(),
  guestname: z.string().max(50).optional(), // nama tamu
})

>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
// GET /api/blog/[slug]/comments
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { data: post } = await adminDb()
      .from('posts').select('id').eq('slug', slug).eq('ispublished', true).maybeSingle()
    if (!post) return NOT_FOUND()

<<<<<<< HEAD
<<<<<<< HEAD
    // Use * to get all columns regardless of schema
    const { data: rawComments, error: ce } = await adminDb()
      .from('postcomments')
      .select('*')
      .eq('postid', post.id)
      .order('createdat', { ascending: true })

    if (ce) {
      console.error('[comments GET]', ce.message)
      return ok({ comments: [], total: 0 })
    }

    const comments = (rawComments ?? []).map(normalizeComment)

    // Fetch user info
    const userIds = [...new Set(comments.filter(c => c.userid).map(c => c.userid!))]
    let usersMap: Record<string, any> = {}
    if (userIds.length > 0) {
      const { data: users } = await adminDb()
        .from('users').select('id,username,displayname,avatarurl').in('id', userIds)
      if (users) usersMap = Object.fromEntries(users.map(u => [u.id, u]))
    }

    const enriched = comments.map(c => ({
=======
    const { data: comments } = await adminDb()
=======
    const { data: comments, error } = await adminDb()
>>>>>>> 8a05456 (fix+feat(blog): comments fix, like animation, hapus hashtags, related posts)
      .from('post_comments')
      .select('id,parentid,userid,username,avatarurl,content,createdat')
      .eq('postid', post.id)
      .eq('isdeleted', false)
      .order('createdat', { ascending: true })

    if (error) return SERVER_ERROR()

    // Normalise ke format client (author field)
    const enriched = (comments ?? []).map(c => ({
<<<<<<< HEAD
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
      ...c,
      author: c.userid ? usersMap[c.userid] ?? null : null,
    }))

<<<<<<< HEAD
    const top     = enriched.filter(c => !c.parentid)
    const replies = enriched.filter(c =>  c.parentid)
=======
    // Build threaded structure: top-level + replies
    const top     = enriched.filter(c => !c.parentid)
    const replies = enriched.filter(c =>  c.parentid)

>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
=======
      id:        c.id,
      parentid:  c.parentid,
      userid:    c.userid,
      guestname: c.username, // username = nama tampil
      content:   c.content,
      createdat: c.createdat,
      author:    c.userid
        ? { username: c.username, displayname: c.username, avatarurl: c.avatarurl }
        : null,
    }))

    const top     = enriched.filter(c => !c.parentid)
    const replies = enriched.filter(c =>  c.parentid)
>>>>>>> 8a05456 (fix+feat(blog): comments fix, like animation, hapus hashtags, related posts)
    const threaded = top.map(c => ({
      ...c,
      replies: replies.filter(r => r.parentid === c.id),
    }))

    return ok({ comments: threaded, total: enriched.length })
<<<<<<< HEAD
  } catch (e: any) {
    console.error('[comments GET exception]', e)
    return ok({ comments: [], total: 0 })
  }
}

// POST /api/blog/[slug]/comments — requires login
=======
  } catch { return SERVER_ERROR() }
}

// POST /api/blog/[slug]/comments
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
<<<<<<< HEAD
    const { slug } = await params
    const session  = await getSession()
<<<<<<< HEAD

    if (!session?.id) return err('Harus login untuk berkomentar.', 401)

=======
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
    const body     = await req.json()
    const parsed   = CommentSchema.safeParse(body)
=======
    const { slug }  = await params
    const session   = await getSession()
    const body      = await req.json()
    const parsed    = CommentSchema.safeParse(body)
>>>>>>> 8a05456 (fix+feat(blog): comments fix, like animation, hapus hashtags, related posts)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    const { data: post } = await adminDb()
      .from('posts').select('id').eq('slug', slug).eq('ispublished', true).maybeSingle()
    if (!post) return NOT_FOUND()

<<<<<<< HEAD
<<<<<<< HEAD
    // Try with minimal columns first
    const { data, error } = await adminDb()
      .from('postcomments')
      .insert({ postid: post.id, userid: session.id, content: parsed.data.content.trim() })
      .select('*')
      .single()

    if (error) {
      console.error('[comments POST]', error.message)
      return err(error.message)
    }

    const { data: u } = await adminDb()
      .from('users').select('username,displayname,avatarurl').eq('id', session.id).maybeSingle()

    return ok({ ...normalizeComment(data), author: u ?? null, replies: [] }, 201)
  } catch (e: any) {
    console.error('[comments POST exception]', e)
    return SERVER_ERROR()
  }
=======
    if (!session && !parsed.data.guestname?.trim()) {
=======
    // Tentukan username dan avatarurl
    let displayName = parsed.data.guestname?.trim() || 'Anonim'
    let avatarUrl: string | null = null

    if (session?.id) {
      const { data: u } = await adminDb()
        .from('users').select('username,displayname,avatarurl').eq('id', session.id).maybeSingle()
      displayName = u?.displayname ?? u?.username ?? displayName
      avatarUrl   = u?.avatarurl ?? null
    } else if (!parsed.data.guestname?.trim()) {
>>>>>>> 8a05456 (fix+feat(blog): comments fix, like animation, hapus hashtags, related posts)
      return err('Nama wajib diisi untuk komentar tamu.')
    }

    const { data, error } = await adminDb()
      .from('post_comments')
      .insert({
        postid:    post.id,
        parentid:  parsed.data.parentid ?? null,
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
