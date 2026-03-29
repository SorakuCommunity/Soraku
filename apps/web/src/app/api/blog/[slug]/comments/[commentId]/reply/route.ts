export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { ok, err, NOT_FOUND, SERVER_ERROR } from '@/lib/api'
import { z } from 'zod'

const ReplySchema = z.object({
  content: z.string().min(1).max(2000),
})

function normalizeComment(c: any) {
  return {
    id: c.id ?? '',
    parentid: c.parentid ?? null,
    userid: c.userid ?? c.authorid ?? null,
    guestname: c.guestname ?? null,
    content: c.content ?? '',
    createdat: c.createdat ?? new Date().toISOString(),
    author: null,
    replies: [],
  }
}

// POST /api/blog/[slug]/comments/[commentId]/reply — requires login
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; commentId: string }> }
) {
  try {
    const { slug, commentId } = await params
    const session = await getSession()

    if (!session?.id) return err('Harus login untuk membalas.', 401)

    const body = await req.json()
    const parsed = ReplySchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    // Get post
    const { data: post } = await adminDb()
      .from('posts')
      .select('id')
      .eq('slug', slug)
      .eq('ispublished', true)
      .maybeSingle()
    if (!post) return NOT_FOUND()

    // Verify parent comment exists
    const { data: parent } = await adminDb()
      .from('postcomments')
      .select('id')
      .eq('id', commentId)
      .maybeSingle()
    if (!parent) return NOT_FOUND()

    // Insert reply with minimal columns
    const { data, error } = await adminDb()
      .from('postcomments')
      .insert({
        postid: post.id,
        parentid: commentId,
        userid: session.id,
        content: parsed.data.content.trim(),
      })
      .select('*')
      .single()

    if (error) {
      console.error('[reply POST]', error.message)
      return err(error.message)
    }

    const { data: u } = await adminDb()
      .from('users')
      .select('username,displayname,avatarurl')
      .eq('id', session.id)
      .maybeSingle()

    return ok({ ...normalizeComment(data), author: u ?? null }, 201)
  } catch (e: any) {
    console.error('[reply POST exception]', e)
    return SERVER_ERROR()
  }
}
