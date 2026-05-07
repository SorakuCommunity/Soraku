'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import {
  Menu,
  X,
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
  ChevronDown,
  Sparkles,
  Star,
  Layers,
  Users,
} from 'lucide-react'
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
  badge?: string
}
type NavGroup = { label: string; Icon: React.FC<{ className?: string }>; children: NavChild[] }
type NavItem =
  | { type: 'link'; label: string; href: string; Icon: React.FC<{ className?: string }> }
  | { type: 'group'; group: NavGroup }

const NAV_ITEMS: NavItem[] = [
  { type: 'link', label: 'Beranda', href: '/', Icon: Home },
  { type: 'link', label: 'Tentang', href: '/about', Icon: Info },
  {
    type: 'group',
    group: {
      label: 'Fitur',
      Icon: Layers,
      children: [
        { label: 'Blog', href: '/blog', Icon: BookOpen, desc: 'Artikel & ulasan komunitas' },
        { label: 'Events', href: '/events', Icon: Calendar, desc: 'Turnamen & acara mendatang' },
        { label: 'Galeri', href: '/gallery', Icon: ImageIcon, desc: 'Fanart & karya anggota' },
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
        {
          label: 'Rekrutmen',
          href: '/requirements',
          Icon: UserPlus,
          desc: 'Bergabung sebagai kreator',
        },
        {
          label: 'Class Online',
          href: '/class',
          Icon: BookOpen,
          desc: 'Kelas online interaktif',
        },
      ],
    },
  },
  {
    type: 'group',
    group: {
      label: 'Komunitas',
      Icon: Users,
      children: [
        { label: 'Donasi', href: '/donate', Icon: Heart, desc: 'Dukung Soraku' },
        { label: 'Premium', href: '/premium', Icon: Star, desc: 'Akses eksklusif', badge: 'NEW' },
      ],
    },
  },
  {
    type: 'group',
    group: {
      label: 'Informasi',
      Icon: FileText,
      children: [
        { label: 'Privasi', href: '/privacy', Icon: Lock, desc: 'Kebijakan privasi' },
        { label: 'Ketentuan', href: '/tos', Icon: FileText, desc: 'Syarat penggunaan' },
        { label: 'Masukan', href: '/feedback', Icon: MessageSquare, desc: 'Kirim saran' },
        { label: 'Lisensi', href: '/license', Icon: Shield, desc: 'Lisensi open source' },
      ],
    },
  },
]

