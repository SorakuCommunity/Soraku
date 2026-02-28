// components/discord/DiscordHeroCard.tsx — SORAKU v1.0.a3.4
// Hero-style Discord glass card with online member scroll, animated glow border
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Users, Wifi } from 'lucide-react'
import Image from 'next/image'

interface OnlineMember {
  id: string
  username: string
  avatar_url: string | null
}

interface DiscordStats {
  guild_id: string
  guild_name: string
  guild_icon: string | null
  online_count: number
  member_count: number
  invite_url: string
  online_members: OnlineMember[]
}

export function DiscordHeroCard() {
  const [stats, setStats] = useState<DiscordStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/discord/stats')
      .then(r => r.json())
      .then(data => {
        if (data && data.member_count) setStats(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Hide entire card if no data
  if (!loading && !stats) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative w-full max-w-4xl mx-auto mb-8"
    >
      {/* Animated glow border */}
      <div className="absolute -inset-px rounded-2xl z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 rounded-2xl animate-pulse-glow"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary)40, #5865F240, var(--color-primary)20)',
            filter: 'blur(1px)',
          }}
        />
      </div>

      {/* Main card */}
      <div
        className="relative z-10 rounded-2xl p-6 sm:p-8 border backdrop-blur-xl overflow-hidden"
        style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderColor: 'rgba(255,255,255,0.12)',
        }}
      >
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #5865F215 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--color-primary)10 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        {loading ? (
          <DiscordCardSkeleton />
        ) : stats ? (
          <DiscordCardContent stats={stats} />
        ) : null}
      </div>
    </motion.div>
  )
}

function DiscordCardContent({ stats }: { stats: DiscordStats }) {
  return (
    <div className="relative">
      {/* Top row: icon + info + join button */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
        {/* Server icon */}
        <div className="relative shrink-0 mx-auto sm:mx-0">
          {stats.guild_icon ? (
            <Image
              src={`https://cdn.discordapp.com/icons/${stats.guild_id}/${stats.guild_icon}.png?size=128`}
              alt={stats.guild_name}
              width={72}
              height={72}
              className="rounded-2xl ring-2 ring-white/10"
            />
          ) : (
            <div className="w-18 h-18 rounded-2xl flex items-center justify-center text-2xl ring-2 ring-white/10"
              style={{ backgroundColor: '#5865F230' }}>
              🎌
            </div>
          )}
          {/* Online pulse dot */}
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 ring-2 ring-[var(--bg)] animate-pulse" />
        </div>

        {/* Server name + stats */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#5865F2">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.101 18.08.113 18.1.132 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            <h2 className="font-bold text-lg" style={{ color: 'var(--text)' }}>{stats.guild_name}</h2>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse inline-block" />
              <span className="text-sm font-semibold text-green-400">
                {stats.online_count.toLocaleString('id-ID')} Online
              </span>
            </div>
            <div className="flex items-center gap-1.5" style={{ color: 'var(--text-sub)' }}>
              <Users size={14} />
              <span className="text-sm">{stats.member_count.toLocaleString('id-ID')} Member</span>
            </div>
          </div>
        </div>

        {/* Join button */}
        <a
          href={stats.invite_url || 'https://discord.gg/CJJ7KEJMbg'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-xl shrink-0 mx-auto sm:mx-0"
          style={{ backgroundColor: '#5865F2', boxShadow: '0 0 20px #5865F230' }}
        >
          <Wifi size={16} />
          Join Discord
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Online members horizontal scroll */}
      {stats.online_members && stats.online_members.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-sub)' }}>
            ONLINE SEKARANG
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {stats.online_members.slice(0, 20).map(member => (
              <div key={member.id} className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="relative">
                  {member.avatar_url ? (
                    <Image
                      src={member.avatar_url}
                      alt={member.username}
                      width={36}
                      height={36}
                      className="rounded-full ring-1 ring-white/10"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ring-1 ring-white/10"
                      style={{ backgroundColor: 'var(--color-primary)30', color: 'var(--color-primary)' }}>
                      {member.username[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 ring-1 ring-[var(--bg)]"
                    style={{ boxShadow: '0 0 6px #4ade80' }} />
                </div>
                <span className="text-xs max-w-[44px] truncate" style={{ color: 'var(--text-sub)' }}>
                  {member.username}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function DiscordCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col sm:flex-row gap-6 mb-6">
        <div className="w-18 h-18 rounded-2xl mx-auto sm:mx-0" style={{ backgroundColor: 'var(--hover-bg)' }} />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-40 rounded" style={{ backgroundColor: 'var(--hover-bg)' }} />
          <div className="h-4 w-56 rounded" style={{ backgroundColor: 'var(--hover-bg)' }} />
        </div>
        <div className="h-10 w-32 rounded-xl" style={{ backgroundColor: 'var(--hover-bg)' }} />
      </div>
      <div className="flex gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-9 h-9 rounded-full" style={{ backgroundColor: 'var(--hover-bg)' }} />
            <div className="h-3 w-10 rounded" style={{ backgroundColor: 'var(--hover-bg)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
