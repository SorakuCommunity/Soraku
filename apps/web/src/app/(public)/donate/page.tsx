export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Heart, ExternalLink, Trophy, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Donasi | Soraku',
  description: 'Dukung Soraku dengan donasi sukarela melalui Trakteer.',
}

const HOW_TO = [
  { step: '1', title: 'Klik tombol Trakteer', desc: 'Kamu akan diarahkan ke halaman Trakteer Soraku.' },
  { step: '2', title: 'Pilih nominal', desc: 'Minimal 1 kopi (sekitar Rp 5.000). Bebas seikhlasnya.' },
  { step: '3', title: 'Isi pesan', desc: 'Opsional: tulis pesan atau username Discord kamu.' },
  { step: '4', title: 'Selesai! 🎉', desc: 'Nama kamu akan muncul di halaman Top Donatur Soraku.' },
]

const USES = [
  { icon: '🖥️', label: 'Server & Hosting' },
  { icon: '🌐', label: 'Domain & SSL' },
  { icon: '🎉', label: 'Event Offline' },
  { icon: '🛠️', label: 'Dev Platform' },
  { icon: '🏆', label: 'Hadiah Lomba' },
  { icon: '💙', label: 'Komunitas' },
]

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-md border-2 border-black bg-rose-500/20 shadow-[3px_3px_0px_#000]">
          <Heart className="h-8 w-8 text-rose-400" />
        </div>
        <p className="mb-3 text-[10px] font-bold tracking-widest text-primary uppercase">
          Support Soraku
        </p>
        <h1 className="text-3xl font-black tracking-tighter text-foreground sm:text-5xl">
          Donasi <span className="text-primary">Sukarela</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted">
          Soraku adalah komunitas non-profit. Setiap donasi sekecil apapun berarti besar untuk
          keberlangsungan komunitas ini. 🌸
        </p>
      </div>

      {/* Main CTA */}
      <div className="relative mb-8 overflow-hidden rounded-md border-2 border-black bg-surface p-8 text-center shadow-[4px_4px_0px_#000]">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-primary/5" />
        <div className="relative">
          <p className="mb-4 text-5xl">☕</p>
          <h2 className="mb-2 text-2xl font-black text-foreground">Trakteer Soraku</h2>
          <p className="mb-6 text-sm text-muted">
            Trakteer semacam &#34;Trakteer Kopi&#34; untuk Soraku. Minimal Rp 5.000 — bebas
            seikhlasnya.
          </p>
          <a
            href="https://trakteer.id/soraku"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border-2 border-black bg-rose-600 px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
          >
            <Heart className="h-4 w-4 fill-white" />
            Trakteer Soraku
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* How To */}
      <div className="mb-8 rounded-md border-2 border-black bg-surface p-6 shadow-[4px_4px_0px_#000]">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-foreground">
          <Sparkles className="h-5 w-5 text-primary" />
          Cara Donasi
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {HOW_TO.map((step) => (
            <div key={step.step} className="flex items-start gap-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border-2 border-black bg-primary text-[10px] font-bold text-white shadow-[2px_2px_0px_#000]">
                {step.step}
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">{step.title}</p>
                <p className="text-xs text-muted">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Uses */}
      <div className="mb-8 rounded-md border-2 border-black bg-surface p-6 shadow-[4px_4px_0px_#000]">
        <h2 className="mb-4 text-lg font-black text-foreground">Donasi Digunakan Untuk</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {USES.map((u) => (
            <div key={u.label} className="rounded-md border-2 border-black bg-surface p-3 text-center shadow-[2px_2px_0px_#000]">
              <p className="text-xl">{u.icon}</p>
              <p className="mt-1 text-[10px] font-bold text-foreground">{u.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Link */}
      <div className="text-center">
        <Link
          href="/donate/leaderboard"
          className="inline-flex items-center gap-2 rounded-md border-2 border-black bg-surface px-6 py-3 text-sm font-bold text-foreground shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
        >
          <Trophy className="h-4 w-4 text-amber-400" />
          Lihat Top Donatur
        </Link>
      </div>
    </div>
  )
}
