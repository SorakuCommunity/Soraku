export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { ok, NOT_FOUND, SERVER_ERROR } from '@/lib/api'

// POST /api/blog/[slug]/views — increment view counter
export async function POST(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { data: post } = await adminDb()
      .from('posts')
      .select('id,viewcount')
      .eq('slug', slug)
      .eq('ispublished', true)
      .maybeSingle()
    if (!post) return NOT_FOUND()

    const { data } = await adminDb()
      .from('posts')
      .update({ viewcount: (post.viewcount ?? 0) + 1 })
      .eq('id', post.id)
      .select('viewcount')
      .single()

    return ok({ viewcount: data?.viewcount ?? 0 })
  } catch {
    return SERVER_ERROR()
  }
}

// GET /api/blog/[slug]/views
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { data } = await adminDb()
      .from('posts')
      .select('viewcount')
      .eq('slug', slug)
      .eq('ispublished', true)
      .maybeSingle()
    return ok({ viewcount: data?.viewcount ?? 0 })
  } catch {
    return SERVER_ERROR()
  }
}
