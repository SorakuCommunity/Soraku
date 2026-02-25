import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { fetchDiscordStats } from '@/lib/discord'
import { formatDate, isEventActive, isEventUpcoming } from '@/lib/utils'
import {
  ArrowRight, Users, Wifi, Calendar, BookOpen,
  ImageIcon, ChevronRight, Sparkles, Heart, Star
} from 'lucide-react'
import { DiscordIcon } from '@/components/icons'
import type { Event, BlogPost, GalleryItem } from '@/types'

const ANIME_BGTILES = [
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80',
  'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&q=80',
  'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&q=80',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
  'https://images.unsplash.com/photo-1514986888952-8cd320577b68?w=600&q=80',
]

export default async function HomePage() {
  const discord = await fetchDiscordStats()
  const supabase = await createClient()

  const [{ data: eventsRaw }, { data: postsRaw }, { data: galleryRaw }] = await Promise.all([
    supabase.from('events').select('*').order('start_date', { ascending: true }).limit(9),
    supabase.from('blog_posts').select('*, users(display_name,avatar_url)').eq('status', 'published').is('deleted_at', null).order('created_at', { ascending: false }).limit(4),
    supabase.from('gallery').select('id,image_url,caption,hashtags').eq('status', 'approved').order('created_at', { ascending: false }).limit(6),
  ])

  const events = (eventsRaw ?? []) as Event[]
  const activeEvents = events.filter(e => isEventActive(e) || isEventUpcoming(e))
  const posts = (postsRaw ?? []) as BlogPost[]
  const gallery = (galleryRaw ?? []) as GalleryItem[]

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Tiled anime background mosaic */}
        <div className="absolute inset-0 grid grid-cols-3 opacity-20">
          {ANIME_BGTILES.map((src, i) => (
            <div key={i} className="relative overflow-hidden">
              <Image src={src} alt="" fill className="object-cover" priority={i < 3} />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-soraku-dark/70 via-soraku-dark/80 to-soraku-dark" />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 py-20">
          {discord.memberCount > 0 && (
            <div className="inline-flex items-center gap-3 glass px-5 py-2 rounded-full mb-8 border border-purple-500/30">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-white">{discord.memberCount.toLocaleString()}</span>
              <span className="text-soraku-sub text-sm">anggota</span>
              <div className="w-px h-4 bg-soraku-border" />
              <Wifi className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-400">{discord.onlineCount.toLocaleString()}</span>
              <span className="text-soraku-sub text-sm">online</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="text-purple-400 text-sm font-semibold uppercase tracking-widest">Komunitas Anime & Manga</span>
          </div>

          <h1 className="font-display text-6xl md:text-8xl font-bold mb-6 leading-none tracking-tight">
            Selamat Datang di<br />
            <span className="grad-text">Soraku</span>
          </h1>
          <p className="text-xl text-soraku-sub mb-10 max-w-2xl mx-auto leading-relaxed">
            Ruang digital untuk penggemar Anime, Manga, dan Budaya Jepang.
            Berbagi, berkarya, dan tumbuh bersama.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/komunitas"
              className="inline-flex items-center gap-2 bg-soraku-gradient text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 hover:scale-105 transition-all shadow-xl shadow-purple-500/30">
              <DiscordIcon className="w-5 h-5" />
              Bergabung Discord
            </Link>
            <Link href="/gallery"
              className="inline-flex items-center gap-2 glass border border-soraku-border text-white px-8 py-4 rounded-full font-semibold text-lg hover:border-purple-500/60 transition-all">
              Lihat Gallery <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-soraku-sub rotate-90" />
        </div>
      </section>

      {/* ══════════════ TENTANG SINGKAT ══════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass rounded-3xl overflow-hidden border border-purple-500/20 shadow-2xl shadow-purple-500/10">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80"
                  alt="Tentang Soraku"
                  fill className="object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-soraku-card/80 md:bg-gradient-to-l" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-2xl bg-soraku-gradient flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div className="font-display text-4xl font-bold grad-text">Soraku</div>
                    <div className="text-soraku-sub text-sm mt-1">Since 2023</div>
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-12">
                <div className="inline-block text-xs font-semibold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full mb-4">
                  Tentang Kami
                </div>
                <h2 className="font-display text-3xl font-bold mb-4">
                  Ekosistem Komunitas<br /><span className="grad-text">Anime & Manga</span>
                </h2>
                <p className="text-soraku-sub leading-relaxed mb-6 text-sm">
                  Soraku adalah platform komunitas yang didirikan untuk menyatukan penggemar Anime,
                  Manga, dan Budaya Digital Jepang di Indonesia. Kami percaya setiap penggemar
                  memiliki cerita, karya, dan kreativitas yang layak untuk dibagikan.
                </p>
                <p className="text-soraku-sub leading-relaxed mb-8 text-sm">
                  Didirikan pada 2023 oleh sekelompok penggemar yang bersemangat, Soraku kini
                  telah menjadi rumah bagi ribuan anggota aktif yang saling mendukung dan menginspirasi.
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <Link href="/Tentang"
                    className="inline-flex items-center gap-2 bg-soraku-gradient text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
                    Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                  </Link>
                  <div className="flex items-center gap-2 text-soraku-sub text-sm">
                    <Heart className="w-4 h-4 text-pink-400" />
                    <span>Dibuat dengan passion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ ACTIVE EVENTS ══════════════ */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />Events
              </div>
              <h2 className="font-display text-4xl font-bold">
                Event <span className="grad-text">Berlangsung</span>
              </h2>
            </div>
            <Link href="/komunitas" className="hidden sm:flex items-center gap-1 text-soraku-sub hover:text-purple-400 transition-colors text-sm">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {activeEvents.length === 0 ? (
            <div className="glass rounded-2xl p-16 text-center border border-soraku-border">
              <Calendar className="w-12 h-12 text-soraku-sub/30 mx-auto mb-4" />
              <p className="text-soraku-sub">Belum ada event aktif saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeEvents.map((e, i) => {
                const bg = ANIME_BGTILES[i % ANIME_BGTILES.length]
                const active = isEventActive(e)
                return (
                  <div key={e.id}
                    className="glass rounded-2xl overflow-hidden group hover:scale-[1.02] hover:border-purple-500/50 transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={e.banner_url ?? bg}
                        alt={e.title}
                        fill className="object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-soraku-card via-soraku-card/40 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${active ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                          {active ? '🔴 Live' : '📅 Upcoming'}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-bold text-lg mb-2 line-clamp-2 group-hover:text-soraku-primary transition-colors">
                        {e.title}
                      </h3>
                      {e.description && (
                        <p className="text-soraku-sub text-xs line-clamp-2 mb-3">{e.description}</p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-soraku-sub">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(e.start_date)}</span>
                        <span>→</span>
                        <span>{formatDate(e.end_date)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════ BLOG PREVIEW ══════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-pink-400 mb-2">
                <BookOpen className="inline w-4 h-4 mr-1" />Blog
              </div>
              <h2 className="font-display text-4xl font-bold">
                Artikel <span className="grad-text">Terbaru</span>
              </h2>
            </div>
            <Link href="/Blog" className="hidden sm:flex items-center gap-1 text-soraku-sub hover:text-pink-400 transition-colors text-sm">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <BookOpen className="w-12 h-12 text-soraku-sub/30 mx-auto mb-4" />
              <p className="text-soraku-sub">Belum ada artikel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((p, i) => {
                const bg = ANIME_BGTILES[(i + 2) % ANIME_BGTILES.length]
                return (
                  <Link key={p.id} href={`/Blog/${p.slug}`}
                    className="glass rounded-2xl overflow-hidden group hover:scale-[1.01] hover:border-pink-500/40 transition-all duration-300 flex flex-col">
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={p.thumbnail ?? bg}
                        alt={p.title}
                        fill className="object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-soraku-card via-soraku-card/30 to-transparent" />
                      {p.tags?.[0] && (
                        <span className="absolute top-3 left-3 text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">{p.tags[0]}</span>
                      )}
                    </div>
                    <div className="p-5 flex-1">
                      <h3 className="font-display font-bold text-lg line-clamp-2 mb-2 group-hover:text-pink-400 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-soraku-sub text-sm line-clamp-2 mb-3">{p.content}</p>
                      <div className="flex items-center gap-2 text-xs text-soraku-sub mt-auto">
                        <span>{p.users?.display_name ?? 'Soraku Team'}</span>
                        <span>·</span>
                        <span>{formatDate(p.created_at)}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════ GALLERY HIGHLIGHT ══════════════ */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-pink-900/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-2">
                <ImageIcon className="inline w-4 h-4 mr-1" />Gallery
              </div>
              <h2 className="font-display text-4xl font-bold">
                Karya <span className="grad-text">Komunitas</span>
              </h2>
            </div>
            <Link href="/gallery" className="hidden sm:flex items-center gap-1 text-soraku-sub hover:text-cyan-400 transition-colors text-sm">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {gallery.length === 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {ANIME_BGTILES.map((src, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden aspect-square relative">
                  <Image src={src} alt="" fill className="object-cover opacity-50" loading="lazy" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-soraku-sub/30" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.map((item) => (
                <Link key={item.id} href="/gallery"
                  className="glass rounded-2xl overflow-hidden aspect-square relative group hover:scale-[1.02] transition-all">
                  <Image
                    src={item.image_url}
                    alt={item.caption ?? ''}
                    fill className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-soraku-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-white text-xs font-medium line-clamp-2">{item.caption}</p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════ DISCORD CTA ══════════════ */}
      <section className="py-24 px-4 mb-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=1400&q=80"
                alt="Discord CTA"
                fill className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-soraku-dark via-soraku-dark/95 to-purple-900/70" />
            </div>
            <div className="relative z-10 p-12 md:p-20 text-center md:text-left md:flex items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Siap Bergabung<br />dengan <span className="grad-text">Komunitas</span>?
                </h2>
                <p className="text-soraku-sub text-lg mb-8 max-w-lg">
                  Ribuan penggemar anime & manga sudah ada di sana. Diskusi, event, giveaway,
                  dan banyak lagi menanti kamu!
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <a href="https://discord.gg/CJJ7KEJMbg" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-indigo-500/30">
                    <DiscordIcon className="w-6 h-6" />
                    Join Discord Sekarang
                  </a>
                  <Link href="/komunitas"
                    className="inline-flex items-center gap-2 glass border border-soraku-border text-white px-8 py-4 rounded-2xl font-semibold hover:border-purple-500/60 transition-all">
                    Halaman Komunitas <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex flex-col items-center gap-4 glass rounded-2xl p-8 min-w-[200px] border border-purple-500/20">
                <DiscordIcon className="w-12 h-12 text-[#5865F2]" />
                {discord.memberCount > 0 && (
                  <>
                    <div className="text-center">
                      <div className="font-display text-3xl font-bold">{discord.memberCount.toLocaleString()}</div>
                      <div className="text-soraku-sub text-sm">anggota</div>
                    </div>
                    <div className="w-full h-px bg-soraku-border" />
                    <div className="text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <div className="font-display text-2xl font-bold text-green-400">{discord.onlineCount.toLocaleString()}</div>
                      </div>
                      <div className="text-soraku-sub text-sm">online sekarang</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
