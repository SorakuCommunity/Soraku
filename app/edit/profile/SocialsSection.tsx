// app/edit/profile/SocialsSection.tsx — SORAKU v1.0.a3.4
// Drop-in section for /edit/profile page to include social links editor
// Import this and add it below the profile header card in your edit/profile/page.tsx

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SocialLinksEditor } from '@/components/profile/SocialLinksEditor'
import type { UserRole } from '@/types'

export async function SocialsSection() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const { data: socials } = await supabase
    .from('user_socials')
    .select('platform, url')
    .eq('user_id', user.id)

  const initialLinks: Record<string, string> = {}
  for (const s of socials ?? []) {
    initialLinks[s.platform] = s.url ?? ''
  }

  return (
    <SocialLinksEditor
      userId={user.id}
      role={(profile?.role ?? 'USER') as UserRole}
      initialLinks={initialLinks}
    />
  )
}
