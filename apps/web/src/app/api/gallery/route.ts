export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'

// GET /api/gallery?tag=&page=1&limit=20&status=pending|approved|all
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    const staff = session && isStaff(session.role)

    const { searchParams } = new URL(req.url)
    const tag = searchParams.get('tag') ?? searchParams.get('category')
    const status = searchParams.get('status') // pending | approved | all
    const limit = Math.min(Number(searchParams.get('limit') ?? 20), 50)
    const page = Math.max(Number(searchParams.get('page') ?? 1), 1)
    const offset = (page - 1) * limit

    let query = adminDb()
      .from('gallery')
      .select('id,imageurl,title,description,tags,status,uploadedby,createdat', { count: 'exact' })
      .order('createdat', { ascending: false })
      .range(offset, offset + limit - 1)

    if (staff) {
      // Staff: bisa filter by status, default tampilkan semua
      if (status === 'pending') query = query.eq('status', 'pending')
      else if (status === 'approved') query = query.eq('status', 'approved')
      else if (status === 'rejected') query = query.eq('status', 'rejected')
      // status=all atau tidak ada → tampilkan semua
    } else {
      // Public: hanya approved
      query = query.eq('status', 'approved')
    }

    if (tag) query = query.contains('tags', [tag])

    const { data, error, count } = await query
    if (error) return SERVER_ERROR()
    return ok(data, 200, { total: count ?? 0, page, limit })
  } catch {
    return SERVER_ERROR()
  }
}
