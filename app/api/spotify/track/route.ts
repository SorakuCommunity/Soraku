import { NextRequest, NextResponse } from 'next/server'
import { getSpotifyTrack } from '@/lib/spotify'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing track id' }, { status: 400 })

  try {
    const track = await getSpotifyTrack(id)
    if (!track) return NextResponse.json({ error: 'Track not found' }, { status: 404 })
    return NextResponse.json({ track })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch track' }, { status: 500 })
  }
}
