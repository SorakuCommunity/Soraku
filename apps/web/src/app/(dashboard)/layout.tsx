'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Home,
  User,
  Image as ImageIcon,
  Bell,
  Shield,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  TrendingUp,
  Award,
  Heart,
  FileText,
  Settings,
  Compass,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SessionUser {
  id: string
  username: string | null
  displayname: string | null
  avatarurl: string | null
  role: string
  supporterrole?: string | null
}

const IS_ADMIN = (r: string) => ['OWNER', 'MANAGER', 'ADMIN'].includes(r.toUpperCase())

const SIDEBAR_ITEMS = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/profile/me', label: 'Profile', icon: User },
  { href: '/posts', label: 'Posts', icon: FileText },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setUser(d.data ?? null))
      .catch(() => setUser(null))
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleSignout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' }).catch(() => {})
    router.push('/')
    router.refresh()
  }

  const sidebarContent = (
    <>
      {/* Logo & Collapse Toggle */}
      <div className="border-border/40 flex items-center justify-between border-b p-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-primary font-bold">空</span>
            </div>
            <span className="text-foreground font-bold">Soraku</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'rounded-lg p-2 transition-colors hover:bg-white/5',
            collapsed && 'mx-auto'
          )}
        >
          {collapsed ? (
            <ChevronLeft className="text-muted-foreground h-4 w-4 rotate-180" />
          ) : (
            <ChevronLeft className="text-muted-foreground h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-3">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 flex-shrink-0',
                  isActive ? 'text-primary' : 'text-muted-foreground/60'
                )}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}

        {user && IS_ADMIN(user.role) && (
          <>
            <div className="border-border/40 my-3 border-t" />
            <Link
              href="/admin"
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                pathname.startsWith('/admin')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              )}
            >
              <Shield
                className={cn(
                  'h-5 w-5 flex-shrink-0',
                  pathname.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground/60'
                )}
              />
              {!collapsed && <span>Admin</span>}
            </Link>
          </>
        )}
      </nav>

      {/* User Profile Card */}
      {user && (
        <div className="border-border/40 border-t p-3">
          <div
            className={cn(
              'flex items-center gap-3 rounded-xl bg-white/[0.02] p-2',
              collapsed && 'justify-center'
            )}
          >
            {user.avatarurl ? (
              <img
                src={user.avatarurl}
                alt={user.displayname || user.username || 'User'}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full">
                <User className="text-primary h-5 w-5" />
              </div>
            )}
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-medium">
                  {user.displayname || user.username || 'User'}
                </p>
                <p className="text-muted-foreground text-xs capitalize">
                  {user.role?.toLowerCase() || 'member'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="border-border/40 space-y-2 border-t p-3">
        <button
          onClick={handleSignout}
          className={cn(
            'text-muted-foreground flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-red-500/10 hover:text-red-400',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </>
  )

  return (
    <div className="bg-background min-h-screen">
      {/* Mobile Header */}
      <header className="border-border/40 bg-background/80 fixed top-0 right-0 left-0 z-50 h-16 border-b backdrop-blur-md lg:hidden">
        <div className="flex h-full items-center justify-between px-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="-ml-2 rounded-lg p-2 hover:bg-white/5"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-primary font-bold">空</span>
            </div>
            <span className="font-bold">Soraku</span>
          </Link>
          <div className="w-10" />
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          'bg-card/50 border-border/40 fixed top-0 left-0 z-50 hidden h-screen flex-col border-r backdrop-blur-xl transition-all duration-300 lg:flex',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={cn(
          'bg-card/95 border-border/40 fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r backdrop-blur-xl transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-end p-4">
          <button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 hover:bg-white/5">
            <X className="h-5 w-5" />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen pt-16 transition-all duration-300 lg:pt-0',
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  )
}
