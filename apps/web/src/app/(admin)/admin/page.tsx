'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  Calendar,
  ImageIcon,
  Users,
  Plus,
  Clock,
  CheckCircle,
  Eye,
  TrendingUp,
  RefreshCw,
  ArrowUpRight,
  Pencil,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminStats {
  blog_count: number
  event_count: number
  gallery_pending: number
  member_count: number
  recent_posts: { id: string; title: string; slug: string; ispublished: boolean }[]
  pending_gallery: { id: string; title: string | null; imageurl: string; tags: string[] }[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => setStats(d.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const METRICS = [
    {
      key: 'blog_count',
      label: 'Artikel',
      icon: BookOpen,
      href: '/admin/blog',
      color: 'text-blue-400',
      glow: 'bg-blue-500/6',
    },
    {
      key: 'event_count',
      label: 'Event',
      icon: Calendar,
      href: '/admin/events',
      color: 'text-emerald-400',
      glow: 'bg-emerald-500/6',
    },
    {
      key: 'gallery_pending',
      label: 'Review Galeri',
      icon: ImageIcon,
      href: '/admin/gallery',
      color: 'text-amber-400',
      glow: 'bg-amber-500/6',
    },
    {
      key: 'member_count',
      label: 'Member',
      icon: Users,
      href: '/admin/users',
      color: 'text-primary',
      glow: 'bg-primary/6',
    },
  ] as const

  const QUICK = [
    {
      label: 'Artikel Baru',
      href: '/admin/blog/new',
      icon: BookOpen,
      color: 'text-blue-400',
      bg: 'hover:bg-blue-500/8',
    },
    {
      label: 'Event Baru',
      href: '/admin/events/new',
      icon: Calendar,
      color: 'text-emerald-400',
      bg: 'hover:bg-emerald-500/8',
    },
    {
      label: 'Review Galeri',
      href: '/admin/gallery',
      icon: ImageIcon,
      color: 'text-amber-400',
      bg: 'hover:bg-amber-500/8',
    },
    {
      label: 'Kelola Users',
      href: '/admin/users',
      icon: Users,
      color: 'text-primary',
      bg: 'hover:bg-primary/8',
    },
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-primary/40 mb-1 text-[9px] font-black tracking-[0.25em] uppercase">
            Admin Panel
          </p>
          <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="text-muted-foreground/50 hover:text-foreground hover:bg-muted/20 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs transition-all disabled:opacity-30"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {/* Separator */}
      <div className="from-primary/20 via-border/25 -mt-4 h-px bg-gradient-to-r to-transparent" />

      {/* Metrics — no cards, number-forward */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {METRICS.map(({ key, label, icon: Icon, href, color, glow }) => (
          <Link
            key={key}
            href={href}
            className="group hover:bg-muted/15 relative flex flex-col gap-3 rounded-2xl p-4 transition-all duration-300"
          >
            <div
              className={cn(
                'absolute inset-0 -z-10 rounded-2xl opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100',
                glow
              )}
            />
            <div className="flex items-center justify-between">
              <Icon
                className={cn(
                  'h-4 w-4',
                  color,
                  'opacity-60 transition-opacity group-hover:opacity-100'
                )}
              />
              <ArrowUpRight className="text-muted-foreground/20 group-hover:text-muted-foreground/50 h-3 w-3 transition-colors" />
            </div>
            <div>
              <div
                className={cn(
                  'text-3xl font-black tracking-tighter',
                  loading ? 'text-muted-foreground/20 animate-pulse' : 'text-foreground'
                )}
              >
                {loading ? '—' : ((stats as any)?.[key] ?? 0).toLocaleString('id-ID')}
              </div>
              <p className="text-muted-foreground/40 mt-0.5 text-[11px] font-semibold">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="from-border/25 h-px bg-gradient-to-r to-transparent" />

      {/* Quick Actions */}
      <div>
        <p className="text-muted-foreground/30 mb-4 text-[9px] font-black tracking-[0.25em] uppercase">
          Aksi Cepat
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK.map(({ label, href, icon: Icon, color, bg }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200',
                'text-muted-foreground/60 hover:text-foreground border-border/20 hover:border-border/40 border',
                bg
              )}
            >
              <Icon className={cn('h-3.5 w-3.5 transition-colors', color)} />
              {label}
              <Plus className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-40" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent content — 2 columns */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Recent blog posts */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-muted-foreground/30 text-[9px] font-black tracking-[0.25em] uppercase">
              Artikel Terbaru
            </p>
            <Link
              href="/admin/blog"
              className="text-muted-foreground/35 hover:text-primary text-[11px] transition-colors"
            >
              Semua →
            </Link>
          </div>
          <div className="space-y-0">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border-border/10 flex animate-pulse items-center gap-3 border-b py-3 last:border-0"
                >
                  <div className="flex-1 space-y-1.5">
                    <div className="bg-muted/12 h-3 w-3/4 rounded" />
                    <div className="bg-muted/8 h-2.5 w-1/3 rounded" />
                  </div>
                </div>
              ))
            ) : !stats?.recent_posts?.length ? (
              <p className="text-muted-foreground/25 py-8 text-center text-sm">Belum ada artikel</p>
            ) : (
              stats.recent_posts.map((post) => (
                <div
                  key={post.id}
                  className="group border-border/10 flex items-center gap-3 border-b py-3 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground/80 group-hover:text-foreground truncate text-sm font-semibold transition-colors">
                      {post.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      {post.ispublished ? (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400/70">
                          <CheckCircle className="h-2.5 w-2.5" />
                          Publik
                        </span>
                      ) : (
                        <span className="text-muted-foreground/30 flex items-center gap-1 text-[10px]">
                          <Clock className="h-2.5 w-2.5" />
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-muted-foreground/40 hover:text-foreground hover:bg-muted/20 flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="text-muted-foreground/40 hover:text-foreground hover:bg-muted/20 flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending gallery */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-muted-foreground/30 text-[9px] font-black tracking-[0.25em] uppercase">
              Galeri Pending
            </p>
            <Link
              href="/admin/gallery"
              className="text-muted-foreground/35 hover:text-primary text-[11px] transition-colors"
            >
              Review →
            </Link>
          </div>
          <div className="space-y-0">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border-border/10 flex animate-pulse items-center gap-3 border-b py-3 last:border-0"
                >
                  <div className="bg-muted/12 h-10 w-10 flex-shrink-0 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <div className="bg-muted/12 h-3 w-1/2 rounded" />
                    <div className="bg-muted/8 h-2.5 w-1/3 rounded" />
                  </div>
                </div>
              ))
            ) : !stats?.pending_gallery?.length ? (
              <div className="py-8 text-center">
                <CheckCircle className="mx-auto mb-2 h-6 w-6 text-emerald-400/30" />
                <p className="text-muted-foreground/25 text-sm">Semua galeri sudah diproses</p>
              </div>
            ) : (
              stats.pending_gallery.map((item) => (
                <Link
                  key={item.id}
                  href="/admin/gallery"
                  className="group border-border/10 -mx-2 flex items-center gap-3 rounded-xl border-b px-2 py-3 transition-colors last:border-0 hover:border-amber-500/15"
                >
                  <div className="bg-muted/15 relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl">
                    <Image src={item.imageurl} alt="" fill sizes="40px" className="object-cover" unoptimized />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground/70 group-hover:text-foreground truncate text-sm font-semibold transition-colors">
                      {item.title || 'Tanpa judul'}
                    </p>
                    {item.tags.length > 0 && (
                      <p className="text-muted-foreground/30 mt-0.5 text-[10px]">
                        {item.tags.slice(0, 3).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="rounded-full border border-amber-500/15 bg-amber-500/8 px-2 py-0.5 text-[9px] font-black text-amber-400/70">
                    Pending
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
