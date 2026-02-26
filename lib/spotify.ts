/**
 * ============================================================
 *  SORAKU COMMUNITY — PROPRIETARY & CONFIDENTIAL
 * ============================================================
 *  Spotify API helper — v1.0.a3
 *  All functions fail gracefully (empty array / null) when
 *  environment variables are missing, preventing page crashes.
 * ============================================================
 */

import type { SpotifyTrack } from '@/types'
import { cacheGet, cacheSet } from './redis'

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const CACHE_KEY_TOKEN = 'spotify:access_token'
const CACHE_KEY_LOFI  = 'spotify:lofi_tracks'

function hasSpotifyCredentials(): boolean {
  return !!(
    process.env.SPOTIFY_CLIENT_ID &&
    process.env.SPOTIFY_CLIENT_SECRET &&
    process.env.SPOTIFY_REFRESH_TOKEN
  )
}

export async function getAccessToken(): Promise<string | null> {
  if (!hasSpotifyCredentials()) return null

  // Try cached token first
  const cached = await cacheGet<string>(CACHE_KEY_TOKEN)
  if (cached) return cached

  try {
    const basic = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64')

    const res = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
      }),
    })

    if (!res.ok) return null

    const data = await res.json()
    const token: string = data.access_token
    // Cache for expires_in - 60s safety margin (default 3600s)
    const ttl = (data.expires_in ?? 3600) - 60
    await cacheSet(CACHE_KEY_TOKEN, token, ttl)
    return token
  } catch {
    return null
  }
}

export async function searchSpotifyTracks(query: string): Promise<SpotifyTrack[]> {
  const access_token = await getAccessToken()
  if (!access_token) return []

  try {
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return (data.tracks?.items ?? []) as SpotifyTrack[]
  } catch {
    return []
  }
}

export async function getSpotifyTrack(id: string): Promise<SpotifyTrack | null> {
  const access_token = await getAccessToken()
  if (!access_token) return null

  try {
    const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function fetchAnimeLofiTracks(): Promise<SpotifyTrack[]> {
  if (!hasSpotifyCredentials()) return []

  // Try cached list first
  const cached = await cacheGet<SpotifyTrack[]>(CACHE_KEY_LOFI)
  if (cached) return cached

  const access_token = await getAccessToken()
  if (!access_token) return []

  try {
    const res = await fetch(
      'https://api.spotify.com/v1/search?q=anime%20lofi&type=track&limit=50',
      { headers: { Authorization: `Bearer ${access_token}` } }
    )
    if (!res.ok) return []
    const data = await res.json()
    const tracks: SpotifyTrack[] = data.tracks?.items ?? []
    await cacheSet(CACHE_KEY_LOFI, tracks, 1800) // 30m cache
    return tracks
  } catch {
    return []
  }
}