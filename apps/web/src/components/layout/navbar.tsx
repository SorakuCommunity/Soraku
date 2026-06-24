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
  Trophy,
  Wallet,
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
  { type: 'link', label: 'Home', href: '/', Icon: Home },
  { type: 'link', label: 'Community', href: '/community', Icon: Users },
  { type: 'link', label: 'Showcase', href: '/showcase', Icon: Layers },
  { type: 'link', label: 'Events', href: '/events', Icon: Calendar },
  { type: 'link', label: 'Leaderboard', href: '/leaderboard', Icon: Trophy },
  { type: 'link', label: 'About', href: '/about', Icon: Info },
  {
    type: 'group',
    group: {
      label: 'More',
      Icon: Menu,
      children: [
        { label: 'Blog', href: '/blog', Icon: BookOpen, desc: 'Articles & community reviews' },
        { label: 'Gallery', href: '/gallery', Icon: ImageIcon, desc: 'Fanart & member works' },
        { label: 'VTubers', href: '/vtubers', Icon: Tv2, desc: 'Community virtual creators' },
        { label: 'Donate', href: '/donate', Icon: Heart, desc: 'Support Soraku' },
        { label: 'Premium', href: '/premium', Icon: Star, desc: 'Exclusive access', badge: 'NEW' },
      ],
    },
  },
  {
    type: 'group',
    group: {
      label: 'Info',
      Icon: FileText,
      children: [
        { label: 'Privacy', href: '/privacy', Icon: Lock, desc: 'Privacy policy' },
        { label: 'Terms', href: '/tos', Icon: FileText, desc: 'Terms of service' },
        { label: 'Feedback', href: '/feedback', Icon: MessageSquare, desc: 'Send suggestions' },
        { label: 'License', href: '/license', Icon: Shield, desc: 'Open source license' },
      ],
    },
  },
]

