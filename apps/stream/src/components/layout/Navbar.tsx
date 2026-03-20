"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Search, Tv2, Menu, X, Home, Clock, TrendingUp } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()
  const [q,      setQ]      = useState("")
  const [menuOpen, setMenu] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) { router.push(`/search?q=${encodeURIComponent(q.trim())}`); setQ("") }
  }

  // Close menu on route change
  useEffect(() => { setMenu(false) }, [pathname])

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-white/[.06] bg-[#0f0f0f]/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-white shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 border border-indigo-500/30">
            <Tv2 className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <span className="text-sm">Soraku<span className="text-indigo-400">.live</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 mx-2">
          {[
            { href: "/",       label: "Home",     icon: Home },
            { href: "/search", label: "Jelajahi", icon: TrendingUp },
          ].map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                pathname === href
                  ? "bg-white/[.08] text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/[.05]"
              )}>
              <Icon className="h-3.5 w-3.5" />{label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-sm ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              ref={inputRef}
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Cari anime..."
              className="w-full rounded-lg bg-white/[.06] border border-white/[.06] py-2 pl-9 pr-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-indigo-500/50 focus:bg-white/[.08] transition-all"
            />
          </div>
        </form>

        {/* Sort Live link */}
        <a href="https://soraku.id" target="_blank" rel="noopener"
          className="hidden md:flex items-center gap-1.5 rounded-lg border border-white/[.06] px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:border-white/[.12] transition-all shrink-0">
          soraku.id →
        </a>

        {/* Mobile menu */}
        <button onClick={() => setMenu(!menuOpen)} className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-white">
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/[.06] bg-[#0f0f0f]/95 px-4 py-3 space-y-1">
          <Link href="/" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/[.05]">
            <Home className="h-4 w-4" /> Home
          </Link>
          <Link href="/search" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/[.05]">
            <TrendingUp className="h-4 w-4" /> Jelajahi
          </Link>
        </div>
      )}
    </header>
  )
}
