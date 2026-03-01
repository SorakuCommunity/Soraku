// app/Admin/gallery/page.tsx — SORAKU v1.0.a3.5
// Server component with proper auth — renders AdminGalleryClient
export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminShell } from '@/components/admin/AdminShell'
import { hasRole } from '@/lib/roles'
import type { Role } from '@/lib/roles'
import { AdminGalleryClient } from './AdminGalleryClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Gallery – Admin' }

export default async function AdminGalleryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/Admin/gallery')

  const { data: profile } = await supabase
    .from('users').select('username, role').eq('id', user.id).single()
  if (!profile || !hasRole(profile.role as Role, 'ADMIN')) redirect('/?error=unauthorized')

  const { data: pending } = await supabase
    .from('gallery')
    .select('id, image_url, caption, approved, created_at, users:user_id(username, avatar_url)')
    .eq('approved', false)
    .order('created_at', { ascending: false })
    .limit(50)

  const { data: approved } = await supabase
    .from('gallery')
    .select('id, image_url, caption, approved, created_at, users:user_id(username, avatar_url)')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <AdminShell userRole={profile.role as Role} username={profile.username ?? 'Admin'}>
      <AdminGalleryClient
        pending={pending as unknown[] ?? []}
        approved={approved as unknown[] ?? []}
      />
    </AdminShell>
  )
}
