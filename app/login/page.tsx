'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, AlertCircle, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DiscordIcon, GoogleIcon, FacebookIcon, SpotifyIcon } from '@/components/icons'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

const PANEL_IMGS = [
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&q=90',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=900&q=90',
  'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=900&q=90',
]

export default function LoginPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState<string | null>(null)
  const [bgIdx, setBgIdx] = useState(0)
  const [loginBg, setLoginBg] = useState<string | null>(null)
  const [spotifyEnabled, setSpotifyEnabled] = useState(true)
  const [spotifyWarning, setSpotifyWarning] = useState(false)

  useEffect(() => {
    const iv = setInterval(() => setBgIdx(i => (i + 1) % PANEL_IMGS.length), 4500)
    supabase.from('site_settings').select('key,value')
      .in('key', ['login_background_image', 'login_illustration_enabled', 'oauth_spotify_enabled'])
      .then(({ data }) => {
        if (!data) return
        const bg = data.find(s => s.key === 'login_background_image')?.value
        const spotify = data.find(s => s.key === 'oauth_spotify_enabled')?.value
        if (bg) setLoginBg(bg)
        if (spotify === 'false') setSpotifyEnabled(false)
      })
    return () => clearInterval(iv)
  }, [supabase])

  const signIn = async (provider: 'discord' | 'google' | 'facebook' | 'spotify') => {
    setLoading(provider)
    setSpotifyWarning(false)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: provider === 'spotify' ? 'user-read-email user-read-private' : undefined,
        },
      })
      if (error) throw error
    } catch {
      toast.error('Login gagal. Coba lagi.')
      setLoading(null)
    }
  }

  const handleSpotify = () => {
    setSpotifyWarning(true)
  }

  const illustrationSrc = loginBg ?? PANEL_IMGS[bgIdx]

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ paddingTop: 0 }}>

      {/* ── LEFT PANEL: Anime Illustration ── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={illustrationSrc}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0">
            <Image src={illustrationSrc} alt="Illustration" fill className="object-cover" priority />
          </motion.div>
        </AnimatePresence>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-soraku-dark/90" />

        {/* Content on illustration */}
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          {/* Top brand */}
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
            className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-soraku-gradient flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-white drop-shadow">Soraku</span>
          </motion.div>

          {/* Bottom copy */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}>
            <h2 className="font-display text-4xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
              Komunitas Anime<br />&amp; Manga Terbaik
            </h2>
            <p className="text-white/70 text-sm max-w-xs leading-relaxed">
              Bergabunglah dengan ribuan penggemar. Berbagi karya, diskusi seru, dan tumbuh bersama.
            </p>
            <div className="flex items-center gap-6 mt-6">
              {[['10K+','Anggota'],['5K+','Karya'],['100+','Event']].map(([n,l]) => (
                <div key={l}>
                  <div className="font-display text-xl font-bold text-white">{n}</div>
                  <div className="text-white/50 text-xs">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {PANEL_IMGS.map((_, i) => (
            <button key={i} onClick={() => setBgIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === bgIdx ? 'bg-white w-5' : 'bg-white/40'}`} />
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL: Login Form ── */}
      <div className="flex-1 flex items-center justify-center bg-soraku-dark relative overflow-hidden p-6">
        {/* BG glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity:0, y:24 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5, delay:0.1 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-soraku-gradient flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl font-bold grad-text">Soraku</span>
          </div>

          {/* Card */}
          <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl shadow-purple-900/30">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold mb-1">Masuk ke Soraku</h1>
              <p className="text-soraku-sub text-sm">Pilih cara login kamu di bawah ini</p>
            </div>

            {/* Spotify permission warning */}
            <AnimatePresence>
              {spotifyWarning && (
                <motion.div
                  initial={{ opacity:0, height:0 }}
                  animate={{ opacity:1, height:'auto' }}
                  exit={{ opacity:0, height:0 }}
                  className="mb-4 overflow-hidden"
                >
                  <div className="flex gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-yellow-300 mb-1">Izin Akses Spotify</p>
                      <p className="text-yellow-200/70 text-xs mb-3">
                        Soraku membutuhkan akses ke email dan profil Spotify kamu untuk membuat akun.
                        Tidak ada data musik yang akan dibagikan.
                      </p>
                      <div className="flex gap-2">
                        <button onClick={() => signIn('spotify')}
                          className="flex-1 bg-[#1DB954] text-black font-semibold py-2 rounded-lg text-xs hover:opacity-90 transition-opacity">
                          Setuju &amp; Lanjutkan
                        </button>
                        <button onClick={() => setSpotifyWarning(false)}
                          className="flex-1 glass border border-soraku-border text-soraku-sub py-2 rounded-lg text-xs hover:text-white transition-colors">
                          Batal
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PRIMARY – Discord */}
            <div className="mb-5">
              <p className="text-center text-xs text-soraku-sub uppercase tracking-widest mb-3">
                ✨ Direkomendasikan
              </p>
              <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                onClick={() => signIn('discord')}
                disabled={!!loading}
                className="w-full flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white py-4 rounded-2xl font-bold text-base transition-all shadow-xl shadow-indigo-600/30 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading === 'discord'
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <DiscordIcon className="w-6 h-6" />
                }
                Lanjutkan dengan Discord
                {!loading && <ArrowRight className="w-4 h-4 ml-auto" />}
              </motion.button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-soraku-sub text-xs">atau pilih lainnya</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* SECONDARY – Google + Facebook */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {([
                { p:'google'   as const, Icon:GoogleIcon,   label:'Google',   hover:'hover:bg-white/5' },
                { p:'facebook' as const, Icon:FacebookIcon, label:'Facebook',  hover:'hover:bg-blue-900/20' },
              ] as const).map(({ p, Icon, label, hover }) => (
                <motion.button key={p} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                  onClick={() => signIn(p)}
                  disabled={!!loading}
                  className={`flex items-center justify-center gap-2 glass border border-white/10 ${hover} py-3.5 rounded-xl text-sm font-medium transition-all disabled:opacity-60`}>
                  {loading === p
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Icon className="w-5 h-5" />
                  }
                  {label}
                </motion.button>
              ))}
            </div>

            {/* OPTIONAL – Spotify */}
            {spotifyEnabled && !spotifyWarning && (
              <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                onClick={handleSpotify}
                disabled={!!loading}
                className="w-full flex items-center justify-center gap-2 glass border border-[#1DB954]/20 hover:bg-[#1DB954]/10 py-3.5 rounded-xl text-sm font-medium transition-all disabled:opacity-60 text-[#1DB954]">
                {loading === 'spotify'
                  ? <div className="w-4 h-4 border-2 border-[#1DB954]/30 border-t-[#1DB954] rounded-full animate-spin" />
                  : <SpotifyIcon className="w-5 h-5" />
                }
                Lanjutkan dengan Spotify
                <span className="ml-auto text-xs text-soraku-sub">(Opsional)</span>
              </motion.button>
            )}

            <p className="text-center text-xs text-soraku-sub/60 mt-6 leading-relaxed">
              Dengan login, kamu setuju dengan{' '}
              <Link href="/Tentang" className="text-purple-400 hover:underline">Ketentuan Layanan</Link>{' '}
              &amp; Kebijakan Privasi Soraku.
            </p>
          </div>

          <div className="text-center mt-5">
            <Link href="/" className="text-soraku-sub text-sm hover:text-purple-400 transition-colors">
              ← Kembali ke Beranda
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
