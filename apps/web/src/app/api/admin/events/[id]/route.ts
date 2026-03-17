export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, NOT_FOUND, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

type Params = { params: Promise<{ id: string }> }

const PatchSchema = z.object({
  title:       z.string().optional(),
  slug:        z.string().optional(),
  description: z.string().optional(),
  coverurl:    z.string().url().optional().or(z.literal('')),
  startdate:   z.string().optional(),
  enddate:     z.string().optional(),
  location:    z.string().optional(),
  isonline:    z.boolean().optional(),
  ispublished:      z.boolean().optional(),
  registrationopen: z.boolean().optional(),
  ispaid:           z.boolean().optional(),
  price:            z.number().int().min(0).optional(),
  priceinfo:        z.string().optional(),
  tags:             z.array(z.string()).optional(),
})

// GET /api/admin/events/[id] — prefill form edit
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()
    const { id } = await params
    const { data, error } = await adminDb()
      .from('events').select('*').eq('id', id).maybeSingle()
    if (error) return SERVER_ERROR()
    if (!data) return NOT_FOUND()
    return ok(data)
  } catch { return SERVER_ERROR() }
}

// PATCH /api/admin/events/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()
    const { id } = await params
    const body    = await req.json()
    const parsed  = PatchSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    const updates: Record<string, unknown> = { ...parsed.data, updatedat: new Date().toISOString() }
    if (updates.coverurl === '') updates.coverurl = null

    const { data, error } = await adminDb()
      .from('events').update(updates).eq('id', id).select().maybeSingle()
    if (error) return err(error.message)
    if (!data) return NOT_FOUND()
    return ok(data)
  } catch { return SERVER_ERROR() }
}

// DELETE /api/admin/events/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()
    const { id }  = await params
    const { error } = await adminDb().from('events').delete().eq('id', id)
    if (error) return err(error.message)
    return ok({ deleted: true })
  } catch { return SERVER_ERROR() }
}
