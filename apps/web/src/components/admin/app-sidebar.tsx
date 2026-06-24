'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Image as ImageIcon,
  Users,
  Shield,
  Webhook,
  Settings,
  CreditCard,
  BarChart3,
  Bot,
  Sparkles,
  Handshake,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@soraku/ui'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@soraku/ui'
import { useSidebar } from './sidebar-context'

export const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, group: null },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, group: 'Analytics' },
  { href: '/admin/premium', label: 'Premium', icon: Sparkles, group: 'Subscription' },
  { href: '/admin/billing', label: 'Billing', icon: CreditCard, group: 'Subscription' },
  { href: '/admin/blog', label: 'Blog', icon: BookOpen, group: 'Konten' },
  { href: '/admin/blog/ai-generate', label: 'AI Generator', icon: Sparkles, group: 'Konten' },
  { href: '/admin/events', label: 'Event', icon: Calendar, group: 'Konten' },
  { href: '/admin/gallery', label: 'Galeri', icon: ImageIcon, group: 'Konten' },
  { href: '/admin/partnerships', label: 'Partnership', icon: Handshake, group: 'Konten' },
  { href: '/admin/bot', label: 'Discord Bot', icon: Bot, group: 'Bot' },
  { href: '/admin/webhooks', label: 'Webhook', icon: Webhook, group: 'Pengaturan' },
  { href: '/admin/users', label: 'Pengguna', icon: Users, group: 'Sistem' },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings, group: 'Sistem' },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { isCollapsed } = useSidebar()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Subscription: true,
    Konten: true,
    Sistem: true,
    Pengaturan: true,
    Bot: true,
    Analytics: true,
  })

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }))
  }

  // Group the navigation items
  const groupedNav: Record<string, typeof ADMIN_NAV> = {}
  ADMIN_NAV.forEach((item) => {
    const key = item.group || 'Independent'
    if (!groupedNav[key]) groupedNav[key] = []
    groupedNav[key].push(item)
  })

  return (
    <aside
      className={cn(
        'hidden flex-shrink-0 flex-col border-r bg-background lg:flex transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[70px]' : 'w-64'
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-4 justify-center">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-2 font-semibold transition-all duration-300',
            isCollapsed ? 'justify-center w-full' : 'w-full'
          )}
        >
          <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-md bg-primary/10 flex items-center justify-center">
            <Image
              src="/assets/brand/logo.png"
              alt="Soraku"
              width={28}
              height={28}
              className="h-6 w-6 object-cover"
            />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold tracking-tight whitespace-nowrap overflow-hidden">
              Soraku Admin
            </span>
          )}
        </Link>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-thin">
        <nav className="grid items-start gap-1 px-2 text-sm font-medium">
          {Object.entries(groupedNav).map(([group, items]) => {
            if (group === 'Independent') {
              return items.map(({ href, label, icon: Icon }) => {
                const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    title={isCollapsed ? label : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2.5 text-muted-foreground transition-all hover:text-foreground',
                      active ? 'bg-muted text-primary hover:text-primary font-medium' : 'hover:bg-muted/50',
                      isCollapsed && 'justify-center px-0'
                    )}
                  >
                    <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                    {!isCollapsed && <span>{label}</span>}
                  </Link>
                )
              })
            }

            // Group with 1 item
            if (items.length === 1) {
              const item = items[0]
              const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
              return (
                <div key={group} className="w-full mt-2">
                  {!isCollapsed && (
                    <h4 className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                      {group}
                    </h4>
                  )}
                  <Link
                    href={item.href}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2.5 text-muted-foreground transition-all hover:text-foreground',
                      active ? 'bg-muted text-primary hover:text-primary font-medium' : 'hover:bg-muted/50',
                      isCollapsed && 'justify-center px-0'
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </div>
              )
            }

            // Group with >1 item (Collapsible)
            const hasActiveChild = items.some((item) => pathname.startsWith(item.href))
            const isOpen = isCollapsed ? false : (openGroups[group] ?? false) || hasActiveChild

            return (
              <div key={group} className="w-full mt-2">
                {isCollapsed ? (
                  // If collapsed, don't use collapsible, just show icons as a list or block
                  <div className="flex flex-col gap-1 border-t border-border/50 pt-2 mt-2 first:mt-0 first:border-0 first:pt-0">
                    {items.map(({ href, label, icon: Icon }) => {
                      const active = pathname.startsWith(href)
                      return (
                        <Link
                          key={href}
                          href={href}
                          title={label}
                          className={cn(
                            'flex items-center justify-center rounded-md py-2.5 text-muted-foreground transition-all hover:text-foreground hover:bg-muted/50',
                            active && 'bg-muted text-primary hover:text-primary'
                          )}
                        >
                          <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <Collapsible open={isOpen} onOpenChange={() => toggleGroup(group)}>
                    <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-foreground transition-colors">
                      {group}
                      {isOpen ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-1 border-l-2 border-border/50 ml-4 pl-2">
                      {items.map(({ href, label, icon: Icon }) => {
                        const active = pathname.startsWith(href)
                        return (
                          <Link
                            key={href}
                            href={href}
                            className={cn(
                              'flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-all hover:text-foreground',
                              active ? 'text-primary font-medium bg-muted/30' : 'hover:bg-muted/30'
                            )}
                          >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            <span>{label}</span>
                          </Link>
                        )
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="mt-auto p-4 border-t">
        <div
          className={cn(
            'flex items-center gap-3 rounded-lg border bg-muted/30 p-2 transition-all duration-300',
            isCollapsed && 'justify-center border-none bg-transparent p-0'
          )}
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-[18px] w-[18px] text-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col whitespace-nowrap overflow-hidden">
              <span className="text-sm font-semibold">Admin Mode</span>
              <span className="text-xs text-muted-foreground">Soraku Panel v1.5</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
