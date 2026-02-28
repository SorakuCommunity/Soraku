'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Shield, Users, Image, FileText, Star, Settings,
  ChevronDown, LogOut, Menu, X, Palette,
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
  { href: '/Soraku_Admin',          label: 'Dashboard',  icon: Shield },
  { href: '/Soraku_Admin/users',    label: 'Users',      icon: Users },
  { href: '/Soraku_Admin/blog',     label: 'Blog',       icon: FileText },
  { href: '/Soraku_Admin/gallery',  label: 'Gallery',    icon: Image },
  { href: '/Soraku_Admin/vtubers',  label: 'VTubers',    icon: Star },
  { href: '/Soraku_Admin/theme',    label: 'Tema',       icon: Palette },
  { href: '/Soraku_Admin/settings', label: 'Pengaturan', icon: Settings },
]

export function AdminShell({ userRole, username, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname  = usePathname()
  const router    = useRouter()
  const supabase  = createClient()

  const roleColor = ROLE_COLORS[userRole] ?? '#6E8FA6'
  const roleLabel = ROLE_LABELS[userRole] ?? userRole

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full" style={{ backgroundColor: 'var(--bg-card)', borderRight: '1px solid var(--border)' }}>
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <Link href="/" className="font-bold text-lg" style={{ color: 'var(--color-primary)' }}>
          Soraku
        </Link>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-sub)' }}>Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/Soraku_Admin' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: active ? 'var(--hover-bg)' : 'transparent',
                color: active ? 'var(--color-primary)' : 'var(--text-sub)',
              }}>
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: roleColor + '22', color: roleColor }}>
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{username}</p>
            <p className="text-xs" style={{ color: roleColor }}>{roleLabel}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:bg-red-500/10"
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
        <div className="w-full">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60 flex-shrink-0">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <button className="lg:hidden p-2 rounded-lg" onClick={() => setSidebarOpen(true)}
            style={{ color: 'var(--text-sub)' }}>
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <span className="text-xs px-2 py-1 rounded-full font-medium"
            style={{ backgroundColor: roleColor + '22', color: roleColor }}>
            {roleLabel}
          </span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
