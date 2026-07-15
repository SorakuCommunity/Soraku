'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import {
  Menu,
  X,
  LogOut,
  Shield,
  User,
  Home,
  Info,
  Sparkles,
  Wallet,
  Briefcase,
  Mail,
  Layers,
  Settings,
  Sun,
  Moon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

interface SessionUser {
  id: string
  username: string | null
  displayname: string | null
  avatarurl: string | null
  role: string
}

const NAV_ITEMS = [
  { label: 'Home', href: '/', Icon: Home },
  { label: 'About', href: '/about', Icon: Info },
  { label: 'Showcase', href: '/showcase', Icon: Layers },
  { label: 'Careers', href: '/careers', Icon: Briefcase },
  { label: 'Contact', href: '/contact', Icon: Mail },
]

const MOBILE_BOTTOM_NAV = [
  { label: 'Home', href: '/', Icon: Home },
  { label: 'About', href: '/about', Icon: Info },
  { label: 'More', href: '#', Icon: Menu, more: true },
  { label: 'Profile', href: '/@me', Icon: User, auth: true },
]

const IS_ADMIN = (r: string) => ['OWNER', 'MANAGER', 'ADMIN'].includes(r.toUpperCase())

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [user, setUser] = useState<SessionUser | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollYRef = useRef(0)
  const profileRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setUser(d.data ?? null))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setProfileOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' }).catch(() => {})
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const displayName = user?.displayname ?? user?.username ?? ''
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <>
      {/* ══ DESKTOP HEADER ═══════════════════════════════════════════ */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block',
          'mx-auto px-4',
          'rounded-xl border border-border bg-background/90 backdrop-blur-xl shadow-xl',
          isScrolled
            ? 'top-2 max-w-4xl shadow-lg'
            : 'top-4 max-w-6xl'
        )}
      >
        <div className={cn(
          'mx-auto flex h-14 items-center justify-between px-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isScrolled ? 'max-w-4xl' : 'max-w-6xl'
        )}>
          {/* Logo */}
          <Link href="/" className="group flex flex-shrink-0 items-center">
            <span className="text-base font-black tracking-tight text-foreground transition-colors group-hover:text-primary">
              Soraku
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
            const active =
              item.label === 'Profile'
                ? pathname.startsWith('/@') || pathname.startsWith('/settings')
                : item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-8 w-8 rounded-md transition-colors"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {user ? (
              <>
                {/* Profile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Link
                      href={`/@${user?.username ?? 'me'}`}
                      className={cn(
                        'flex h-8 w-8 items-center justify-center overflow-hidden rounded-md border-2 transition-all',
                        'border-border hover:border-primary/30'
                      )}
                    >
                      <Avatar className="h-8 w-8">
                        {user.avatarurl ? (
                          <AvatarImage src={user.avatarurl} alt={displayName} />
                        ) : null}
                        <AvatarFallback>
                          {initial || <User className="h-4 w-4 text-primary" />}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">Account</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/@${user?.username ?? 'me'}`}
                        onClick={() => setProfileOpen(false)}
                        className="flex w-full"
                      >
                        <User className="h-4 w-4 mr-2" /> My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" onClick={() => setProfileOpen(false)} className="flex w-full">
                        <Settings className="h-4 w-4 mr-2" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wallet" className="flex w-full">
                        <Wallet className="h-4 w-4 mr-2" /> Wallet
                      </Link>
                    </DropdownMenuItem>
                    {IS_ADMIN(user.role) && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex w-full">
                          <Shield className="h-4 w-4 mr-2" /> Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <button onClick={handleSignout} className="flex w-full text-red-400">
                        <LogOut className="h-4 w-4 mr-2" /> Sign Out
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Join
                </Link>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                      {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col gap-2 py-4">
                      {NAV_ITEMS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={cn(
                            'flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors',
                            pathname.startsWith(item.href)
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground/70 hover:bg-accent hover:text-accent-foreground'
                          )}
                        >
                          <item.Icon className="h-4 w-4 flex-shrink-0" />
                          {item.label}
                        </Link>
                      ))}
                      {user && (
                        <>
                          <div className="border-t border-border my-2" />
                          <Link
                            href={`/@${(user as SessionUser).username ?? 'me'}`}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-muted-foreground/70 transition-colors hover:bg-accent hover:text-accent-foreground"
                          >
                            <User className="h-4 w-4 flex-shrink-0" />
                            My Profile
                          </Link>
                          <Link
                            href="/wallet"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-muted-foreground/70 transition-colors hover:bg-accent hover:text-accent-foreground"
                          >
                            <Wallet className="h-4 w-4 flex-shrink-0" />
                            Wallet
                          </Link>
{IS_ADMIN((user as SessionUser).role) && (
                            <Link
                              href="/admin"
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-muted-foreground/70 transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                              <Shield className="h-4 w-4 flex-shrink-0" />
                              Admin Panel
                            </Link>
                          )}
                        </>
                      )}
                      <div className="border-t border-border mt-2 pt-4" />
                      {user ? (
                        <button
                          onClick={handleSignout}
                          className="flex w-full items-center justify-center gap-2 rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm font-semibold text-red-400/70 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <Link
                            href="/register"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                          >
                            <Sparkles className="h-4 w-4" /> Join Soraku
                          </Link>
                          <Link
                            href="/login"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-center rounded-md border border-border py-2.5 text-sm font-semibold text-muted-foreground/65 transition-all hover:border-border hover:text-foreground"
                          >
                            Login
                          </Link>
                        </div>
                      )}
                    </nav>
                  </SheetContent>
                </Sheet>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ══ MOBILE BOTTOM NAV ═══════════════════════════════════════ */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-border bg-background/98 backdrop-blur-2xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around py-1">
          {MOBILE_BOTTOM_NAV.map((item) => {
            if (item.more) {
              return (
                <Button
                  key="more"
                  variant="ghost"
                  size="icon"
                  onClick={() => setMenuOpen(true)}
                  className="flex flex-col items-center gap-0.5 px-4 py-1.5 text-muted-foreground/60 transition-colors"
                >
                  <item.Icon className="h-5 w-5" />
                  <span className="text-[10px] font-semibold">{item.label}</span>
                </Button>
              )
            }
            if (item.auth && !user && item.href === '/@me') {
              return (
                <Link
                  key={item.href}
                  href="/login"
                  className="flex flex-col items-center gap-0.5 px-4 py-1.5"
                >
                  <item.Icon className="h-5 w-5 text-muted-foreground/60" />
                  <span className="text-[10px] font-medium text-muted-foreground/60">{item.label}</span>
                </Link>
              )
            }
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground/60'
                )}
              >
                <item.Icon className={cn('h-5 w-5', active && 'fill-primary/20')} />
                <span className={cn('text-[10px] font-semibold', active ? 'text-primary' : 'text-muted-foreground/60')}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export default Navbar