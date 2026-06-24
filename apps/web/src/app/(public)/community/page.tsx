'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Users,
  MessageCircle,
  TrendingUp,
  ArrowRight,
  Plus,
  Hash,
  Clock,
  Pin,
  Heart,
  MessageSquare,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Thread {
  id: string
  title: string
  content: string | null
  category: string
  authorid: string | null
  ispinned: boolean
  replycount: number
  viewcount: number
  lastactivity: string
  createdat: string
}

const CATEGORY_META: Record<string, { label: string; desc: string; emoji: string; color: string }> = {
  general: { label: 'General Discussion', desc: 'Diskusi bebas seputar apa saja', emoji: '💬', color: 'border-primary/30' },
  anime: { label: 'Anime & Manga', desc: 'Diskusi anime dan manga', emoji: '🎬', color: 'border-violet-500/30' },
  vtuber: { label: 'VTuber Corner', desc: 'Diskusi VTuber favoritmu', emoji: '✨', color: 'border-rose-500/30' },
  creative: { label: 'Creative Corner', desc: 'Fanart, cosplay, dan karya kreatif', emoji: '🎨', color: 'border-amber-500/30' },
  tech: { label: 'Tech & Dev', desc: 'Teknologi dan pengembangan', emoji: '💻', color: 'border-emerald-500/30' },
}

