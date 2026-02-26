import { NextRequest, NextResponse } from 'next/server';
import { searchSpotifyTracks } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const tracks = await searchSpotifyTracks(query);
    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Spotify search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}