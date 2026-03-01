// app/dashboard/page.tsx — SORAKU v1.0.a3.5
// Server Component: fetches data server-side, delegates animation to client wrappers
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DiscordHeroCard } from '@/components/community/DiscordHeroCard'
import { FadeInSection, StaggerGrid, StaggerItem } from '@/components/dashboard/DashboardAnimations'
import { BookOpen, Calendar, Users, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard – Soraku' }

function SectionHeader({
  icon: Icon,
  title,
  href,
}: {
  icon: React.ElementType
  title: string
  href?: string
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'rgba(79,163,209,0.15)', color: 'var(--color-primary)' }}
        >
          <Icon size={16} />
        </div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-primary)' }}
        >
          Lihat Semua <ArrowRight size={12} />
        </Link>
      )}
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  const { data: events } = await supabase
    .from('events')
    .select('id, title, slug, cover_url, description, start_date, status')
    .in('status', ['active', 'upcoming'])
    .order('start_date', { ascending: true })
    .limit(6)

  const hasBlog   = posts?.length   && posts.length   > 0
  const hasEvents = events?.length  && events.length  > 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-10">

        {/* Page Header */}
        <FadeInSection>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-sub)' }}>
            Selamat datang di Soraku — komunitas Anime & Manga Indonesia.
          </p>
        </FadeInSection>

        {/* Discord Hero Card */}
        <FadeInSection delay={0.1}>
          <DiscordHeroCard />
        </FadeInSection>

        {/* Latest Blog Posts */}
        {hasBlog && (
          <FadeInSection delay={0.15}>
            <SectionHeader icon={BookOpen} title="Artikel Terbaru" href="/blog" />
            <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts!.map((post) => (
                <StaggerItem key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block rounded-2xl overflow-hidden border h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    style={{
                      background:     'rgba(255,255,255,0.04)',
                      backdropFilter: 'blur(20px)',
                      borderColor:    'rgba(255,255,255,0.08)',
                    }}
                  >
                    {post.cover_image ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div
                        className="aspect-video flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, rgba(79,163,209,0.12), rgba(110,143,166,0.08))' }}
                      >
                        <BookOpen size={32} style={{ color: 'var(--color-primary)', opacity: 0.35 }} />
                      </div>
                    )}
                    <div className="p-4">
                      <h3
                        className="font-semibold text-sm mb-1.5 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors"
                        style={{ color: 'var(--text)' }}
                      >
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-xs line-clamp-2 mb-2" style={{ color: 'var(--text-sub)' }}>
                          {post.excerpt}
                        </p>
                      )}
                      <p className="text-xs" style={{ color: 'var(--text-sub)', opacity: 0.6 }}>
                        {new Date(post.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </FadeInSection>
        )}

        {/* Latest Events */}
        {hasEvents && (
          <FadeInSection delay={0.2}>
            <SectionHeader icon={Calendar} title="Event Mendatang" href="/events" />
            <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events!.map((event) => (
                <StaggerItem key={event.id}>
                  <Link
                    href={event.slug ? `/events/${event.slug}` : '/events'}
                    className="group block rounded-2xl overflow-hidden border h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    style={{
                      background:     'rgba(255,255,255,0.04)',
                      backdropFilter: 'blur(20px)',
                      borderColor:    'rgba(255,255,255,0.08)',
                    }}
                  >
                    {event.cover_url ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={event.cover_url}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div
                        className="aspect-video flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, rgba(232,194,168,0.12), rgba(79,163,209,0.08))' }}
                      >
                        <Calendar size={32} style={{ color: 'var(--color-accent)', opacity: 0.35 }} />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: event.status === 'active'
                              ? 'rgba(87,242,135,0.15)'
                              : 'rgba(79,163,209,0.15)',
                            color: event.status === 'active' ? '#57F287' : 'var(--color-primary)',
                          }}
                        >
                          {event.status === 'active' ? 'Berlangsung' : 'Upcoming'}
                        </span>
                      </div>
                      <h3
                        className="font-semibold text-sm mb-1.5 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors"
                        style={{ color: 'var(--text)' }}
                      >
                        {event.title}
                      </h3>
                      {event.start_date && (
                        <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-sub)' }}>
                          <Calendar size={11} />
                          {new Date(event.start_date).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </FadeInSection>
        )}

        {/* Komunitas CTA */}
        <FadeInSection delay={0.25}>
          <div
            className="relative rounded-2xl border overflow-hidden"
            style={{
              background:     'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              borderColor:    'rgba(255,255,255,0.08)',
            }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at top left, rgba(79,163,209,0.08) 0%, transparent 70%)' }} />
            <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
              <div
                className="flex items-center justify-center w-16 h-16 rounded-2xl flex-shrink-0"
                style={{ backgroundColor: 'rgba(79,163,209,0.15)', color: 'var(--color-primary)' }}
              >
                <Users size={28} />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>
                  Gabung Komunitas Soraku
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-sub)' }}>
                  Temukan teman sesama penggemar Anime & Manga, ikut event, dan berbagi karya.
                </p>
              </div>
              <Link
                href="/komunitas"
                className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:scale-105 min-h-[44px]"
                style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
              >
                Komunitas <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </FadeInSection>

      </div>
    </div>
  )
}
