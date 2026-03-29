'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Home,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Image as ImageIcon,
  Users,
  Shield,
  ChevronRight,
  Bell,
  Handshake,
  LogOut,
  Settings,
  Webhook,
  User,
  Menu,
  X,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, group: null },
  { href: '/admin/blog', label: 'Blog', icon: BookOpen, group: 'Konten' },
  { href: '/admin/events', label: 'Event', icon: Calendar, group: 'Konten' },
  { href: '/admin/gallery', label: 'Galeri', icon: ImageIcon, group: 'Konten' },
  { href: '/admin/partnerships', label: 'Partnership', icon: Handshake, group: 'Konten' },
  { href: '/admin/webhooks', label: 'Webhook', icon: Webhook, group: 'Pengaturan' },
  { href: '/admin/users', label: 'Pengguna', icon: Users, group: 'Sistem' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<{ username: string | null; displayname: string | null; avatarurl: string | null } | null>(null)

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setUser(d.data ?? null))
      .catch(() => {})
  }, [])

  useEffect(() => { setMobileMenuOpen(false) }, [pathname])

  const handleSignout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' }).catch(() => {})
    router.push('/')
    router.refresh()
  }

  const displayName = user?.displayname ?? user?.username ?? 'Admin'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-[#1C1E22]">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#1C1E22]/95 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          {/* Left: Logo + Admin label */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-7 w-7 overflow-hidden rounded-lg border border-white/10 bg-[#1a1c20]">
                <Image src="/logo.png" alt="Soraku" width={28} height={28} className="h-full w-full object-cover" />
              </div>
              <span className="text-sm font-black text-[#D9DDE3] group-hover:text-[#4FA3D1] transition-colors">Soraku</span>
            </Link>
            <div className="h-5 w-px bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-[#4FA3D1]" />
              <span className="text-xs font-bold text-[#4FA3D1]">Admin Panel</span>
            </div>
          </div>

          {/* Right: Back to site + user */}
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden sm:flex items-center gap-1.5 text-xs text-[#6E8FA6] hover:text-[#D9DDE3] transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke Situs
            </Link>
            <div className="h-5 w-px bg-white/[0.08] hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#4FA3D1]/10 flex items-center justify-center overflow-hidden border border-white/10">
                {user?.avatarurl
                  ? <Image src={user.avatarurl} alt={displayName} width={32} height={32} className="h-full w-full object-cover" />
                  : <span className="text-xs font-black text-[#4FA3D1]">{initial}</span>
                }
              </div>
              <button onClick={handleSignout} className="text-[#6E8FA6]/60 hover:text-red-400 transition-colors hidden sm:block">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
            {/* Mobile menu toggle */}
            <button onClick={() => setMobileMenuOpen(o => !o)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-[#6E8FA6] hover:text-[#D9DDE3] hover:bg-white/5 transition-colors">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Desktop Sidebar */}
        <aside className="hidden w-56 flex-shrink-0 lg:block">
          <div className="sticky top-20 space-y-4">
            {/* Admin badge */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="bg-[#4FA3D1]/10 flex h-10 w-10 items-center justify-center rounded-xl">
                <Shield className="text-[#4FA3D1] h-5 w-5" />
              </div>
              <div>
                <p className="text-sm leading-none font-black text-[#D9DDE3]">Admin</p>
                <p className="text-[#6E8FA6]/60 mt-0.5 text-[10px]">Soraku Panel</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-0.5 p-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              {(() => {
                let lastGroup: string | null = undefined as any
                return ADMIN_NAV.map(({ href, label, icon: Icon, group }) => {
                  const showGroup = group !== lastGroup
                  lastGroup = group
                  const active =
                    href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(href)

                  return (
                    <div key={href}>
                      {showGroup && group && (
                        <p className="text-[#6E8FA6]/40 mt-3 mb-1.5 px-2 text-[9px] font-black tracking-[0.2em] uppercase">
                          {group}
                        </p>
                      )}
                      <Link
                        href={href}
                        className={cn(
                          'group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                          active
                            ? 'bg-[#4FA3D1]/10 text-[#4FA3D1]'
                            : 'text-[#6E8FA6]/70 hover:bg-white/5 hover:text-[#D9DDE3]'
                        )}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-[#4FA3D1]" : "text-[#6E8FA6]/50")} />
                          {label}
                        </span>
                        {active && <ChevronRight className="h-3 w-3 opacity-40" />}
                      </Link>
                    </div>
                  )
                })
              })()}
            </nav>

            {/* Bottom info */}
            <div className="from-border/20 mt-4 h-px bg-gradient-to-r to-transparent" />
            <p className="text-[#6E8FA6]/30 px-2 text-[9px] font-semibold tracking-wider uppercase">
              Soraku v1.0
            </p>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute left-0 top-14 bottom-0 w-64 bg-[#1C1E22] border-r border-white/[0.06] overflow-y-auto p-4">
              <nav className="space-y-0.5">
                {(() => {
                  let lastGroup: string | null = undefined as any
                  return ADMIN_NAV.map(({ href, label, icon: Icon, group }) => {
                    const showGroup = group !== lastGroup
                    lastGroup = group
                    const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
                    return (
                      <div key={href}>
                        {showGroup && group && (
                          <p className="text-[#6E8FA6]/40 mt-3 mb-1.5 px-2 text-[9px] font-black tracking-[0.2em] uppercase">{group}</p>
                        )}
                        <Link href={href}
                          className={cn('flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                            active ? 'bg-[#4FA3D1]/10 text-[#4FA3D1]' : 'text-[#6E8FA6]/70 hover:bg-white/5 hover:text-[#D9DDE3]')}>
                          <Icon className={cn("h-4 w-4", active ? "text-[#4FA3D1]" : "text-[#6E8FA6]/50")} />
                          {label}
                        </Link>
                      </div>
                    )
                  })
                })()}
                <div className="my-2 border-t border-white/[0.06]" />
                <Link href="/" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-[#6E8FA6]/70 hover:bg-white/5 hover:text-[#D9DDE3]">
                  <ArrowLeft className="h-4 w-4" /> Kembali ke Situs
                </Link>
                <button onClick={handleSignout} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-400/60 hover:bg-red-500/5 hover:text-red-400 transition-colors">
                  <LogOut className="h-4 w-4" /> Keluar
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Content */}
        <main className="min-w-0 flex-1 pb-12">{children}</main>
      </div>
    </div>
  )
}
