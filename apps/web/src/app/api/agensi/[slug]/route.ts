import { adminDb } from '@/lib/supabase/admin'
import { ok, NOT_FOUND, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

// GET /api/agensi/[slug]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params
    const { data, error } = await adminDb()
      .from('vtubers')
      .select('*')
      .eq('slug', slug)
      .eq('isactive', true)
      .single()

    if (error || !data) return NOT_FOUND()
    return ok(data)
  } catch {
    return SERVER_ERROR()
  }
}
