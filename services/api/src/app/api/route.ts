import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const START_TIME = Date.now()

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fde5c0a (fix(blog): correct path apps/web/src + blog overhaul + events fixes)
/** GET /api — health check */
export async function GET() {
  return NextResponse.json({
    data: {
      status:  "ok",
      version: "0.1.0",
      service: "soraku-api",
      uptime:  Math.floor((Date.now() - START_TIME) / 1000),
      endpoints: [
        "GET  /api",
        "GET  /api/users/:username",
        "PATCH /api/users/:username",
        "GET  /api/premium",
        "GET  /api/vtubers",
        "GET  /api/vtubers/:slug",
        "GET  /api/events",
        "GET  /api/events/:slug",
        "GET  /api/blog",
        "GET  /api/blog/:slug",
        "GET  /api/blog/:slug/views",
        "POST /api/blog/:slug/views",
        "GET  /api/blog/:slug/likes",
        "POST /api/blog/:slug/likes",
        "GET  /api/blog/:slug/comments",
        "POST /api/blog/:slug/comments",
        "POST /api/blog/:slug/comments/:id/reply",
        "GET  /api/gallery",
        "GET  /api/stream",
        "GET  /api/stream?anime=true&q=:query&source=:source",
        "GET  /api/stream/:slug",
        "GET  /api/stream/:episodeId?anime=true&source=:source",
        "GET  /api/stream/sources",
        "POST /api/donate/xendit/create",
        "POST /api/donate/xendit/webhook",
        "POST /api/donate/trakteer",
      ],
    },
    error: null,
  })
<<<<<<< HEAD
=======
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
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
=======
>>>>>>> fde5c0a (fix(blog): correct path apps/web/src + blog overhaul + events fixes)
}
