/**
 * GET /api/stream/sources
 * Cek status ketersediaan semua anime streaming sources.
 * Response: { source, name, lang, status: "online"|"degraded"|"offline", url }
 *
 * Dipakai oleh apps/stream untuk menampilkan badge provider availability.
 */
import { NextResponse } from "next/server"
import { getAvailableSources } from "@/lib/anime"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const sources = await getAvailableSources()
    return NextResponse.json({ data: sources, error: null })
  } catch {
    return NextResponse.json({ data: null, error: "Gagal cek status sources" }, { status: 500 })
  }
}
