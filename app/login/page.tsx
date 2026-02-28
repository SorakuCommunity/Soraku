'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Music, Github, Chrome, Facebook, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'

const DEFAULT_BG = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&q=80'

// Discord SVG icon (no external lib)
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.175 13.175 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028z" />
    </svg>
  )
}

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<string | null>(null)
  const [bgUrl, setBgUrl] = useState(DEFAULT_BG)

  const next = searchParams.get('next') ?? '/'

  useEffect(() => {
    // Load custom BG from site_settings
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'login_bg_url')
      .single()
      .then(({ data }) => {
        if (data?.value) setBgUrl(data.value)
      })
  }, [supabase])

  const signIn = async (provider: 'discord' | 'google' | 'facebook' | 'spotify') => {
    setLoading(provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (error) {
      toast.error('Gagal login: ' + error.message)
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image src={bgUrl} alt="Login Background" fill className="object-cover blur-sm scale-105" priority />
        <div className="absolute inset-0 bg-gradient-to-br from-soraku-dark/90 via-soraku-dark/80 to-purple-900/60" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-3xl p-8 border border-white/10 backdrop-blur-xl shadow-2xl shadow-purple-900/30">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-soraku-gradient flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
              <span className="font-display text-2xl font-black text-white">S</span>
            </div>
            <h1 className="font-display text-2xl font-bold mb-1">Masuk ke Soraku</h1>
            <p className="text-soraku-sub text-sm">Bergabung dengan komunitas anime & manga Indonesia</p>
          </div>

          {/* ─── Discord (Primary) ─────────────────────────────────── */}
          <button
            onClick={() => signIn('discord')}
            disabled={!!loading}
            className="w-full flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-3.5 px-5 rounded-2xl font-semibold transition-all hover:scale-[1.02] active:scale-100 shadow-lg shadow-indigo-900/30 mb-3"
          >
            <DiscordIcon className="w-5 h-5 shrink-0" />
            <span className="flex-1 text-left">
              {loading === 'discord' ? 'Menghubungkan...' : 'Login dengan Discord'}
            </span>
            {loading !== 'discord' && <ArrowRight className="w-4 h-4" />}
          </button>

          {/* ─── Divider ───────────────────────────────────────────── */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-soraku-border" />
            <span className="text-soraku-sub text-xs">atau lanjut dengan</span>
            <div className="flex-1 h-px bg-soraku-border" />
          </div>

          {/* ─── Secondary providers (2-col grid) ─────────────────── */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => signIn('google')}
              disabled={!!loading}
              className="flex items-center justify-center gap-2 glass border border-soraku-border hover:border-white/30 disabled:opacity-60 text-soraku-text py-3 px-4 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
            >
              <Chrome className="w-4 h-4 text-blue-400" />
              {loading === 'google' ? '...' : 'Google'}
            </button>
            <button
              onClick={() => signIn('facebook')}
              disabled={!!loading}
              className="flex items-center justify-center gap-2 glass border border-soraku-border hover:border-white/30 disabled:opacity-60 text-soraku-text py-3 px-4 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
            >
              <Facebook className="w-4 h-4 text-blue-500" />
              {loading === 'facebook' ? '...' : 'Facebook'}
            </button>
          </div>

          {/* ─── Spotify (optional) ────────────────────────────────── */}
          <button
            onClick={() => signIn('spotify')}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-2 glass border border-green-500/30 hover:border-green-500/60 disabled:opacity-60 text-soraku-text py-2.5 px-4 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
          >
            <Music className="w-4 h-4 text-green-400" />
            {loading === 'spotify' ? 'Menghubungkan...' : 'Hubungkan Spotify (opsional)'}
          </button>

          {/* Footer */}
          <p className="text-center text-soraku-sub text-xs mt-6">
            Dengan login, kamu menyetujui{' '}
            <span className="text-soraku-primary">Ketentuan Layanan</span> dan{' '}
            <span className="text-soraku-primary">Kebijakan Privasi</span> Soraku.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-pink-500/10 blur-3xl" />
      </div>
    </div>
  )
}
