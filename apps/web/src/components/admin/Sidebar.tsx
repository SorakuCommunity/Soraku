'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Image as LucideImage,
  Settings,
  Trophy,
  Banknote,
  LayoutGrid,
  LogOut,
  Moon,
  Sun,
  Handshake,
} from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Dashboard',
      href: '/(admin)/admin',
      icon: LayoutDashboard,
      isActive: pathname === '/(admin)/admin',
    },
    {
      name: 'Pengguna',
      href: '/(admin)/admin/users',
      icon: Users,
      isActive: pathname.startsWith('/(admin)/admin/users'),
    },
    {
      name: 'Artikel',
      href: '/(admin)/admin/blog',
      icon: BookOpen,
      isActive: pathname.startsWith('/(admin)/admin/blog'),
    },
    {
      name: 'Event',
      href: '/(admin)/admin/events',
      icon: Calendar,
      isActive: pathname.startsWith('/(admin)/admin/events'),
    },
    {
      name: 'Galeri',
      href: '/(admin)/admin/gallery',
      icon: LucideImage,
      isActive: pathname.startsWith('/(admin)/admin/gallery'),
    },
    {
      name: 'Partnership',
      href: '/(admin)/admin/partnerships',
      icon: Handshake,
      isActive: pathname.startsWith('/(admin)/admin/partnerships'),
    },
    {
      name: 'Sponsor',
      href: '/(admin)/admin/sponsorships',
      icon: Banknote,
      isActive: pathname.startsWith('/(admin)/admin/sponsorships'),
    },
    {
      name: 'Pengaturan',
      href: '/(admin)/admin/settings',
      icon: Settings,
      isActive: pathname.startsWith('/(admin)/admin/settings'),
    },
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white/5 backdrop-blur-sm border-r border-white/10">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center px-4 border-b border-white/10">
          <Link href="/" className="flex items-center space-x-3">
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#1a1c20]">
              <Image
                src="/assets/brand/logo.png"
                alt="Soraku Logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <span className="font-black text-white text-lg">Soraku Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                item.isActive
                  ? 'bg-white/10 text-white border-l-4 border-primary'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon className={cn(
                item.isActive ? 'h-5 w-5 text-primary' : 'h-5 w-5 text-white/60'
              )} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <Moon className="h-4 w-4 text-white/60 hover:text-white" />
            <button
              onClick={() => {
                // Toggle theme implementation would go here
              }}
              className="p-1 rounded hover:bg-white/5"
            >
              <Sun className="h-4 w-4 text-white/60 hover:text-white" />
            </button>
            <Link
              href="/api/auth/logout"
              className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}