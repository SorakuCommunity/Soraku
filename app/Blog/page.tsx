import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Calendar, User, ArrowRight, BookOpen, Clock } from 'lucide-react'
import type { BlogPost } from '@/types'

export const metadata = { title: 'Blog' }

const FALLBACK: BlogPost[] = [
  { id: '1', title: 'Top 10 Anime Wajib Tonton 2024', slug: '#',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
    content: 'Dari isekai epik hingga slice of life — inilah anime terbaik tahun ini yang tidak boleh kamu lewatkan.',
    tags: ['Top 10', 'Review'], status: 'published', author_id: '', deleted_at: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', title: 'Panduan Lengkap Membaca Manga untuk Pemula', slug: '#',
    thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80',
    content: 'Baru mau mulai baca manga tapi bingung mulai dari mana? Panduan ini cocok untukmu!',
    tags: ['Panduan', 'Manga'], status: 'published', author_id: '', deleted_at: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', title: 'Sejarah Anime: Dari Astro Boy Hingga Kini', slug: '#',
    thumbnail: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&q=80',
    content: 'Perjalanan panjang industri anime dari 1960-an hingga era streaming modern yang kita nikmati sekarang.',
    tags: ['Sejarah', 'Anime'], status: 'published', author_id: '', deleted_at: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', title: 'Fenomena Anime di Indonesia: Komunitas & Tren 2024', slug: '#',
    thumbnail: 'https://images.unsplash.com/photo-1514986888952-8cd320577b68?w=800&q=80',
    content: 'Anime di Indonesia bukan sekadar tontonan — ia sudah menjadi budaya tersendiri.',
    tags: ['Komunitas', 'Indonesia'], status: 'published', author_id: '', deleted_at: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

export default async function BlogPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*, users(display_name, avatar_url, username)')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(20)

  const posts: BlogPost[] = (data?.length ? data : FALLBACK) as BlogPost[]
  const [featured, ...rest] = posts

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-pink-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-pink-400">Blog Soraku</span>
            </div>
            <h1 className="font-display text-5xl font-bold">
              Artikel & <span className="grad-text">Ulasan</span>
            </h1>
          </div>
          <p className="hidden md:block text-soraku-sub max-w-xs text-sm text-right">
            Cerita, ulasan, dan inspirasi dari komunitas Soraku.
          </p>
        </div>

        {/* Featured */}
        {featured && (
          <Link href={`/Blog/${featured.slug}`}
            className="glass rounded-3xl overflow-hidden group hover:border-pink-500/40 transition-all mb-10 block">
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-3 relative h-64 md:h-80 overflow-hidden">
                <Image
                  src={featured.thumbnail ?? 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80'}
                  alt={featured.title} fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-soraku-card/80 md:block hidden" />
                <div className="absolute top-4 left-4">
                  <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ✨ Unggulan
                  </span>
                </div>
              </div>
              <div className="md:col-span-2 p-8 flex flex-col justify-center">
                {featured.tags?.[0] && (
                  <span className="text-xs text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full inline-block mb-3 self-start">
                    {featured.tags[0]}
                  </span>
                )}
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 group-hover:text-pink-400 transition-colors line-clamp-3">
                  {featured.title}
                </h2>
                <p className="text-soraku-sub text-sm line-clamp-3 mb-6">{featured.content}</p>
                <div className="flex items-center gap-3 text-xs text-soraku-sub mb-4">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{featured.users?.display_name ?? 'Soraku'}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(featured.created_at)}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />5 mnt</span>
                </div>
                <span className="inline-flex items-center gap-2 text-pink-400 text-sm font-semibold hover:gap-3 transition-all">
                  Baca Artikel <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Grid 2 */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rest.map((p) => (
              <Link key={p.id} href={`/Blog/${p.slug}`}
                className="glass rounded-2xl overflow-hidden group hover:border-pink-500/30 hover:scale-[1.01] transition-all flex flex-col">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={p.thumbnail ?? 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80'}
                    alt={p.title} fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-soraku-card to-transparent" />
                  {p.tags?.[0] && (
                    <span className="absolute top-3 left-3 bg-pink-500/80 text-white text-xs px-2 py-0.5 rounded-full">{p.tags[0]}</span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-display font-bold text-lg line-clamp-2 mb-2 group-hover:text-pink-400 transition-colors flex-1">
                    {p.title}
                  </h3>
                  <p className="text-soraku-sub text-sm line-clamp-2 mb-4">{p.content}</p>
                  <div className="flex items-center justify-between text-xs text-soraku-sub mt-auto">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />{p.users?.display_name ?? 'Soraku'}
                    </span>
                    <span>{formatDate(p.created_at)}</span>
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
