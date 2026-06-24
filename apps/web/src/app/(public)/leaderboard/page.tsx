'use client'

import { useState } from 'react'
import {
  Trophy,
  Medal,
  Star,
  Zap,
  Users,
  TrendingUp,
  Award,
  ArrowUp,
  ArrowDown,
  Crown,
} from 'lucide-react'

type Tier = {
  name: string
  range: string
  color: string
  bg: string
  border: string
}

const TIERS: Tier[] = [
  { name: 'Newbie', range: 'Level 1-5', color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/30' },
  { name: 'Explorer', range: 'Level 6-10', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30' },
  { name: 'Builder', range: 'Level 11-20', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
  { name: 'Creator', range: 'Level 21-35', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
  { name: 'Mentor', range: 'Level 36-50', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
  { name: 'Legend', range: 'Level 51+', color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/30' },
]

function getTier(level: number): Tier {
  if (level <= 5) return TIERS[0]
  if (level <= 10) return TIERS[1]
  if (level <= 20) return TIERS[2]
  if (level <= 35) return TIERS[3]
  if (level <= 50) return TIERS[4]
  return TIERS[5]
}

type Leader = {
  rank: number
  username: string
  xp: number
  level: number
  reputation: number
  trend: 'up' | 'down' | 'same'
}

const LEADERS: Leader[] = [
  { rank: 1, username: 'AnimeMaster', xp: 15420, level: 52, reputation: 980, trend: 'up' },
  { rank: 2, username: 'OtakuCoder', xp: 12850, level: 48, reputation: 875, trend: 'up' },
  { rank: 3, username: 'FanartQueen', xp: 11230, level: 44, reputation: 812, trend: 'down' },
  { rank: 4, username: 'MangaReader', xp: 9870, level: 39, reputation: 745, trend: 'up' },
  { rank: 5, username: 'VTuberFan', xp: 8540, level: 35, reputation: 689, trend: 'same' },
  { rank: 6, username: 'CodeNinja', xp: 7320, level: 31, reputation: 634, trend: 'up' },
  { rank: 7, username: 'CreativeMind', xp: 6150, level: 27, reputation: 578, trend: 'down' },
  { rank: 8, username: 'StudyBuddy', xp: 5980, level: 26, reputation: 562, trend: 'up' },
  { rank: 9, username: 'PixelWizard', xp: 5210, level: 23, reputation: 510, trend: 'up' },
  { rank: 10, username: 'VoiceActorX', xp: 4890, level: 21, reputation: 487, trend: 'down' },
  { rank: 11, username: 'CosplayPro', xp: 4560, level: 19, reputation: 452, trend: 'up' },
  { rank: 12, username: 'LightNovelist', xp: 4230, level: 18, reputation: 428, trend: 'same' },
  { rank: 13, username: 'DoujinArtist', xp: 3980, level: 16, reputation: 405, trend: 'up' },
  { rank: 14, username: 'GachaWhale', xp: 3650, level: 15, reputation: 382, trend: 'down' },
  { rank: 15, username: 'SeiyuuFan', xp: 3320, level: 13, reputation: 358, trend: 'up' },
  { rank: 16, username: 'MechaBuilder', xp: 2980, level: 12, reputation: 335, trend: 'up' },
  { rank: 17, username: 'IdolProducer', xp: 2650, level: 10, reputation: 312, trend: 'down' },
  { rank: 18, username: 'NendoroidKing', xp: 2320, level: 9, reputation: 289, trend: 'up' },
  { rank: 19, username: 'ShonenJumpFan', xp: 1980, level: 7, reputation: 265, trend: 'same' },
  { rank: 20, username: 'NewTypeRising', xp: 1650, level: 6, reputation: 242, trend: 'up' },
]

function formatXp(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1).replace(/\.0$/, '') + 'K'
  return String(n)
}

export default function LeaderboardPage() {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? LEADERS : LEADERS.slice(0, 10)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-bold tracking-widest text-primary/70 uppercase">Leaderboard</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Top <span className="text-gradient">Contributors</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Earn XP through events, projects, contributions, and community engagement.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Players', value: '2,847', Icon: Users },
          { label: 'XP Given', value: '284K', Icon: Zap },
          { label: 'Badges Awarded', value: '156', Icon: Medal },
          { label: 'Events Hosted', value: '48', Icon: Trophy },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-md border-2 border-white/[0.07] bg-card p-4 text-center shadow-[4px_4px_0px_rgba(37,99,235,0.12)]"
          >
            <s.Icon className="mx-auto mb-2 h-5 w-5 text-primary" />
            <p className="text-xl font-black text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground/60">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Period Tabs */}
      <div className="mb-6 flex items-center gap-2">
        {['All Time', 'This Month', 'This Week'].map((tab) => (
          <button
            key={tab}
            className="rounded-md bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-[2px_2px_0px_rgba(37,99,235,0.3)]"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main layout: list + sidebar */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Leaderboard List */}
        <div className="min-w-0 flex-1 space-y-3">
          {visible.map((l) => {
            const tier = getTier(l.level)
            const isTop3 = l.rank <= 3
            const medal = l.rank === 1 ? '🏆' : l.rank === 2 ? '🥈' : l.rank === 3 ? '🥉' : null

            return (
              <div
                key={l.rank}
                className={
                  isTop3
                    ? 'rounded-md border-2 border-amber-500/30 bg-card px-5 py-4 shadow-[4px_4px_0px_rgba(245,158,11,0.2)]'
                    : 'rounded-md border-2 border-white/[0.07] bg-card px-5 py-3 shadow-[4px_4px_0px_rgba(37,99,235,0.12)]'
                }
              >
                <div className={`flex items-center gap-3 ${isTop3 ? 'sm:gap-4' : ''}`}>
                  {/* Rank */}
                  <div className={`flex w-8 shrink-0 items-center justify-center ${isTop3 ? 'sm:w-10' : ''}`}>
                    {medal ? (
                      <span className={`text-xl ${isTop3 ? 'sm:text-2xl' : ''}`}>{medal}</span>
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground">#{l.rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div
                    className={`flex shrink-0 items-center justify-center rounded border-2 border-white/[0.07] ${
                      isTop3 ? 'h-11 w-11 sm:h-12 sm:w-12' : 'h-9 w-9'
                    } bg-card`}
                  >
                    <span className={`font-black text-primary ${isTop3 ? 'text-sm sm:text-base' : 'text-xs'}`}>
                      {l.username.charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className={`flex items-center gap-2 ${isTop3 ? 'sm:gap-3' : ''}`}>
                      <p className={`truncate font-bold text-foreground ${isTop3 ? 'text-sm sm:text-base' : 'text-sm'}`}>
                        {l.username}
                      </p>
                      {isTop3 && l.rank === 1 && <Crown className="hidden h-4 w-4 shrink-0 text-amber-400 sm:block" />}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground/60">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {formatXp(l.xp)} XP
                      </span>
                      <span>Level {l.level}</span>
                      <span className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {l.reputation} rep
                      </span>
                    </div>
                  </div>

                  {/* Tier badge + trend */}
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded border px-2 py-0.5 text-[10px] font-bold ${tier.color} ${tier.bg} ${tier.border}`}
                    >
                      {tier.name}
                    </span>
                    {l.trend === 'up' && <ArrowUp className="h-3.5 w-3.5 text-emerald-400" />}
                    {l.trend === 'down' && <ArrowDown className="h-3.5 w-3.5 text-red-400" />}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Load More */}
          {!showAll && LEADERS.length > 10 && (
            <div className="pt-2 text-center">
              <button
                onClick={() => setShowAll(true)}
                className="rounded-md bg-primary px-6 py-2 text-xs font-bold text-primary-foreground shadow-[2px_2px_0px_rgba(37,99,235,0.3)]"
              >
                Load More ({LEADERS.length - 10} remaining)
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="w-full shrink-0 space-y-6 lg:w-72">
          {/* Your Rank Card */}
          <div className="rounded-md border-2 border-white/[0.07] bg-card p-5 shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <p className="text-xs font-bold tracking-wider text-foreground uppercase">Your Rank</p>
            </div>
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <Users className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Login to see your rank</p>
              <button className="rounded-md bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-[2px_2px_0px_rgba(37,99,235,0.3)]">
                Sign In
              </button>
            </div>
          </div>

          {/* Level Tiers Legend */}
          <div className="rounded-md border-2 border-white/[0.07] bg-card p-5 shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
            <p className="mb-3 text-xs font-bold tracking-wider text-foreground uppercase">Level Tiers</p>
            <div className="space-y-2">
              {TIERS.map((t) => (
                <div key={t.name} className="flex items-center justify-between rounded border border-white/[0.05] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-sm ${t.bg} border ${t.border}`} />
                    <span className={`text-xs font-bold ${t.color}`}>{t.name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground/50">{t.range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How to Earn XP */}
          <div className="rounded-md border-2 border-white/[0.07] bg-card p-5 shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
            <p className="mb-3 text-xs font-bold tracking-wider text-foreground uppercase">How to Earn XP</p>
            <ul className="space-y-2.5">
              {[
                'Create and share content',
                'Participate in events',
                'Help others in discussions',
                'Complete projects',
                'Contribute to the community',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground/70">
                  <Zap className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
