export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Crown, Medal, Trophy, ArrowLeft, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Top Donatur | Soraku',
  description: 'Para donatur yang telah mendukung Soraku.',
}

type Donor = {
  name: string
  amount: number
  message: string
  tier: 'vvip' | 'vip' | 'donatur'
  date: string
}

const TOP_DONORS: Donor[] = [
  { name: 'Kenn', amount: 500000, message: 'Semoga Soraku makin maju!', tier: 'vvip', date: '2026-05-01' },
  { name: 'Raka', amount: 350000, message: 'Mantap Soraku!', tier: 'vvip', date: '2026-04-15' },
  { name: 'Sasa', amount: 200000, message: 'Keep going gan!', tier: 'vip', date: '2026-04-10' },
  { name: 'Rio', amount: 150000, message: 'Gas pol!', tier: 'vip', date: '2026-05-05' },
  { name: 'Fajar', amount: 100000, message: 'Anime Jepang best!', tier: 'vip', date: '2026-03-20' },
  { name: 'Bunga', amount: 100000, message: 'Semangat Soraku!', tier: 'vip', date: '2026-04-22' },
  { name: 'Yoga', amount: 75000, message: 'Sip', tier: 'donatur', date: '2026-05-10' },
  { name: 'Dita', amount: 50000, message: 'Mantap jiwa', tier: 'donatur', date: '2026-04-18' },
  { name: 'Rizki', amount: 50000, message: 'Gasken', tier: 'donatur', date: '2026-03-25' },
  { name: 'Nina', amount: 25000, message: 'Sukses selalu!', tier: 'donatur', date: '2026-05-02' },
]

const TIER_STYLES = {
  vvip: { label: 'VVIP', border: 'border-amber-500', bg: 'bg-amber-500/20', icon: Crown, color: 'text-amber-400', shadow: 'shadow-[4px_4px_0px_rgba(251,191,36,0.3)]' },
  vip: { label: 'VIP', border: 'border-primary', bg: 'bg-primary/20', icon: Medal, color: 'text-primary', shadow: 'shadow-[4px_4px_0px_rgba(37,99,235,0.3)]' },
  donatur: { label: 'Donatur', border: 'border-muted', bg: 'bg-muted/20', icon: Trophy, color: 'text-muted', shadow: 'shadow-[3px_3px_0px_rgba(148,163,184,0.2)]' },
}

export default function DonorLeaderboardPage() {
  const sorted = [...TOP_DONORS].sort((a, b) => b.amount - a.amount)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/donate"
        className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Donasi
      </Link>

      <div className="mb-8 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-md border-2 border-black bg-primary px-3 py-1.5 text-[10px] font-bold text-white shadow-[2px_2px_0px_#000]">
          <Sparkles className="h-3 w-3" />
          Top Donatur
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tighter text-foreground sm:text-5xl">
        Pahlawan <span className="text-primary">Soraku</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted">
          Terima kasih untuk para donatur yang sudah mendukung komunitas Soraku.
        </p>
      </div>

      {/* Podium */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {[1, 0, 2].map((idx) => {
          const d = sorted[idx]
          if (!d) return null
          const t = TIER_STYLES[d.tier]
          const heights = ['h-32', 'h-40', 'h-24']
          return (
            <div key={d.name} className="flex flex-col items-center justify-end">
              <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-md border-2 border-black ${t.bg} ${t.shadow}`}>
                <t.icon className={`h-5 w-5 ${t.color}`} />
              </div>
              <p className="text-sm font-bold text-foreground">{d.name}</p>
              <p className="text-xs text-muted">Rp {d.amount.toLocaleString('id-ID')}</p>
              <div className={`mt-2 w-full rounded-md border-2 border-black ${t.border} ${t.bg} ${heights[idx]} flex items-center justify-center`}>
                <span className="text-2xl font-black text-foreground">#{idx + 1}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* List */}
      <div className="rounded-md border-2 border-black bg-surface shadow-[4px_4px_0px_#000]">
        {sorted.map((d, i) => {
          const t = TIER_STYLES[d.tier]
          return (
            <div
              key={d.name}
              className={`flex items-center gap-4 px-5 py-4 ${i < sorted.length - 1 ? 'border-b-2 border-black' : ''}`}
            >
              <span className="w-6 text-center text-sm font-black text-muted">#{i + 1}</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-md border-2 border-black ${t.bg}`}>
                <t.icon className={`h-4 w-4 ${t.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground">{d.name}</p>
                <p className="text-xs text-muted line-clamp-1">{d.message}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">Rp {d.amount.toLocaleString('id-ID')}</p>
                <span className={`rounded-sm border px-1.5 py-0.5 text-[9px] font-bold ${t.border} ${t.bg} ${t.color}`}>
                  {t.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <Link
          href="/donate"
          className="inline-flex items-center gap-2 rounded-md border-2 border-black bg-primary px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
        >
          Ikut Donasi
        </Link>
      </div>
    </div>
  )
}
