export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { ok, err, NOT_FOUND, SERVER_ERROR } from '@/lib/api'
import { z } from 'zod'

const ReplySchema = z.object({
  content:   z.string().min(1).max(2000),
  guestname: z.string().max(50).optional(),
})

// POST /api/blog/[slug]/comments/[commentId]/reply
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; commentId: string }> }
) {
  try {
    const { slug, commentId } = await params
    const session = await getSession()
    const body    = await req.json()
    const parsed  = ReplySchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    const { data: post } = await adminDb()
      .from('posts').select('id').eq('slug', slug).eq('ispublished', true).maybeSingle()
    if (!post) return NOT_FOUND()

    const { data: parent } = await adminDb()
      .from('post_comments').select('id').eq('id', commentId).eq('postid', post.id).maybeSingle()
    if (!parent) return NOT_FOUND()

    if (!session && !parsed.data.guestname?.trim()) {
      return err('Nama wajib diisi untuk komentar tamu.')
    }

    const { data, error } = await adminDb()
      .from('post_comments')
      .insert({
        postid:    post.id,
        parentid:  commentId,
        userid:    session?.id ?? null,
        guestname: session ? null : (parsed.data.guestname?.trim() ?? 'Anonim'),
        content:   parsed.data.content.trim(),
      })
      .select('id,parentid,userid,guestname,content,createdat')
      .single()

    if (error) return err(error.message)

    let author = null
    if (session?.id) {
      const { data: u } = await adminDb()
        .from('users').select('username,displayname,avatarurl').eq('id', session.id).maybeSingle()
      author = u
    }

    return ok({ ...data, author }, 201)
  } catch { return SERVER_ERROR() }
}
