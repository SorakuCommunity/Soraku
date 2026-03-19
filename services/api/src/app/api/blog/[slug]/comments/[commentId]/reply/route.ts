import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { posts, post_comments, users } from "@/lib/db/schema"
import { verifyAuth } from "@/lib/auth"
import { eq, and } from "drizzle-orm"
import { z } from "zod"

export const dynamic = "force-dynamic"

const ReplySchema = z.object({
  content:   z.string().min(1).max(2000),
  guestname: z.string().max(50).optional(),
})

// POST /api/blog/:slug/comments/:commentId/reply
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; commentId: string }> }
) {
  const { slug, commentId } = await params
  const body   = await req.json()
  const parsed = ReplySchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ data: null, error: parsed.error.issues[0]?.message }, { status: 400 })

  const [post] = await db.select({ id: posts.id })
    .from(posts).where(and(eq(posts.slug, slug), eq(posts.ispublished, true))).limit(1)
  if (!post) return NextResponse.json({ data: null, error: "Not found" }, { status: 404 })

  const [parent] = await db.select({ id: post_comments.id })
    .from(post_comments).where(and(eq(post_comments.id, commentId), eq(post_comments.postid, post.id))).limit(1)
  if (!parent) return NextResponse.json({ data: null, error: "Parent comment not found" }, { status: 404 })

  const auth   = await verifyAuth(req)
  const userId = "userId" in auth ? auth.userId : null

  if (!userId && !parsed.data.guestname?.trim()) {
    return NextResponse.json({ data: null, error: "Nama wajib diisi untuk komentar tamu." }, { status: 400 })
  }

  const [inserted] = await db.insert(post_comments).values({
    postid:    post.id,
    parentid:  commentId,
    userid:    userId ?? null,
    guestname: userId ? null : (parsed.data.guestname?.trim() ?? "Anonim"),
    content:   parsed.data.content.trim(),
  }).returning()

  let author = null
  if (userId) {
    const [u] = await db
      .select({ username: users.username, displayname: users.displayname, avatarurl: users.avatarurl })
      .from(users).where(eq(users.id, userId)).limit(1)
    author = u ?? null
  }

  return NextResponse.json({ data: { ...inserted, author }, error: null }, { status: 201 })
}
