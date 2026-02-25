import type { SpotifyTrack } from '@/types'

interface TokenCache {
  token: string
  exp: number
}

let tokenCache: TokenCache | null = null

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.exp) return tokenCache.token

  const id = process.env.SPOTIFY_CLIENT_ID
  const secret = process.env.SPOTIFY_CLIENT_SECRET
  if (!id || !secret) throw new Error('Spotify credentials not configured')

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  })

  if (!res.ok) throw new Error('Spotify token request failed')

  const data = await res.json()
  tokenCache = {
    token: data.access_token,
    exp: Date.now() + (data.expires_in - 60) * 1000,
  }
  return tokenCache.token
}

/**
 * Fetch anime / lofi preview tracks from curated playlists.
 */
export async function fetchAnimeLofiTracks(): Promise<SpotifyTrack[]> {
  try {
    const token = await getAccessToken()
    const PLAYLISTS = ['37i9dQZF1DWXbttAJcbphz', '37i9dQZF1DX5trt9i14X7j']
    const playlistId = PLAYLISTS[Math.floor(Math.random() * PLAYLISTS.length)]

    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=20&fields=items(track(id,name,artists,album,preview_url,external_urls,duration_ms))`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 300 },
      }
    )

    if (!res.ok) return []
    const data = await res.json()

    return (data.items as { track: SpotifyTrack }[])
      .map((i) => i.track)
      .filter((t) => t?.id && t?.preview_url)
      .slice(0, 10)
  } catch {
    return []
  }
}

/**
 * Search Spotify tracks by query string.
 * Used by: app/api/spotify/search/route.ts
 */
export async function searchSpotifyTracks(query: string): Promise<SpotifyTrack[]> {
  try {
    const token = await getAccessToken()
    const params = new URLSearchParams({ q: query, type: 'track', limit: '10' })
    const res = await fetch(`https://api.spotify.com/v1/search?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) return []
    const data = await res.json()
    return (data.tracks?.items ?? []) as SpotifyTrack[]
  } catch {
    return []
  }
}

/**
 * Get a single Spotify track by ID.
 * Used by: app/api/spotify/track/route.ts
 */
export async function getSpotifyTrack(trackId: string): Promise<SpotifyTrack | null> {
  try {
    const token = await getAccessToken()
    const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) return null
    return (await res.json()) as SpotifyTrack
  } catch {
    return null
  }
}
