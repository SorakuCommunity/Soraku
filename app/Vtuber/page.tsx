import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { Twitter, Youtube, Twitch, Star } from 'lucide-react'
import type { VtuberProfile } from '@/types'

export const metadata = { title: 'Anime & VTuber' }

const FALLBACK = [
  { id: '1', name: 'Sakura Miko', generation: 'Gen 3', avatar_url: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=300&q=80', description: 'Kreator anime pilihan komunitas.', twitter: null, youtube: null, twitch: null, instagram: null, tiktok: null, created_at: '' },
  { id: '2', name: 'Nakiri Ayame', generation: 'Gen 2', avatar_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&q=80', description: 'Streamer dengan konten anime berkualitas.', twitter: null, youtube: null, twitch: null, instagram: null, tiktok: null, created_at: '' },
  { id: '3', name: 'Shirakami Fubuki', generation: 'Gen 1', avatar_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&q=80', description: 'Content creator anime dan gaming.', twitter: null, youtube: null, twitch: null, instagram: null, tiktok: null, created_at: '' },
]

export default async function VtuberPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('vtubers').select('*').order('created_at', { ascending: false })
  const profiles: VtuberProfile[] = (data?.length ? data : FALLBACK) as VtuberProfile[]

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="font-display text-4xl font-bold mb-4">Anime & <span className="grad-text">VTuber</span></h1>
          <p className="text-soraku-sub">Koleksi kreator dan konten anime pilihan komunitas Soraku.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {profiles.map((p) => (
            <div key={p.id} className="glass rounded-2xl overflow-hidden hover:border-purple-500/50 hover:scale-[1.02] transition-all group">
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
                  {p.twitter && <a href={p.twitter} target="_blank" rel="noopener noreferrer" className="text-soraku-sub hover:text-blue-400 transition-colors"><Twitter className="w-4 h-4" /></a>}
                  {p.youtube && <a href={p.youtube} target="_blank" rel="noopener noreferrer" className="text-soraku-sub hover:text-red-400 transition-colors"><Youtube className="w-4 h-4" /></a>}
                  {p.twitch && <a href={p.twitch} target="_blank" rel="noopener noreferrer" className="text-soraku-sub hover:text-purple-400 transition-colors"><Twitch className="w-4 h-4" /></a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
