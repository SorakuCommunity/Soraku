import { fetchAnimeLofiTracks } from '@/lib/spotify'
import { createClient } from '@/lib/supabase/server'
import { MusicPlayer } from '@/components/MusicPlayer'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Blog — Soraku' }
export const revalidate = 60

const FALLBACK_POSTS: Partial<BlogPost>[] = [
  { id: '1', title: 'Top 10 Anime Wajib Tonton 2024', slug: '#', thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80', content: 'Dari isekai epik hingga slice of life yang menyentuh hati, inilah daftar anime terbaik tahun ini.', tags: ['Review', 'Top 10'], status: 'published', created_at: new Date().toISOString() },
  { id: '2', title: 'Panduan Lengkap Membaca Manga untuk Pemula', slug: '#', thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80', content: 'Baru pertama kali ingin membaca manga? Panduan ini akan membantumu memulai dengan tepat.', tags: ['Panduan'], status: 'published', created_at: new Date().toISOString() },
  { id: '3', title: 'Fenomena Anime di Indonesia: Tren 2024', slug: '#', thumbnail: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&q=80', content: 'Anime telah menjadi bagian dari budaya pop Indonesia. Eksplorasi komunitas lokalnya.', tags: ['Komunitas'], status: 'published', created_at: new Date().toISOString() },
  { id: '4', title: 'Review: Manga Terbaik Musim Ini', slug: '#', thumbnail: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&q=80', content: 'Kami merangkum manga terbaik yang wajib kamu baca musim ini tanpa spoiler.', tags: ['Review', 'Manga'], status: 'published', created_at: new Date().toISOString() },
]

export default async function BlogPage() {
  const [tracks, supabase] = await Promise.all([fetchAnimeLofiTracks(), createClient()])
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*, users(display_name, avatar_url)')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(12)

  const displayPosts = (posts?.length ? posts : FALLBACK_POSTS) as BlogPost[]
  const [featured, ...rest] = displayPosts

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ─── Header ─────────────────────────────────────────────── */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <h1 className="font-display text-4xl font-bold">
                Blog <span className="grad-text">Soraku</span>
              </h1>
            </div>
            <p className="text-soraku-sub">Artikel, ulasan, dan cerita dari komunitas Soraku.</p>
          </div>
        </div>

        {/* ─── Spotify Player (top, single row) ───────────────────── */}
        {tracks.length > 0 && (
          <div className="glass rounded-2xl p-4 mb-10 flex items-center gap-4">
            <div className="text-soraku-sub text-sm whitespace-nowrap font-medium flex items-center gap-2">
              🎵 <span className="hidden sm:inline">Musik Anime Lofi</span>
            </div>
            <div className="flex-1">
              <MusicPlayer tracks={tracks} compact />
            </div>
          </div>
        )}

        {/* ─── Featured Post ───────────────────────────────────────── */}
        {featured && (
          <Link
            href={`/Blog/${featured.slug}`}
            className="glass rounded-3xl overflow-hidden mb-10 group flex flex-col md:flex-row hover:border-purple-500/50 transition-all block"
          >
            {featured.thumbnail && (
              <div className="relative h-64 md:h-auto md:w-1/2 overflow-hidden shrink-0">
                <Image src={featured.thumbnail} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" priority />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-soraku-card/80 to-transparent" />
              </div>
            )}
            <div className="p-8 flex flex-col justify-center md:w-1/2">
              {featured.tags?.[0] && (
                <span className="inline-block text-xs bg-purple-500/15 text-purple-400 border border-purple-500/30 px-3 py-0.5 rounded-full mb-3">
                  {featured.tags[0]}
                </span>
              )}
              <h2 className="font-display text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors line-clamp-3">
                {featured.title}
              </h2>
              <p className="text-soraku-sub text-sm line-clamp-3 mb-4">{featured.content}</p>
              <div className="flex items-center gap-4 text-xs text-soraku-sub mb-6">
                <span className="flex items-center gap-1"><User className="w-3 h-3" />{featured.users?.display_name ?? 'Soraku Team'}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(featured.created_at)}</span>
              </div>
              <span className="inline-flex items-center gap-2 text-soraku-primary text-sm font-medium">
                Baca Selengkapnya <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        )}

        {/* ─── Blog Grid 2 ─────────────────────────────────────────── */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rest.map((p) => (
              <Link
                key={p.id}
                href={`/Blog/${p.slug}`}
                className="glass rounded-2xl overflow-hidden hover:border-purple-500/50 group transition-all flex"
              >
                {p.thumbnail && (
                  <div className="relative w-36 shrink-0 overflow-hidden">
                    <Image src={p.thumbnail} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                )}
                <div className="p-5 flex flex-col justify-between">
                  <div>
                    {p.tags?.[0] && (
                      <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full mb-2 inline-block">
                        {p.tags[0]}
                      </span>
                    )}
                    <h3 className="font-semibold text-sm line-clamp-3 group-hover:text-purple-400 transition-colors">{p.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-soraku-sub mt-2">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{p.users?.display_name ?? 'Soraku'}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(p.created_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
