import { NextResponse } from "next/server";
import { getDiscordStats } from "@/lib/discord";

export async function GET() {
  try {
    const stats = await getDiscordStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch Discord stats" },
      { status: 500 }
    );
  }
}
