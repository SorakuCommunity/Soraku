'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { CheckCircle, XCircle, Loader2, RefreshCw, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface GalleryItem {
  id: string
  title: string | null
  imageurl: string
  tags: string[]
  createdat: string
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [realtimeOk, setRealtimeOk] = useState(false)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/gallery?status=pending&limit=50')
      const json = await res.json()
      setItems(json?.data ?? [])
    } catch {
      /* silent */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()

    // Supabase Realtime — notif saat ada upload baru masuk
    const supabase = createClient()
    const ch = supabase
      .channel('admin-gallery-pending')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'soraku',
          table: 'gallery',
        },
        () => {
          // Ada upload baru — refresh list
          load()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'soraku',
          table: 'gallery',
        },
        () => load()
      )
      .subscribe((status) => {
        setRealtimeOk(status === 'SUBSCRIBED')
      })

    channelRef.current = ch
    return () => {
      supabase.removeChannel(ch)
    }
  }, [load])

  const moderate = async (id: string, status: 'approved' | 'rejected') => {
    setSaving(id)
    try {
      await fetch(`/api/admin/gallery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setItems((prev) => prev.filter((i) => i.id !== id))
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-primary/60 mb-1 text-[11px] font-bold tracking-widest uppercase">
            Admin Panel
          </p>
          <h1 className="text-2xl font-black">Moderasi Galeri</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Realtime indicator */}
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold',
              realtimeOk
                ? 'border-green-500/30 bg-green-500/10 text-green-400'
                : 'border-border bg-muted/20 text-muted-foreground/50'
            )}
          >
            <Zap className="h-2.5 w-2.5" />
            {realtimeOk ? 'Live' : 'Static'}
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="border-border text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-xl border transition-colors disabled:opacity-40"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-muted-foreground flex items-center justify-center gap-2 py-16">
          <Loader2 className="h-5 w-5 animate-spin" /> Memuat...
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center gap-3 py-16">
          <CheckCircle className="h-10 w-10 text-green-400/50" />
          <p className="text-sm font-medium">Semua sudah bersih</p>
          <p className="text-muted-foreground text-xs">Tidak ada kiriman yang menunggu moderasi</p>
          {realtimeOk && (
            <p className="flex items-center gap-1 text-[11px] text-green-400/70">
              <Zap className="h-2.5 w-2.5" /> Live — kiriman baru akan muncul otomatis
            </p>
          )}
        </div>
      ) : (
        <>
          <p className="text-muted-foreground text-sm">
            <span className="text-foreground font-bold">{items.length}</span> kiriman menunggu
            review
            {realtimeOk && (
              <span className="ml-2 text-xs text-green-400/70">
                <Zap className="mr-0.5 inline h-2.5 w-2.5" />
                Live
              </span>
            )}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const busy = saving === item.id
              return (
                <div key={item.id} className="glass-card group overflow-hidden">
                  <div className="bg-muted/30 relative aspect-square overflow-hidden">
                    <Image
                      src={item.imageurl}
                      alt={item.title ?? 'Karya'}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Clock className="h-6 w-6 text-white/70" />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-medium">{item.title ?? 'Tanpa judul'}</p>
                    <p className="text-muted-foreground/50 mt-0.5 text-xs">
                      {new Date(item.createdat).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    {item.tags?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => moderate(item.id, 'approved')}
                        disabled={busy}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-500/10 py-2 text-xs font-bold text-green-400 transition-colors hover:bg-green-500/20 disabled:opacity-40"
                      >
                        {busy ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle className="h-3.5 w-3.5" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => moderate(item.id, 'rejected')}
                        disabled={busy}
                        className="bg-destructive/10 text-destructive hover:bg-destructive/20 flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-colors disabled:opacity-40"
                      >
                        {busy ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
