'use client'

import { useState } from 'react'
import { LayoutDashboard, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/roles'
import type { User } from '@/types'

interface Tab {
  key: string
  label: string
  icon: React.ElementType
}

interface Props {
  user: User
  tabs: Tab[]
  onTabChange: (tab: string) => void
  children: (activeTab: string) => React.ReactNode
}

export function AdminShell({ user, tabs, onTabChange, children }: Props) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key ?? 'dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleTabChange = (key: string) => {
    setActiveTab(key)
    setSidebarOpen(false)
    onTabChange(key)
  }

  return (
    <div className="flex min-h-[calc(100vh-96px)]">
      {/* ─── Mobile overlay ────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ───────────────────────────────────────────────── */}
      <aside className={cn(
        'fixed top-16 bottom-0 left-0 z-40 w-60 bg-soraku-card border-r border-soraku-border',
        'transform transition-transform duration-200',
        'lg:relative lg:top-auto lg:bottom-auto lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* User info */}
        <div className="p-4 border-b border-soraku-border">
          <div className="flex items-center gap-3">
            {user.avatar_url
              ? <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full" />
              : <div className="w-8 h-8 rounded-full bg-purple-500/20" />
            }
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.display_name ?? user.username ?? 'Admin'}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${ROLE_COLORS[user.role]}`}>
                {ROLE_LABELS[user.role]}
              </span>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-0.5">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                activeTab === key
                  ? 'bg-soraku-gradient text-white shadow-lg'
                  : 'text-soraku-sub hover:text-soraku-text hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ─── Content ───────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-6 py-4 border-b border-soraku-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-soraku-sub hover:text-soraku-text"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-sm">
            {tabs.find(t => t.key === activeTab)?.label ?? 'Admin'}
          </span>
        </div>

        <div className="p-6">
          {children(activeTab)}
        </div>
      </div>
    </div>
  )
}
