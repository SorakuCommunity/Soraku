'use client'

import { useEffect, useState } from 'react'

export interface PublicProfileBadge {
  id: string
  badgename: string
  badgeicon: string
  badgecls?: string
}

export interface PublicProfile {
  id: string
  username: string
  displayname: string | null
  avatarurl: string | null
  coverurl: string | null
  bio: string | null
  role: string
  supporterrole: string | null
  sociallinks: Record<string, string>
  isprivate: boolean
  createdat: string
  level: { level: number; xpcurrent: number; xprequired: number; reputationscore: number }
  badges: PublicProfileBadge[]
  galleryCount: number
  galleryPosts: { id: string; imageurl: string; title: string | null }[]
  followers: number
  following: number
  isFollowing: boolean
  supportTotal: number
}

export type PublicProfileStatus = 'loading' | 'ready' | 'notfound' | 'error'

/**
 * Public user profile data layer.
 * GET /api/users/[username] -> public-facing profile (no private fields).
 * Preserves the existing API contract; no business logic changed.
 */
export function usePublicProfile(username: string) {
  const [status, setStatus] = useState<PublicProfileStatus>('loading')
  const [profile, setProfile] = useState<PublicProfile | null>(null)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setProfile(null)

    fetch(`/api/users/${encodeURIComponent(username)}`, { cache: 'no-store' })
      .then(async (res) => {
        if (res.status === 404) {
          if (!cancelled) setStatus('notfound')
          return
        }
        if (!res.ok) {
          if (!cancelled) setStatus('error')
          return
        }
        const json = await res.json()
        if (!cancelled) {
          setProfile(json.data ?? null)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [username])

  return { status, profile }
}
