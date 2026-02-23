import { NextRequest, NextResponse } from "next/server";
import { getSpotifyTrack } from "@/lib/spotify";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Track ID required" }, { status: 400 });
  }

  const track = await getSpotifyTrack(id);
  if (!track) {
    return NextResponse.json({ error: "Track not found" }, { status: 404 });
  }

  return NextResponse.json(track);
}
