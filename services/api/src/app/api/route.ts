import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const START_TIME = Date.now();

/** GET /api — health check */
export async function GET() {
  return NextResponse.json({
    data: {
      status: "ok",
      version: "0.1.0",
      service: "soraku-api",
      uptime: Math.floor((Date.now() - START_TIME) / 1000),
      endpoints: [
        // Community
        "GET  /api/community",
        "GET  /api/community/users",
        "GET  /api/community/users/:username",
        "PATCH /api/community/users/:username",
        "GET  /api/community/blog",
        "GET  /api/community/blog/:slug",
        "POST /api/community/blog/:slug/likes",
        "POST /api/community/blog/:slug/views",
        "GET  /api/community/blog/:slug/comments",
        "POST /api/community/blog/:slug/comments",
        "POST /api/community/blog/:slug/comments/:id/reply",
        "GET  /api/community/events",
        "GET  /api/community/events/:slug",
        "GET  /api/community/vtubers",
        "GET  /api/community/vtubers/:slug",
        "GET  /api/community/gallery",
        "POST /api/community/gallery",
        "GET  /api/community/premium",
        "POST /api/community/donate/xendit/create",
        "POST /api/community/donate/xendit/webhook",
        "POST /api/community/donate/trakteer",
        // Stream
        "GET  /api/stream",
        "GET  /api/stream/sources",
        "GET  /api/stream/:slug",
        "GET  /api/stream/:slug/:episode",
        "GET  /api/stream/watch-history",
        "POST /api/stream/watch-history",
        "GET  /api/stream/favorites",
        "POST /api/stream/favorites",
        "DELETE /api/stream/favorites/:animeId",
      ],
    },
    error: null,
  });
}
