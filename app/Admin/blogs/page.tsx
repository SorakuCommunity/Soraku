// app/Admin/blogs/page.tsx — SORAKU v1.0.a3.4
// Blog management: create, edit, publish / unpublish
export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminShell } from '@/components/admin/AdminShell'
import { hasRole } from '@/lib/roles'
import type { Role } from '@/lib/roles'
import { AdminBlogsClient } from './AdminBlogsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Blogs – Admin' }

export default async function AdminBlogsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/Admin/blogs')

  const { data: profile } = await supabase
    .from('users').select('username, role').eq('id', user.id).single()
  if (!profile || !hasRole(profile.role as Role, 'ADMIN')) redirect('/?error=unauthorized')

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, published, published_at, created_at, cover_image')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <AdminShell userRole={profile.role as Role} username={profile.username ?? 'Admin'}>
      <AdminBlogsClient posts={posts ?? []} authorId={user.id} />
    </AdminShell>
  )
}
