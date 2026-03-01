// components/dashboard/DashboardContent.tsx — SORAKU v1.0.a3.4
// Content Connection Area — Blog Posts + Events grid
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ArrowRight, Newspaper, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string | null
  cover_image: string | null
  published_at: string | null
}

interface Event {
  id: string
  title: string
  description: string | null
  cover_image: string | null
  date: string
  status: 'ongoing' | 'upcoming' | 'finished'
}

interface Props {
  posts: Post[]
  events: Event[]
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export function DashboardContent({ posts, events }: Props) {
  const hasPosts = posts.length > 0
  const hasEvents = events.length > 0

  if (!hasPosts && !hasEvents) return null

  return (
    <div className="space-y-10">
      {/* Blog Posts */}
      {hasPosts && (
        <section>
          <SectionHeader
            icon={<Newspaper size={16} />}
            title="Blog Terbaru"
            href="/blog"
          />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {posts.map(post => (
              <motion.div key={post.id} variants={cardVariants}>
                <ContentCard
                  href={`/blog/${post.slug}`}
                  image={post.cover_image}
                  title={post.title}
                  excerpt={post.excerpt ?? ''}
                  date={post.published_at
                    ? format(new Date(post.published_at), 'd MMM yyyy', { locale: idLocale })
                    : ''}
                  badge="Blog"
                  badgeColor="var(--color-primary)"
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Events */}
      {hasEvents && (
        <section>
          <SectionHeader
            icon={<Sparkles size={16} />}
            title="Event Mendatang"
            href="/events"
          />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {events.map(event => (
              <motion.div key={event.id} variants={cardVariants}>
                <ContentCard
                  href={`/events/${event.id}`}
                  image={event.cover_image}
                  title={event.title}
                  excerpt={event.description ?? ''}
                  date={format(new Date(event.date), 'd MMM yyyy', { locale: idLocale })}
                  badge={event.status === 'ongoing' ? '🔴 Berlangsung' : '📅 Upcoming'}
                  badgeColor={event.status === 'ongoing' ? '#ef4444' : 'var(--color-accent)'}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}
    </div>
  )
}

function SectionHeader({
  icon, title, href,
}: { icon: React.ReactNode; title: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2" style={{ color: 'var(--text)' }}>
        <span style={{ color: 'var(--color-primary)' }}>{icon}</span>
        <h2 className="font-bold text-base">{title}</h2>
      </div>
      <Link
        href={href}
        className="flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
        style={{ color: 'var(--color-primary)' }}
      >
        Lihat Semua <ArrowRight size={12} />
      </Link>
    </div>
  )
}

function ContentCard({
  href, image, title, excerpt, date, badge, badgeColor,
}: {
  href: string
  image: string | null
  title: string
  excerpt: string
  date: string
  badge: string
  badgeColor: string
}) {
  return (
    <Link href={href} className="block group">
      <div
        className="rounded-xl border overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl backdrop-blur-xl h-full"
        style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderColor: 'rgba(255,255,255,0.10)',
        }}
      >
        {/* Cover image */}
        <div className="relative h-44 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl"
              style={{ background: 'linear-gradient(135deg, var(--color-primary)20, var(--color-secondary)20)' }}>
              🎌
            </div>
          )}
          {/* Badge */}
          <span
            className="absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: badgeColor + 'cc' }}
          >
            {badge}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-1.5 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors"
            style={{ color: 'var(--text)' }}>
            {title}
          </h3>
          <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--text-sub)' }}>
            {excerpt}
          </p>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-sub)' }}>
            <Calendar size={11} />
            {date}
          </div>
        </div>
      </div>
    </Link>
  )
}
