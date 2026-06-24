import { Zap } from 'lucide-react'

interface XPProgressBarProps {
  currentXP: number
  requiredXP: number
  level: number
  title?: string
  color?: string
}

export function XPProgressBar({
  currentXP,
  requiredXP,
  level,
  title = 'Newcomer',
  color = '#3B82F6',
}: XPProgressBarProps) {
  const pct = Math.min(100, Math.round((currentXP / Math.max(1, requiredXP)) * 100))

  return (
    <div className="rounded-md border-2 border-white/[0.07] bg-card p-5 shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4" style={{ color }} />
          <span className="text-sm font-black text-foreground">Level {level}</span>
          <span
            className="rounded-sm border-2 px-1.5 py-0.5 text-[8px] font-bold uppercase"
            style={{ borderColor: `${color}30`, color }}
          >
            {title}
          </span>
        </div>
        <span className="text-[11px] font-bold text-muted-foreground/60">
          {currentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-sm border-2 border-white/[0.06] bg-white/[0.02]">
        <div
          className="h-full rounded-sm transition-all duration-1000 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground/50">
        <span>{pct}% complete</span>
        <span>{requiredXP - currentXP > 0 ? `${(requiredXP - currentXP).toLocaleString()} XP to next level` : 'MAX LEVEL'}</span>
      </div>
    </div>
  )
}
