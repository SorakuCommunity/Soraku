import { NextResponse } from 'next/server'
import { fetchDiscordStats } from '@/lib/discord'

export async function GET() {
  const stats = await fetchDiscordStats()
  if (!stats) return NextResponse.json({ error: 'Tidak dapat mengambil data Discord' }, { status: 503 })
  return NextResponse.json({ stats }, { headers: { 'Cache-Control': 's-maxage=300' } })
}
