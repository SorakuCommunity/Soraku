import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({
  theme_mode: z.enum(['dark', 'light', 'auto']),
})

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid theme_mode' }, { status: 400 })
    }

    const { error } = await supabase
      .from('users')
      .update({ theme_mode: parsed.data.theme_mode })
      .eq('id', user.id)

    if (error) return NextResponse.json({ error: 'Database error' }, { status: 500 })

    return NextResponse.json({ ok: true, theme_mode: parsed.data.theme_mode })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
