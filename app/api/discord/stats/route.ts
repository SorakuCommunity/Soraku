import { NextResponse } from "next/server";
import { getDiscordStats } from "@/lib/discord";

export async function GET() {
  try {
    const stats = await getDiscordStats();
    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch Discord stats" },
      { status: 500 }
    );
  }
}
