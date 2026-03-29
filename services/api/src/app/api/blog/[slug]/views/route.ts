import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { eq, and, sql } from "drizzle-orm"

export const dynamic = "force-dynamic"

// POST /api/blog/:slug/views — increment view
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const [post] = await db.select({ id: posts.id, viewcount: posts.viewcount })
    .from(posts).where(and(eq(posts.slug, slug), eq(posts.ispublished, true))).limit(1)
  if (!post) return NextResponse.json({ data: null, error: "Not found" }, { status: 404 })

  await db.update(posts)
    .set({ viewcount: sql`${posts.viewcount} + 1` })
    .where(eq(posts.id, post.id))

  return NextResponse.json({ data: { viewcount: (post.viewcount ?? 0) + 1 }, error: null })
}

// GET /api/blog/:slug/views
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const [post] = await db.select({ viewcount: posts.viewcount })
    .from(posts).where(and(eq(posts.slug, slug), eq(posts.ispublished, true))).limit(1)
  if (!post) return NextResponse.json({ data: null, error: "Not found" }, { status: 404 })
  return NextResponse.json({ data: { viewcount: post.viewcount ?? 0 }, error: null })
}
