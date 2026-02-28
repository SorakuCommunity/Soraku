'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Github } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { loginSchema } from '@/lib/validations'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const router   = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) { toast.error(error.message); return }
    router.push('/')
    router.refresh()
  }

  const handleOAuth = async (provider: 'github' | 'discord') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: 'var(--bg)' }}>
    <div className="w-full max-w-md">
      <div className="rounded-2xl border p-8" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>Soraku</Link>
          <h1 className="text-xl font-semibold mt-2" style={{ color: 'var(--text)' }}>Selamat Datang Kembali</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-sub)' }}>Masuk ke akun Anda</p>
        </div>

        {/* OAuth */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => handleOAuth('github')}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all hover:bg-[var(--hover-bg)] min-h-[44px]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-sub)' }}>
            <Github size={16} /> GitHub
          </button>
          <button onClick={() => handleOAuth('discord')}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all hover:bg-[var(--hover-bg)] min-h-[44px]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-sub)' }}>
            <span className="text-base">💬</span> Discord
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: 'var(--border)' }} />
          </div>
          <div className="relative text-center">
            <span className="px-3 text-xs" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-sub)' }}>atau</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-sub)' }} />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="kamu@email.com" required
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 min-h-[44px]"
                style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-sub)' }} />
              <input
                type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required minLength={8}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 min-h-[44px]"
                style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-sub)' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60 min-h-[44px]"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
            {loading ? 'Memuat...' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-sub)' }}>
          Belum punya akun?{' '}
          <Link href="/register" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
    </div>
  )
}
