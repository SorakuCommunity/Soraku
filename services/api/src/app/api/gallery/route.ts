import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { gallery } from "@/lib/db/schema"
import { GalleryQuerySchema } from "@/lib/validators"
import { eq, and, sql, desc } from "drizzle-orm"

export const dynamic = "force-dynamic"

// GET /api/gallery
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const parsed = GalleryQuerySchema.safeParse(Object.fromEntries(searchParams))
  if (!parsed.success) return NextResponse.json({ data: null, error: parsed.error.issues[0]?.message }, { status: 400 })

  const { tag, page, limit } = parsed.data
  const offset = (page - 1) * limit

  const rows = await db
    .select({
      id: gallery.id, imageurl: gallery.imageurl, title: gallery.title,
      description: gallery.description, tags: gallery.tags,
      uploadedby: gallery.uploadedby, createdat: gallery.createdat,
    })
    .from(gallery)
    .where(and(
      eq(gallery.status, "approved"),
      tag ? sql`${tag} = ANY(${gallery.tags})` : undefined,
    ))
    .orderBy(desc(gallery.createdat))
    .limit(limit)
    .offset(offset)

  return NextResponse.json({ data: rows, error: null })
}
