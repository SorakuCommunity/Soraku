'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRealtime } from '@upstash/realtime/client'
import type { Notification } from '@/lib/notifications'

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

  // Upstash realtime — SSE-based push tanpa polling
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useRealtime({
    events: ['notification.created'] as any,
    onData(payload: any) {
      const d = payload?.data ?? payload
      const newNotif: Notification = {
        id: d.id ?? crypto.randomUUID(),
        type: d.type ?? 'info',
        title: d.title ?? '',
        body: d.body ?? null,
        href: d.href ?? null,
        isread: false,
        createdat: new Date().toISOString(),
      }
      setNotifications((prev) => [newNotif, ...prev])
    },
  } as any)

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
