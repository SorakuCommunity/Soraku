import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { vtubers } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export const dynamic = "force-dynamic"

// GET /api/vtubers/:slug
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const [vtuber] = await db
    .select()
    .from(vtubers)
    .where(and(eq(vtubers.slug, slug), eq(vtubers.ispublished, true)))
    .limit(1)

  if (!vtuber) return NextResponse.json({ data: null, error: "VTuber not found" }, { status: 404 })
  return NextResponse.json({ data: vtuber, error: null })
}
