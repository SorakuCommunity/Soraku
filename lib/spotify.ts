/**
 * lib/spotify.ts — Spotify API integration with Redis cache
 */
import { cacheGet, cacheSet } from './redis'

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

async function getAccessToken(): Promise<string> {
  const cached = await cacheGet<string>('spotify:token')
  if (cached) return cached

  const creds = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64')

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
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

  const token = await getAccessToken()
  const res = await fetch(`${SPOTIFY_API_BASE}/tracks/${trackId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null

  const data = await res.json()
  await cacheSet(cacheKey, data, 3600)
  return data
}
