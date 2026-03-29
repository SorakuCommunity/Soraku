'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Home, User, Image as ImageIcon, Bell, Shield, LogOut, ChevronRight, Sparkles, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SessionUser {
  id: string
  username: string | null
  displayname: string | null
  avatarurl: string | null
  role: string
}

const IS_ADMIN = (r: string) => ['OWNER', 'MANAGER', 'ADMIN'].includes(r.toUpperCase())

const SIDEBAR_LINKS = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/profile/me', label: 'Profil', icon: User },
  { href: '/gallery/upload', label: 'Unggah Karya', icon: ImageIcon },
  { href: '/notifications', label: 'Notifikasi', icon: Bell },
]

// Stats for sidebar - data will be fetched from API
const USER_STATS = [
  { label: 'Karya', value: '—', icon: ImageIcon },
  { label: 'Notif', value: '—', icon: Bell },
]

// New Color Palette
const COLORS = {
  primary: "#4FA3D1",
  dark: "#1C1E22",
  secondary: "#6E8FA6",
  light: "#D9DDE3",
  accent: "#E8C2A8",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(null)

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setUser(d.data ?? null))
      .catch(() => setUser(null))
  }, [])

  const handleSignout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' }).catch(() => {})
    router.push('/')
    router.refresh()
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl gap-6 px-4 py-6 pb-24 sm:px-6 lg:px-8">
      {/* Sidebar - Redesigned without user profile card */}
      <aside className="hidden w-52 flex-shrink-0 lg:block">
        <div className="sticky top-24 space-y-4">
          
          {/* Navigation */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <nav className="space-y-0.5">
              {SIDEBAR_LINKS.map(({ href, label, icon: Icon }) => {
                const active =
                  href === '/'
                    ? pathname === '/'
                    : pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      active
                        ? 'bg-[#4FA3D1]/10 text-[#4FA3D1]'
                        : 'text-[#6E8FA6] hover:bg-white/5 hover:text-[#D9DDE3]'
                    )}
                  >
                    <Icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-[#4FA3D1]" : "text-[#6E8FA6]/60")} />
                    {label}
                  </Link>
                )
              })}

              <div className="border-border/40 my-1.5 border-t" />

              {user && IS_ADMIN(user.role) && (
                <Link
                  href="/admin"
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    pathname.startsWith('/admin')
                      ? 'bg-[#4FA3D1]/10 text-[#4FA3D1]'
                      : 'text-[#6E8FA6] hover:bg-white/5 hover:text-[#D9DDE3]'
                  )}
                >
                  <Shield className={cn("h-4 w-4 flex-shrink-0", pathname.startsWith('/admin') ? "text-[#4FA3D1]" : "text-[#6E8FA6]/60")} /> 
                  Admin Panel
                </Link>
              )}

              <button
                onClick={handleSignout}
                className="text-[#6E8FA6] hover:bg-red-500/5 hover:text-red-400 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4 flex-shrink-0" /> Keluar
              </button>
            </nav>
          </div>

          {/* Quick Stats */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-3">Aktivitas</p>
            <div className="grid grid-cols-2 gap-2">
              {USER_STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center p-2 rounded-lg bg-white/[0.02]">
                  <stat.icon className="h-4 w-4 text-[#6E8FA6] mb-1" />
                  <p className="text-lg font-black leading-none text-[#D9DDE3]">{stat.value}</p>
                  <p className="text-[9px] text-[#6E8FA6]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#4FA3D1]/10 to-[#E8C2A8]/5 border border-[#4FA3D1]/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-[#4FA3D1]" />
              <p className="text-xs font-bold text-[#D9DDE3]">Premium</p>
            </div>
            <p className="text-[10px] text-[#6E8FA6] mb-3">Akses fitur eksklusif dan dukung komunitas</p>
            <Link href="/premium" className="block w-full text-center py-2 rounded-lg bg-[#4FA3D1]/20 text-[#4FA3D1] text-xs font-bold hover:bg-[#4FA3D1]/30 transition-colors">
              Upgrade
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  )
}
