// app/Admin/pengaturan/page.tsx — SORAKU v1.0.a3.5
export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminShell } from '@/components/admin/AdminShell'
import { hasRole } from '@/lib/roles'
import type { Role } from '@/lib/roles'
import { AdminPengaturanClient } from './AdminPengaturanClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pengaturan – Admin' }

export default async function AdminPengaturanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/Admin/pengaturan')

  const { data: profile } = await supabase
    .from('users').select('username, role').eq('id', user.id).single()
  if (!profile || !hasRole(profile.role as Role, 'ADMIN')) redirect('/?error=unauthorized')

  const { data: settings } = await supabase.from('site_settings').select('key, value')
  const map: Record<string, string> = {}
  for (const s of settings ?? []) map[s.key] = s.value

  return (
    <AdminShell userRole={profile.role as Role} username={profile.username ?? 'Admin'}>
      <AdminPengaturanClient initialSettings={map} />
    </AdminShell>
  )
}
