/**
 * ============================================================
 *  SORAKU COMMUNITY — PROPRIETARY & CONFIDENTIAL
 * ============================================================
 *  API: PATCH /api/gallery — Moderate gallery item (approve/reject)
 *  Server-side enforcement — requires ADMIN+ session
 * ============================================================
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { UserRole } from '@/types'

const ADMIN_ROLES: UserRole[] = ['OWNER', 'MANAGER', 'ADMIN']

const moderateSchema = z.object({
  id: z.string().uuid('Invalid gallery item ID'),
  status: z.enum(['approved', 'rejected', 'pending']),
})

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check actor role
    const { data: actor } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!actor || !ADMIN_ROLES.includes(actor.role as UserRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = moderateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { id, status } = parsed.data

    const { error } = await supabase
      .from('gallery')
      .update({ status, reviewed_by: user.id })
      .eq('id', id)

    if (error) {
      console.error('[gallery PATCH]', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id, status })
  } catch (err) {
    console.error('[gallery PATCH] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
