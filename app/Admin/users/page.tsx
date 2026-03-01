// app/Admin/users/page.tsx — SORAKU v1.0.a3.4
export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminShell } from '@/components/admin/AdminShell'
import { hasRole } from '@/lib/roles'
import type { Role } from '@/lib/roles'
import { AdminUsersClient } from './AdminUsersClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Users – Admin' }

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/Admin/users')

  const { data: profile } = await supabase
    .from('users').select('username, role').eq('id', user.id).single()
  if (!profile || !hasRole(profile.role as Role, 'ADMIN')) redirect('/?error=unauthorized')

  const sp   = await searchParams
  const page = Math.max(1, parseInt(sp.page ?? '1'))
  const q    = sp.q ?? ''
  const per  = 10

  let query = supabase
    .from('users')
    .select('id, username, email, role, avatar_url, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * per, page * per - 1)

  if (q) query = query.ilike('username', `%${q}%`)

  const { data: users, count } = await query
  const totalPages = Math.ceil((count ?? 0) / per)

  return (
    <AdminShell userRole={profile.role as Role} username={profile.username ?? 'Admin'}>
      <AdminUsersClient
        users={users ?? []}
        page={page}
        totalPages={totalPages}
        total={count ?? 0}
        q={q}
        myRole={profile.role as Role}
      />
    </AdminShell>
  )
}