function timeAgo(dateStr: string) {
  const now = Date.now()
  const d = new Date(dateStr).getTime()
  const diff = now - d
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'baru saja'
  if (mins < 60) return `${mins}m lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}j lalu`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}h lalu`
  const weeks = Math.floor(days / 7)
  return `${weeks}w lalu`
}

const ACTIVE_MEMBERS = ['RN', 'DM', 'VA', 'SW', 'NN', 'CI', 'RK', 'AB', 'MS', 'TW', 'YK', 'ZN']
const TRENDING_TAGS = [
  '#SummerAnime2026', '#FanartFriday', '#VTuberDebut',
  '#StudyJapanese', '#CosplayMeetup', '#MangaRecommendation',
  '#WebDev', '#VRoid', '#ALSTELM',
]

export default function CommunityPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({ totalThreads: 0, totalReplies: 0 })
  const [filter, setFilter] = useState('semua')

  useEffect(() => {
    Promise.all([
      fetch(`/api/forum/threads${filter !== 'semua' ? `?category=${filter}` : ''}`).then((r) => r.json()),
      fetch('/api/forum/stats').then((r) => r.json()),
    ])
      .then(([threadsRes, statsRes]) => {
        setThreads(threadsRes?.data ?? [])
        setStats(statsRes?.data ?? { totalThreads: 0, totalReplies: 0 })
      })
      .catch(() => setError('Gagal memuat forum.'))
      .finally(() => setLoading(false))
  }, [filter])

  const categories = Object.entries(CATEGORY_META)
  const pinned = threads.filter((t) => t.ispinned)
  const regular = threads.filter((t) => !t.ispinned)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold tracking-widest uppercase text-primary">Komunitas</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Forum <span className="text-gradient">Komunitas</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Tempat diskusi, berbagi, dan terhubung dengan sesama anggota komunitas Soraku.
        </p>
      </div>

      {/* Stats bar */}
      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-md border-2 border-border bg-card px-6 py-4 shadow-[4px_4px_0px_0px_#000]">
        <div className="flex items-center gap-6 text-sm">
          <div className="text-center">
            <p className="text-lg font-black text-foreground">{stats.totalThreads}</p>
            <p className="text-[10px] text-muted">Threads</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-lg font-black text-foreground">{stats.totalReplies}</p>
            <p className="text-[10px] text-muted">Pesan</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/40" />
            <input
              type="text"
              placeholder="Cari diskusi..."
              className="w-48 border-2 border-border bg-background py-2 pr-3 pl-9 text-xs text-foreground placeholder:text-muted/30 outline-none transition-colors focus:border-primary"
            />
          </div>
          <button className="flex items-center gap-2 border-2 border-primary bg-primary px-4 py-2 text-xs font-bold text-white transition-all hover:shadow-[4px_4px_0px_0px_#000]">
            <Plus className="h-3.5 w-3.5" /> Thread Baru
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('semua')}
          className={cn(
            'border-2 px-3.5 py-1.5 text-xs font-semibold transition-all',
            filter === 'semua'
              ? 'border-primary bg-primary text-white shadow-[3px_3px_0px_0px_#000]'
              : 'border-border text-muted hover:border-primary hover:text-foreground'
          )}
        >
          Semua
        </button>
        {categories.map(([slug, meta]) => (
          <button
            key={slug}
            onClick={() => setFilter(slug)}
            className={cn(
              'border-2 px-3.5 py-1.5 text-xs font-semibold transition-all',
              filter === slug
                ? 'border-primary bg-primary text-white shadow-[3px_3px_0px_0px_#000]'
                : 'border-border text-muted hover:border-primary hover:text-foreground'
            )}
          >
            {meta.emoji} {meta.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-muted">
          <Loader2 className="h-5 w-5 animate-spin" /> Memuat diskusi...
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <AlertCircle className="h-8 w-8 text-muted" />
          <p className="text-sm text-muted">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="border-2 border-primary bg-primary px-4 py-2 text-xs font-bold text-white"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main feed */}
          <div className="space-y-6">
            {/* Pinned */}
            {pinned.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <Pin className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-black text-foreground">Disematkan</h2>
                </div>
                <div className="space-y-2">
                  {pinned.map((t) => (
                    <ThreadRow key={t.id} thread={t} />
                  ))}
                </div>
              </section>
            )}

            {/* Thread list */}
            <section>
              {regular.length === 0 && pinned.length === 0 ? (
                <div className="py-16 text-center">
                  <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted/30" />
                  <p className="text-sm text-muted">Belum ada diskusi di kategori ini.</p>
                  <p className="mt-1 text-xs text-muted/60">Jadilah yang pertama membuat thread!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {regular.map((t) => (
                    <ThreadRow key={t.id} thread={t} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Trending Tags */}
            <div className="rounded-md border-2 border-border bg-card p-5 shadow-[4px_4px_0px_0px_#000]">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-foreground">
                <TrendingUp className="h-4 w-4 text-primary" /> Trending Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex cursor-pointer items-center gap-1 border-2 border-border px-2.5 py-1 text-[10px] font-semibold text-muted transition-colors hover:border-primary hover:text-foreground"
                  >
                    <Hash className="h-2.5 w-2.5 shrink-0 text-primary/60" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Active Members */}
            <div className="rounded-md border-2 border-border bg-card p-5 shadow-[4px_4px_0px_0px_#000]">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-foreground">
                <Heart className="h-4 w-4 text-primary" /> Anggota Aktif
              </h3>
              <div className="mb-4 grid grid-cols-6 gap-2">
                {ACTIVE_MEMBERS.map((initials, i) => (
                  <div
                    key={i}
                    className="flex aspect-square items-center justify-center border-2 border-border bg-primary/10 text-[10px] font-bold text-primary"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <button className="flex w-full items-center justify-center gap-2 border-2 border-primary bg-primary px-4 py-2 text-xs font-bold text-white transition-all hover:shadow-[4px_4px_0px_0px_#000]">
                Join 200+ members online <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* Forum Stats */}
            <div className="rounded-md border-2 border-border bg-card p-5 shadow-[4px_4px_0px_0px_#000]">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-foreground">
                <MessageCircle className="h-4 w-4 text-primary" /> Statistik Forum
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  ['Total Threads', stats.totalThreads],
                  ['Total Replies', stats.totalReplies],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex justify-between border-b-2 border-border pb-1.5">
                    <span className="text-muted">{label}</span>
                    <span className="font-bold text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Post CTA */}
            <div className="rounded-md border-2 border-indigo-500/30 bg-indigo-500/5 p-5 shadow-[4px_4px_0px_0px_#000]">
              <div className="mb-3 inline-flex border-2 border-indigo-500/30 bg-indigo-500/20 p-2">
                <Plus className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="mb-2 text-sm font-black text-foreground">Buat Thread Baru</h3>
              <p className="mb-4 text-xs text-muted">
                Bagikan pemikiran, karya, atau pertanyaanmu dengan komunitas.
              </p>
              <a
                href="https://discord.gg/qm3XJvRa6B"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-indigo-500 bg-indigo-500 px-4 py-2 text-xs font-bold text-white transition-all hover:shadow-[4px_4px_0px_0px_#000]"
              >
                Join Discord <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ThreadRow({ thread }: { thread: Thread }) {
  const catMeta = CATEGORY_META[thread.category] ?? CATEGORY_META.general

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-md border-2 border-border bg-card px-5 py-4 shadow-[4px_4px_0px_0px_#000] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_0px_#000]',
        thread.ispinned && 'border-primary/30'
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {thread.ispinned && <Pin className="h-3.5 w-3.5 shrink-0 text-primary" />}
          <h3 className="truncate text-sm font-bold text-foreground">{thread.title}</h3>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted">
          <span className={cn('border-2 px-2 py-0.5 text-[9px] font-bold', catMeta.color + '/30 text-foreground/70')}>
            {catMeta.emoji} {catMeta.label}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo(thread.lastactivity)}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1">
          <MessageCircle className="h-3.5 w-3.5" />
          {thread.replycount}
        </span>
        <span className="flex items-center gap-1 text-muted/60">
          <Users className="h-3.5 w-3.5" />
          {thread.viewcount}
        </span>
      </div>
    </div>
  )
}
