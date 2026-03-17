export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { ok, NOT_FOUND, SERVER_ERROR } from '@/lib/api'

// GET /api/events/[slug] — public event detail (untuk halaman daftar)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { data, error } = await adminDb()
      .from('events')
      .select('id,slug,title,coverurl,startdate,enddate,ispublished,registrationurl,gametype')
      .eq('slug', slug)
      .eq('ispublished', true)
      .maybeSingle()

    if (error || !data) return NOT_FOUND()
    return ok(data)
  } catch { return SERVER_ERROR() }
}
