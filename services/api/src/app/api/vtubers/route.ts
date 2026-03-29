import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { vtubers } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export const dynamic = "force-dynamic"

// GET /api/vtubers
export async function GET(_req: NextRequest) {
  const rows = await db
    .select()
    .from(vtubers)
    .where(and(eq(vtubers.ispublished, true), eq(vtubers.isactive, true)))
    .orderBy(vtubers.name)

  return NextResponse.json({ data: rows, error: null })
}
