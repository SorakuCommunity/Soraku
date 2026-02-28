// app/Admin/vtuber/page.tsx — SORAKU v1.0.a3.4
export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminShell } from '@/components/admin/AdminShell'
import { hasRole } from '@/lib/roles'
import type { Role } from '@/lib/roles'
import { AdminVtuberClient } from './AdminVtuberClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'VTuber – Admin' }

export default async function AdminVtuberPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/Admin/vtuber')

  const { data: profile } = await supabase
    .from('users').select('username, role').eq('id', user.id).single()
  if (!profile || !hasRole(profile.role as Role, 'AGENSI')) redirect('/?error=unauthorized')

  const { data: vtubers } = await supabase
    .from('vtubers')
    .select('id, name, slug, description, image_url, agency, active')
    .order('name')

  return (
    <AdminShell userRole={profile.role as Role} username={profile.username ?? 'Admin'}>
      <AdminVtuberClient vtubers={vtubers ?? []} />
    </AdminShell>
  )
}
