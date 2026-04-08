import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { BlogQuerySchema } from "@/lib/validators";
import { eq, and, ilike, desc, sql, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/community/blog
export async function GET(req: NextRequest) {
  if (!db) {
    return NextResponse.json(
      { data: null, error: "Database not configured" },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(req.url);
  const parsed = BlogQuerySchema.safeParse(Object.fromEntries(searchParams));

  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: parsed.error.issues[0]?.message },
      { status: 400 },
    );
  }

  const { tag, search, page, limit } = parsed.data;
  const offset = (page - 1) * limit;

  const rows = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      coverurl: posts.coverurl,
      tags: posts.tags,
      publishedat: posts.publishedat,
      authorid: posts.authorid,
      viewcount: posts.viewcount,
      likecount: posts.likecount,
    })
    .from(posts)
    .where(
      and(
        eq(posts.ispublished, true),
        search ? ilike(posts.title, `%${search}%`) : undefined,
        tag ? sql`${tag} = ANY(${posts.tags})` : undefined,
      ),
    )
    .orderBy(desc(posts.publishedat))
    .limit(limit)
    .offset(offset);

  const authorIds = [
    ...new Set(rows.filter((r) => r.authorid).map((r) => r.authorid!)),
  ];
  let authorsMap: Record<
    string,
    {
      username: string | null;
      displayname: string | null;
      avatarurl: string | null;
    }
  > = {};

  if (authorIds.length > 0) {
    const authors = await db
      .select({
        id: users.id,
        username: users.username,
        displayname: users.displayname,
        avatarurl: users.avatarurl,
      })
      .from(users)
      .where(inArray(users.id, authorIds));
    authorsMap = Object.fromEntries(authors.map((u) => [u.id, u]));
  }

  const result = rows.map((r) => ({
    ...r,
    author: r.authorid ? (authorsMap[r.authorid] ?? null) : null,
  }));

  return NextResponse.json({ data: result, error: null });
}
