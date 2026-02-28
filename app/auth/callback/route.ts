import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: existing } = await supabase.from('users').select('id').eq('id', user.id).single()
        if (!existing) {
          const meta = user.user_metadata
          const base = ((meta.user_name ?? meta.full_name ?? meta.name ?? 'user') as string)
            .toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20)
          const username = `${base}_${Math.random().toString(36).slice(2, 6)}`
          await supabase.from('users').insert({
            id: user.id,
            email: user.email,
            display_name: meta.full_name ?? meta.name ?? 'User',
            username,
            avatar_url: meta.avatar_url ?? null,
            role: 'USER',
          })
        }
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }
  return NextResponse.redirect(`${origin}/?error=auth_failed`)
}
