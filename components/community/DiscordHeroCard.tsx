'use client'
// components/community/DiscordHeroCard.tsx — SORAKU v1.0.a3.5
// Glass Discord Hero Card — used by Dashboard + Komunitas

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDiscord } from '@/hooks/useDiscord'

interface DiscordStats {
  name: string
  icon_url: string | null
  approximate_member_count: number
  approximate_presence_count: number
  online_members: { id: string; username: string; avatar_url: string }[]
}

function GlowPulse() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ backgroundColor: '#57F287' }}
      />
      <span
        className="relative inline-flex rounded-full h-2.5 w-2.5"
        style={{ backgroundColor: '#57F287' }}
      />
    </span>
  )
}

export function DiscordHeroCard() {
  const { stats: raw, loading } = useDiscord()
  const scrollRef = useRef<HTMLDivElement>(null)

  const stats = raw
    ? ({
        name:                      (raw as unknown as DiscordStats).name ?? 'Soraku Community',
        icon_url:                  (raw as unknown as DiscordStats).icon_url ?? null,
        approximate_member_count:  (raw as unknown as DiscordStats).approximate_member_count ?? 0,
        approximate_presence_count:(raw as unknown as DiscordStats).approximate_presence_count ?? 0,
        online_members:            (raw as unknown as DiscordStats).online_members ?? [],
      } as DiscordStats)
    : null

  // Auto-scroll members list
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let frame: number
    let pos = 0
    const scroll = () => {
      pos += 0.4
      if (pos >= el.scrollWidth / 2) pos = 0
      el.scrollLeft = pos
      frame = requestAnimationFrame(scroll)
    }
    frame = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(frame)
  }, [stats?.online_members])

  if (loading) {
    return (
      <div className="w-full rounded-2xl border animate-pulse h-36"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }} />
    )
  }

  if (!stats) return null

  const DISCORD_URL = 'https://discord.gg/CJJ7KEJMbg'
  const iconFallback = (
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
      style={{ backgroundColor: '#5865F2', color: '#fff' }}>
      S
    </div>
  )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full rounded-2xl border overflow-hidden"
        style={{
          background:   'linear-gradient(135deg, rgba(88,101,242,0.12) 0%, rgba(28,30,34,0.85) 100%)',
          backdropFilter: 'blur(24px)',
          borderColor:  'rgba(88,101,242,0.35)',
          boxShadow:    '0 0 40px rgba(88,101,242,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Animated glow border */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(88,101,242,0.15), transparent 60%)',
          }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative z-10 p-5 sm:p-7">
          {/* Top row: icon + info + button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* Server Icon */}
            <div className="relative flex-shrink-0">
              {stats.icon_url ? (
                <img
                  src={stats.icon_url}
                  alt={stats.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover"
                />
              ) : iconFallback}
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1">
                <GlowPulse />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-bold text-lg sm:text-xl truncate" style={{ color: 'var(--text)' }}>
                  {stats.name}
                </h2>
                <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: 'rgba(87,242,135,0.15)', color: '#57F287' }}>
                  <GlowPulse />
                  Online
                </span>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#57F287' }} />
                  <span className="text-sm font-semibold" style={{ color: '#57F287' }}>
                    {stats.approximate_presence_count.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-sub)' }}>online</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--text-sub)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                    {stats.approximate_member_count.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-sub)' }}>member</span>
                </div>
              </div>
            </div>

            {/* Join Button */}
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:scale-105 min-h-[44px]"
              style={{ backgroundColor: '#5865F2', color: '#fff' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.175 13.175 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028z"/>
              </svg>
              Join Discord
            </a>
          </div>

          {/* Online Members Scroll — only if we have widget data */}
          {stats.online_members.length > 0 && (
            <div className="mt-5 pt-4 border-t" style={{ borderColor: 'rgba(88,101,242,0.2)' }}>
              <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-sub)' }}>
                Member Online
              </p>
              <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-hidden"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Duplicate for infinite scroll effect */}
                {[...stats.online_members, ...stats.online_members].map((member, i) => (
                  <div key={`${member.id}-${i}`} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    <div className="relative">
                      <img
                        src={member.avatar_url || `https://cdn.discordapp.com/embed/avatars/${parseInt(member.id) % 5}.png`}
                        alt={member.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                        style={{ backgroundColor: '#57F287', borderColor: 'var(--bg-card)' }} />
                    </div>
                    <span className="text-xs truncate max-w-[56px]" style={{ color: 'var(--text-sub)' }}>
                      {member.username}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
