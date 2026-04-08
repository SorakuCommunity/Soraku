'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import {
  Menu,
  X,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  Bell,
  LogOut,
  Shield,
  CheckCheck,
  User,
  Home,
  Calendar,
  BookOpen,
  ImageIcon,
  Tv2,
  Info,
  Heart,
  MessageSquare,
  Lock,
  FileText,
  UserPlus,
  LayoutDashboard,
  Users,
  Star,
  Layers,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { useNotifications } from '@/hooks/use-notifications'
import { NOTIF_CONFIG } from '@/lib/notifications'
import { DiscordIcon } from '@/components/icons/custom-icons'

interface SessionUser {
  id: string
  username: string | null
  displayname: string | null
  avatarurl: string | null
  role: string
}
type NavChild = {
  label: string
  href: string
  desc?: string
  Icon: React.FC<{ className?: string }>
}
type NavGroup = { label: string; Icon: React.FC<{ className?: string }>; children: NavChild[] }
type NavItem =
  | { type: 'link'; label: string; href: string; Icon: React.FC<{ className?: string }> }
  | { type: 'group'; group: NavGroup }

// Color palette
const COLORS = {
  primary: '#4FA3D1',
  dark: '#1C1E22',
  secondary: '#6E8FA6',
  light: '#D9DDE3',
  accent: '#E8C2A8',
}

const NAV_ITEMS: NavItem[] = [
  { type: 'link', label: 'Beranda', href: '/', Icon: Home },
  {
    type: 'group',
    group: {
      label: 'Fitur',
      Icon: Layers,
      children: [
        { label: 'Blog', href: '/blog', Icon: BookOpen, desc: 'Artikel komunitas' },
        { label: 'Events', href: '/events', Icon: Calendar, desc: 'Turnamen & acara' },
        { label: 'Galeri', href: '/gallery', Icon: ImageIcon, desc: 'Karya anggota' },
      ],
    },
  },
  {
    type: 'group',
    group: {
      label: 'Agensi',
      Icon: Tv2,
      children: [
        { label: 'VTuber', href: '/vtubers', Icon: Tv2, desc: 'Virtual YouTuber komunitas' },
      ],
    },
  },
  {
    type: 'group',
    group: {
      label: 'Komunitas',
      Icon: Users,
      children: [
        { label: 'Donasi', href: '/donate', Icon: Heart, desc: 'Dukung komunitas kami' },
        { label: 'Premium', href: '/premium', Icon: Star, desc: 'Akses eksklusif supporter' },
      ],
    },
  },
  {
    type: 'group',
    group: {
      label: 'Informasi',
      Icon: FileText,
      children: [
        { label: 'Tentang', href: '/about', Icon: Info, desc: 'Tentang Soraku dan tim' },
        {
          label: 'Rekrutmen',
          href: '/requirements',
          Icon: UserPlus,
          desc: 'Bergabung sebagai kreator',
        },
        { label: 'Privasi', href: '/privacy', Icon: Lock, desc: 'Kebijakan privasi' },
        { label: 'Ketentuan', href: '/tos', Icon: FileText, desc: 'Syarat penggunaan' },
        { label: 'Masukan', href: '/feedback', Icon: MessageSquare, desc: 'Kirim saran' },
        { label: 'Lisensi', href: '/license', Icon: Shield, desc: 'Lisensi konten' },
      ],
    },
  },
]