const IS_ADMIN = (r: string) => ['OWNER', 'MANAGER', 'ADMIN'].includes(r.toUpperCase())

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [user, setUser] = useState<SessionUser | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications(!!user)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setUser(d.data ?? null))
      .catch(() => {})
  }, [])
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false)
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
      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-white/[0.06] bg-[#1C1E22]/92 shadow-lg shadow-black/25 backdrop-blur-2xl'
            : 'border-b border-transparent bg-[#1C1E22]/55 backdrop-blur-md'
        )}
      >
        <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group flex flex-shrink-0 items-center gap-2.5">
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#1a1c20] transition-all group-hover:border-[#4FA3D1]/30">
              <Image
                src="/assets/brand/logo.png"
                alt="Soraku"
                width={32}
                height={32}
                className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="text-[15px] font-black tracking-tight text-[#D9DDE3] transition-colors group-hover:text-[#4FA3D1]">
              Soraku
            </span>
          </Link>

          {/* Desktop nav — pill container like Propease */}
          <nav className="hidden items-center lg:flex">
            <div className="flex items-center gap-0.5 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-2 py-1.5 backdrop-blur-sm">
              {NAV_ITEMS.map((item) => {
                if (item.type === 'link') {
                  const active =
                    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-medium transition-all duration-200',
                        active
                          ? 'bg-[#4FA3D1]/15 text-[#4FA3D1]'
                          : 'text-[#6E8FA6] hover:bg-white/5 hover:text-[#D9DDE3]'
                      )}
                    >
                      <item.Icon className="h-3.5 w-3.5 opacity-70" />
                      {item.label}
                    </Link>
                  )
                }
                const g = (item as any).group as NavGroup
                const isOpen = openGroup === g.label
                const isActive = g.children.some((c) => pathname.startsWith(c.href))
                return (
                  <div
                    key={g.label}
                    className="relative"
                    onMouseEnter={() => setOpenGroup(g.label)}
                    onMouseLeave={() => setOpenGroup(null)}
                  >
                    <button
                      className={cn(
                        'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-medium transition-all duration-200',
                        isActive
                          ? 'bg-[#4FA3D1]/15 text-[#4FA3D1]'
                          : isOpen
                            ? 'bg-white/6 text-[#D9DDE3]'
                            : 'text-[#6E8FA6] hover:bg-white/5 hover:text-[#D9DDE3]'
                      )}
                    >
                      <g.Icon className="h-3.5 w-3.5 opacity-70" />
                      {g.label}
                      <ChevronDown
                        className={cn(
                          'h-3 w-3 opacity-50 transition-transform duration-200',
                          isOpen && 'rotate-180'
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        'absolute top-full left-1/2 z-50 origin-top -translate-x-1/2 pt-3 transition-all duration-150',
                        isOpen
                          ? 'pointer-events-auto scale-100 opacity-100'
                          : 'pointer-events-none scale-95 opacity-0'
                      )}
                    >
                      <div className="w-60 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1C1E22]/98 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl">
                        {g.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpenGroup(null)}
                            className={cn(
                              'group/item flex items-start gap-3 rounded-xl px-3.5 py-3 transition-colors',
                              pathname.startsWith(child.href)
                                ? 'bg-[#4FA3D1]/10'
                                : 'hover:bg-white/[0.05]'
                            )}
                          >
                            <div
                              className={cn(
                                'mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-colors',
                                pathname.startsWith(child.href)
                                  ? 'bg-[#4FA3D1]/20'
                                  : 'bg-white/[0.05] group-hover/item:bg-[#4FA3D1]/15'
                              )}
                            >
                              <child.Icon
                                className={cn(
                                  'h-3.5 w-3.5',
                                  pathname.startsWith(child.href)
                                    ? 'text-[#4FA3D1]'
                                    : 'text-[#6E8FA6] group-hover/item:text-[#4FA3D1]'
                                )}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p
                                  className={cn(
                                    'text-sm font-semibold',
                                    pathname.startsWith(child.href)
                                      ? 'text-[#4FA3D1]'
                                      : 'text-[#D9DDE3]/85'
                                  )}
                                >
                                  {child.label}
                                </p>
                                {child.badge && (
                                  <span className="rounded-full bg-[#E8C2A8]/20 px-1.5 py-0.5 text-[9px] font-black text-[#E8C2A8]">
                                    {child.badge}
                                  </span>
                                )}
                              </div>
                              {child.desc && (
                                <p className="mt-0.5 text-xs leading-snug text-[#6E8FA6]/55">
                                  {child.desc}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {/* Discord pill */}
            <a
              href="https://discord.gg/qm3XJvRa6B"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/8 px-3 py-1.5 text-xs font-semibold text-indigo-300/70 transition-all hover:border-indigo-400/35 hover:bg-indigo-500/15 hover:text-indigo-300 sm:flex"
            >
              <DiscordIcon className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Discord</span>
            </a>

            {user ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifOpen((o) => !o)}
                    className={cn(
                      'relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
                      notifOpen
                        ? 'bg-[#4FA3D1]/15 text-[#4FA3D1]'
                        : 'text-[#6E8FA6] hover:bg-white/6 hover:text-[#D9DDE3]'
                    )}
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#4FA3D1] px-1 text-[9px] font-black text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute top-full right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1C1E22]/98 shadow-2xl shadow-black/50 backdrop-blur-xl">
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
                            className="flex items-center gap-1 text-xs text-[#6E8FA6]/60 transition-colors hover:text-[#4FA3D1]"
                          >
                            <CheckCheck className="h-3 w-3" /> Baca semua
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center">
                            <Bell className="mx-auto mb-2 h-8 w-8 text-[#6E8FA6]/25" />
                            <p className="text-xs text-[#6E8FA6]/40">Tidak ada notifikasi</p>
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
                                  'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.04]',
                                  !n.isread && 'bg-[#4FA3D1]/5'
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
                                  <p className="text-xs font-semibold text-[#D9DDE3]/85">
                                    {n.title}
                                  </p>
                                  {n.body && (
                                    <p className="mt-0.5 line-clamp-2 text-[11px] text-[#6E8FA6]/50">
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
                        className="flex items-center justify-center gap-1.5 border-t border-white/[0.06] py-2.5 text-xs text-[#6E8FA6]/50 transition-colors hover:text-[#4FA3D1]"
                      >
                        Lihat semua notifikasi
                      </Link>
                    </div>
                  )}
                </div>

                {/* Profile avatar */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((o) => !o)}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border transition-all',
                      profileOpen
                        ? 'border-[#4FA3D1]/40 ring-2 ring-[#4FA3D1]/20'
                        : 'border-white/10 hover:border-[#4FA3D1]/30'
                    )}
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
                  {profileOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1C1E22]/98 shadow-2xl shadow-black/50 backdrop-blur-xl">
                      <div className="border-b border-white/[0.06] px-4 py-3">
                        <p className="truncate text-sm font-bold text-[#D9DDE3]">{displayName}</p>
                        <p className="truncate text-xs text-[#6E8FA6]/60">
                          @{user.username ?? '—'}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile/me"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6E8FA6]/70 transition-colors hover:bg-white/[0.05] hover:text-[#D9DDE3]"
                        >
                          <User className="h-4 w-4" /> Profil Saya
                        </Link>
                        <Link
                          href="/notifications"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6E8FA6]/70 transition-colors hover:bg-white/[0.05] hover:text-[#D9DDE3]"
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
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6E8FA6]/70 transition-colors hover:bg-white/[0.05] hover:text-[#D9DDE3]"
                          >
                            <Shield className="h-4 w-4" /> Admin Panel
                          </Link>
                        )}
                        <div className="mx-3 my-1 border-t border-white/[0.06]" />
                        <button
                          onClick={handleSignout}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-400/60 transition-colors hover:bg-red-500/8 hover:text-red-400"
                        >
                          <LogOut className="h-4 w-4" /> Keluar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#6E8FA6] transition-colors hover:bg-white/6 hover:text-[#D9DDE3] lg:hidden"
                >
                  {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden rounded-xl px-3.5 py-1.5 text-[13px] font-medium text-[#6E8FA6] transition-colors hover:bg-white/5 hover:text-[#D9DDE3] lg:block"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="hidden items-center gap-1.5 rounded-xl px-4 py-1.5 text-[13px] font-semibold text-white transition-all hover:brightness-110 lg:flex"
                  style={{ background: 'linear-gradient(135deg,#4FA3D1,#3a8fbe)' }}
                >
                  <Sparkles className="h-3.5 w-3.5" /> Bergabung
                </Link>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#6E8FA6] transition-colors hover:bg-white/6 hover:text-[#D9DDE3] lg:hidden"
                >
                  {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ══ MOBILE DROPDOWN ══════════════════════════════════════════════════════ */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative top-[60px] max-h-[calc(100dvh-60px)] overflow-y-auto rounded-b-2xl border-t border-white/[0.08] bg-[#1C1E22] shadow-xl">
            <div className="px-4 py-3">
              {user && (
                <div className="mb-1 flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-3">
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/10">
                    {user.avatarurl ? (
                      <Image
                        src={user.avatarurl}
                        alt={displayName}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#4FA3D1]/10 text-sm font-black text-[#4FA3D1]">
                        {initial}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#D9DDE3]">{displayName}</p>
                    <p className="truncate text-xs text-[#6E8FA6]/55">@{user.username ?? '—'}</p>
                  </div>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-[#4FA3D1] px-1.5 py-0.5 text-[9px] font-black text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
              )}
              <div>
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    pathname === '/'
                      ? 'bg-[#4FA3D1]/10 text-[#4FA3D1]'
                      : 'text-[#6E8FA6]/70 hover:bg-white/[0.04] hover:text-[#D9DDE3]'
                  )}
                >
                  <Home className="h-4 w-4 flex-shrink-0" /> Beranda
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    pathname.startsWith('/about')
                      ? 'bg-[#4FA3D1]/10 text-[#4FA3D1]'
                      : 'text-[#6E8FA6]/70 hover:bg-white/[0.04] hover:text-[#D9DDE3]'
                  )}
                >
                  <Info className="h-4 w-4 flex-shrink-0" /> Tentang
                </Link>
              </div>
              <div className="border-t border-white/[0.06] pt-2">
                <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#6E8FA6]/40">
                  Fitur
                </p>
                {[
                  { label: 'Blog', href: '/blog', Icon: BookOpen },
                  { label: 'Events', href: '/events', Icon: Calendar },
                  { label: 'Galeri', href: '/gallery', Icon: ImageIcon },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      pathname.startsWith(item.href)
                        ? 'bg-[#4FA3D1]/10 text-[#4FA3D1]'
                        : 'text-[#6E8FA6]/70 hover:bg-white/[0.04] hover:text-[#D9DDE3]'
                    )}
                  >
                    <item.Icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-white/[0.06] pt-2">
                <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#6E8FA6]/40">
                  Agensi
                </p>
                {[
                  { label: 'VTuber', href: '/vtubers', Icon: Tv2 },
                  { label: 'Rekrutmen', href: '/requirements', Icon: UserPlus },
                  { label: 'Class Online', href: '/class', Icon: BookOpen },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      pathname.startsWith(item.href)
                        ? 'bg-[#4FA3D1]/10 text-[#4FA3D1]'
                        : 'text-[#6E8FA6]/70 hover:bg-white/[0.04] hover:text-[#D9DDE3]'
                    )}
                  >
                    <item.Icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-white/[0.06] pt-2">
                <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#6E8FA6]/40">
                  Komunitas
                </p>
                {[
                  { label: 'Donasi', href: '/donate', Icon: Heart },
                  { label: 'Premium', href: '/premium', Icon: Star },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      pathname.startsWith(item.href)
                        ? 'bg-[#4FA3D1]/10 text-[#4FA3D1]'
                        : 'text-[#6E8FA6]/70 hover:bg-white/[0.04] hover:text-[#D9DDE3]'
                    )}
                  >
                    <item.Icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-white/[0.06] pt-2">
                <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#6E8FA6]/40">
                  Informasi
                </p>
                {[
                  { label: 'Privasi', href: '/privacy', Icon: Lock },
                  { label: 'Ketentuan', href: '/tos', Icon: FileText },
                  { label: 'Masukan', href: '/feedback', Icon: MessageSquare },
                  { label: 'Lisensi', href: '/license', Icon: Shield },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      pathname.startsWith(item.href)
                        ? 'bg-[#4FA3D1]/10 text-[#4FA3D1]'
                        : 'text-[#6E8FA6]/70 hover:bg-white/[0.04] hover:text-[#D9DDE3]'
                    )}
                  >
                    <item.Icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>
              {user && (
                <div className="border-t border-white/[0.06] pt-2">
                  <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#6E8FA6]/40">
                    Akun
                  </p>
                  {[
                    { label: 'Profil Saya', href: '/profile/me', Icon: User },
                    {
                      label: 'Notifikasi',
                      href: '/notifications',
                      Icon: Bell,
                      count: unreadCount,
                    },
                    ...(IS_ADMIN(user.role)
                      ? [{ label: 'Admin Panel', href: '/admin', Icon: Shield }]
                      : []),
                  ].map((item: any) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#6E8FA6]/70 transition-colors hover:bg-white/[0.04] hover:text-[#D9DDE3]"
                    >
                      <item.Icon className="h-4 w-4 flex-shrink-0" />
                      {item.label}
                      {item.count > 0 && (
                        <span className="ml-auto rounded-full bg-[#4FA3D1] px-1.5 py-0.5 text-[9px] font-black text-white">
                          {item.count}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
              <div className="border-t border-white/[0.06] py-3">
                {user ? (
                  <button
                    onClick={handleSignout}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm font-semibold text-red-400/70 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" /> Keluar
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold text-white"
                      style={{ background: 'linear-gradient(135deg,#4FA3D1,#3a8fbe)' }}
                    >
                      <Sparkles className="h-4 w-4" /> Bergabung Gratis
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center rounded-lg border border-white/[0.08] py-2.5 text-sm font-semibold text-[#6E8FA6]/65 transition-all hover:border-white/[0.15] hover:text-[#D9DDE3]"
                    >
                      Masuk
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
