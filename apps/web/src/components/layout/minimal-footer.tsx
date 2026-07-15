import Link from 'next/link'
import pkg from '../../../package.json'

const MINIMAL_LEGAL = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/tos' },
  { label: 'Status', href: '#' },
]

export function MinimalFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground/60 sm:flex-row sm:px-6">
        <p className="text-center sm:text-left">
          &copy; {year} The Soraku Ecosystem
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {MINIMAL_LEGAL.map((l) => (
            <Link key={l.label} href={l.href} className="transition-colors hover:text-primary">
              {l.label}
            </Link>
          ))}
          <span className="text-muted-foreground/40">v{pkg.version}</span>
        </div>
      </div>
    </footer>
  )
}