const BOTTOM_NAV = [
  { label: 'Home', href: '/', Icon: Home },
  { label: 'Community', href: '/community', Icon: Users },
  { label: 'Showcase', href: '/showcase', Icon: Layers },
  { label: 'Events', href: '/events', Icon: Calendar },
  { label: 'Profile', href: '/profile/me', Icon: User, auth: true },
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
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications(!!user)

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setUser(d.data ?? null))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
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
      {/* ══ DESKTOP HEADER ═══════════════════════════════════════════ */}
      <header className="fixed inset-x-0 top-0 z-50 hidden border-b border-white/[0.06] bg-[#0B1120]/95 shadow-lg shadow-black/25 backdrop-blur-2xl lg:block">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="group flex flex-shrink-0 items-center gap-2.5">
            <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded border border-white/10 bg-[#0B1120] transition-all group-hover:border-primary/30">
              <Image
                src="/assets/brand/logo.png"
                alt="Soraku"
                width={28}
                height={28}
                className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="text-sm font-black tracking-tight text-foreground transition-colors group-hover:text-primary">
              Soraku
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="flex items-center">
            <div className="flex items-center gap-0.5 rounded-md border border-white/[0.06] bg-white/[0.02] px-1.5 py-1">
              {NAV_ITEMS.map((item) => {
                if (item.type === 'link') {
                  const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold transition-all duration-200',
                        active
                          ? 'bg-primary/15 text-primary'
                          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                      )}
                    >
                      <item.Icon className="h-3.5 w-3.5" />
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
                        'flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold transition-all duration-200',
                        isActive
                          ? 'bg-primary/15 text-primary'
                          : isOpen
                            ? 'bg-white/5 text-foreground'
                            : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                      )}
                    >
                      <g.Icon className="h-3.5 w-3.5" />
                      {g.label}
                      <ChevronDown className={cn('h-3 w-3 opacity-50 transition-transform duration-200', isOpen && 'rotate-180')} />
                    </button>
                    <div
                      className={cn(
                        'absolute top-full left-1/2 z-50 origin-top -translate-x-1/2 pt-2 transition-all duration-150',
                        isOpen
                          ? 'pointer-events-auto scale-100 opacity-100'
                          : 'pointer-events-none scale-95 opacity-0'
                      )}
                    >
                      <div className="w-56 overflow-hidden rounded-md border-2 border-white/[0.08] bg-[#111827] shadow-[4px_4px_0px_rgba(37,99,235,0.15)]">
                        {g.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpenGroup(null)}
                            className={cn(
                              'group/item flex items-start gap-3 border-b border-white/[0.04] px-3.5 py-2.5 last:border-0 transition-colors',
                              pathname.startsWith(child.href)
                                ? 'bg-primary/10'
                                : 'hover:bg-white/[0.04]'
                            )}
                          >
                            <div
                              className={cn(
                                'mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded border',
                                pathname.startsWith(child.href)
                                  ? 'border-primary/30 bg-primary/20'
                                  : 'border-white/10 bg-white/[0.05] group-hover/item:border-primary/30'
                              )}
                            >
                              <child.Icon
                                className={cn(
                                  'h-3.5 w-3.5',
                                  pathname.startsWith(child.href)
                                    ? 'text-primary'
                                    : 'text-muted-foreground group-hover/item:text-primary'
                                )}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className={cn('text-xs font-bold', pathname.startsWith(child.href) ? 'text-primary' : 'text-foreground/85')}>
                                  {child.label}
                                </p>
                                {child.badge && (
                                  <span className="rounded border border-amber-500/30 bg-amber-500/15 px-1.5 py-0.5 text-[8px] font-black text-amber-400">
                                    {child.badge}
                                  </span>
                                )}
                              </div>
                              {child.desc && (
                                <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground/60">
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
            {/* Discord */}
            <a
              href="https://discord.gg/qm3XJvRa6B"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md border border-indigo-500/20 bg-indigo-500/8 px-2.5 py-1.5 text-xs font-semibold text-indigo-300/70 transition-all hover:border-indigo-400/35 hover:bg-indigo-500/15 hover:text-indigo-300"
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
                      'relative flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                      notifOpen
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    )}
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded bg-primary px-1 text-[8px] font-black text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-md border-2 border-white/[0.08] bg-[#111827] shadow-[4px_4px_0px_rgba(37,99,235,0.15)]">
                      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                        <span className="text-sm font-bold text-foreground">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={() => markAllRead()} className="flex items-center gap-1 text-[11px] text-muted-foreground/60 transition-colors hover:text-primary">
                            <CheckCheck className="h-3 w-3" /> Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center">
                            <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground/25" />
                            <p className="text-xs text-muted-foreground/40">No notifications</p>
                          </div>
                        ) : (
                          notifications.slice(0, 8).map((n) => {
                            const cfg = (NOTIF_CONFIG as any)[n.type] ?? (NOTIF_CONFIG as any).info
                            const NIcon = cfg.icon as React.ElementType | undefined
                            return (
                              <button
                                key={n.id}
                                onClick={() => { markRead([n.id]); setNotifOpen(false) }}
                                className={cn(
                                  'flex w-full items-start gap-3 border-b border-white/[0.04] px-4 py-3 text-left transition-colors hover:bg-white/[0.04]',
                                  !n.isread && 'bg-primary/5'
                                )}
                              >
                                <div className={cn('mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded border', cfg.bg)}>
                                  {NIcon ? <NIcon className={cn('h-3.5 w-3.5', cfg.color)} /> : <span className="text-sm">{cfg.emoji}</span>}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-semibold text-foreground/85">{n.title}</p>
                                  {n.body && <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground/50">{n.body}</p>}
                                </div>
                                {!n.isread && <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />}
                              </button>
                            )
                          })
                        )}
                      </div>
                      <Link href="/notifications" onClick={() => setNotifOpen(false)}
                        className="flex items-center justify-center gap-1.5 border-t border-white/[0.06] py-2.5 text-xs text-muted-foreground/50 transition-colors hover:text-primary">
                        View all notifications
                      </Link>
                    </div>
                  )}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((o) => !o)}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center overflow-hidden rounded-md border-2 transition-all',
                      profileOpen
                        ? 'border-primary/40'
                        : 'border-white/10 hover:border-primary/30'
                    )}
                  >
                    {user.avatarurl ? (
                      <Image src={user.avatarurl} alt={displayName} width={32} height={32} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs font-black text-primary">{initial || <User className="h-4 w-4" />}</span>
                    )}
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-md border-2 border-white/[0.08] bg-[#111827] shadow-[4px_4px_0px_rgba(37,99,235,0.15)]">
                      <div className="border-b border-white/[0.06] px-4 py-3">
                        <p className="truncate text-sm font-bold text-foreground">{displayName}</p>
                        <p className="truncate text-xs text-muted-foreground/60">@{user.username ?? '—'}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/profile/me" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-muted-foreground/70 transition-colors hover:bg-white/[0.05] hover:text-foreground">
                          <User className="h-4 w-4" /> My Profile
                        </Link>
                        <Link href="/wallet" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-muted-foreground/70 transition-colors hover:bg-white/[0.05] hover:text-foreground">
                          <Wallet className="h-4 w-4" /> Wallet
                        </Link>
                        <Link href="/notifications" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-muted-foreground/70 transition-colors hover:bg-white/[0.05] hover:text-foreground">
                          <Bell className="h-4 w-4" /> Notifications
                          {unreadCount > 0 && (
                            <span className="ml-auto rounded bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold text-primary">{unreadCount}</span>
                          )}
                        </Link>
                        {IS_ADMIN(user.role) && (
                          <Link href="/admin" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-muted-foreground/70 transition-colors hover:bg-white/[0.05] hover:text-foreground">
                            <Shield className="h-4 w-4" /> Admin Panel
                          </Link>
                        )}
                        <div className="mx-3 my-1 border-t border-white/[0.06]" />
                        <button onClick={handleSignout}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs text-red-400/60 transition-colors hover:bg-red-500/8 hover:text-red-400">
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login"
                  className="rounded-md px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
                  Login
                </Link>
                <Link href="/register"
                  className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-[2px_2px_0px_rgba(37,99,235,0.3)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_rgba(37,99,235,0.4)]">
                  <Sparkles className="h-3.5 w-3.5" /> Join
                </Link>
                <button onClick={() => setMenuOpen((o) => !o)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground lg:hidden">
                  {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ══ MOBILE BOTTOM NAV ═══════════════════════════════════════ */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-white/[0.06] bg-[#0B1120]/98 backdrop-blur-2xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around py-1">
          {BOTTOM_NAV.map((item) => {
            if (item.auth && !user && item.href === '/profile/me') {
              return (
                <Link
                  key={item.href}
                  href="/login"
                  className="flex flex-col items-center gap-0.5 px-4 py-1.5"
                >
                  <item.Icon className="h-5 w-5 text-muted-foreground/60" />
                  <span className="text-[10px] font-medium text-muted-foreground/60">{item.label}</span>
                </Link>
              )
            }
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground/60'
                )}
              >
                <item.Icon className={cn('h-5 w-5', active && 'fill-primary/20')} />
                <span className={cn('text-[10px] font-semibold', active ? 'text-primary' : 'text-muted-foreground/60')}>
                  {item.label}
                </span>
                {item.label === 'Profile' && unreadCount > 0 && user && (
                  <span className="absolute top-1 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ══ MOBILE OVERFLOW MENU ════════════════════════════════════ */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <div className="relative top-0 max-h-[calc(100dvh-64px)] overflow-y-auto border-b-2 border-white/[0.08] bg-[#0B1120] shadow-[0_4px_0px_rgba(37,99,235,0.15)]">
            <div className="px-4 py-3">
              {user && (
                <div className="mb-3 flex items-center gap-3 rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-3">
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded border border-white/10">
                    {user.avatarurl ? (
                      <Image src={user.avatarurl} alt={displayName} width={40} height={40} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-sm font-black text-primary">{initial}</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">{displayName}</p>
                    <p className="truncate text-xs text-muted-foreground/55">@{user.username ?? '—'}</p>
                  </div>
                  {unreadCount > 0 && (
                    <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-black text-white">{unreadCount}</span>
                  )}
                </div>
              )}

              <div className="space-y-0.5">
                {[
                  { label: 'Home', href: '/', Icon: Home },
                  { label: 'Community', href: '/community', Icon: Users },
                  { label: 'Showcase', href: '/showcase', Icon: Layers },
                  { label: 'Events', href: '/events', Icon: Calendar },
                  { label: 'Leaderboard', href: '/leaderboard', Icon: Trophy },
                  { label: 'About', href: '/about', Icon: Info },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors',
                      pathname.startsWith(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground/70 hover:bg-white/[0.04] hover:text-foreground'
                    )}
                  >
                    <item.Icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-2 border-t border-white/[0.06] pt-2">
                <p className="px-3 pb-2 text-[9px] font-black tracking-[0.15em] text-muted-foreground/40 uppercase">
                  Features
                </p>
                {[
                  { label: 'Blog', href: '/blog', Icon: BookOpen },
                  { label: 'Gallery', href: '/gallery', Icon: ImageIcon },
                  { label: 'VTubers', href: '/vtubers', Icon: Tv2 },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors',
                      pathname.startsWith(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground/70 hover:bg-white/[0.04] hover:text-foreground'
                    )}
                  >
                    <item.Icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-2 border-t border-white/[0.06] pt-2">
                <p className="px-3 pb-2 text-[9px] font-black tracking-[0.15em] text-muted-foreground/40 uppercase">
                  Community
                </p>
                {[
                  { label: 'Donate', href: '/donate', Icon: Heart },
                  { label: 'Premium', href: '/premium', Icon: Star },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors',
                      pathname.startsWith(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground/70 hover:bg-white/[0.04] hover:text-foreground'
                    )}
                  >
                    <item.Icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-2 border-t border-white/[0.06] pt-2">
                <p className="px-3 pb-2 text-[9px] font-black tracking-[0.15em] text-muted-foreground/40 uppercase">
                  Info
                </p>
                {[
                  { label: 'Privacy', href: '/privacy', Icon: Lock },
                  { label: 'Terms', href: '/tos', Icon: FileText },
                  { label: 'Feedback', href: '/feedback', Icon: MessageSquare },
                  { label: 'License', href: '/license', Icon: Shield },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors',
                      pathname.startsWith(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground/70 hover:bg-white/[0.04] hover:text-foreground'
                    )}
                  >
                    <item.Icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>

              {user && (
                <div className="mt-2 border-t border-white/[0.06] pt-2">
                  <p className="px-3 pb-2 text-[9px] font-black tracking-[0.15em] text-muted-foreground/40 uppercase">
                    Account
                  </p>
                  {[
                    { label: 'My Profile', href: '/profile/me', Icon: User },
                    { label: 'Wallet', href: '/wallet', Icon: Wallet },
                    { label: 'Notifications', href: '/notifications', Icon: Bell, count: unreadCount },
                    ...(IS_ADMIN(user.role) ? [{ label: 'Admin Panel', href: '/admin', Icon: Shield }] : []),
                  ].map((item: any) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-muted-foreground/70 transition-colors hover:bg-white/[0.04] hover:text-foreground"
                    >
                      <item.Icon className="h-4 w-4 flex-shrink-0" />
                      {item.label}
                      {item.count > 0 && (
                        <span className="ml-auto rounded bg-primary px-1.5 py-0.5 text-[8px] font-black text-white">{item.count}</span>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-2 border-t border-white/[0.06] py-3">
                {user ? (
                  <button onClick={handleSignout}
                    className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm font-semibold text-red-400/70 transition-colors hover:bg-red-500/10 hover:text-red-400">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/register" onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-bold text-primary-foreground shadow-[2px_2px_0px_rgba(37,99,235,0.3)]">
                      <Sparkles className="h-4 w-4" /> Join Soraku
                    </Link>
                    <Link href="/login" onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center rounded-md border-2 border-white/[0.08] py-2.5 text-sm font-semibold text-muted-foreground/65 transition-all hover:border-white/[0.15] hover:text-foreground">
                      Login
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
