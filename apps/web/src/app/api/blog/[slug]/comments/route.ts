export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { ok, err, NOT_FOUND, SERVER_ERROR } from '@/lib/api'
import { z } from 'zod'

const CommentSchema = z.object({
  content:   z.string().min(1).max(2000),
  parentid:  z.string().uuid().optional(),
  guestname: z.string().max(50).optional(),
})

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

    const { data: comments } = await adminDb()
      .from('postcomments')
      .select('id,parentid,userid,guestname,content,createdat')
      .eq('postid', post.id)
      .order('createdat', { ascending: true })

    const userIds = [...new Set((comments ?? []).filter(c => c.userid).map(c => c.userid!))]
    let usersMap: Record<string, { username: string | null; displayname: string | null; avatarurl: string | null }> = {}

    if (userIds.length > 0) {
      const { data: users } = await adminDb()
        .from('users').select('id,username,displayname,avatarurl').in('id', userIds)
      if (users) usersMap = Object.fromEntries(users.map(u => [u.id, u]))
    }

    const enriched = (comments ?? []).map(c => ({
      ...c,
      author: c.userid ? usersMap[c.userid] ?? null : null,
    }))

    const top     = enriched.filter(c => !c.parentid)
    const replies = enriched.filter(c =>  c.parentid)
    const threaded = top.map(c => ({
      ...c,
      replies: replies.filter(r => r.parentid === c.id),
    }))

    return ok({ comments: threaded, total: enriched.length })
  } catch { return SERVER_ERROR() }
}

// POST /api/blog/[slug]/comments
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session  = await getSession()
    const body     = await req.json()
    const parsed   = CommentSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    const { data: post } = await adminDb()
      .from('posts').select('id').eq('slug', slug).eq('ispublished', true).maybeSingle()
    if (!post) return NOT_FOUND()

    // Require name for guest
    if (!session && !parsed.data.guestname?.trim()) {
      return err('Nama wajib diisi untuk komentar tamu.')
    }

    const insertPayload: Record<string, unknown> = {
      postid:   post.id,
      parentid: parsed.data.parentid ?? null,
      userid:   session?.id ?? null,
      content:  parsed.data.content.trim(),
    }

    // Only add guestname if not logged in (column may exist)
    if (!session) {
      insertPayload.guestname = parsed.data.guestname?.trim() ?? 'Anonim'
    }

    const { data, error } = await adminDb()
      .from('postcomments')
      .insert(insertPayload)
      .select('id,parentid,userid,guestname,content,createdat')
      .single()

    if (error) {
      // If guestname column doesn't exist yet, retry without it
      if (error.message?.includes('guestname')) {
        delete insertPayload.guestname
        const { data: data2, error: error2 } = await adminDb()
          .from('postcomments')
          .insert(insertPayload)
          .select('id,parentid,userid,content,createdat')
          .single()
        if (error2) return err(error2.message)
        const name = parsed.data.guestname?.trim() ?? 'Anonim'
        let author2 = null
        if (session?.id) {
          const { data: u } = await adminDb()
            .from('users').select('username,displayname,avatarurl').eq('id', session.id).maybeSingle()
          author2 = u
        }
        return ok({ ...data2, guestname: session ? null : name, author: author2, replies: [] }, 201)
      }
      return err(error.message)
    }

    let author = null
    if (session?.id) {
      const { data: u } = await adminDb()
        .from('users').select('username,displayname,avatarurl').eq('id', session.id).maybeSingle()
      author = u
    }

    return ok({ ...data, author, replies: [] }, 201)
  } catch { return SERVER_ERROR() }
}
