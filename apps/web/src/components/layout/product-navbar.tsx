'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from '@radix-ui/react-icons'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { NavbarSearch } from './navbar-search'
import { NavbarNotifications } from './navbar-notifications'
import { NavbarUserMenu, ProductSessionUser } from './navbar-user-menu'

export function ProductNavbar({ showSidebarTrigger = false }: { showSidebarTrigger?: boolean }) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [user, setUser] = React.useState<ProductSessionUser | null>(null)

  React.useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.data ?? null))
      .catch(() => {})
  }, [])

  const handleSignout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' }).catch(() => {})
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
      <div className="flex flex-shrink-0 items-center gap-2">
        {showSidebarTrigger ? <SidebarTrigger className="md:hidden" /> : null}
        <Link
          href="/"
          className="text-base font-black tracking-tight text-foreground transition-colors hover:text-primary"
        >
          Soraku
        </Link>
      </div>

      <div className="flex flex-1 justify-center">
        <NavbarSearch username={user?.username} />
      </div>

      <div className="flex flex-shrink-0 items-center gap-1">
        {user ? <NavbarNotifications /> : null}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="relative h-9 w-9 rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Toggle theme"
        >
          <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        {user ? (
          <NavbarUserMenu user={user} onSignout={handleSignout} />
        ) : (
          <Link
            href="/login"
            className="rounded-md px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  )
}
