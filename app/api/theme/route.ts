import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { loadThemePalette } from '@/lib/theme'

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createClient()
    const palette = await loadThemePalette(supabase)
    return NextResponse.json(palette, {
      headers: { 'Cache-Control': 'public, max-age=60' },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to load theme' }, { status: 500 })
  }
}
