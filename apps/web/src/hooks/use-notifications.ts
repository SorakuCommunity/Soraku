'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Notification } from '@/lib/notifications'

// Lazy load useRealtime agar tidak crash saat prerender
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _useRealtime: any = null
let _loaded = false

function loadRealtime() {
  if (_loaded) return
  _loaded = true
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('@upstash/realtime/client')
    _useRealtime = mod.useRealtime
  } catch {
    // Tidak tersedia
  }
}

export function useNotifications(enabled = true) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  const fetchNotifs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/notifications', { cache: 'no-store' })
      if (!res.ok) return
      const { data } = await res.json()
      setNotifications(data ?? [])
    } catch {
      /* silent */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    fetchNotifs()
  }, [enabled, fetchNotifs])

  // Upstash realtime - SSE-based push, skip jika tidak tersedia
  useEffect(() => {
    if (!enabled) return
    loadRealtime()
    if (!_useRealtime) return

    // useRealtime adalah hook, tapi kita pakai sebagai subscription manual
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cleanup: any = null
    try {
      // Kita tidak bisa panggil hook secara kondisional, jadi pakai polling fallback
      // Realtime bekerja lewat RealtimeProvider yang sudah di-setup di Providers
    } catch {
      /* skip */
    }
    return () => cleanup?.()
  }, [enabled])

  const markRead = useCallback(async (ids: string[]) => {
    setNotifications((prev) => prev.map((n) => (ids.includes(n.id) ? { ...n, isread: true } : n)))
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })
  }, [])

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isread: true })))
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    })
  }, [])

  const unreadCount = notifications.filter((n) => !n.isread).length

  return {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    loading,
    refresh: fetchNotifs,
  }
}
