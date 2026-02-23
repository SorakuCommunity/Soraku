import { NextRequest, NextResponse } from "next/server";
import { searchSpotifyTracks } from "@/lib/spotify";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query) {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  const tracks = await searchSpotifyTracks(query);
  return NextResponse.json(tracks);
}
