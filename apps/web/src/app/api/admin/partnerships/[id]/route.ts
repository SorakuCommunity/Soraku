export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, NOT_FOUND, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

type Params = { params: Promise<{ id: string }> }

const PatchSchema = z.object({
  name: z.string().min(1).optional(),
  logourl: z
    .string()
    .url()
    .optional()
    .or(z.literal(''))
    .transform((v) => v || undefined),
  website: z
    .string()
    .url()
    .optional()
    .or(z.literal(''))
    .transform((v) => v || undefined),
  category: z.enum(['partner', 'sponsor']).optional(),
  description: z.string().optional(),
  isactive: z.boolean().optional(),
  sortorder: z.number().int().optional(),
})

// PATCH /api/admin/partnerships/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    const { id } = await params
    const body = await req.json()
    const parsed = PatchSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    const { data, error } = await adminDb()
      .from('partnerships')
      .update(parsed.data)
      .eq('id', id)
      .select()
      .maybeSingle()

    if (error) return err(error.message)
    if (!data) return NOT_FOUND()
    return ok(data)
  } catch {
    return SERVER_ERROR()
  }
}

// DELETE /api/admin/partnerships/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    const { id } = await params
    const { error } = await adminDb().from('partnerships').delete().eq('id', id)
    if (error) return err(error.message)
    return ok({ deleted: true })
  } catch {
    return SERVER_ERROR()
  }
}
