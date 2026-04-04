import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/lib/auth";
import { db, streamDb } from "@/lib/db";
import { watch_history } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

export const dynamic = "force-dynamic";

const WatchHistorySchema = z.object({
  animeId: z.string(),
  animeTitle: z.string(),
  cover: z.string().optional(),
  episode: z.number(),
  progress: z.number(),
  duration: z.number(),
  provider: z.string().optional(),
});

// GET /api/stream/watch-history
export async function GET(req: NextRequest) {
  const auth = await verifyAuth(req);
  if ("error" in auth) return unauthorized();

  const userId = "userId" in auth ? auth.userId : null;
  if (!userId) return unauthorized();

  // If streaming DB is configured, use it
  if (streamDb) {
    const history = await streamDb
      .select()
      .from(watch_history)
      .where(eq(watch_history.userid, userId))
      .orderBy(desc(watch_history.updatedat))
      .limit(50);

    return NextResponse.json({ data: history, error: null });
  }

  // Fallback: return empty if no streaming DB
  return NextResponse.json({ data: [], error: null });
}

// POST /api/stream/watch-history
export async function POST(req: NextRequest) {
  const auth = await verifyAuth(req);
  if ("error" in auth) return unauthorized();

  const userId = "userId" in auth ? auth.userId : null;
  if (!userId) return unauthorized();

  const body = await req.json();
  const parsed = WatchHistorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: parsed.error.issues[0]?.message },
      { status: 400 },
    );
  }

  const { animeId, animeTitle, cover, episode, progress, duration, provider } =
    parsed.data;

  // If streaming DB is configured, save to it
  if (streamDb) {
    // Check if already exists
    const existing = await streamDb
      .select()
      .from(watch_history)
      .where(eq(watch_history.userid, userId))
      .limit(1);

    if (existing.length > 0) {
      // Update existing
      await streamDb
        .update(watch_history)
        .set({
          animeid: animeId,
          animetitle: animeTitle,
          cover: cover,
          episode: episode,
          progress: progress,
          duration: duration,
          provider: provider ?? "hianime",
          updatedat: new Date(),
        })
        .where(eq(watch_history.userid, userId));
    } else {
      // Insert new
      await streamDb.insert(watch_history).values({
        userid: userId,
        animeid: animeId,
        animetitle: animeTitle,
        cover: cover,
        episode: episode,
        progress: progress,
        duration: duration,
        provider: provider ?? "hianime",
      });
    }

    return NextResponse.json({ data: { saved: true }, error: null });
  }

  // No streaming DB configured
  return NextResponse.json(
    { data: null, error: "Streaming database not configured" },
    { status: 503 },
  );
}
