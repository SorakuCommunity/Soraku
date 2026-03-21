'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Image,
  Users,
  Shield,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ADMIN_NAV = [
  { href: '/', label: 'Beranda', icon: Home, group: null },
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, group: null },
  { href: '/admin/blog', label: 'Blog', icon: BookOpen, group: 'Konten' },
  { href: '/admin/events', label: 'Event', icon: Calendar, group: 'Konten' },
  { href: '/admin/gallery', label: 'Galeri', icon: Image, group: 'Konten' },
  { href: '/admin/users', label: 'Pengguna', icon: Users, group: 'Sistem' },
]

export default function DashAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Sidebar — minimalist, borderless */}
      <aside className="hidden w-48 flex-shrink-0 lg:block">
        <div className="sticky top-24">
          {/* Admin badge */}
          <div className="mb-6 flex items-center gap-2.5">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-xl">
              <Shield className="text-primary/70 h-4 w-4" />
            </div>
            <div>
              <p className="text-sm leading-none font-black">Admin</p>
              <p className="text-muted-foreground/40 mt-0.5 text-[10px]">Soraku Panel</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-0.5">
            {(() => {
              let lastGroup: string | null = undefined as any
              return ADMIN_NAV.map(({ href, label, icon: Icon, group }) => {
                const showGroup = group !== lastGroup
                lastGroup = group
                const active =
                  href === '/'
                    ? pathname === '/'
                    : href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(href)

                return (
                  <div key={href}>
                    {showGroup && group && (
                      <p className="text-muted-foreground/25 mt-4 mb-1.5 px-2 text-[9px] font-black tracking-[0.2em] uppercase">
                        {group}
                      </p>
                    )}
                    <Link
                      href={href}
                      className={cn(
                        'group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground/60 hover:bg-muted/20 hover:text-foreground'
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                        {label}
                      </span>
                      {active && <ChevronRight className="h-3 w-3 opacity-40" />}
                    </Link>
                  </div>
                )
              })
            })()}
          </nav>

          {/* Bottom separator */}
          <div className="from-border/20 mt-8 h-px bg-gradient-to-r to-transparent" />
          <p className="text-muted-foreground/20 mt-4 px-2 text-[9px] font-semibold tracking-wider uppercase">
            Soraku v1.0
          </p>
        </div>
      </aside>

      {/* Content */}
      <main className="min-w-0 flex-1 pb-12">{children}</main>
    </div>
  )
}
