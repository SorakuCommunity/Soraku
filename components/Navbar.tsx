'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, User, Settings, LogOut, LayoutDashboard, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { hasAdminAccess, cn } from '@/lib/utils'
import type { User as UserType } from '@/types'

const NAV_LINKS = [
  { label: 'Beranda', href: '/' },
  { label: 'Komunitas', href: '/komunitas' },
  { label: 'Anime', href: '/Anime' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/Blog' },
  { label: 'Tentang', href: '/Tentang' },
]

function Avatar({ url, name }: { url?: string | null; name?: string | null }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={name ?? 'avatar'} className="w-7 h-7 rounded-full object-cover" />
  }
  return (
    <div className="w-7 h-7 rounded-full bg-soraku-primary flex items-center justify-center">
      <User className="w-4 h-4 text-white" />
    </div>
  )
}

export function Navbar() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<UserType | null>(null)
  const [authed, setAuthed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setAuthed(!!u)
      if (u) supabase.from('users').select('*').eq('id', u.id).single()
        .then(({ data }) => setUser(data as UserType | null))
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthed(!!session?.user)
      if (!session?.user) { setUser(null); return }
      supabase.from('users').select('*').eq('id', session.user.id).single()
        .then(({ data }) => setUser(data as UserType | null))
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogin = () => router.push('/login')
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setDropOpen(false)
    router.push('/')
  }

  return (
    <nav className={cn(
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrolled ? 'bg-soraku-dark/95 backdrop-blur-md border-b border-soraku-border shadow-lg' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-soraku-gradient flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl grad-text">Soraku</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                className="text-soraku-sub hover:text-soraku-text transition-colors text-sm font-medium">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {authed ? (
              <div className="relative">
                <button onClick={() => setDropOpen(p => !p)}
                  className="flex items-center gap-2 glass px-3 py-1.5 rounded-full hover:border-purple-500 transition-all">
                  <Avatar url={user?.avatar_url} name={user?.display_name} />
                  <span className="text-sm hidden sm:block">{user?.display_name ?? 'User'}</span>
                  <ChevronDown className="w-3 h-3 text-soraku-sub" />
                </button>
                <AnimatePresence>
                  {dropOpen && (
                    <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.12 }}
                      className="absolute right-0 mt-2 w-52 glass rounded-xl shadow-2xl overflow-hidden border border-soraku-border">
                      {user?.username && (
                        <Link href={`/u/${user.username}`} onClick={() => setDropOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                          <User className="w-4 h-4 text-soraku-primary" />
                          <span className="text-sm">Profil Saya</span>
                        </Link>
                      )}
                      <Link href="/edit/profile" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                        <Settings className="w-4 h-4 text-soraku-primary" />
                        <span className="text-sm">Edit Profil</span>
                      </Link>
                      {user && hasAdminAccess(user.role) && (
                        <Link href="/Soraku_Admin" onClick={() => setDropOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                          <LayoutDashboard className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">Admin Panel</span>
                        </Link>
                      )}
                      <div className="border-t border-soraku-border" />
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-900/20 transition-colors text-left">
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-400">Keluar</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button onClick={handleLogin}
                className="bg-soraku-gradient text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg">
                Login
              </button>
            )}
            <button onClick={() => setMenuOpen(p => !p)}
              className="md:hidden text-soraku-sub hover:text-soraku-text" aria-label="Toggle menu">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-soraku-border overflow-hidden">
              <div className="py-3 space-y-1">
                {NAV_LINKS.map(l => (
                  <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-soraku-sub hover:text-soraku-text hover:bg-white/5 rounded-lg transition-colors text-sm">
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
