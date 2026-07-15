'use client'

import { useCallback, useEffect, useState } from 'react'

export interface ProfileLevel {
  level: number
  xpcurrent: number
  xprequired: number
  reputationscore: number
}

export interface ProfileBadge {
  id: string
  badgename: string
  badgeicon: string
  badgecls?: string
}

export interface ProfileData {
  id: string
  username: string | null
  displayname: string | null
  avatarurl: string | null
  coverurl: string | null
  bio: string | null
  role: string
  supporterrole: string | null
  sociallinks: Record<string, string>
  isprivate: boolean
  createdat: string
  level: ProfileLevel
  galleryCount: number
  supportTotal: number
  badges: ProfileBadge[]
}

export type ProfileStatus = 'loading' | 'unauthorized' | 'ready'

export interface ProfileSavePayload {
  displayname?: string
  username?: string
  bio?: string
  avatarurl?: string
  coverurl?: string
  isprivate?: boolean
  sociallinks?: Record<string, string>
}

export interface UseProfileResult {
  status: ProfileStatus
  profile: ProfileData | null
  email: string | null
  saving: boolean
  reload: () => void
  save: (payload: ProfileSavePayload) => Promise<{ ok: boolean; error?: string }>
}

/**
 * Profile data layer.
 * GET /api/profile  -> full profile (preserves original business logic)
 * GET /api/auth/me  -> session, used for `email` (not stored in /api/profile)
 * PATCH /api/profile -> persists editable fields
 */
export function useProfile(): UseProfileResult {
  const [status, setStatus] = useState<ProfileStatus>('loading')
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const [profileRes, meRes] = await Promise.all([
        fetch('/api/profile', { cache: 'no-store' }),
        fetch('/api/auth/me', { cache: 'no-store' }),
      ])

      if (!profileRes.ok) {
        setStatus('unauthorized')
        return
      }

      const profileJson = await profileRes.json()
      const meJson = meRes.ok ? await meRes.json() : null

      setProfile(profileJson.data ?? null)
      setEmail(meJson?.data?.email ?? null)
      setStatus('ready')
    } catch {
      setStatus('unauthorized')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const save = useCallback(async (payload: ProfileSavePayload) => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) {
        return { ok: false, error: json?.error ?? 'Gagal menyimpan.' }
      }
      setProfile((prev) => (prev ? { ...prev, ...(json.data ?? {}) } : prev))
      return { ok: true }
    } catch {
      return { ok: false, error: 'Terjadi kesalahan.' }
    } finally {
      setSaving(false)
    }
  }, [])

  return { status, profile, email, saving, reload: load, save }
}
