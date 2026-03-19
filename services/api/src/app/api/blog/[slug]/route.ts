import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { posts, users } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export const dynamic = "force-dynamic"

// GET /api/blog/:slug
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.ispublished, true)))
    .limit(1)

  if (!post) return NextResponse.json({ data: null, error: "Post not found" }, { status: 404 })

  // Fetch author
  let author = null
  if (post.authorid) {
    const [u] = await db
      .select({ username: users.username, displayname: users.displayname, avatarurl: users.avatarurl })
      .from(users).where(eq(users.id, post.authorid)).limit(1)
    author = u ?? null
  }

  return NextResponse.json({ data: { ...post, author }, error: null })
}
