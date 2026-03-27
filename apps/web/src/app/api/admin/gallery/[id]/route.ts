import { notifyGalleryStatus } from '@/lib/notify'
import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

const PatchSchema = z.object({
  approved: z.boolean().optional(),
  status: z.enum(['approved', 'rejected', 'pending']).optional(),
  rejectionreason: z.string().optional(),
})

// PATCH /api/admin/gallery/[id] — approve atau reject
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()
    const { id } = await params
    const body = await req.json()
    const parsed = PatchSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.message)

    // Support dua cara: { approved: true/false } atau { status: 'approved' }
    const status =
      parsed.data.status ??
      (parsed.data.approved === true
        ? 'approved'
        : parsed.data.approved === false
          ? 'rejected'
          : undefined)

    if (!status) return err('status atau approved wajib ada')

    const { data, error } = await adminDb()
      .from('gallery')
      .update({
        status,
        reviewedby: session.id,
        rejectionreason: parsed.data.rejectionreason ?? null,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) return err(error.message)
    // Auto-notify uploader
    if (parsed.data.status && data?.uploadedby) {
      notifyGalleryStatus({ userid: data.uploadedby, imageTitle: data.title, approved: parsed.data.status === 'approved' }).catch(() => {})
    }
    return ok(data)
  } catch {
    return SERVER_ERROR()
  }
}

// DELETE /api/admin/gallery/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()
    const { id } = await params
    const { error } = await adminDb().from('gallery').delete().eq('id', id)
    if (error) return err(error.message)
    return ok({ deleted: true })
  } catch {
    return SERVER_ERROR()
  }
}
