import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { Twitter, Youtube, Twitch, Instagram, Star, Plus } from 'lucide-react'
import type { VtuberProfile } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Anime & VTuber — Soraku' }
export const revalidate = 60

const FALLBACK: VtuberProfile[] = [
  { id: '1', name: 'Sakura Miko', slug: 'sakura-miko', generation: 'Gen 3', avatar_url: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80', description: 'Kreator anime pilihan komunitas Soraku.', twitter: null, youtube: null, twitch: null, instagram: null, tiktok: null, created_at: '' },
  { id: '2', name: 'Nakiri Ayame', slug: 'nakiri-ayame', generation: 'Gen 2', avatar_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80', description: 'Streamer dengan konten anime berkualitas tinggi.', twitter: null, youtube: null, twitch: null, instagram: null, tiktok: null, created_at: '' },
  { id: '3', name: 'Shirakami Fubuki', slug: 'shirakami-fubuki', generation: 'Gen 1', avatar_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80', description: 'Content creator anime dan gaming populer.', twitter: null, youtube: null, twitch: null, instagram: null, tiktok: null, created_at: '' },
]

export default async function VtuberPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('vtubers')
    .select('*')
    .order('created_at', { ascending: false })

  const profiles: VtuberProfile[] = (data?.length ? data : FALLBACK) as VtuberProfile[]

  // Group by generation
  const generations = [...new Set(profiles.map(p => p.generation ?? 'Lainnya'))].filter(Boolean)

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold mb-4">
              Anime & <span className="grad-text">VTuber</span>
            </h1>
            <p className="text-soraku-sub">Koleksi kreator dan talent berbakat dari komunitas Soraku.</p>
          </div>
          <Link
            href="/Soraku_Admin"
            className="inline-flex items-center gap-2 glass border border-soraku-border px-4 py-2 rounded-xl text-sm hover:border-purple-500 transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah VTuber
          </Link>
        </div>

        {/* Grid — all or by generation */}
        {generations.length > 1 ? (
          generations.map(gen => (
            <div key={gen} className="mb-12">
              <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-400" />
                <span>{gen}</span>
              </h2>
              <VtuberGrid profiles={profiles.filter(p => (p.generation ?? 'Lainnya') === gen)} />
            </div>
          ))
        ) : (
          <VtuberGrid profiles={profiles} />
        )}
      </div>
    </div>
  )
}

function VtuberGrid({ profiles }: { profiles: VtuberProfile[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((p) => (
        <Link
          key={p.id}
          href={`/Vtuber/${p.slug ?? p.id}`}
          className="glass rounded-2xl overflow-hidden hover:border-purple-500/50 hover:scale-[1.02] transition-all group"
        >
          <div className="relative h-52 overflow-hidden">
            {p.avatar_url ? (
              <Image src={p.avatar_url} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
            ) : (
              <div className="w-full h-full bg-soraku-muted flex items-center justify-center">
                <Star className="w-12 h-12 text-soraku-sub/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-soraku-card to-transparent" />
            {p.generation && (
              <span className="absolute top-3 left-3 text-xs bg-soraku-primary/80 text-white px-2 py-0.5 rounded-full">{p.generation}</span>
            )}
          </div>
          <div className="p-5">
            <h3 className="font-display font-bold text-lg mb-1 group-hover:text-soraku-primary transition-colors">{p.name}</h3>
            {p.description && <p className="text-soraku-sub text-sm line-clamp-2 mb-3">{p.description}</p>}
            <div className="flex items-center gap-2">
              {p.twitter && <Twitter className="w-4 h-4 text-soraku-sub" />}
              {p.youtube && <Youtube className="w-4 h-4 text-soraku-sub" />}
              {p.twitch && <Twitch className="w-4 h-4 text-soraku-sub" />}
              {p.instagram && <Instagram className="w-4 h-4 text-soraku-sub" />}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
