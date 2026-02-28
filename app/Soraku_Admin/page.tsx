import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminShell } from '@/components/admin/AdminShell'
import { ALL_ROLES, ROLE_LABELS, ROLE_COLORS, hasRole } from '@/lib/roles'
import type { Role } from '@/lib/roles'
import { toast } from 'sonner'
import {
  Shield, TrendingUp, Users, Image, FileText, CheckCircle,
  AlertCircle, Star, Settings,
} from 'lucide-react'

export const metadata = { title: 'Admin Panel' }

export default async function SorakuAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/Soraku_Admin')

  const { data: profile } = await supabase
    .from('users')
    .select('username, role')
    .eq('id', user.id)
    .single()

  if (!profile || !hasRole(profile.role as Role, 'ADMIN')) {
    redirect('/?error=unauthorized')
  }

  // Stats
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
    { label: 'Total Users',       value: totalUsers  ?? 0, icon: Users,      color: '#4FA3D1' },
    { label: 'Blog Published',    value: totalPosts  ?? 0, icon: FileText,   color: '#6E8FA6' },
    { label: 'Gallery Pending',   value: pendingGallery ?? 0, icon: Image,   color: '#E8C2A8' },
    { label: 'VTuber Terdaftar', value: totalVtubers ?? 0, icon: Star,       color: '#7C9E87' },
  ]

  return (
    <AdminShell userRole={profile.role as Role} username={profile.username ?? 'Admin'}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-sub)' }}>
            Selamat datang, {ROLE_LABELS[profile.role as Role]} {profile.username}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="p-5 rounded-xl border"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium" style={{ color: 'var(--text-sub)' }}>{label}</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: color + '22', color }}>
                  <Icon size={14} />
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { href: '/Soraku_Admin/users',   label: 'Kelola Users',   icon: Users },
            { href: '/Soraku_Admin/blog',    label: 'Kelola Blog',    icon: FileText },
            { href: '/Soraku_Admin/gallery', label: 'Approve Gallery', icon: Image },
            { href: '/Soraku_Admin/theme',   label: 'Atur Tema',      icon: Settings },
          ].map(({ href, label, icon: Icon }) => (
            <a key={href} href={href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <Icon size={20} style={{ color: 'var(--color-primary)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}
