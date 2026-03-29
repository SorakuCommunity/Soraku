import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { posts, post_likes } from "@/lib/db/schema"
import { verifyAuth } from "@/lib/auth"
import { eq, and, sql } from "drizzle-orm"

export const dynamic = "force-dynamic"

// GET /api/blog/:slug/likes
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const [post] = await db.select({ id: posts.id, likecount: posts.likecount })
    .from(posts).where(and(eq(posts.slug, slug), eq(posts.ispublished, true))).limit(1)
  if (!post) return NextResponse.json({ data: null, error: "Not found" }, { status: 404 })

  // Check if current user liked
  let liked = false
  const auth = await verifyAuth(req)
  if ("userId" in auth && auth.userId) {
    const [existing] = await db.select({ id: post_likes.id })
      .from(post_likes)
      .where(and(eq(post_likes.postid, post.id), eq(post_likes.userid, auth.userId)))
      .limit(1)
    liked = !!existing
  }

  return NextResponse.json({ data: { likecount: post.likecount ?? 0, liked }, error: null })
}

// POST /api/blog/:slug/likes — toggle like
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const [post] = await db.select({ id: posts.id, likecount: posts.likecount })
    .from(posts).where(and(eq(posts.slug, slug), eq(posts.ispublished, true))).limit(1)
  if (!post) return NextResponse.json({ data: null, error: "Not found" }, { status: 404 })

  const auth = await verifyAuth(req)
  const userId = "userId" in auth ? auth.userId : null

  if (userId) {
    const [existing] = await db.select({ id: post_likes.id })
      .from(post_likes)
      .where(and(eq(post_likes.postid, post.id), eq(post_likes.userid, userId)))
      .limit(1)

    if (existing) {
      // Unlike
      await db.delete(post_likes).where(eq(post_likes.id, existing.id))
      await db.update(posts).set({ likecount: sql`GREATEST(0, ${posts.likecount} - 1)` }).where(eq(posts.id, post.id))
      const newCount = Math.max(0, (post.likecount ?? 0) - 1)
      return NextResponse.json({ data: { likecount: newCount, liked: false }, error: null })
    } else {
      // Like
      await db.insert(post_likes).values({ postid: post.id, userid: userId })
      await db.update(posts).set({ likecount: sql`${posts.likecount} + 1` }).where(eq(posts.id, post.id))
      const newCount = (post.likecount ?? 0) + 1
      return NextResponse.json({ data: { likecount: newCount, liked: true }, error: null })
    }
  } else {
    // Guest — just increment
    await db.update(posts).set({ likecount: sql`${posts.likecount} + 1` }).where(eq(posts.id, post.id))
    return NextResponse.json({ data: { likecount: (post.likecount ?? 0) + 1, liked: true }, error: null })
  }
}
