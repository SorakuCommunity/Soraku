'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@soraku/ui'

const PRODUCT_NAV: { label: string; href: string }[] = [
  { label: 'Settings', href: '/settings/profile' },
  { label: 'Account', href: '/settings/account' },
  { label: 'Security', href: '/settings/security' },
  { label: 'Appearance', href: '/settings/appearance' },
  { label: 'Notifications', href: '/settings/notifications' },
  { label: 'Connected Accounts', href: '/settings/connected-accounts' },
]

export function NavbarSearch({ username }: { username?: string | null }) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const run = React.useCallback(
    (href: string) => {
      setOpen(false)
      router.push(href)
    },
    [router]
  )

  const items = username
    ? [{ label: 'View Profile', href: `/@${username}` }, ...PRODUCT_NAV]
    : PRODUCT_NAV

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className="hidden h-9 w-full max-w-xs justify-start gap-2 rounded-md border border-border bg-muted/40 px-3 text-sm font-normal text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
        <span>Search or jump to...</span>
        <kbd className="pointer-events-none ml-auto hidden items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-9 w-9 rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
        aria-label="Search"
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search or jump to..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {items.map((item) => (
              <CommandItem
                key={item.href}
                value={item.label}
                onSelect={() => run(item.href)}
                className="gap-2"
              >
                <MagnifyingGlassIcon className="h-4 w-4 text-muted-foreground" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
