import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { hasRole } from '@/lib/roles'
import type { Role } from '@/lib/roles'
import { rateLimit } from '@/lib/redis'
import { z } from 'zod'

const updateRoleSchema = z.object({
  userId: z.string().uuid(),
  role:   z.enum(['OWNER', 'MANAGER', 'ADMIN', 'AGENSI', 'PREMIUM', 'DONATE', 'USER']),
})

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: me } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (!hasRole(me?.role as Role, 'ADMIN'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const page  = parseInt(searchParams.get('page')  ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const q     = searchParams.get('q') ?? ''

  let query = supabase
    .from('users')
    .select('id, username, display_name, email, role, created_at, avatar_url', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (q) query = query.ilike('username', `%${q}%`)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data, count, page, limit })
}

export async function PATCH(req: NextRequest) {
  // Rate limit: 30 role-changes per minute per IP
  const ip    = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'anon'
  const count = await rateLimit(`rl:admin:users:${ip}`, 60)
  if (count > 30) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: me } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (!hasRole(me?.role as Role, 'MANAGER'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body   = await req.json()
  const parsed = updateRoleSchema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { userId, role } = parsed.data

  // Prevent setting OWNER unless you are OWNER
  if (role === 'OWNER' && !hasRole(me?.role as Role, 'OWNER'))
    return NextResponse.json({ error: 'Only OWNER can assign OWNER role' }, { status: 403 })

  const admin = await createAdminClient()
  const { error } = await admin.from('users').update({ role }).eq('id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
