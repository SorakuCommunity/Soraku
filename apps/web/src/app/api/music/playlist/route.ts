import { adminDb } from '@/lib/supabase/admin'
import { ok, SERVER_ERROR } from '@/lib/api'

export const dynamic = 'force-dynamic'

// GET /api/music/playlist
// Response shape sesuai interface di src/context/music-player.tsx
export async function GET() {
  try {
    const { data, error } = await adminDb()
      .from('musictracks')
      .select('id,title,artist,anime,coverurl,srcurl,duration')
      .eq('isactive', true)
      .order('ordernum', { ascending: true })

    if (error) return SERVER_ERROR()

    // Map ke shape yang dipakai music player context
    const tracks = (data ?? []).map((t) => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      anime: t.anime ?? null,
      cover: t.coverurl ?? '🎵', // emoji fallback jika belum ada cover
      src: t.srcurl,
      duration: t.duration ?? 0,
    }))

    return ok(tracks)
  } catch {
    return SERVER_ERROR()
  }
}
