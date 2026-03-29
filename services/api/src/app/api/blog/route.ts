import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
<<<<<<< HEAD
<<<<<<< HEAD
import { posts, users } from "@/lib/db/schema"
import { BlogQuerySchema } from "@/lib/validators"
import { eq, and, ilike, desc, sql, inArray } from "drizzle-orm"
=======
import { posts, post_comments, users } from "@/lib/db/schema"
import { verifyAuth } from "@/lib/auth"
import { eq, and, asc, inArray } from "drizzle-orm"
import { z } from "zod"
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
=======
import { posts, users } from "@/lib/db/schema"
import { BlogQuerySchema } from "@/lib/validators"
import { eq, and, ilike, desc, sql, inArray } from "drizzle-orm"
>>>>>>> fde5c0a (fix(blog): correct path apps/web/src + blog overhaul + events fixes)

export const dynamic = "force-dynamic"

// GET /api/blog
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const parsed = BlogQuerySchema.safeParse(Object.fromEntries(searchParams))
  if (!parsed.success) return NextResponse.json({ data: null, error: parsed.error.issues[0]?.message }, { status: 400 })

  const { tag, search, page, limit } = parsed.data
  const offset = (page - 1) * limit

  const rows = await db
    .select({
      id:          posts.id,
      slug:        posts.slug,
      title:       posts.title,
      excerpt:     posts.excerpt,
      coverurl:    posts.coverurl,
      tags:        posts.tags,
      publishedat: posts.publishedat,
      authorid:    posts.authorid,
      viewcount:   posts.viewcount,
      likecount:   posts.likecount,
    })
    .from(posts)
    .where(and(
      eq(posts.ispublished, true),
      search ? ilike(posts.title, `%${search}%`) : undefined,
      tag    ? sql`${tag} = ANY(${posts.tags})` : undefined,
    ))
    .orderBy(desc(posts.publishedat))
    .limit(limit)
    .offset(offset)

  // Fetch authors
  const authorIds = [...new Set(rows.filter(r => r.authorid).map(r => r.authorid!))]
  let authorsMap: Record<string, { username: string | null; displayname: string | null; avatarurl: string | null }> = {}
  if (authorIds.length > 0) {
    const authors = await db
      .select({ id: users.id, username: users.username, displayname: users.displayname, avatarurl: users.avatarurl })
      .from(users)
      .where(inArray(users.id, authorIds))
    authorsMap = Object.fromEntries(authors.map(u => [u.id, u]))
  }

  const result = rows.map(r => ({
    ...r,
    author: r.authorid ? authorsMap[r.authorid] ?? null : null,
  }))

<<<<<<< HEAD
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

<<<<<<< HEAD
  const rows = await db
    .select({
      id:          posts.id,
      slug:        posts.slug,
      title:       posts.title,
      excerpt:     posts.excerpt,
      coverurl:    posts.coverurl,
      tags:        posts.tags,
      publishedat: posts.publishedat,
      authorid:    posts.authorid,
      viewcount:   posts.viewcount,
      likecount:   posts.likecount,
    })
    .from(posts)
    .where(and(
      eq(posts.ispublished, true),
      search ? ilike(posts.title, `%${search}%`) : undefined,
      tag    ? sql`${tag} = ANY(${posts.tags})` : undefined,
    ))
    .orderBy(desc(posts.publishedat))
    .limit(limit)
    .offset(offset)

  // Fetch authors
  const authorIds = [...new Set(rows.filter(r => r.authorid).map(r => r.authorid!))]
  let authorsMap: Record<string, { username: string | null; displayname: string | null; avatarurl: string | null }> = {}
  if (authorIds.length > 0) {
    const authors = await db
      .select({ id: users.id, username: users.username, displayname: users.displayname, avatarurl: users.avatarurl })
      .from(users)
      .where(inArray(users.id, authorIds))
    authorsMap = Object.fromEntries(authors.map(u => [u.id, u]))
  }

  const result = rows.map(r => ({
    ...r,
    author: r.authorid ? authorsMap[r.authorid] ?? null : null,
  }))

  return NextResponse.json({ data: result, error: null })
=======
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
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
=======
  return NextResponse.json({ data: result, error: null })
>>>>>>> fde5c0a (fix(blog): correct path apps/web/src + blog overhaul + events fixes)
}