const IS_ADMIN = (r: string) => ['OWNER', 'MANAGER', 'ADMIN'].includes(r.toUpperCase())

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [user, setUser] = useState<SessionUser | null>(null)
  const [mounted, setMounted] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications(!!user)

  useEffect(() => {
    setMounted(true)
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setUser(d.data ?? null))
      .catch(() => setUser(null))
  }, [])
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  useEffect(() => {
    setMenuOpen(false)
    setProfileOpen(false)
  }, [pathname])

  const handleSignout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' }).catch(() => {})
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const displayName = user?.displayname ?? user?.username ?? ''
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          DESKTOP & MOBILE NAVBAR
          ═══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#1C1E22]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group flex flex-shrink-0 items-center gap-2.5">
            <div className="h-8 w-8 overflow-hidden rounded-lg border border-white/10 bg-[#1a1c20]">
              <Image
                src="/logo.png"
                alt="Soraku"
                width={32}
                height={32}
                className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="text-base font-black tracking-tight text-[#D9DDE3] transition-colors group-hover:text-[#4FA3D1]">
              Soraku
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV_ITEMS.map((item, idx) => {
              if (item.type === 'link')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-[#4FA3D1]/10 text-[#4FA3D1]'
                        : 'text-[#6E8FA6] hover:bg-white/5 hover:text-[#D9DDE3]'
                    )}
                  >
                    <item.Icon className="h-3.5 w-3.5 opacity-70" />
                    {item.label}
                  </Link>
                )
              const g = (item as any).group as NavGroup
              const isOpen = openGroup === g.label
              return (
                <div
                  key={g.label}
                  className="relative"
                  onMouseEnter={() => setOpenGroup(g.label)}
                  onMouseLeave={() => setOpenGroup(null)}
                >
                  <button
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isOpen
                        ? 'bg-white/5 text-[#D9DDE3]'
                        : 'text-[#6E8FA6] hover:bg-white/5 hover:text-[#D9DDE3]'
                    )}
                  >
                    <g.Icon className="h-3.5 w-3.5 opacity-70" />
                    {g.label}
                    <ChevronDown
                      className={cn(
                        'h-3 w-3 transition-transform duration-200',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'absolute top-full left-0 z-50 origin-top-left pt-2 transition-all duration-150',
                      isOpen
                        ? 'pointer-events-auto scale-100 opacity-100'
                        : 'pointer-events-none scale-95 opacity-0'
                    )}
                  >
                    <div className="w-56 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1C1E22]/98 shadow-xl backdrop-blur-xl">
                      {g.children.map((c) => {
                        const isActive = pathname === c.href || pathname.startsWith(c.href + '/')
                        return (
                          <Link
                            key={c.href}
                            href={c.href}
                            onClick={() => setOpenGroup(null)}
                            className={cn(
                              'flex items-start gap-3 px-4 py-3 transition-colors',
                              isActive ? 'bg-[#4FA3D1]/10 text-[#4FA3D1]' : 'hover:bg-white/5'
                            )}
                          >
                            <c.Icon
                              className={cn(
                                'mt-0.5 h-4 w-4 flex-shrink-0',
                                isActive ? 'text-[#4FA3D1]' : 'text-[#6E8FA6]'
                              )}
                            />
                            <div>
                              <p
                                className={cn(
                                  'text-sm font-semibold',
                                  isActive ? 'text-[#4FA3D1]' : 'text-[#D9DDE3]'
                                )}
                              >
                                {c.label}
                              </p>
                              {c.desc && (
                                <p className="mt-0.5 text-xs text-[#6E8FA6]/70">{c.desc}</p>
                              )}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </nav>

          {/* Right actions - Desktop */}
          <div className="hidden items-center gap-1 lg:flex">
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6E8FA6] transition-colors hover:bg-white/5 hover:text-[#D9DDE3]"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}

            {user ? (
              <>
                {/* Notif */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifOpen((o) => !o)}
                    className={cn(
                      'relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                      notifOpen
                        ? 'bg-[#4FA3D1]/15 text-[#4FA3D1]'
                        : 'text-[#6E8FA6] hover:bg-white/5 hover:text-[#D9DDE3]'
                    )}
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#E8C2A8] px-1 text-[9px] font-black text-[#1C1E22]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute top-full right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1C1E22]/98 shadow-2xl backdrop-blur-xl">
                      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Bell className="h-3.5 w-3.5 text-[#4FA3D1]" />
                          <span className="text-sm font-bold text-[#D9DDE3]">Notifikasi</span>
                          {unreadCount > 0 && (
                            <span className="rounded-full bg-[#4FA3D1]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#4FA3D1]">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllRead()}
                            className="flex items-center gap-1 text-xs text-[#6E8FA6] transition-colors hover:text-[#4FA3D1]"
                          >
                            <CheckCheck className="h-3 w-3" /> Baca semua
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center">
                            <Bell className="mx-auto mb-2 h-8 w-8 text-white/15" />
                            <p className="text-xs text-[#6E8FA6]">Tidak ada notifikasi</p>
                          </div>
                        ) : (
                          notifications.slice(0, 8).map((n) => {
                            const cfg = (NOTIF_CONFIG as any)[n.type] ?? (NOTIF_CONFIG as any).info
                            const NIcon = cfg.icon as React.ElementType | undefined
                            return (
                              <button
                                key={n.id}
                                onClick={() => {
                                  markRead([n.id])
                                  setNotifOpen(false)
                                }}
                                className={cn(
                                  'flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-white/5',
                                  !n.isread && 'bg-white/[0.03]'
                                )}
                              >
                                <div
                                  className={cn(
                                    'mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border',
                                    cfg.bg
                                  )}
                                >
                                  {NIcon ? (
                                    <NIcon className={cn('h-3.5 w-3.5', cfg.color)} />
                                  ) : (
                                    <span className="text-sm">{cfg.emoji}</span>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-semibold text-[#D9DDE3]">{n.title}</p>
                                  {n.body && (
                                    <p className="mt-0.5 line-clamp-2 text-[11px] text-[#6E8FA6]/70">
                                      {n.body}
                                    </p>
                                  )}
                                </div>
                                {!n.isread && (
                                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#4FA3D1]" />
                                )}
                              </button>
                            )
                          })
                        )}
                      </div>
                      <Link
                        href="/notifications"
                        onClick={() => setNotifOpen(false)}
                        className="flex items-center justify-center gap-1.5 border-t border-white/[0.06] py-2.5 text-xs text-[#6E8FA6] transition-colors hover:text-[#4FA3D1]"
                      >
                        Lihat semua
                      </Link>
                    </div>
                  )}
                </div>

                {/* Avatar desktop */}
                <div className="group relative">
                  <button className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all hover:border-[#4FA3D1]/40 hover:ring-2 hover:ring-[#4FA3D1]/20">
                    {user.avatarurl ? (
                      <Image
                        src={user.avatarurl}
                        alt={displayName}
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-black text-[#4FA3D1]">
                        {initial || <User className="h-4 w-4" />}
                      </span>
                    )}
                  </button>
                  <div className="pointer-events-none absolute top-full right-0 origin-top-right scale-95 pt-2 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100">
                    <div className="w-52 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1C1E22]/98 shadow-xl backdrop-blur-xl">
                      <div className="border-b border-white/[0.06] px-4 py-3">
                        <p className="truncate text-sm font-semibold text-[#D9DDE3]">
                          {displayName}
                        </p>
                        <p className="truncate text-xs text-[#6E8FA6]">@{user.username ?? '—'}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile/me"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6E8FA6] transition-colors hover:bg-white/5 hover:text-[#D9DDE3]"
                        >
                          <User className="h-4 w-4" /> Profil
                        </Link>
                        <Link
                          href="/notifications"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6E8FA6] transition-colors hover:bg-white/5 hover:text-[#D9DDE3]"
                        >
                          <Bell className="h-4 w-4" /> Notifikasi
                          {unreadCount > 0 && (
                            <span className="ml-auto rounded-full bg-[#4FA3D1]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#4FA3D1]">
                              {unreadCount}
                            </span>
                          )}
                        </Link>
                        {IS_ADMIN(user.role) && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6E8FA6] transition-colors hover:bg-white/5 hover:text-[#D9DDE3]"
                          >
                            <Shield className="h-4 w-4" /> Admin Panel
                          </Link>
                        )}
                        <div className="mx-2 my-1 border-t border-white/[0.06]" />
                        <button
                          onClick={handleSignout}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-400/60 transition-colors hover:bg-red-500/8 hover:text-red-400"
                        >
                          <LogOut className="h-4 w-4" /> Keluar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-xl bg-[#4FA3D1] px-4 py-2 text-sm font-semibold text-[#1C1E22] transition-colors hover:bg-[#4FA3D1]/90 lg:inline-flex"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6E8FA6] transition-colors hover:bg-white/5 hover:text-[#D9DDE3]"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}

            {/* Profile button - separate from menu */}
            {user ? (
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5"
              >
                {user.avatarurl ? (
                  <Image
                    src={user.avatarurl}
                    alt={displayName}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-black text-[#4FA3D1]">
                    {initial || <User className="h-4 w-4" />}
                  </span>
                )}
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-lg bg-[#4FA3D1] px-3 py-1.5 text-xs font-semibold text-[#1C1E22]"
              >
                Masuk
              </Link>
            )}

            {/* Menu button */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6E8FA6] transition-colors hover:bg-white/5 hover:text-[#D9DDE3]"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          MOBILE PROFILE DRAWER
          ═══════════════════════════════════════════════════════════════════════ */}
      {profileOpen && user && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setProfileOpen(false)}
          />
          <div className="absolute top-16 right-0 w-64 rounded-bl-2xl border-b border-l border-white/[0.08] bg-[#1C1E22] shadow-2xl">
            {/* User info */}
            <div className="border-b border-white/[0.06] p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  {user.avatarurl ? (
                    <Image
                      src={user.avatarurl}
                      alt={displayName}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-lg font-black text-[#4FA3D1]">
                      {initial}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-[#D9DDE3]">{displayName}</p>
                  <p className="truncate text-xs text-[#6E8FA6]">@{user.username ?? '—'}</p>
                </div>
              </div>
            </div>
            {/* Profile links */}
            <div className="p-2">
              <Link
                href="/profile/me"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#6E8FA6] transition-colors hover:bg-white/5 hover:text-[#D9DDE3]"
              >
                <User className="h-4 w-4" /> Profil
              </Link>
              <Link
                href="/notifications"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#6E8FA6] transition-colors hover:bg-white/5 hover:text-[#D9DDE3]"
              >
                <Bell className="h-4 w-4" /> Notifikasi
                {unreadCount > 0 && (
                  <span className="ml-auto rounded-full bg-[#4FA3D1]/15 px-2 py-0.5 text-[10px] font-bold text-[#4FA3D1]">
                    {unreadCount}
                  </span>
                )}
              </Link>
              {IS_ADMIN(user.role) && (
                <Link
                  href="/admin"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#6E8FA6] transition-colors hover:bg-white/5 hover:text-[#D9DDE3]"
                >
                  <Shield className="h-4 w-4" /> Admin Panel
                </Link>
              )}
              <div className="my-2 border-t border-white/[0.06]" />
              <button
                onClick={handleSignout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400/60 transition-colors hover:bg-red-500/5 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" /> Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          MOBILE NAVIGATION DRAWER - Simple List Style
          ═══════════════════════════════════════════════════════════════════════ */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto bg-[#1C1E22]">
            <div className="space-y-1 px-4 py-4">
              {NAV_ITEMS.map((item) => {
                if (item.type === 'link') {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-[#4FA3D1]/10 text-[#4FA3D1]'
                          : 'text-[#D9DDE3] hover:bg-white/5'
                      )}
                    >
                      <item.Icon
                        className={cn('h-4 w-4', isActive ? 'text-[#4FA3D1]' : 'text-[#6E8FA6]')}
                      />
                      {item.label}
                    </Link>
                  )
                }

                const g = item.group
                const isGroupOpen = openGroup === g.label
                const hasActiveChild = g.children.some(
                  (c) => pathname === c.href || pathname.startsWith(c.href + '/')
                )

                return (
                  <div key={g.label}>
                    <button
                      onClick={() => setOpenGroup(isGroupOpen ? null : g.label)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        hasActiveChild ? 'text-[#4FA3D1]' : 'text-[#D9DDE3]'
                      )}
                    >
                      <g.Icon
                        className={cn(
                          'h-4 w-4',
                          hasActiveChild ? 'text-[#4FA3D1]' : 'text-[#6E8FA6]'
                        )}
                      />
                      <span className="flex-1 text-left">{g.label}</span>
                      <ChevronDown className={cn('h-4 w-4', isGroupOpen && 'rotate-180')} />
                    </button>

                    {isGroupOpen && (
                      <div className="mt-1 ml-6 space-y-1">
                        {g.children.map((c) => {
                          const isActive = pathname === c.href || pathname.startsWith(c.href + '/')
                          return (
                            <Link
                              key={c.href}
                              href={c.href}
                              onClick={() => setMenuOpen(false)}
                              className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                isActive ? 'text-[#4FA3D1]' : 'text-[#6E8FA6] hover:text-[#D9DDE3]'
                              )}
                            >
                              <c.Icon className="h-4 w-4" />
                              {c.label}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}

              <div className="my-2 border-t border-white/[0.06]" />

              <a
                href="https://discord.gg/qm3XJvRa6B"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#D9DDE3] transition-colors hover:bg-white/5"
              >
                <DiscordIcon className="h-4 w-4 text-[#5865F2]" />
                Join Discord
              </a>

              {!user && (
                <div className="flex gap-2 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 rounded-lg bg-[#4FA3D1] py-2.5 text-center text-sm font-bold text-[#1C1E22]"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 rounded-lg border border-white/[0.08] py-2.5 text-center text-sm font-medium text-[#D9DDE3]"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
