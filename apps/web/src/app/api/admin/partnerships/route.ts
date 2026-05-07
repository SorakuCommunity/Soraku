export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

const PartnershipSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  logourl: z
    .string()
    .url('URL logo tidak valid')
    .or(z.literal(''))
    .transform((v) => v || undefined),
  website: z
    .string()
    .url('URL website tidak valid')
    .optional()
    .or(z.literal(''))
    .transform((v) => v || undefined),
  category: z.enum(['partner', 'sponsor']).default('partner'),
  description: z.string().optional(),
  isactive: z.boolean().default(true),
  sortorder: z.number().int().default(0),
})

// GET /api/admin/partnerships — list all partnerships (staff only)
export async function GET() {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    const { data, error } = await adminDb()
      .from('partnerships')
      .select('id,name,logourl,website,category,description,isactive,sortorder,createdat')
      .order('sortorder', { ascending: true })
      .order('createdat', { ascending: false })

    if (error) {
      console.error('[partnerships GET]', error.message)
      return err(error.message, 500)
    }
    return ok(data ?? [])
  } catch (e) {
    console.error('[partnerships GET] catch:', e)
    return SERVER_ERROR()
  }
}

// POST /api/admin/partnerships — create new partnership
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    const body = await req.json()
    const parsed = PartnershipSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    const payload = {
      ...parsed.data,
      createdby: session.id,
    }

    const { data, error } = await adminDb().from('partnerships').insert(payload).select().single()

    if (error) {
      console.error('[partnerships POST]', error.message)
      return err(error.message, 500)
    }
    return ok(data, 201)
  } catch (e) {
    console.error('[partnerships POST] catch:', e)
    return SERVER_ERROR()
  }
}
