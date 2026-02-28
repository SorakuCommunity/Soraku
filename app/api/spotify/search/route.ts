import { NextRequest, NextResponse } from 'next/server'
import { searchSpotifyTracks } from '@/lib/spotify'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q     = searchParams.get('q')     ?? ''
  const limit = parseInt(searchParams.get('limit') ?? '10')

  if (!q.trim()) return NextResponse.json({ tracks: [] })

  try {
    const tracks = await searchSpotifyTracks(q, Math.min(limit, 20))
    return NextResponse.json({ tracks })
  } catch {
    return NextResponse.json({ tracks: [] }, { status: 500 })
  }
}
