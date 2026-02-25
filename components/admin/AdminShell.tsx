'use client'

import { useState } from 'react'
import { LayoutDashboard, Users, FileText, Calendar, Star, Image, Settings, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

const MENU = [
  { id: 'dashboard', label: 'Dashboard',   Icon: LayoutDashboard, minLevel: 1 },
  { id: 'users',     label: 'Pengguna',    Icon: Users,            minLevel: 3 },
  { id: 'blog',      label: 'Blog',        Icon: FileText,         minLevel: 3 },
  { id: 'events',    label: 'Events',      Icon: Calendar,         minLevel: 4 },
  { id: 'vtubers',   label: 'Anime/Talent',Icon: Star,             minLevel: 4 },
  { id: 'gallery',   label: 'Gallery',     Icon: Image,            minLevel: 3 },
  { id: 'settings',  label: 'Settings',    Icon: Settings,         minLevel: 5 },
] as const

export type TabId = (typeof MENU)[number]['id']

const LEVEL: Record<UserRole, number> = {
  OWNER: 7, MANAGER: 6, ADMIN: 5, AGENSI: 4, PREMIUM: 3, DONATE: 2, USER: 1,
}

interface Props {
  role: UserRole
  children: (tab: TabId) => React.ReactNode
}

export function AdminShell({ role, children }: Props) {
  const [active, setActive] = useState<TabId>('dashboard')
  const [open, setOpen] = useState(false)
  const level = LEVEL[role]
  const allowed = MENU.filter(m => level >= m.minLevel)

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <aside className={cn(
        'fixed inset-y-16 left-0 z-40 w-60 bg-soraku-card border-r border-soraku-border transition-transform duration-200',
        'lg:relative lg:inset-auto lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-4 h-full overflow-y-auto">
          <nav className="space-y-1">
            {allowed.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => { setActive(id); setOpen(false) }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active === id ? 'bg-soraku-gradient text-white shadow-lg' : 'text-soraku-sub hover:text-soraku-text hover:bg-white/5'
                )}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </nav>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <button onClick={() => setOpen(true)}
            className="lg:hidden mb-4 p-2 rounded-lg glass text-soraku-sub hover:text-soraku-text">
            <Menu className="w-5 h-5" />
          </button>
          {children(active)}
        </div>
      </div>
    </div>
  )
}
