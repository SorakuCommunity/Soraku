export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { ok, err, NOT_FOUND, SERVER_ERROR } from '@/lib/api'
import { z } from 'zod'

const CommentSchema = z.object({
  content: z.string().min(1).max(2000),
})

function normalizeComment(c: any) {
  return {
    id: c.id ?? '',
    parentid: c.parentid ?? null,
    userid: c.userid ?? c.authorid ?? null,
    guestname: c.guestname ?? c.username ?? null,
    content: c.content ?? '',
    createdat: c.createdat ?? c.createdat ?? new Date().toISOString(),
    author: null,
    replies: [],
  }
}

// GET /api/blog/[slug]/comments
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { data: post } = await adminDb()
      .from('posts')
      .select('id')
      .eq('slug', slug)
      .eq('ispublished', true)
      .maybeSingle()
    if (!post) return NOT_FOUND()

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
    const userIds = [...new Set(comments.filter((c) => c.userid).map((c) => c.userid!))]
    let usersMap: Record<string, any> = {}
    if (userIds.length > 0) {
      const { data: users } = await adminDb()
        .from('users')
        .select('id,username,displayname,avatarurl')
        .in('id', userIds)
      if (users) usersMap = Object.fromEntries(users.map((u) => [u.id, u]))
    }

    const enriched = comments.map((c) => ({
      ...c,
      author: c.userid ? (usersMap[c.userid] ?? null) : null,
    }))

    const top = enriched.filter((c) => !c.parentid)
    const replies = enriched.filter((c) => c.parentid)
    const threaded = top.map((c) => ({
      ...c,
      replies: replies.filter((r) => r.parentid === c.id),
    }))

    return ok({ comments: threaded, total: enriched.length })
  } catch (e: any) {
    console.error('[comments GET exception]', e)
    return ok({ comments: [], total: 0 })
  }
}

// POST /api/blog/[slug]/comments — requires login
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const session = await getSession()

    if (!session?.id) return err('Harus login untuk berkomentar.', 401)

    const body = await req.json()
    const parsed = CommentSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    const { data: post } = await adminDb()
      .from('posts')
      .select('id')
      .eq('slug', slug)
      .eq('ispublished', true)
      .maybeSingle()
    if (!post) return NOT_FOUND()

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
      .from('users')
      .select('username,displayname,avatarurl')
      .eq('id', session.id)
      .maybeSingle()

    return ok({ ...normalizeComment(data), author: u ?? null, replies: [] }, 201)
  } catch (e: any) {
    console.error('[comments POST exception]', e)
    return SERVER_ERROR()
  }
}
