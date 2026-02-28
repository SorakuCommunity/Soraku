'use client'
// components/admin/AdminShell.tsx — SORAKU v1.0.a3.4
// Updated sidebar: Dashboard/Users/Gallery/Blogs/Vtuber/Pengaturan/Pengurus
// Route: /Admin (not /Soraku_Admin)
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Images, FileText, Star,
  Settings, Shield, LogOut, Menu, X, UserCog,
} from 'lucide-react'
import { ROLE_COLORS, ROLE_LABELS, type Role } from '@/lib/roles'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AdminShellProps {
  userRole: Role
  username: string
  children: React.ReactNode
}

const NAV_ITEMS = [
  { href: '/Admin',            label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { href: '/Admin/users',      label: 'Users',      icon: Users },
  { href: '/Admin/gallery',    label: 'Gallery',    icon: Images },
  { href: '/Admin/blogs',      label: 'Blogs',      icon: FileText },
  { href: '/Admin/vtuber',     label: 'Vtuber',     icon: Star },
  { href: '/Admin/pengaturan', label: 'Pengaturan', icon: Settings },
  { href: '/Admin/pengurus',   label: 'Pengurus',   icon: UserCog },
]

export function AdminShell({ userRole, username, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  const roleColor = ROLE_COLORS[userRole] ?? '#6E8FA6'
  const roleLabel = ROLE_LABELS[userRole] ?? userRole

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : (pathname === href || pathname.startsWith(href + '/'))

  const SidebarContent = () => (
    <aside className="flex flex-col h-full" style={{
      backgroundColor: 'var(--bg-card)',
      borderRight: '1px solid var(--border)',
    }}>
      {/* Logo */}
      <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <div>
          <Link href="/" className="font-bold text-lg" style={{ color: 'var(--color-primary)' }}>
            Soraku
          </Link>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Shield size={10} style={{ color: 'var(--text-sub)' }} />
            <p className="text-xs" style={{ color: 'var(--text-sub)' }}>Admin Panel</p>
          </div>
        </div>
        <button className="lg:hidden p-1.5 rounded-lg" onClick={() => setSidebarOpen(false)}
          style={{ color: 'var(--text-sub)' }}>
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: active ? 'var(--color-primary)18' : 'transparent',
                color: active ? 'var(--color-primary)' : 'var(--text-sub)',
                borderLeft: active ? `3px solid var(--color-primary)` : '3px solid transparent',
              }}>
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2.5 mb-3 p-2 rounded-xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ backgroundColor: roleColor + '22', color: roleColor }}>
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{username}</p>
            <p className="text-xs font-semibold" style={{ color: roleColor }}>{roleLabel}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all hover:bg-red-500/10"
          style={{ color: '#ef4444' }}>
          <LogOut size={14} /> Logout
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-60 flex-shrink-0">
        <div className="w-full"><SidebarContent /></div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60 flex-shrink-0"><SidebarContent /></div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <button className="lg:hidden p-2 rounded-lg" onClick={() => setSidebarOpen(true)}
            style={{ color: 'var(--text-sub)' }}>
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            {NAV_ITEMS.find(n => isActive(n.href, n.exact))?.label ?? 'Admin'}
          </span>
          <div className="flex-1" />
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ backgroundColor: roleColor + '22', color: roleColor }}>
            {roleLabel}
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
