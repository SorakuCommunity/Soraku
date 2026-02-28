import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminThemeSchema } from '@/lib/validations'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  const role = profile?.role as string | null
  if (!role || !['ADMIN', 'MANAGER', 'OWNER'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const parsed = adminThemeSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const updates = Object.entries(parsed.data).filter(([, v]) => v !== undefined)
  for (const [key, value] of updates) {
    if (!value) continue
    await supabase.from('site_settings').upsert({ key, value: String(value) }, { onConflict: 'key' })
  }

  return NextResponse.json({ ok: true })
}
