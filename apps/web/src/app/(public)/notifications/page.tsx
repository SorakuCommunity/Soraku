'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, ArrowLeft, CheckCheck, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNotifications } from '@/hooks/use-notifications'
import { NOTIF_CONFIG, type Notification } from '@/lib/notifications'

export default function NotificationsPage() {
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        setUser(d.data ?? null)
        setAuthed(!!d.data)
      })
      .catch(() => {
        setUser(null)
        setAuthed(false)
      })
  }, [])

  const { notifications, unreadCount, markRead, markAllRead, loading } = useNotifications(!!user)

  if (authed === null) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="animate-pulse space-y-3">
          <div className="bg-muted/30 h-4 w-24 rounded" />
          <div className="bg-muted/30 h-8 w-48 rounded" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-muted/20 h-16 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="border-border/40 bg-muted/15 mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl border">
          <Bell className="text-muted-foreground/30 h-7 w-7" />
        </div>
        <h1 className="text-xl font-black">Masuk untuk melihat notifikasi</h1>
        <p className="text-muted-foreground/60 mt-2 text-sm">
          Kamu perlu masuk untuk mengakses halaman ini.
        </p>
        <Link
          href="/login"
          className="bg-primary hover:bg-primary/90 mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          Masuk Sekarang
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-muted-foreground/50 hover:text-muted-foreground/80 group mb-4 flex w-fit items-center gap-1.5 text-xs transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />{' '}
          Beranda
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Notifikasi</h1>
            {unreadCount > 0 && (
              <p className="text-muted-foreground/60 mt-1 text-sm">{unreadCount} belum dibaca</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead()}
              className="border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Tandai semua dibaca
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-muted/20 h-16 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-20 text-center">
          <div className="border-border/40 bg-muted/15 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border">
            <Bell className="text-muted-foreground/25 h-7 w-7" />
          </div>
          <h2 className="text-foreground/70 text-base font-bold">Belum ada notifikasi</h2>
          <p className="text-muted-foreground/50 mt-1.5 text-sm">Notifikasi akan muncul di sini.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {notifications.map((n) => {
            const cfg = NOTIF_CONFIG[n.type] ?? NOTIF_CONFIG.info
            const timeAgo = (() => {
              const diff = Date.now() - new Date(n.createdat).getTime()
              if (diff < 60_000) return 'Baru saja'
              if (diff < 3600_000) return `${Math.floor(diff / 60_000)} mnt lalu`
              if (diff < 86400_000) return `${Math.floor(diff / 3600_000)} jam lalu`
              return `${Math.floor(diff / 86400_000)} hari lalu`
            })()

            return (
              <button
                key={n.id}
                onClick={() => markRead([n.id])}
                className={cn(
                  'hover:bg-primary/5 flex w-full items-start gap-4 rounded-2xl px-5 py-4 text-left transition-colors',
                  !n.isread ? 'bg-primary/5 border-primary/10 border' : 'border border-transparent'
                )}
              >
                <div
                  className={cn(
                    'mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border',
                    cfg.bg
                  )}
                >
                  <span className="text-base leading-none">{cfg.emoji}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-foreground text-sm leading-snug font-semibold">{n.title}</p>
                    <span className="text-muted-foreground/40 mt-0.5 flex-shrink-0 text-[10px]">
                      {timeAgo}
                    </span>
                  </div>
                  {n.body && (
                    <p className="text-muted-foreground/60 mt-1 text-sm leading-relaxed">
                      {n.body}
                    </p>
                  )}
                </div>
                {!n.isread && (
                  <span className="bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
