'use client'

import type { ElementType } from 'react'
import { motion } from 'framer-motion'

interface AchievementCardProps {
  icon: ElementType
  title: string
  description: string
  xp: number
  progress?: number
  rarity?: string
  color?: string
  unlocked?: boolean
}

export function AchievementCard({
  icon: Icon,
  title,
  description,
  xp,
  progress = 0,
  rarity,
  color = '#3B82F6',
  unlocked = false,
}: AchievementCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`rounded-md border-2 bg-card p-4 shadow-[4px_4px_0px_rgba(37,99,235,0.12)] transition-all hover:shadow-[6px_6px_0px_rgba(37,99,235,0.25)] ${
        unlocked ? 'border-green-500/30' : 'border-white/[0.07]'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-sm border-2"
          style={{ borderColor: `${color}30`, backgroundColor: `${color}15` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-black text-foreground">{title}</h4>
            {rarity && (
              <span className="rounded-sm border-2 border-amber-400/30 px-1.5 py-0.5 text-[8px] font-bold text-amber-400">
                {rarity}
              </span>
            )}
            {unlocked && (
              <span className="rounded-sm border-2 border-green-500/30 px-1.5 py-0.5 text-[8px] font-bold text-green-400">
                Unlocked
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground/60">{description}</p>

          {!unlocked && progress > 0 && (
            <div className="mt-2.5">
              <div className="mb-1 flex items-center justify-between text-[8px] text-muted-foreground/50">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-sm bg-white/[0.06]">
                <div
                  className="h-full rounded-sm bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <p className="mt-1.5 text-[9px] font-bold text-muted-foreground/40">+{xp} XP</p>
        </div>
      </div>
    </motion.div>
  )
}
