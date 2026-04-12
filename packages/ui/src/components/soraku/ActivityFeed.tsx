'use client'
import { cn } from '@/lib/utils'

export type ActivityItem = {
  id:      string
  type:    'blog' | 'event' | 'gallery' | 'user' | 'system' | 'badge' | 'follow'
  title:   string
  desc?:   string
  time:    string
  href?:   string
  avatar?: string | null
  user?:   string | null
}

const TYPE_META: Record<ActivityItem['type'], { emoji: string; color: string; bg: string }> = {
  blog:    { emoji:'📝', color:'text-[#4FA3D1]',    bg:'bg-[#4FA3D1]/10'   },
  event:   { emoji:'🗓️', color:'text-emerald-400',  bg:'bg-emerald-500/10' },
  gallery: { emoji:'🖼️', color:'text-violet-400',  bg:'bg-violet-500/10'  },
  user:    { emoji:'👤', color:'text-[#6E8FA6]',   bg:'bg-white/5'        },
  system:  { emoji:'📢', color:'text-[#E8C2A8]',   bg:'bg-[#E8C2A8]/10'  },
  badge:   { emoji:'🏅', color:'text-yellow-400',  bg:'bg-yellow-500/10'  },
  follow:  { emoji:'💬', color:'text-pink-400',    bg:'bg-pink-500/10'    },
}

function fmtRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff/60000)
  if (mins < 2) return 'baru saja'
  if (mins < 60) return `${mins}m`
  const h = Math.floor(diff/3600000)
  if (h < 24) return `${h}j`
  return `${Math.floor(diff/86400000)}h`
}

interface ActivityFeedProps {
  items:    ActivityItem[]
  loading?: boolean
  className?: string
}

export function ActivityFeed({ items, loading, className }: ActivityFeedProps) {
  if (loading) {
    return (
      <div className={cn('space-y-3', className)}>
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex items-start gap-3 animate-pulse">
            <div className="h-8 w-8 rounded-xl bg-white/8 flex-shrink-0"/>
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-3/4 rounded bg-white/8"/>
              <div className="h-2.5 w-1/2 rounded bg-white/5"/>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-10 text-center', className)}>
        <p className="text-3xl mb-2">📭</p>
        <p className="text-sm text-[#6E8FA6]/50">Belum ada aktivitas</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-1', className)}>
      {items.map(item => {
        const meta = TYPE_META[item.type]
        const Wrapper = item.href ? 'a' : 'div'
        return (
          <Wrapper key={item.id} {...(item.href ? { href: item.href } : {})}
            className={cn(
              'flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors',
              item.href && 'hover:bg-white/[0.04] cursor-pointer'
            )}>
            <div className={cn('flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-sm', meta.bg)}>
              {meta.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#D9DDE3]/85 leading-snug truncate">{item.title}</p>
              {item.desc && <p className="text-xs text-[#6E8FA6]/50 truncate mt-0.5">{item.desc}</p>}
            </div>
            <span className="flex-shrink-0 text-[10px] text-[#6E8FA6]/35 font-medium mt-0.5">
              {fmtRelative(item.time)}
            </span>
          </Wrapper>
        )
      })}
    </div>
  )
}
