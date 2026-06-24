'use client'

import { Zap, Flame } from 'lucide-react'

interface DailyStreakProps {
  currentStreak?: number
  longestStreak?: number
  days?: ('completed' | 'missed' | 'current' | 'upcoming')[]
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function DailyStreak({
  currentStreak = 7,
  longestStreak = 32,
  days = ['completed', 'completed', 'completed', 'completed', 'completed', 'completed', 'current'],
}: DailyStreakProps) {
  return (
    <div className="rounded-md border-2 border-white/[0.07] bg-card p-5 shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-black text-foreground">
          <Flame className="h-4 w-4 text-orange-400" />
          Daily Streak
        </h3>
        <span className="rounded-sm border-2 border-orange-400/30 bg-orange-400/10 px-2 py-0.5 text-[10px] font-bold text-orange-400">
          {currentStreak} days
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((status, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-sm text-[11px] font-black transition-all border-2 ${
                status === 'completed'
                  ? 'border-green-500/40 bg-green-500/15 text-green-400'
                  : status === 'current'
                    ? 'border-primary/40 bg-primary/15 text-primary shadow-[2px_2px_0px_rgba(37,99,235,0.2)]'
                    : status === 'missed'
                      ? 'border-red-500/20 bg-red-500/8 text-red-400/50'
                      : 'border-white/[0.06] bg-white/[0.02] text-muted-foreground/30'
              }`}
            >
              {i + 1}
            </div>
            <span className="text-[8px] font-bold uppercase text-muted-foreground/40">{DAY_LABELS[i]}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t-2 border-white/[0.06] pt-3 text-[10px] text-muted-foreground/60">
        <span className="flex items-center gap-1">
          <Zap className="h-3 w-3" />
          Best: {longestStreak} days
        </span>
        <span className="font-bold text-muted-foreground/40">
          {days.filter((d) => d === 'completed' || d === 'current').length}/7 this week
        </span>
      </div>
    </div>
  )
}
