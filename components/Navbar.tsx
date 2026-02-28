'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Sun, Moon, Monitor, User, LogOut, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const NAV_LINKS = [
  { label: 'Blog',      href: '/blog' },
  { label: 'Gallery',   href: '/gallery' },
  { label: 'Komunitas', href: '/komunitas' },
  { label: 'VTuber',    href: '/Vtuber' },
]

type ThemeMode = 'dark' | 'light' | 'auto'

export function Navbar() {
  const [open, setOpen]           = useState(false)
  const [userOpen, setUserOpen]   = useState(false)
  const [user, setUser]           = useState<SupabaseUser | null>(null)
  const [role, setRole]           = useState<string | null>(null)
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark')
  const pathname  = usePathname()
  const router    = useRouter()
  const supabase  = createClient()
  const dropRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase.from('users').select('role, theme_mode').eq('id', data.user.id).single()
          .then(({ data: p }) => {
            if (p) { setRole(p.role); setThemeMode(p.theme_mode ?? 'dark') }
          })
      }
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) { setRole(null) }
    })
    return () => sub.subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setUserOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleTheme = async (mode: ThemeMode) => {
    setThemeMode(mode)
    const html = document.documentElement
    if (mode === 'dark')       { html.classList.add('dark');  html.classList.remove('light') }
    else if (mode === 'light') { html.classList.add('light'); html.classList.remove('dark')  }
    else {
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
      html.classList.toggle('dark', dark); html.classList.toggle('light', !dark)
    }
    if (user) await fetch('/api/profile/theme', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ theme_mode: mode }) })
    setUserOpen(false)
  }

  const signOut = async () => { await supabase.auth.signOut(); router.push('/'); router.refresh() }
  const active  = (h: string) => pathname === h || pathname.startsWith(h + '/')

  return (
    <nav className="sticky top-0 z-50 border-b backdrop-blur-sm" style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl" style={{ color: 'var(--color-primary)' }}>Soraku</Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: active(l.href) ? 'var(--color-primary)' : 'var(--text-sub)', backgroundColor: active(l.href) ? 'var(--hover-bg)' : 'transparent' }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative" ref={dropRef}>
              <button onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm min-h-[44px] transition-colors"
                style={{ color: 'var(--text-sub)', backgroundColor: userOpen ? 'var(--hover-bg)' : 'transparent' }}>
                <User size={16} />
                <span className="hidden sm:block max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
                <ChevronDown size={14} className={`transition-transform ${userOpen ? 'rotate-180' : ''}`} />
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border shadow-xl py-1 z-50"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                  <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{user.email?.split('@')[0]}</p>
                    {role && <span className="text-xs px-1.5 py-0.5 rounded font-medium mt-0.5 inline-block"
                      style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--badge-text)' }}>{role}</span>}
                  </div>
                  <Link href="/profile" onClick={() => setUserOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm transition-colors hover:bg-[--hover-bg]"
                    style={{ color: 'var(--text-sub)' }}>
                    <User size={14} /> Profil Saya
                  </Link>
                  {role && ['ADMIN','MANAGER','OWNER'].includes(role) && (
                    <Link href="/admin" onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm transition-colors hover:bg-[--hover-bg]"
                      style={{ color: 'var(--text-sub)' }}>
                      <Shield size={14} /> Admin Panel
                    </Link>
                  )}
                  {/* Theme */}
                  <div className="px-3 pt-2 pb-1 border-t" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-sub)' }}>Tampilan</p>
                    <div className="grid grid-cols-3 gap-1">
                      {([['dark','Gelap',Moon],['light','Terang',Sun],['auto','Otomatis',Monitor]] as const).map(([m,label,Icon]) => (
                        <button key={m} onClick={() => handleTheme(m as ThemeMode)}
                          className="flex flex-col items-center gap-1 p-1.5 rounded-lg text-xs transition-all"
                          style={{ backgroundColor: themeMode===m ? 'var(--hover-bg)':'transparent',
                            color: themeMode===m ? 'var(--color-primary)':'var(--text-sub)',
                            border: `1px solid ${themeMode===m ? 'var(--color-primary)':'transparent'}` }}>
                          <Icon size={12} />{label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={signOut}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm w-full transition-colors hover:bg-[--hover-bg]"
                    style={{ color: '#ef4444' }}>
                    <LogOut size={14} /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] flex items-center" style={{ color: 'var(--text-sub)' }}>Masuk</Link>
              <Link href="/register" className="px-4 py-2 rounded-lg text-sm font-semibold min-h-[44px] flex items-center" style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>Daftar</Link>
            </div>
          )}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center" style={{ color: 'var(--text-sub)' }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t px-4 py-3 space-y-1" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block px-3 py-3 rounded-lg text-sm font-medium transition-colors"
              style={{ color: active(l.href) ? 'var(--color-primary)':'var(--text-sub)', backgroundColor: active(l.href) ? 'var(--hover-bg)':'transparent' }}>
              {l.label}
            </Link>
          ))}
          {!user && (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link href="/login" onClick={() => setOpen(false)} className="text-center py-2.5 rounded-lg text-sm font-medium border" style={{ color:'var(--text-sub)', borderColor:'var(--border)' }}>Masuk</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="text-center py-2.5 rounded-lg text-sm font-semibold" style={{ backgroundColor:'var(--color-primary)', color:'#fff' }}>Daftar</Link>
            </div>
          )}
          {user && (
            <button onClick={signOut} className="flex items-center gap-2 w-full px-3 py-3 rounded-lg text-sm" style={{ color:'#ef4444' }}>
              <LogOut size={14} /> Keluar
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
