import type { Metadata } from 'next'
import Link from 'next/link'
import { Trophy, Crown, Heart } from 'lucide-react'
import { db } from '@/lib/supabase/server'
import { formatRupiah, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Leaderboard Donatur | Soraku Community',
  description: 'Daftar donatur terbaik yang mendukung Soraku Community.',
}

const TIER_STYLES: Record<string, { badge: string; glow: string; text: string }> = {
  VVIP: {
    badge: '✨ VVIP',
    glow: 'shadow-lg shadow-amber-500/20 border-amber-500/40',
    text: 'text-amber-400',
  },
  VIP: {
    badge: '💜 VIP',
    glow: 'shadow-md shadow-primary/15 border-primary/30',
    text: 'text-primary',
  },
  DONATUR: { badge: '💙 Donatur', glow: '', text: 'text-blue-400' },
}

const PODIUM = [1, 0, 2]
const PODIUM_HEIGHTS = ['h-24', 'h-32', 'h-20']
const PODIUM_LABELS = ['🥈', '🥇', '🥉']

export default async function TopDonaturPage() {
  const { data } = await (await db())
    .from('donatur')
    .select('id,displayname,amount,tier,message,createdat')
    .eq('ispublic', true)
    .order('amount', { ascending: false })
    .limit(50)

  const sorted = data ?? []
  const top3 = sorted.slice(0, 3)
  const rest = sorted.slice(3)

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10">
          <Trophy className="h-8 w-8 text-amber-400" />
        </div>
        <p className="text-primary/70 mb-3 text-xs font-bold tracking-widest uppercase">
          Hall of Fame
        </p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Top <span className="text-gradient">Donatur</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-lg">
          Terima kasih kepada para supporter setia yang membuat Soraku Community tetap hidup. 💙
        </p>
      </div>

      {/* Podium */}
      {top3.length === 3 && (
        <div className="mb-12 flex items-end justify-center gap-4">
          {PODIUM.map((idx, i) => {
            const d = top3[idx]
            const style = TIER_STYLES[d.tier ?? 'DONATUR']
            return (
              <div key={d.id} className="flex flex-col items-center gap-3">
                <div
                  className={`relative flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black ${
                    idx === 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-primary/10 text-primary'
                  }`}
                >
                  {d.displayname.charAt(0)}
                  {idx === 0 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Crown className="h-5 w-5 text-amber-400" />
                    </div>
                  )}
                </div>
                <p className="max-w-[80px] truncate text-center text-xs font-bold">
                  {d.displayname}
                </p>
                <p className={`text-xs font-medium ${style.text}`}>{formatRupiah(d.amount)}</p>
                <div
                  className={`flex w-20 items-center justify-center rounded-t-xl ${PODIUM_HEIGHTS[i]} ${
                    idx === 0
                      ? 'border border-amber-500/30 bg-gradient-to-t from-amber-600/40 to-amber-400/20'
                      : idx === 1
                        ? 'from-muted/60 to-muted/20 border-border border bg-gradient-to-t'
                        : 'border border-amber-600/20 bg-gradient-to-t from-amber-700/30 to-amber-600/10'
                  }`}
                >
                  <span className="text-xl">{PODIUM_LABELS[i]}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Full list */}
      <div className="space-y-3">
        <h2 className="text-muted-foreground/60 mb-5 text-sm font-semibold tracking-widest uppercase">
          Semua Donatur
        </h2>
        {sorted.map((d, i) => {
          const style = TIER_STYLES[d.tier ?? 'DONATUR']
          return (
            <div key={d.id} className={`glass-card flex items-center gap-4 p-4 ${style.glow}`}>
              <div className="text-muted-foreground/40 w-8 text-center text-sm font-black">
                {i < 3 ? ['🥇', '🥈', '🥉'][i] : `${i + 1}`}
              </div>
              <div className="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl font-bold">
                {d.displayname.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold">{d.displayname}</p>
                  <span className={`text-xs font-medium ${style.text}`}>{style.badge}</span>
                </div>
                {d.message && (
                  <p className="text-muted-foreground/70 mt-0.5 text-xs italic">"{d.message}"</p>
                )}
                <p className="text-muted-foreground/50 mt-0.5 text-xs">{formatDate(d.createdat)}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className={`text-sm font-black ${style.text}`}>{formatRupiah(d.amount)}</p>
              </div>
            </div>
          )
        })}
        {sorted.length === 0 && (
          <div className="py-12 text-center">
            <p className="mb-3 text-3xl">💙</p>
            <p className="text-muted-foreground">Belum ada donatur. Jadilah yang pertama!</p>
          </div>
        )}
      </div>

      <div className="glass-card mt-12 px-8 py-8 text-center">
        <Heart className="mx-auto mb-3 h-8 w-8 text-rose-400" />
        <h2 className="mb-2 font-bold">Ingin Masuk Daftar Ini?</h2>
        <p className="text-muted-foreground mb-5 text-sm">
          Setiap donasi membantumu masuk ke halaman Top Donatur.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/donate"
            className="rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-700"
          >
            Donasi via Trakteer
          </Link>
          <Link
            href="/premium"
            className="border-border text-muted-foreground hover:border-primary/40 hover:text-foreground rounded-xl border px-6 py-3 text-sm font-medium transition-colors"
          >
            Premium Membership
          </Link>
        </div>
      </div>
    </div>
  )
}
