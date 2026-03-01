// app/komunitas/page.tsx — SORAKU v1.0.a3.5
// Discord Hero + 6-feature glass grid + filter tabs + gallery grid + discussions
export const dynamic   = 'force-dynamic'
export const revalidate = 600

import { createClient } from '@/lib/supabase/server'
import { DiscordHeroCard } from '@/components/discord/DiscordHeroCard'
import { KomunitasClient } from '@/components/komunitas/KomunitasClient'
import { getGitHubDiscussions } from '@/lib/github'
import { MessageCircle, Radio, Mic2, Calendar, Image as ImageIcon, Star } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Komunitas – Soraku' }

const FEATURES = [
  { icon: <MessageCircle size={22} />, title: 'Diskusi Anime',   desc: 'Bahas episode terbaru, rekomendasi, dan teori seru bersama ribuan anggota.' },
  { icon: <Radio          size={22} />, title: 'Discord Chat',   desc: 'Server Discord aktif 24/7 dengan channel topik spesifik dan komunitas hangat.' },
  { icon: <Mic2           size={22} />, title: 'Voice Channel',  desc: 'Nonton bareng, ngobrol santai, dan karaoke online kapan saja kamu mau.' },
  { icon: <Calendar       size={22} />, title: 'Event Regular',  desc: 'Event online & offline rutin — cosplay contest, quiz, watch party dan lainnya.' },
  { icon: <ImageIcon      size={22} />, title: 'Fan Gallery',    desc: 'Upload dan pamerkan fanart originalmu, dapatkan likes dari seluruh komunitas.' },
  { icon: <Star           size={22} />, title: 'VTuber Lounge',  desc: 'Ikuti VTuber favoritmu, pantau jadwal live, dan diskusi clip terbaru.' },
]

export default async function KomunitasPage() {
  const supabase = await createClient()

  const { data: gallery } = await supabase
    .from('gallery')
    .select('id, image_url, caption, created_at, likes, user_id')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(24)

  const discussions = await getGitHubDiscussions(
    process.env.GITHUB_OWNER ?? 'SorakuCommunity',
    process.env.GITHUB_REPO  ?? 'Soraku',
    12,
  ).catch(() => [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

        {/* Page header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            Komunitas Soraku
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-sub)' }}>
            Bergabunglah bersama ribuan penggemar Anime dan Manga Indonesia.
          </p>
        </div>

        {/* Discord Hero */}
        <DiscordHeroCard />

        {/* 6-Feature Glass Grid — 3 cols × 2 rows */}
        <section>
          <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--text)' }}>Apa yang ada di Soraku?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i}
                className="group p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-default backdrop-blur-xl"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderColor:     'rgba(255,255,255,0.10)',
                }}>
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                  style={{
                    backgroundColor: 'var(--color-primary)18',
                    color:           'var(--color-primary)',
                  }}>
                  {f.icon}
                </div>
                {/* Text */}
                <h3 className="font-semibold text-sm mb-1.5 transition-colors"
                  style={{ color: 'var(--text)' }}>
                  {f.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                  {f.desc}
                </p>
                {/* Hover accent line */}
                <div className="mt-4 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500"
                  style={{ backgroundColor: 'var(--color-primary)' }} />
              </div>
            ))}
          </div>
        </section>

        {/* Gallery + Discussions with filter tabs */}
        <KomunitasClient
          gallery={gallery ?? []}
          discussions={discussions as Record<string, unknown>[]}
        />
      </div>
    </div>
  )
}
