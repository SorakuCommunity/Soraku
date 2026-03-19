import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const START_TIME = Date.now()

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
}
