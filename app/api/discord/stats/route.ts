import { NextResponse } from 'next/server'
import { fetchDiscordStats } from '@/lib/discord'

export async function GET() {
  const stats = await fetchDiscordStats()
  return NextResponse.json(stats, { headers: { 'Cache-Control': 'public, max-age=300' } })
}
