'use client'

import * as React from 'react'
import {
  PersonIcon,
  GearIcon,
  LockClosedIcon,
  MoonIcon,
  BellIcon,
  LinkBreak2Icon,
  ChevronRightIcon,
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
import { ScrollArea } from '@/components/ui/scroll-area'

export interface ProfileNavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export const PROFILE_NAV_ITEMS: ProfileNavItem[] = [
  { id: 'profile', label: 'Profile', icon: PersonIcon },
  { id: 'account', label: 'Account', icon: GearIcon },
  { id: 'security', label: 'Security', icon: LockClosedIcon },
  { id: 'appearance', label: 'Appearance', icon: MoonIcon },
  { id: 'notifications', label: 'Notifications', icon: BellIcon },
  { id: 'connected', label: 'Connected Accounts', icon: LinkBreak2Icon },
]

interface ProfileSidebarProps {
  activeId: string
  onSelect: (id: string) => void
}

export function ProfileSidebar({ activeId, onSelect }: ProfileSidebarProps) {
  return (
    <Sidebar className="border-border bg-card">
      <SidebarHeader className="px-4 py-4">
        <p className="text-sm font-semibold text-foreground">Settings</p>
        <p className="text-xs text-muted-foreground">
          Kelola profil dan preferensi akunmu
        </p>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              {PROFILE_NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const active = activeId === item.id
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      isActive={active}
                      onClick={() => onSelect(item.id)}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                      <ChevronRightIcon
                        className={`ml-auto h-4 w-4 transition-transform ${
                          active ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
