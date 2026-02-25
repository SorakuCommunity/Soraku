import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { Twitter, Youtube, Twitch, Star, ChevronRight } from 'lucide-react'
import type { AnimeProfile } from '@/types'

export const metadata = { title: 'Anime & Kreator' }
export const revalidate = 60

const FALLBACK: AnimeProfile[] = [
  {
    id: '1', name: 'Sakura Miko', slug: 'sakura-miko', generation: 'Gen 3',
    avatar_url: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80',
    cover_url: null,
    description: 'Kreator anime dan VTuber populer.', bio: null,
    twitter: null, youtube: null, twitch: null, instagram: null, tiktok: null, website: null,
    tags: ['VTuber', 'Gaming'], created_at: '',
  },
  {
    id: '2', name: 'Nakiri Ayame', slug: 'nakiri-ayame', generation: 'Gen 2',
    avatar_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
    cover_url: null,
    description: 'Streamer anime & gaming berkarakter kuat.', bio: null,
    twitter: null, youtube: null, twitch: null, instagram: null, tiktok: null, website: null,
    tags: ['Streamer', 'Anime'], created_at: '',
  },
  {
    id: '3', name: 'Shirakami Fubuki', slug: 'shirakami-fubuki', generation: 'Gen 1',
    avatar_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80',
    cover_url: null,
    description: 'Content creator anime legendaris.', bio: null,
    twitter: null, youtube: null, twitch: null, instagram: null, tiktok: null, website: null,
    tags: ['Content Creator'], created_at: '',
  },
]

export default async function AnimePage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('anime_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const profiles: AnimeProfile[] = (data?.length ? data : FALLBACK) as AnimeProfile[]

  // Group by generation
  const byGen: Record<string, AnimeProfile[]> = {}
  for (const p of profiles) {
    const gen = p.generation ?? 'Lainnya'
    if (!byGen[gen]) byGen[gen] = []
    byGen[gen].push(p)
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full border border-purple-500/30 mb-4">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">Talent & Kreator</span>
          </div>
          <h1 className="font-display text-5xl font-bold mb-4">
            Anime & <span className="grad-text">Kreator</span>
          </h1>
          <p className="text-soraku-sub max-w-xl mx-auto">
            Temukan kreator, VTuber, dan talent favorit kamu di komunitas Soraku.
          </p>
        </div>

        {/* Grid per generation */}
        {Object.entries(byGen).map(([gen, list]) => (
          <div key={gen} className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-display text-xl font-bold">{gen}</h2>
              <div className="flex-1 h-px bg-soraku-border" />
              <span className="text-soraku-sub text-xs">{list.length} talent</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((p) => (
                <Link key={p.id} href={`/Anime/${p.slug}`}
                  className="glass rounded-2xl overflow-hidden group hover:border-purple-500/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                  {/* Card – portrait style like talent cards */}
                  <div className="relative h-64 overflow-hidden">
                    {p.avatar_url ? (
                      <Image
                        src={p.avatar_url} alt={p.name}
                        fill className="object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-soraku-muted flex items-center justify-center">
                        <Star className="w-16 h-16 text-soraku-sub/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-soraku-card via-soraku-card/30 to-transparent" />
                    {p.generation && (
                      <div className="absolute top-3 left-3">
                        <span className="text-xs font-semibold bg-purple-500/80 text-white px-2.5 py-1 rounded-full">
                          {p.generation}
                        </span>
                      </div>
                    )}
                    {p.tags?.length > 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="text-xs bg-black/60 text-white/80 px-2 py-0.5 rounded-full">
                          {p.tags[0]}
                        </span>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-soraku-primary/80 text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2">
                        Lihat Profil <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-lg mb-1 group-hover:text-soraku-primary transition-colors">
                      {p.name}
                    </h3>
                    {p.description && (
                      <p className="text-soraku-sub text-sm line-clamp-2 mb-3">{p.description}</p>
                    )}
                    <div className="flex items-center gap-2">
                      {p.twitter && (
                        <span className="p-1.5 glass rounded-lg border border-soraku-border">
                          <Twitter className="w-3.5 h-3.5 text-blue-400" />
                        </span>
                      )}
                      {p.youtube && (
                        <span className="p-1.5 glass rounded-lg border border-soraku-border">
                          <Youtube className="w-3.5 h-3.5 text-red-400" />
                        </span>
                      )}
                      {p.twitch && (
                        <span className="p-1.5 glass rounded-lg border border-soraku-border">
                          <Twitch className="w-3.5 h-3.5 text-purple-400" />
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
