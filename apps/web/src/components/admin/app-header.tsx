'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Menu,
  Shield,
  ArrowLeft,
  LogOut,
  User as UserIcon,
  Settings,
} from 'lucide-react'

import {
  Button,
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  cn,
} from '@soraku/ui'

import { ADMIN_NAV } from './app-sidebar'
import { SearchCommand } from './search-command'
import { ThemeToggle } from './theme-toggle'
import { useSidebar } from './sidebar-context'
import { PanelLeft } from 'lucide-react'

export function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { toggleSidebar } = useSidebar()
  const [user, setUser] = useState<{
    username: string | null
    displayname: string | null
    avatarurl: string | null
  } | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Auto close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setUser(d.data ?? null))
      .catch(() => {})
  }, [])

  const handleSignout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' }).catch(() => {})
    router.push('/')
    router.refresh()
  }

  const displayName = user?.displayname ?? user?.username ?? 'Admin'
  const initial = displayName.charAt(0).toUpperCase()

  // Generate breadcrumbs from path
  const pathSegments = pathname.split('/').filter(Boolean)
  const isDashboardRoot = pathname === '/admin'

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur lg:h-[60px] lg:px-6">
      {/* Desktop Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:flex shrink-0 h-8 w-8"
        onClick={toggleSidebar}
      >
        <PanelLeft className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      {/* Mobile Menu */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex w-72 flex-col p-0">
          <SheetHeader className="border-b px-6 py-4 text-left">
            <SheetTitle className="flex items-center gap-2">
              <div className="h-6 w-6 overflow-hidden rounded bg-primary/10 flex items-center justify-center">
                <Image src="/logo.png" alt="Soraku" width={24} height={24} className="h-5 w-5 object-cover" />
              </div>
              Soraku Admin
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium">
              {(() => {
                let lastGroup: string | null = undefined as any
                return ADMIN_NAV.map(({ href, label, icon: Icon, group }) => {
                  const showGroup = group !== lastGroup
                  lastGroup = group
                  const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

                  return (
                    <div key={href} className="w-full">
                      {showGroup && group && (
                        <h4 className="mb-1 mt-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                          {group}
                        </h4>
                      )}
                      <Link
                        href={href}
                        className={cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:text-foreground',
                          active ? 'bg-muted text-primary hover:text-primary font-medium' : 'hover:bg-muted/50'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </Link>
                    </div>
                  )
                })
              })()}
            </nav>
          </div>
          <div className="mt-auto border-t p-4">
             <Link
              href="/"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali ke Situs
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      {/* Breadcrumbs */}
      <div className="flex-1 hidden md:flex">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {!isDashboardRoot &&
              pathSegments.slice(1).map((segment, index) => {
                const href = `/${pathSegments.slice(0, index + 2).join('/')}`
                const isLast = index === pathSegments.length - 2
                // Format label: capitalize and replace dashes
                const formattedLabel = segment
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')

                return (
                  <div key={segment} className="flex items-center gap-1.5 sm:gap-2.5">
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{formattedLabel}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={href}>{formattedLabel}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                )
              })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex-1 md:hidden" />

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <SearchCommand />
        
        <ThemeToggle />

        <Link href="/" className="hidden mr-1 items-center gap-2 text-sm text-muted-foreground hover:text-foreground sm:flex">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden xl:inline">Kembali ke Situs</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full border-muted-foreground/20">
              <Avatar className="h-8 w-8">
                {user?.avatarurl ? (
                  <AvatarImage src={user.avatarurl} alt={displayName} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {initial}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Admin Soraku Panel
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings/profile" className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Dashboard Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignout} className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
