/**
 * lib/spotify.ts — Spotify API integration with Redis cache
 */
import { cacheGet, cacheSet } from './redis'

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_API_BASE  = 'https://api.spotify.com/v1'

async function getAccessToken(): Promise<string> {
  const cached = await cacheGet<string>('spotify:token')
  if (cached) return cached

  const creds = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64')

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method:  'POST',
    headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    'grant_type=client_credentials',
  })
  if (!res.ok) throw new Error('Failed to fetch Spotify token')
  const data = await res.json()
  await cacheSet('spotify:token', data.access_token, data.expires_in - 60)
  return data.access_token
}

export async function getTrack(trackId: string) {
  const cacheKey = `spotify:track:${trackId}`
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  try {
    const token = await getAccessToken()
    const res = await fetch(`${SPOTIFY_API_BASE}/tracks/${trackId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    await cacheSet(cacheKey, data, 3600)
    return data
  } catch { return null }
}

// Aliases
export const getSpotifyTrack  = getTrack
export const fetchTrack       = getTrack
export const fetchSpotifyTrack = getTrack

export async function searchSpotifyTracks(query: string, limit = 10) {
  const cacheKey = `spotify:search:${encodeURIComponent(query)}:${limit}`
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  try {
    const token = await getAccessToken()
    const params = new URLSearchParams({ q: query, type: 'track', limit: String(limit) })
    const res = await fetch(`${SPOTIFY_API_BASE}/search?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return []
    const data = await res.json()
    const tracks = data?.tracks?.items ?? []
    await cacheSet(cacheKey, tracks, 300)
    return tracks
  } catch { return [] }
}

// Alias
export const searchTracks = searchSpotifyTracks

export async function getAlbum(albumId: string) {
  const cacheKey = `spotify:album:${albumId}`
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  try {
    const token = await getAccessToken()
    const res = await fetch(`${SPOTIFY_API_BASE}/albums/${albumId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    await cacheSet(cacheKey, data, 3600)
    return data
  } catch { return null }
}

export async function getArtist(artistId: string) {
  const cacheKey = `spotify:artist:${artistId}`
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  try {
    const token = await getAccessToken()
    const res = await fetch(`${SPOTIFY_API_BASE}/artists/${artistId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    await cacheSet(cacheKey, data, 3600)
    return data
  } catch { return null }
}
