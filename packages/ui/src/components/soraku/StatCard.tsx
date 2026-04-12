'use client'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface StatCardProps {
  label:    string
  value:    string | number
  sub?:     string
  icon:     LucideIcon
  color:    string  // tailwind text class
  bg:       string  // tailwind bg class
  href?:    string
  badge?:   number | null
  trend?:   { value: number; label: string }
  loading?: boolean
}

export function StatCard({ label, value, sub, icon: Icon, color, bg, href, badge, trend, loading }: StatCardProps) {
  const inner = (
    <div className={cn(
      'group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 transition-all duration-300',
      href && 'hover:-translate-y-0.5 hover:border-white/[0.1] hover:shadow-xl hover:shadow-black/30'
    )}>
      {/* Ambient glow */}
      <div className={cn('absolute -top-8 -right-8 h-24 w-24 rounded-full blur-2xl opacity-20', bg)}/>
      {/* Urgency badge */}
      {badge != null && badge > 0 && (
        <span className="absolute right-3 top-3 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
      <div className="relative z-10">
        <div className={cn('mb-4 flex h-9 w-9 items-center justify-center rounded-xl', bg)}>
          <Icon className={cn('h-[18px] w-[18px]', color)}/>
        </div>
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 w-16 animate-pulse rounded-lg bg-white/8"/>
            <div className="h-3 w-20 animate-pulse rounded bg-white/5"/>
          </div>
        ) : (
          <>
            <p className="text-[28px] font-black leading-none tabular-nums text-[#D9DDE3]">{value}</p>
            <p className="mt-1.5 text-xs font-semibold text-[#6E8FA6]/70">{label}</p>
            {sub && <p className="mt-0.5 text-[10px] text-[#6E8FA6]/40">{sub}</p>}
            {trend && (
              <p className={cn('mt-2 flex items-center gap-1 text-[10px] font-bold',
                trend.value >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
                <span className="text-[#6E8FA6]/40 font-normal">{trend.label}</span>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )

  return href ? <Link href={href} className="block">{inner}</Link> : inner
}
