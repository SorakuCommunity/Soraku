import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { events } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export const dynamic = "force-dynamic"

// GET /api/events/:slug
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const [event] = await db
    .select()
    .from(events)
    .where(and(eq(events.slug, slug), eq(events.ispublished, true)))
    .limit(1)

  if (!event) return NextResponse.json({ data: null, error: "Event not found" }, { status: 404 })
  return NextResponse.json({ data: event, error: null })
}
