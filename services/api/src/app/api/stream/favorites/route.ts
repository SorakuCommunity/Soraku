import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/lib/auth";
import { streamDb } from "@/lib/db";
import { favorites } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

export const dynamic = "force-dynamic";

const FavoriteSchema = z.object({
  animeId: z.string(),
  title: z.string(),
  cover: z.string().optional(),
});

// GET /api/stream/favorites
export async function GET(req: NextRequest) {
  const auth = await verifyAuth(req);
  if ("error" in auth) return unauthorized();

  const userId = "userId" in auth ? auth.userId : null;
  if (!userId) return unauthorized();

  if (streamDb) {
    const userFavorites = await streamDb
      .select()
      .from(favorites)
      .where(eq(favorites.userid, userId))
      .orderBy(desc(favorites.addedat));

    return NextResponse.json({ data: userFavorites, error: null });
  }

  return NextResponse.json({ data: [], error: null });
}

// POST /api/stream/favorites
export async function POST(req: NextRequest) {
  const auth = await verifyAuth(req);
  if ("error" in auth) return unauthorized();

  const userId = "userId" in auth ? auth.userId : null;
  if (!userId) return unauthorized();

  const body = await req.json();
  const parsed = FavoriteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: parsed.error.issues[0]?.message },
      { status: 400 },
    );
  }

  const { animeId, title, cover } = parsed.data;

  if (streamDb) {
    // Check if already favorited
    const existing = await streamDb
      .select()
      .from(favorites)
      .where(and(eq(favorites.userid, userId), eq(favorites.animeid, animeId)))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ data: { saved: true }, error: null });
    }

    // Add to favorites
    await streamDb.insert(favorites).values({
      userid: userId,
      animeid: animeId,
      title: title,
      cover: cover,
    });

    return NextResponse.json({ data: { saved: true }, error: null });
  }

  return NextResponse.json(
    { data: null, error: "Streaming database not configured" },
    { status: 503 },
  );
}

// DELETE /api/stream/favorites?animeId=xxx
export async function DELETE(req: NextRequest) {
  const auth = await verifyAuth(req);
  if ("error" in auth) return unauthorized();

  const userId = "userId" in auth ? auth.userId : null;
  if (!userId) return unauthorized();

  const { searchParams } = new URL(req.url);
  const animeId = searchParams.get("animeId");

  if (!animeId) {
    return NextResponse.json(
      { data: null, error: "animeId is required" },
      { status: 400 },
    );
  }

  if (streamDb) {
    await streamDb
      .delete(favorites)
      .where(and(eq(favorites.userid, userId), eq(favorites.animeid, animeId)));

    return NextResponse.json({ data: { removed: true }, error: null });
  }

  return NextResponse.json(
    { data: null, error: "Streaming database not configured" },
    { status: 503 },
  );
}
