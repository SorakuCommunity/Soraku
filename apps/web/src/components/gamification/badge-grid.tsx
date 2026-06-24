interface Badge {
  id: string
  icon: string
  name: string
  description?: string
  rarity?: string
}

interface BadgeGridProps {
  badges: Badge[]
  columns?: 2 | 3 | 4
}

export function BadgeGrid({ badges, columns = 4 }: BadgeGridProps) {
  const cols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  return (
    <div className={`grid ${cols[columns]} gap-3`}>
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="group relative rounded-md border-2 border-white/[0.07] bg-card p-4 text-center shadow-[2px_2px_0px_rgba(37,99,235,0.08)] transition-all hover:shadow-[4px_4px_0px_rgba(37,99,235,0.2)] hover:scale-[1.02]"
        >
          <div className="mb-2 text-2xl">{badge.icon}</div>
          <p className="text-[11px] font-bold leading-tight text-foreground">{badge.name}</p>
          {badge.rarity && (
            <span className="mt-1 inline-block rounded-sm border-2 border-amber-400/30 px-1.5 py-0.5 text-[8px] font-bold text-amber-400">
              {badge.rarity}
            </span>
          )}
          {badge.description && (
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-40 -translate-x-1/2 rounded-sm border-2 border-white/[0.12] bg-card p-2 text-center text-[10px] text-muted-foreground opacity-0 shadow-[2px_2px_0px_rgba(0,0,0,0.2)] transition-all group-hover:opacity-100">
              {badge.description}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
