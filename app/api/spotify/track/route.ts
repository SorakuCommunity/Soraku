import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyTrack } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    const track = await getSpotifyTrack(id);
    return NextResponse.json(track);
  } catch (error) {
    console.error('Spotify track fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}