import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { fetchDiscordStats } from '@/lib/discord'
import {
  ArrowRight, Users, Wifi, Image as Img, BookOpen,
  Calendar, Star, MessageCircle, Zap, Info,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { BlogPost, Event } from '@/types'

export const revalidate = 60

const ANIME_BG = [
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80',
  'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&q=80',
  'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&q=80',
  'https://images.unsplash.com/photo-1514986888952-8cd320577b68?w=600&q=80',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
]

const NAV_CARDS = [
  { title: 'Komunitas', desc: 'Diskusi seru dengan ribuan penggemar anime & manga.', href: '/komunitas', icon: Users },
  { title: 'VTuber', desc: 'Koleksi profil kreator & talent berbakat komunitas.', href: '/Vtuber', icon: Star },
  { title: 'Gallery', desc: 'Fanart dan karya kreatif dari komunitas.', href: '/gallery', icon: Img },
  { title: 'Blog', desc: 'Artikel, review, dan ulasan terbaru.', href: '/Blog', icon: BookOpen },
  { title: 'Events', desc: 'Ikuti event dan kompetisi komunitas.', href: '/events', icon: Calendar },
  { title: 'Tentang', desc: 'Kisah dan perjalanan Soraku sejak 2023.', href: '/Tentang', icon: Info },
]

export default async function HomePage() {
  const [discord, supabase] = await Promise.all([fetchDiscordStats(), createClient()])

  const [{ data: events }, { data: blogPosts }] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, description, banner_url, start_date, end_date')
      .gte('end_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(6),
    supabase
      .from('blog_posts')
      .select('id, title, slug, thumbnail, content, tags, created_at, users(display_name)')
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(4),
  ])

  const activeEvents = (events ?? []) as Event[]
  const posts = (blogPosts ?? []) as unknown as BlogPost[]

  return (
    <div className="min-h-screen">
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&q=80"
            alt="Hero Background"
            fill
            className="object-cover blur-sm scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-soraku-dark/80 via-soraku-dark/75 to-soraku-dark" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* Discord stats badge */}
          <div className="inline-flex items-center gap-3 glass px-5 py-2 rounded-full mb-8 border border-purple-500/30">
            {discord.memberCount > 0 ? (
              <>
                <span className="flex items-center gap-1.5 text-sm">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-white">{discord.memberCount.toLocaleString()}</span>
                  <span className="text-soraku-sub">anggota</span>
                </span>
                <div className="w-px h-4 bg-soraku-border" />
                <span className="flex items-center gap-1.5 text-sm">
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="font-semibold text-green-400">{discord.onlineCount.toLocaleString()}</span>
                  <span className="text-soraku-sub">online</span>
                </span>
              </>
            ) : (
              <span className="text-sm text-soraku-sub flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-400" /> Komunitas Anime & Manga Indonesia
              </span>
            )}
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Selamat Datang di{' '}
            <span className="grad-text">Soraku</span>
          </h1>
          <p className="text-xl text-soraku-sub mb-10 max-w-2xl mx-auto leading-relaxed">
            Ekosistem komunitas untuk penggemar Anime, Manga, dan Budaya Digital Jepang.
            Bergabunglah dan ekspresikan kreativitasmu.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/komunitas"
              className="inline-flex items-center gap-2 bg-soraku-gradient text-white px-8 py-3.5 rounded-full font-semibold hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-purple-500/25"
            >
              Bergabung Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 glass border border-soraku-border text-soraku-text px-8 py-3.5 rounded-full font-semibold hover:border-purple-500 transition-all"
            >
              Lihat Gallery
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-9 rounded-full border-2 border-soraku-sub/40 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-soraku-sub/40 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ─── Navigation Cards (Grid 3) ────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              Jelajahi <span className="grad-text">Soraku</span>
            </h2>
            <p className="text-soraku-sub max-w-xl mx-auto">Semua yang kamu butuhkan untuk menikmati budaya anime & manga.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NAV_CARDS.map(({ title, desc, href, icon: Icon }, i) => (
              <Link
                key={href}
                href={href}
                className="glass rounded-2xl overflow-hidden group hover:scale-[1.02] hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={ANIME_BG[i % ANIME_BG.length]}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-soraku-card via-soraku-card/50 to-transparent" />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-soraku-gradient flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold mb-2 group-hover:text-soraku-primary transition-colors">{title}</h3>
                  <p className="text-soraku-sub text-sm">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Active Events (Grid 3, auto wrap) ───────────────────────────── */}
      {activeEvents.length > 0 && (
        <section className="py-16 px-4 bg-soraku-card/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl font-bold mb-2">
                  Events <span className="grad-text">Aktif</span>
                </h2>
                <p className="text-soraku-sub text-sm">Event dan kompetisi yang sedang berjalan</p>
              </div>
              <Link href="/events" className="text-soraku-primary hover:text-soraku-accent text-sm font-medium flex items-center gap-1 transition-colors">
                Semua Events <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeEvents.slice(0, 6).map((ev) => (
                <Link
                  key={ev.id}
                  href={`/events/${ev.id}`}
                  className="glass rounded-2xl overflow-hidden hover:border-purple-500/50 hover:scale-[1.02] transition-all group"
                >
                  {ev.banner_url && (
                    <div className="relative h-40 overflow-hidden">
                      <Image src={ev.banner_url} alt={ev.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-soraku-card/80 to-transparent" />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="inline-block text-xs bg-green-500/15 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full mb-2">
                      Berlangsung
                    </span>
                    <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-soraku-primary transition-colors">{ev.title}</h3>
                    <p className="text-soraku-sub text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(ev.start_date)} – {formatDate(ev.end_date)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Blog Preview (Grid 2) ────────────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl font-bold mb-2">
                  Blog <span className="grad-text">Terbaru</span>
                </h2>
                <p className="text-soraku-sub text-sm">Artikel dan ulasan dari tim Soraku</p>
              </div>
              <Link href="/Blog" className="text-soraku-primary hover:text-soraku-accent text-sm font-medium flex items-center gap-1 transition-colors">
                Semua Artikel <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.slice(0, 4).map((p) => (
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
                        <span className="text-xs bg-purple-500/15 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full mb-2 inline-block">
                          {p.tags[0]}
                        </span>
                      )}
                      <h3 className="font-semibold line-clamp-2 mb-1 group-hover:text-soraku-primary transition-colors text-sm">{p.title}</h3>
                    </div>
                    <p className="text-soraku-sub text-xs">{formatDate(p.created_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Tentang Singkat + Discord CTA ───────────────────────────────── */}
      <section className="py-16 px-4 mb-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Tentang preview card */}
          <Link href="/Tentang" className="relative rounded-3xl overflow-hidden group block">
            <Image
              src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80"
              alt="Tentang Soraku"
              width={800}
              height={400}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-soraku-dark via-soraku-dark/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <Info className="w-6 h-6 text-purple-400 mb-2" />
              <h3 className="font-display text-2xl font-bold mb-1">Tentang Soraku</h3>
              <p className="text-soraku-sub text-sm">Kisah founder, timeline, dan perjalanan komunitas sejak 2023.</p>
              <span className="inline-flex items-center gap-1 text-soraku-primary text-sm mt-3 font-medium group-hover:gap-2 transition-all">
                Baca Selengkapnya <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

          {/* Discord CTA */}
          <div className="relative rounded-3xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80"
              alt="Discord Community"
              width={800}
              height={400}
              className="w-full h-64 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-soraku-dark via-soraku-dark/90 to-indigo-900/50" />
            <div className="absolute inset-0 flex flex-col items-start justify-center p-8">
              <MessageCircle className="w-8 h-8 text-indigo-400 mb-3" />
              <h3 className="font-display text-2xl font-bold mb-2">Gabung Discord</h3>
              <p className="text-soraku-sub text-sm mb-5 max-w-sm">Chat real-time, voice call, dan keseruan komunitas Soraku setiap hari.</p>
              <div className="flex gap-3">
                <Link
                  href="/komunitas"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
                >
                  <Zap className="w-4 h-4" /> Komunitas
                </Link>
                <a
                  href="https://discord.gg/CJJ7KEJMbg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 glass border border-indigo-500/40 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:border-indigo-400 transition-colors"
                >
                  Invite Link
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
