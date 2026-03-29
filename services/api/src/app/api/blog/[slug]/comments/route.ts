import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { posts, post_comments, users } from "@/lib/db/schema"
import { verifyAuth } from "@/lib/auth"
import { eq, and, asc, inArray } from "drizzle-orm"
import { z } from "zod"

export const dynamic = "force-dynamic"

const CommentSchema = z.object({
  content:   z.string().min(1).max(2000),
  parentid:  z.string().uuid().optional(),
  guestname: z.string().max(50).optional(),
})

// GET /api/blog/:slug/comments
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const [post] = await db.select({ id: posts.id })
    .from(posts).where(and(eq(posts.slug, slug), eq(posts.ispublished, true))).limit(1)
  if (!post) return NextResponse.json({ data: null, error: "Not found" }, { status: 404 })

  const comments = await db.select()
    .from(post_comments)
    .where(and(eq(post_comments.postid, post.id), eq(post_comments.isdeleted, false)))
    .orderBy(asc(post_comments.createdat))

  // Fetch authors
  const userIds = [...new Set(comments.filter(c => c.userid).map(c => c.userid!))]
  let authorsMap: Record<string, any> = {}
  if (userIds.length > 0) {
    const authors = await db
      .select({ id: users.id, username: users.username, displayname: users.displayname, avatarurl: users.avatarurl })
      .from(users).where(inArray(users.id, userIds))
    authorsMap = Object.fromEntries(authors.map(u => [u.id, u]))
  }

  const enriched = comments.map(c => ({
    ...c,
    author: c.userid ? authorsMap[c.userid] ?? null : null,
  }))

  // Thread structure
  const top     = enriched.filter(c => !c.parentid)
  const replies = enriched.filter(c =>  c.parentid)
  const threaded = top.map(c => ({
    ...c,
    replies: replies.filter(r => r.parentid === c.id),
  }))

  return NextResponse.json({ data: { comments: threaded, total: enriched.length }, error: null })
}

// POST /api/blog/:slug/comments
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const body   = await req.json()
  const parsed = CommentSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ data: null, error: parsed.error.issues[0]?.message }, { status: 400 })

  const [post] = await db.select({ id: posts.id })
    .from(posts).where(and(eq(posts.slug, slug), eq(posts.ispublished, true))).limit(1)
  if (!post) return NextResponse.json({ data: null, error: "Not found" }, { status: 404 })

  // Get user if authenticated (optional)
  const auth   = await verifyAuth(req)
  const userId = "userId" in auth ? auth.userId : null

  if (!userId && !parsed.data.guestname?.trim()) {
    return NextResponse.json({ data: null, error: "Nama wajib diisi untuk komentar tamu." }, { status: 400 })
  }

  const [inserted] = await db.insert(post_comments).values({
    postid:    post.id,
    parentid:  parsed.data.parentid ?? null,
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

  return NextResponse.json({ data: { ...inserted, author, replies: [] }, error: null }, { status: 201 })
}
