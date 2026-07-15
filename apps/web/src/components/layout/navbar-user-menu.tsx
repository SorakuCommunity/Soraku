'use client'

import * as React from 'react'
import Link from 'next/link'
import { PersonIcon, GearIcon, SliderIcon, ExitIcon } from '@radix-ui/react-icons'
import { Shield } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface ProductSessionUser {
  id: string
  username: string | null
  displayname: string | null
  avatarurl: string | null
  role: string
}

const IS_ADMIN = (r?: string) => ['OWNER', 'MANAGER', 'ADMIN'].includes((r ?? '').toUpperCase())

export function NavbarUserMenu({
  user,
  onSignout,
}: {
  user: ProductSessionUser | null
  onSignout: () => void
}) {
  const name = user?.displayname || user?.username || 'User'
  const initial = name.charAt(0).toUpperCase()
  const profileHref = user?.username ? `/@${user.username}` : '/'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border border-border transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Account menu"
        >
          <Avatar className="h-9 w-9">
            {user?.avatarurl ? <AvatarImage src={user.avatarurl} alt={name} /> : null}
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium text-foreground">{name}</p>
          {user?.username ? <p className="text-xs text-muted-foreground">@{user.username}</p> : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={profileHref} className="flex w-full cursor-pointer items-center">
            <PersonIcon className="mr-2 h-4 w-4" /> View Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings/profile" className="flex w-full cursor-pointer items-center">
            <GearIcon className="mr-2 h-4 w-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings/appearance" className="flex w-full cursor-pointer items-center">
            <SliderIcon className="mr-2 h-4 w-4" /> Appearance
          </Link>
        </DropdownMenuItem>
        {user && IS_ADMIN(user.role) ? (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex w-full cursor-pointer items-center">
              <Shield className="mr-2 h-4 w-4" /> Admin Panel
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button
            onClick={onSignout}
            className="flex w-full cursor-pointer items-center text-red-400 focus:text-red-400"
          >
            <ExitIcon className="mr-2 h-4 w-4" /> Sign Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
