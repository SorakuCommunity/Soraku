'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  PersonIcon,
  GearIcon,
  LockClosedIcon,
  MoonIcon,
  BellIcon,
  LinkBreak2Icon,
} from '@radix-ui/react-icons'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const NAV_ITEMS = [
  { href: '/settings/profile', label: 'Profile', icon: PersonIcon },
  { href: '/settings/account', label: 'Account', icon: GearIcon },
  { href: '/settings/security', label: 'Security', icon: LockClosedIcon },
  { href: '/settings/appearance', label: 'Appearance', icon: MoonIcon },
  { href: '/settings/notifications', label: 'Notifications', icon: BellIcon },
  { href: '/settings/connected-accounts', label: 'Connected Accounts', icon: LinkBreak2Icon },
]

interface SessionUser {
  username: string | null
  displayname: string | null
  avatarurl: string | null
}

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('') || 'S'
  )
}

export function SettingsSidebar() {
  const pathname = usePathname()
  const [user, setUser] = React.useState<SessionUser | null>(null)

  React.useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.data ?? null))
      .catch(() => {})
  }, [])

  const name = user?.displayname || user?.username || 'User'

  return (
    <Sidebar className="border-border bg-card">
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatarurl ?? undefined} alt={name} />
            <AvatarFallback className="text-sm">{initials(name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{name}</p>
            {user?.username ? (
              <Link
                href={`/@${user.username}`}
                className="block truncate text-xs text-primary hover:underline"
              >
                View profile
              </Link>
            ) : null}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                    <Link href={item.href} aria-current={active ? 'page' : undefined}>
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
