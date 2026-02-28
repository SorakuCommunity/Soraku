'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { registerSchema } from '@/lib/validations'
import { toast } from 'sonner'

function AnimeIllustration() {
  return (
    <div className="relative w-full h-full min-h-[280px] flex items-end justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-dark-base)] via-[#1a2535] to-[#0d1521]" />
      <motion.div
        className="absolute top-12 right-12 w-36 h-36 rounded-full"
        style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)', opacity: 0.2 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4.5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-28 left-8 w-24 h-24 rounded-full"
        style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)', opacity: 0.25 }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.7 }}
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? 'var(--color-accent)' : 'var(--color-primary)',
            right: `${10 + i * 15}%`,
            top: `${15 + (i % 3) * 25}%`,
            opacity: 0.5,
          }}
          animate={{ y: [-6, 10, -6], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      <div className="relative z-10 w-full p-6 pb-8"
        style={{ background: 'linear-gradient(to top, rgba(28,30,34,0.95), transparent)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <p className="text-3xl font-bold mb-1" style={{ color: 'var(--color-accent)' }}>Bergabung</p>
          <p className="text-sm" style={{ color: 'var(--text-sub)', opacity: 0.75 }}>
            Jadi bagian dari komunitas Soraku
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const router   = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = registerSchema.safeParse({ username, email, password })
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)

    if (error) { toast.error(error.message); return }
    toast.success('Cek email kamu untuk verifikasi!')
    router.push('/login')
  }

  const handleOAuth = async (provider: 'google' | 'discord') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="min-h-screen flex flex-col md:flex-row-reverse">

        {/* ─── Right (illustration on right for register) ─────────────── */}
        <motion.div
          className="md:w-1/2 md:min-h-screen"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimeIllustration />
        </motion.div>

        {/* ─── Left: Glass Form ─────────────────────────────────────────── */}
        <motion.div
          className="md:w-1/2 flex items-center justify-center px-4 py-10 md:py-0"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="w-full max-w-md">
            <div
              className="rounded-2xl border p-8"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
            >
              <div className="text-center mb-7">
                <Link href="/" className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>Soraku</Link>
                <h1 className="text-xl font-semibold mt-2" style={{ color: 'var(--text)' }}>Bergabung dengan Soraku</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-sub)' }}>Buat akun gratis Anda</p>
              </div>

              {/* OAuth */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => handleOAuth('google')}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all hover:opacity-80 min-h-[44px]"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-sub)', backgroundColor: 'var(--hover-bg)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button
                  onClick={() => handleOAuth('discord')}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all hover:opacity-80 min-h-[44px]"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-sub)', backgroundColor: 'var(--hover-bg)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.175 13.175 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
                  </svg>
                  Discord
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: 'var(--border)' }} />
                </div>
                <div className="relative text-center">
                  <span className="px-3 text-xs" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-sub)' }}>
                    atau daftar dengan email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Username</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-sub)' }} />
                    <input
                      type="text" value={username} onChange={e => setUsername(e.target.value)}
                      placeholder="username_kamu" required autoComplete="username"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors"
                      style={{ backgroundColor: 'var(--hover-bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-sub)' }} />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="kamu@email.com" required autoComplete="email"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors"
                      style={{ backgroundColor: 'var(--hover-bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-sub)' }} />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 karakter" required autoComplete="new-password"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm outline-none transition-colors"
                      style={{ backgroundColor: 'var(--hover-bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-sub)' }}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 min-h-[44px]"
                  style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
                >
                  {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
                </button>
              </form>

              <p className="text-center text-sm mt-5" style={{ color: 'var(--text-sub)' }}>
                Sudah punya akun?{' '}
                <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
                  Masuk
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
