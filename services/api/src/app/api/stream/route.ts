import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { streamcontent, users } from "@/lib/db/schema";
import { StreamQuerySchema, AnimeSearchQuerySchema } from "@/lib/validators";
import { verifyAuth } from "@/lib/auth";
import { searchAnime, getAvailableSources } from "@/lib/anime";
import { withCache, TTL } from "@/lib/cache";
import { eq, and, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/stream - Anime search OR Soraku internal streaming
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Anime search mode
  if (searchParams.get("anime") === "true") {
    // Sources health check
    if (searchParams.get("sources") === "true") {
      const sources = await withCache(
        "anime:sources",
        TTL.SOURCES,
        getAvailableSources,
      );
      return NextResponse.json({ data: sources, error: null });
    }

    const parsed = AnimeSearchQuerySchema.safeParse(
      Object.fromEntries(searchParams),
    );
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.issues[0]?.message },
        { status: 400 },
      );
    }

    const { q, source, page } = parsed.data;
    const cacheKey = `anime:search:${source}:${q.toLowerCase().trim()}:${page}`;
    const results = await withCache(cacheKey, TTL.SEARCH, () =>
      searchAnime(q, source, page),
    );

    return NextResponse.json({ data: results, error: null });
  }

  // Soraku DB mode (VTuber VODs)
  const parsed = StreamQuerySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: parsed.error.issues[0]?.message },
      { status: 400 },
    );
  }

  const { type, vtuberid, ispremium, page, limit } = parsed.data;
  const offset = (page - 1) * limit;

  if (ispremium) {
    const auth = await verifyAuth(req);
    if ("error" in auth)
      return NextResponse.json(
        { data: null, error: "Login dulu" },
        { status: 401 },
      );
    const userId =
      "userId" in auth && typeof auth.userId === "string" ? auth.userId : null;
    if (userId) {
      const [user] = await db
        .select({
          supporterrole: users.supporterrole,
          supporteruntil: users.supporteruntil,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      const isActive =
        user?.supporterrole &&
        (!user.supporteruntil || user.supporteruntil > new Date());
      if (!isActive)
        return NextResponse.json(
          { data: null, error: "Butuh subscription premium" },
          { status: 403 },
        );
    }
  }

  const rows = await db
    .select({
      id: streamcontent.id,
      slug: streamcontent.slug,
      title: streamcontent.title,
      description: streamcontent.description,
      thumbnailurl: streamcontent.thumbnailurl,
      duration: streamcontent.duration,
      type: streamcontent.type,
      vtuberid: streamcontent.vtuberid,
      tags: streamcontent.tags,
      viewcount: streamcontent.viewcount,
      ispremium: streamcontent.ispremium,
      createdat: streamcontent.createdat,
    })
    .from(streamcontent)
    .where(
      and(
        eq(streamcontent.status, "published"),
        type ? eq(streamcontent.type, type) : undefined,
        vtuberid ? eq(streamcontent.vtuberid, vtuberid) : undefined,
        ispremium !== undefined
          ? eq(streamcontent.ispremium, ispremium)
          : undefined,
      ),
    )
    .orderBy(desc(streamcontent.createdat))
    .limit(limit)
    .offset(offset);

  return NextResponse.json({ data: rows, error: null });
}
