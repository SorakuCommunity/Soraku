import Link from 'next/link'
import { ArrowRight, Users, BookOpen, Image, Music } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch active events
  const { data: events } = await supabase
    .from('events')
    .select('id, title, cover_url, start_date, slug')
    .eq('status', 'active')
    .order('start_date', { ascending: true })
    .limit(6)

  // Fetch recent blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3)

  // Fetch gallery highlights
  const { data: gallery } = await supabase
    .from('gallery')
    .select('id, title, image_url')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 60% 50%, rgba(79,163,209,0.12) 0%, transparent 70%), var(--bg)'
        }} />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 border"
            style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--badge-text)', borderColor: 'var(--glass-border)' }}>
            ✦ Platform Komunitas Anime & Manga Indonesia
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight" style={{ color: 'var(--text)' }}>
            Selamat Datang di{' '}
            <span style={{ color: 'var(--color-primary)' }}>Soraku</span>
          </h1>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-sub)' }}>
            Temukan komunitas Anime, Manga, Games, dan Budaya Digital Jepang yang hangat dan aktif.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/komunitas"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 min-h-[44px]"
              style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
              Bergabung Sekarang <ArrowRight size={16} />
            </Link>
            <Link href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm border transition-all hover:bg-[var(--hover-bg)] min-h-[44px]"
              style={{ color: 'var(--text-sub)', borderColor: 'var(--border)' }}>
              Lihat Blog
            </Link>
          </div>
        </div>
      </section>

      {/* ── About Preview ─────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text)' }}>Tentang Soraku</h2>
            <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-sub)' }}>
              Soraku adalah ruang digital untuk para pecinta Anime, Manga, Game Jepang, dan Vtuber.
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {[
              { icon: <Users size={24} />,    title: 'Komunitas',  desc: 'Diskusi dan event bersama member aktif.' },
              { icon: <BookOpen size={24} />, title: 'Blog',       desc: 'Artikel, review, dan berita terkini.' },
              { icon: <Image size={24} />,    title: 'Gallery',    desc: 'Koleksi fanart dan karya original.' },
              { icon: <Music size={24} />,    title: 'VTuber',     desc: 'Profil VTuber dan konten kreator.' },
            ].map((item) => (
              <div key={item.title} className="p-4 sm:p-6 rounded-xl border text-center transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--color-primary)' }}>
                  {item.icon}
                </div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>{item.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Active Events ─────────────────────────────────────── */}
      {events && events.length > 0 && (
        <section className="py-16 px-4" style={{ backgroundColor: 'var(--bg-muted)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>Event Aktif</h2>
              <Link href="/komunitas" className="text-sm hover:underline" style={{ color: 'var(--color-primary)' }}>
                Lihat semua →
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {events.map((event) => (
                <Link key={event.id} href={`/komunitas/${event.slug ?? event.id}`}
                  className="group rounded-xl overflow-hidden border transition-all hover:-translate-y-0.5"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                  <div className="aspect-square overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
                    {event.cover_url ? (
                      <img src={event.cover_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--color-primary)' }}>
                        <Users size={24} />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{event.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Blog Preview ──────────────────────────────────────── */}
      {posts && posts.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>Blog Terbaru</h2>
              <Link href="/blog" className="text-sm hover:underline" style={{ color: 'var(--color-primary)' }}>Lihat semua →</Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  className="group rounded-xl overflow-hidden border transition-all hover:-translate-y-0.5"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                  {post.cover_image && (
                    <div className="aspect-video overflow-hidden">
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2" style={{ color: 'var(--text)' }}>{post.title}</h3>
                    {post.excerpt && <p className="text-xs line-clamp-2" style={{ color: 'var(--text-sub)' }}>{post.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery Highlight ─────────────────────────────────── */}
      {gallery && gallery.length > 0 && (
        <section className="py-16 px-4" style={{ backgroundColor: 'var(--bg-muted)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>Gallery Terbaru</h2>
              <Link href="/gallery" className="text-sm hover:underline" style={{ color: 'var(--color-primary)' }}>Lihat semua →</Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {gallery.map((item) => (
                <Link key={item.id} href="/gallery"
                  className="group aspect-square rounded-xl overflow-hidden border"
                  style={{ borderColor: 'var(--border)' }}>
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Discord CTA ───────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-8 sm:p-12 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--glass-border)' }}>
            <div className="text-4xl mb-4">💬</div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>
              Yuk Ngobrol di Discord
            </h2>
            <p className="mb-6 text-sm" style={{ color: 'var(--text-sub)' }}>
              Server Discord kami aktif setiap hari — diskusi anime, nonton bareng, game bareng, dan event seru lainnya.
            </p>
            <a href="https://discord.gg/CJJ7KEJMbg" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 min-h-[44px]"
              style={{ backgroundColor: '#5865F2', color: '#fff' }}>
              Bergabung ke Discord
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
