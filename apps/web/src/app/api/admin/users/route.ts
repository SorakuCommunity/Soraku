import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff, isManager } from '@/lib/auth'
import { ok, err, FORBIDDEN, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const PatchSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['OWNER', 'MANAGER', 'ADMIN', 'AGENSI', 'KREATOR', 'USER']).optional(),
  supporterrole: z.enum(['DONATUR', 'VIP', 'VVIP']).nullable().optional(),
  isbanned: z.boolean().optional(),
})

// GET /api/admin/users?page=1&role=
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('q')
    const role = searchParams.get('role')
    const limit = Math.min(Number(searchParams.get('limit') ?? 20), 100)
    const page = Math.max(Number(searchParams.get('page') ?? 1), 1)
    const offset = (page - 1) * limit

    let query = adminDb()
      .from('users')
      .select('id,username,displayname,avatarurl,role,supporterrole,isbanned,createdat', {
        count: 'exact',
      })
      .order('createdat', { ascending: false })
      .range(offset, offset + limit - 1)

    if (search) query = query.or(`username.ilike.%${search}%,displayname.ilike.%${search}%`)
    if (role) query = query.eq('role', role)

    const { data, error, count } = await query
    if (error) return SERVER_ERROR()
    return ok(data, 200, { total: count ?? 0, page, limit })
  } catch {
    return SERVER_ERROR()
  }
}

// PATCH /api/admin/users — update role / ban
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    const body = await req.json()
    const parsed = PatchSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.message)

    // Hanya OWNER/MANAGER yang bisa ubah role
    if (parsed.data.role && !isManager(session.role)) return FORBIDDEN()

    const { id, ...updates } = parsed.data
    const { data, error } = await adminDb()
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return err(error.message)
    return ok(data)
  } catch {
    return SERVER_ERROR()
  }
}
