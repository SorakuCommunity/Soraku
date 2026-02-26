/**
 * ============================================================
 *  SORAKU COMMUNITY — PROPRIETARY & CONFIDENTIAL
 * ============================================================
 *  API: PATCH /api/admin/users — Update user role
 *  Server-side enforcement — requires ADMIN+ session
 *  Rate-limited to prevent abuse
 * ============================================================
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/redis'
import { z } from 'zod'
import type { UserRole } from '@/types'

const ADMIN_ROLES: UserRole[] = ['OWNER', 'MANAGER', 'ADMIN']

const updateRoleSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  role: z.enum(['OWNER', 'MANAGER', 'ADMIN', 'AGENSI', 'PREMIUM', 'DONATE', 'USER']),
})

// Only OWNER can assign OWNER role
const OWNER_ONLY_ROLES: UserRole[] = ['OWNER']

export async function PATCH(req: NextRequest) {
  try {
    // ── Rate limit: 30 role-changes per minute per IP ─────────────
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'anon'
    const count = await rateLimit(`rl:admin:users:${ip}`, 60)
    if (count > 30) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    // ── Auth ─────────────────────────────────────────────────────
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── Fetch actor role ─────────────────────────────────────────
    const { data: actor } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!actor || !ADMIN_ROLES.includes(actor.role as UserRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // ── Parse & validate body ────────────────────────────────────
    const body = await req.json()
    const parsed = updateRoleSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { userId, role } = parsed.data

    // ── Prevent non-OWNER from assigning OWNER role ──────────────
    if (OWNER_ONLY_ROLES.includes(role as UserRole) && actor.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'Only OWNER can assign OWNER role' },
        { status: 403 }
      )
    }

    // ── Prevent downgrading a user with higher role ──────────────
    const { data: target } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (!target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const ROLE_LEVEL: Record<string, number> = {
      OWNER: 7, MANAGER: 6, ADMIN: 5, AGENSI: 4, PREMIUM: 3, DONATE: 2, USER: 1,
    }

    const actorLevel = ROLE_LEVEL[actor.role] ?? 0
    const targetCurrentLevel = ROLE_LEVEL[target.role] ?? 0

    // Cannot modify a user with equal or higher level (unless OWNER)
    if (actor.role !== 'OWNER' && targetCurrentLevel >= actorLevel) {
      return NextResponse.json(
        { error: 'Cannot modify user with equal or higher role' },
        { status: 403 }
      )
    }

    // ── Perform update ───────────────────────────────────────────
    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)

    if (error) {
      console.error('[admin/users PATCH]', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, userId, role })
  } catch (err) {
    console.error('[admin/users PATCH] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
