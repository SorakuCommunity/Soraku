import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { streamcontent, users } from "@/lib/db/schema";
import { verifyAuth } from "@/lib/auth";
import { getAnimeDetail, getEpisodeStream } from "@/lib/anime";
import { withCache, TTL } from "@/lib/cache";
import type { AnimeSource } from "@soraku/types";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/stream/:slug - Anime detail/stream OR Soraku VOD content
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!db) {
    return NextResponse.json(
      { data: null, error: "Database not configured" },
      { status: 503 },
    );
  }
  const { slug } = await params;
  const { searchParams } = new URL(req.url);

  // Anime detail/stream mode
  if (searchParams.get("anime") === "true") {
    const source = (searchParams.get("source") ?? "hianime") as AnimeSource;
    const isInfo = searchParams.get("info") === "true";
    const quality = (searchParams.get("quality") ?? "auto") as
      | "auto"
      | "1080p"
      | "720p"
      | "360p";

    if (isInfo) {
      const cacheKey = `anime:detail:${source}:${slug}`;
      const detail = await withCache(cacheKey, TTL.DETAIL, () =>
        getAnimeDetail(slug, source),
      );
      if (!detail)
        return NextResponse.json(
          { data: null, error: "Anime tidak ditemukan" },
          { status: 404 },
        );
      return NextResponse.json({ data: detail, error: null });
    }

    // Episode stream
    const cacheKey = `anime:stream:${source}:${slug}:${quality}`;
    const stream = await withCache(cacheKey, TTL.STREAM, () =>
      getEpisodeStream(slug, source, quality),
    );
    if (!stream)
      return NextResponse.json(
        { data: null, error: "Stream tidak tersedia" },
        { status: 404 },
      );
    return NextResponse.json({ data: stream, error: null });
  }

  // Soraku DB mode (VTuber VODs)
  const [content] = await db
    .select()
    .from(streamcontent)
    .where(
      and(eq(streamcontent.slug, slug), eq(streamcontent.status, "published")),
    )
    .limit(1);

  if (!content)
    return NextResponse.json(
      { data: null, error: "Konten tidak ditemukan" },
      { status: 404 },
    );

  if (content.ispremium) {
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

  db.update(streamcontent)
    .set({ viewcount: (content.viewcount ?? 0) + 1 })
    .where(eq(streamcontent.id, content.id))
    .catch(() => {});

  return NextResponse.json({ data: content, error: null });
}
