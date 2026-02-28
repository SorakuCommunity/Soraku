import { NextRequest, NextResponse } from 'next/server'
import { isMaintenanceMode, setMaintenanceMode, getMaintenanceStatus } from '@/lib/maintenance'
import { createClient } from '@/lib/supabase/server'
import { hasRole } from '@/lib/roles'
import type { Role } from '@/lib/roles'
import { z } from 'zod'

export async function GET() {
  const status = await getMaintenanceStatus()
  return NextResponse.json({ status })
}

const schema = z.object({
  enabled: z.boolean(),
  message: z.string().max(500).optional(),
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: me } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (!hasRole(me?.role as Role, 'OWNER'))
    return NextResponse.json({ error: 'Hanya OWNER yang bisa mengubah maintenance mode' }, { status: 403 })

  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  await setMaintenanceMode(parsed.data.enabled, parsed.data.message)
  return NextResponse.json({ success: true, enabled: parsed.data.enabled })
}
