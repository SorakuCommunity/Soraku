// app/Admin/page.tsx — SORAKU v1.0.a3.4
export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminShell } from '@/components/admin/AdminShell'
import { hasRole } from '@/lib/roles'
import type { Role } from '@/lib/roles'
import { Users, FileText, Images, Star } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Panel – Soraku' }

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/Admin')

  const { data: profile } = await supabase
    .from('users').select('username, role').eq('id', user.id).single()

  if (!profile || !hasRole(profile.role as Role, 'ADMIN')) redirect('/?error=unauthorized')

  const [
    { count: totalUsers },
    { count: totalPosts },
    { count: pendingGallery },
    { count: totalVtubers },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('gallery').select('*', { count: 'exact', head: true }).eq('approved', false),
    supabase.from('vtubers').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Total Users',      value: totalUsers     ?? 0, icon: Users,    color: '#4FA3D1' },
    { label: 'Blog Published',   value: totalPosts     ?? 0, icon: FileText, color: '#6E8FA6' },
    { label: 'Gallery Pending',  value: pendingGallery ?? 0, icon: Images,   color: '#E8C2A8' },
    { label: 'Vtuber Terdaftar', value: totalVtubers   ?? 0, icon: Star,     color: '#7C9E87' },
  ]

  const quickLinks = [
    { href: '/Admin/users',      label: 'Kelola Users',    icon: Users },
    { href: '/Admin/blogs',      label: 'Kelola Blog',     icon: FileText },
    { href: '/Admin/gallery',    label: 'Approve Gallery', icon: Images },
    { href: '/Admin/vtuber',     label: 'Atur VTuber',     icon: Star },
  ]

  return (
    <AdminShell userRole={profile.role as Role} username={profile.username ?? 'Admin'}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-sub)' }}>
            Selamat datang, {profile.role} {profile.username}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="p-5 rounded-2xl border backdrop-blur-xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.10)' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium" style={{ color: 'var(--text-sub)' }}>{label}</p>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: color + '22', color }}>
                  <Icon size={14} />
                </div>
              </div>
              <p className="text-3xl font-bold" style={{ color: 'var(--text)' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <a key={href} href={href}
              className="flex flex-col items-center gap-2 p-5 rounded-2xl border text-center transition-all hover:scale-[1.02] hover:shadow-xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.10)' }}>
              <Icon size={22} style={{ color: 'var(--color-primary)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}
