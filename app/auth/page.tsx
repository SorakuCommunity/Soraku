'use client'

/**
 * ============================================================
 *  SORAKU COMMUNITY — PROPRIETARY & CONFIDENTIAL
 * ============================================================
 *  Auth Page — Login / Register
 *  Glassmorphism dark anime aesthetic — v1.0.a3
 *  Discord primary · Google/Facebook secondary · Spotify optional
 * ============================================================
 */

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  MessageCircle, // Discord
  Mail,
  Loader2,
  Star,
  Sparkles,
  Music,
  Github,
} from 'lucide-react'
import Image from 'next/image'

// Anime background pool (same as dashboard)
const BG_IMAGES = [
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&q=80',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1920&q=80',
  'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1920&q=80',
  'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=1920&q=80',
]

type Provider = 'discord' | 'google' | 'github' | 'spotify'

export default function AuthPage() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/'
  const error = searchParams.get('error')

  const [bgSrc] = useState(BG_IMAGES[Math.floor(Math.random() * BG_IMAGES.length)])
  const [loading, setLoading] = useState<Provider | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace(next)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Show error from callback
  useEffect(() => {
    if (error === 'auth_failed') {
      toast.error('Login gagal. Coba lagi.')
    }
  }, [error])

  async function signIn(provider: Provider) {
    setLoading(provider)
    try {
      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl,
          scopes: provider === 'discord' ? 'identify email guilds' : undefined,
        },
      })
      if (signInError) {
        toast.error(`Login ${provider} gagal: ${signInError.message}`)
        setLoading(null)
      }
      // If no error, browser will redirect — keep loading state
    } catch {
      toast.error('Terjadi kesalahan. Coba lagi.')
      setLoading(null)
    }
  }

  const isLoading = loading !== null

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* ── Animated anime background ───────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgSrc}
          alt="Auth Background"
          fill
          className="object-cover scale-105 blur-sm"
          priority
        />
        {/* Gradient overlay — heavy dark, slightly purple tinted */}
        <div className="absolute inset-0 bg-gradient-to-br from-soraku-dark/90 via-purple-950/80 to-soraku-dark/95" />
        {/* Subtle neon glow orbs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-pink-600/10 blur-[100px] pointer-events-none" />
      </div>

      {/* ── Glass card ──────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass border border-soraku-border rounded-3xl p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">

          {/* Brand header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-soraku-gradient mb-4 shadow-lg shadow-purple-500/30">
              <Star className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-2">
              Masuk ke <span className="grad-text">Soraku</span>
            </h1>
            <p className="text-soraku-sub text-sm">
              Komunitas Anime &amp; Manga Indonesia
            </p>
          </div>

          {/* ── Primary: Discord ──────────────────────────────────── */}
          <button
            onClick={() => signIn('discord')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl font-semibold text-white bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-60 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#5865F2]/30 mb-4"
          >
            {loading === 'discord' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <MessageCircle className="w-5 h-5" />
            )}
            <span>
              {loading === 'discord' ? 'Menghubungkan...' : 'Masuk dengan Discord'}
            </span>
            <span className="ml-auto text-xs opacity-70 font-normal">Disarankan</span>
          </button>

          {/* ── Divider ──────────────────────────────────────────── */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-soraku-border" />
            <span className="text-soraku-sub text-xs">atau</span>
            <div className="flex-1 h-px bg-soraku-border" />
          </div>

          {/* ── Secondary: Google ─────────────────────────────────── */}
          <button
            onClick={() => signIn('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl font-medium text-soraku-text glass border border-soraku-border hover:border-white/20 disabled:opacity-60 transition-all hover:scale-[1.01] active:scale-[0.99] mb-3"
          >
            {loading === 'google' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            <span>
              {loading === 'google' ? 'Menghubungkan...' : 'Masuk dengan Google'}
            </span>
          </button>

          {/* ── Secondary: GitHub ─────────────────────────────────── */}
          <button
            onClick={() => signIn('github')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl font-medium text-soraku-text glass border border-soraku-border hover:border-white/20 disabled:opacity-60 transition-all hover:scale-[1.01] active:scale-[0.99] mb-3"
          >
            {loading === 'github' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Github className="w-4 h-4" />
            )}
            <span>
              {loading === 'github' ? 'Menghubungkan...' : 'Masuk dengan GitHub'}
            </span>
          </button>

          {/* ── Optional: Spotify ─────────────────────────────────── */}
          <button
            onClick={() => signIn('spotify')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl font-medium text-soraku-text glass border border-soraku-border hover:border-[#1DB954]/40 disabled:opacity-60 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading === 'spotify' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Music className="w-4 h-4 text-[#1DB954]" />
            )}
            <span className={loading === 'spotify' ? '' : 'text-soraku-sub'}>
              {loading === 'spotify' ? 'Menghubungkan...' : 'Masuk dengan Spotify'}
            </span>
          </button>

          {/* ── Info footer ──────────────────────────────────────── */}
          <p className="text-soraku-sub text-xs text-center mt-6 leading-relaxed">
            Dengan masuk, kamu menyetujui{' '}
            <span className="text-purple-400">Ketentuan Penggunaan</span>
            {' '}dan{' '}
            <span className="text-purple-400">Kebijakan Privasi</span>{' '}
            Soraku Community.
          </p>

          {/* ── Decorative anime accent ──────────────────────────── */}
          <div className="absolute -top-3 -right-3 pointer-events-none select-none">
            <Sparkles className="w-6 h-6 text-purple-400/40" />
          </div>
          <div className="absolute -bottom-3 -left-3 pointer-events-none select-none">
            <Star className="w-5 h-5 text-pink-400/30" />
          </div>
        </div>

        {/* Return link */}
        <p className="text-center mt-5 text-soraku-sub text-sm">
          <a href="/" className="hover:text-soraku-text transition-colors">
            ← Kembali ke Beranda
          </a>
        </p>
      </div>
    </div>
  )
}

/** Inline Google SVG icon to avoid dependency */
function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}
