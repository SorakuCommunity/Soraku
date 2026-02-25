'use client'

import { useState } from 'react'
import {
  LayoutDashboard, Users, FileText, Calendar,
  Star, Image, Settings, Menu
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

const MENU = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, minRole: 'USER' },
  { id: 'users',     label: 'Pengguna',  icon: Users,           minRole: 'ADMIN' },
  { id: 'blog',      label: 'Blog',      icon: FileText,        minRole: 'ADMIN' },
  { id: 'events',    label: 'Events',    icon: Calendar,        minRole: 'MANAGER' },
  { id: 'vtubers',   label: 'VTuber',    icon: Star,            minRole: 'MANAGER' },
  { id: 'gallery',   label: 'Gallery',   icon: Image,           minRole: 'ADMIN' },
  { id: 'settings',  label: 'Settings',  icon: Settings,        minRole: 'OWNER' },
] as const

type TabId = typeof MENU[number]['id']

const ROLE_LEVELS: Record<UserRole, number> = {
  OWNER: 5, MANAGER: 4, ADMIN: 3, AGENSI: 2, USER: 1,
}

interface Props {
  role: UserRole
  children: (activeTab: TabId) => React.ReactNode
}

export function AdminShell({ role, children }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const allowed = MENU.filter(m => ROLE_LEVELS[role] >= ROLE_LEVELS[m.minRole as UserRole])

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-16 left-0 z-40 w-60 bg-soraku-card border-r border-soraku-border transform transition-transform duration-200 lg:relative lg:inset-auto lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-4 h-full overflow-y-auto">
          <nav className="space-y-1">
            {allowed.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setSidebarOpen(false) }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                  activeTab === id
                    ? 'bg-soraku-gradient text-white shadow-lg'
                    : 'text-soraku-sub hover:text-soraku-text hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mb-4 text-soraku-sub hover:text-soraku-text"
          >
            <Menu className="w-5 h-5" />
          </button>
          {children(activeTab)}
        </div>
      </div>
    </div>
  )
}
