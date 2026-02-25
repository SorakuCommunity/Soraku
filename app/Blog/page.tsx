import { fetchAnimeLofiTracks } from '@/lib/spotify'
import { createClient } from '@/lib/supabase/server'
import { MusicPlayer } from '@/components/MusicPlayer'
import Image from 'next/image'
import { Calendar, User, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from '@/types'

export const metadata = { title: 'Blog' }

const FALLBACK_POSTS: Partial<BlogPost>[] = [
  { id: '1', title: 'Top 10 Anime Wajib Tonton 2024', slug: '#', thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80', content: 'Dari isekai epik hingga slice of life yang menyentuh hati, inilah daftar anime terbaik tahun ini.', tags: ['Review', 'Top 10'], status: 'published', created_at: new Date().toISOString() },
  { id: '2', title: 'Panduan Lengkap Membaca Manga untuk Pemula', slug: '#', thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80', content: 'Baru pertama kali ingin membaca manga? Panduan ini akan membantumu memulai.', tags: ['Panduan'], status: 'published', created_at: new Date().toISOString() },
  { id: '3', title: 'Fenomena Anime di Indonesia: Tren 2024', slug: '#', thumbnail: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&q=80', content: 'Anime telah menjadi bagian dari budaya pop Indonesia. Eksplorasi komunitas lokalnya.', tags: ['Komunitas'], status: 'published', created_at: new Date().toISOString() },
]

export default async function BlogPage() {
  const [tracks, supabase] = await Promise.all([fetchAnimeLofiTracks(), createClient()])
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*, users(display_name, avatar_url)')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(10)

  const displayPosts = posts?.length ? posts as BlogPost[] : FALLBACK_POSTS as BlogPost[]

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="font-display text-4xl font-bold mb-4">Blog <span className="grad-text">Soraku</span></h1>
          <p className="text-soraku-sub">Artikel, ulasan, dan cerita dari komunitas.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {displayPosts.map((p, i) => (
              <article key={p.id}
                className={`glass rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all group ${i === 0 ? 'lg:flex' : ''}`}>
                {p.thumbnail && (
                  <div className={`relative overflow-hidden ${i === 0 ? 'h-64 lg:h-auto lg:w-72 lg:shrink-0' : 'h-48'}`}>
                    <Image src={p.thumbnail} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-soraku-card/60 to-transparent" />
                    {p.tags?.[0] && (
                      <span className="absolute top-3 left-3 text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">{p.tags[0]}</span>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <h2 className="font-display font-bold text-xl mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">{p.title}</h2>
                  <p className="text-soraku-sub text-sm line-clamp-3 mb-4">{p.content}</p>
                  <div className="flex items-center gap-4 text-xs text-soraku-sub">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{p.users?.display_name ?? 'Soraku Team'}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(p.created_at)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />5 menit</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="font-semibold mb-4">🎵 Musik Anime & Lofi</h3>
              <MusicPlayer tracks={tracks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
