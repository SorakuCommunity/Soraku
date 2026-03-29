'use client'
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Home, User, Image as ImageIcon, Bell, Shield, LogOut, ChevronRight } from 'lucide-react'
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

  const displayName = user?.displayname ?? user?.username ?? 'Member'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl gap-8 px-4 py-8 pb-24 sm:px-6 lg:px-8">
      {/* Sidebar */}
      <aside className="hidden w-56 flex-shrink-0 lg:block">
        <div className="sticky top-24 space-y-2">
          {/* User card */}
          <div className="glass-card p-4">
            <Link href="/profile/me" className="group flex items-center gap-3">
              <div className="bg-primary/15 text-primary border-primary/20 group-hover:border-primary/40 flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border font-bold transition-colors">
                {user?.avatarurl ? (
                  <Image
                    src={user.avatarurl}
                    alt={displayName}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-black">{initial}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="group-hover:text-primary truncate text-sm font-bold transition-colors">
                  {displayName}
                </p>
                <p className="text-muted-foreground/50 truncate text-xs">
                  @{user?.username ?? '—'}
                </p>
              </div>
              <ChevronRight className="text-muted-foreground/30 group-hover:text-primary/60 h-3.5 w-3.5 flex-shrink-0 transition-colors" />
            </Link>
          </div>

          {/* Nav */}
          <div className="glass-card p-3">
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
                      'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-primary/8 hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {label}
                  </Link>
                )
              })}

              <div className="border-border/40 my-1.5 border-t" />

              {user && IS_ADMIN(user.role) && (
                <Link
                  href="/admin"
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    pathname.startsWith('/admin')
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-primary/8 hover:text-foreground'
                  )}
                >
                  <Shield className="h-4 w-4 flex-shrink-0" /> Admin Panel
                </Link>
              )}

              <button
                onClick={handleSignout}
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4 flex-shrink-0" /> Keluar
              </button>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  )
}
