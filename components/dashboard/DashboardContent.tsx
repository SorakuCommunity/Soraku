// components/dashboard/DashboardContent.tsx — SORAKU v1.0.a3.5
// Blog + Events + Komunitas CTA — all sections auto-hide if no data
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ArrowRight, Newspaper, Sparkles, Users, MessageCircle, Image as ImageIcon } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface Post {
  id: string; slug: string; title: string
  excerpt: string | null; cover_image: string | null; published_at: string | null
}
interface Event {
  id: string; title: string; description: string | null
  cover_image: string | null; date: string; status: 'ongoing' | 'upcoming' | 'finished'
}
interface Props { posts: Post[]; events: Event[] }

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item      = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }

export function DashboardContent({ posts, events }: Props) {
  return (
    <div className="space-y-10">

      {/* ── Latest Blog Posts ─────────────────────────── */}
      {posts.length > 0 && (
        <section>
          <SectionHeader icon={<Newspaper size={15} />} title="Blog Terbaru" href="/blog" />
          <motion.div variants={container} initial="hidden" animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {posts.map(p => (
              <motion.div key={p.id} variants={item}>
                <ContentCard
                  href={`/blog/${p.slug}`} image={p.cover_image} title={p.title}
                  excerpt={p.excerpt ?? ''} badge="Blog" badgeColor="var(--color-primary)"
                  date={p.published_at ? format(new Date(p.published_at), 'd MMM yyyy', { locale: idLocale }) : ''} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* ── Latest Events ─────────────────────────────── */}
      {events.length > 0 && (
        <section>
          <SectionHeader icon={<Sparkles size={15} />} title="Event Mendatang" href="/events" />
          <motion.div variants={container} initial="hidden" animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.map(e => (
              <motion.div key={e.id} variants={item}>
                <ContentCard
                  href={`/events/${e.id}`} image={e.cover_image} title={e.title}
                  excerpt={e.description ?? ''}
                  badge={e.status === 'ongoing' ? '🔴 Berlangsung' : '📅 Upcoming'}
                  badgeColor={e.status === 'ongoing' ? '#ef4444' : '#F39C12'}
                  date={format(new Date(e.date), 'd MMM yyyy', { locale: idLocale })} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* ── Komunitas CTA ─────────────────────────────── */}
      <section>
        <SectionHeader icon={<Users size={15} />} title="Bergabung Komunitas" href="/komunitas" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Main CTA card */}
          <Link href="/komunitas" className="sm:col-span-2 group block">
            <div className="relative rounded-2xl border overflow-hidden h-full min-h-[160px] backdrop-blur-xl
              transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.10)' }}>
              <div className="absolute inset-0 opacity-20"
                style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #5865F2 100%)' }} />
              <div className="absolute -inset-1 opacity-0 group-hover:opacity-25 transition-opacity duration-500 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), #5865F2)', filter: 'blur(12px)' }} />
              <div className="relative p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-primary)22', color: 'var(--color-primary)' }}>
                      <Users size={20} />
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--color-primary)20', color: 'var(--color-primary)' }}>
                      Komunitas
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>Komunitas Soraku</h3>
                  <p className="text-sm" style={{ color: 'var(--text-sub)' }}>
                    Bergabunglah bersama ribuan penggemar Anime, Manga, dan VTuber Indonesia.
                    Diskusi, event, gallery, dan masih banyak lagi!
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mt-4 text-sm font-semibold
                  group-hover:gap-3 transition-all duration-300"
                  style={{ color: 'var(--color-primary)' }}>
                  Lihat Komunitas <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </Link>

          {/* Side CTA cards */}
          <div className="flex flex-col gap-4">
            <Link href="/gallery" className="group block flex-1">
              <div className="rounded-2xl border p-4 h-full backdrop-blur-xl flex flex-col justify-between
                transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.10)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: '#E8C2A820', color: '#E8C2A8' }}>
                  <ImageIcon size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>Fan Gallery</h4>
                  <p className="text-xs" style={{ color: 'var(--text-sub)' }}>Upload & explore karya fanart komunitas.</p>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs font-medium group-hover:gap-2 transition-all"
                  style={{ color: '#E8C2A8' }}>
                  Lihat Gallery <ArrowRight size={11} />
                </div>
              </div>
            </Link>

            <Link href="/blog" className="group block flex-1">
              <div className="rounded-2xl border p-4 h-full backdrop-blur-xl flex flex-col justify-between
                transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.10)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: 'var(--color-primary)20', color: 'var(--color-primary)' }}>
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>Artikel & Blog</h4>
                  <p className="text-xs" style={{ color: 'var(--text-sub)' }}>Baca review dan berita Anime terbaru.</p>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs font-medium group-hover:gap-2 transition-all"
                  style={{ color: 'var(--color-primary)' }}>
                  Baca Blog <ArrowRight size={11} />
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  )
}

function SectionHeader({ icon, title, href }: { icon: React.ReactNode; title: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2" style={{ color: 'var(--text)' }}>
        <span style={{ color: 'var(--color-primary)' }}>{icon}</span>
        <h2 className="font-bold text-base">{title}</h2>
      </div>
      <Link href={href} className="flex items-center gap-1 text-xs font-medium hover:gap-2 transition-all"
        style={{ color: 'var(--color-primary)' }}>
        Lihat Semua <ArrowRight size={12} />
      </Link>
    </div>
  )
}

function ContentCard({ href, image, title, excerpt, date, badge, badgeColor }: {
  href: string; image: string | null; title: string; excerpt: string
  date: string; badge: string; badgeColor: string
}) {
  return (
    <Link href={href} className="block group h-full">
      <div className="rounded-xl border overflow-hidden backdrop-blur-xl h-full
        transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
        style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.10)' }}>
        <div className="relative h-44 overflow-hidden">
          {image ? (
            <Image src={image} alt={title} fill sizes="(max-width:640px) 100vw,50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl"
              style={{ background: 'linear-gradient(135deg,var(--color-primary)20,#5865F220)' }}>🎌</div>
          )}
          <span className="absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: badgeColor + 'cc' }}>{badge}</span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-1.5 line-clamp-2 transition-colors
            group-hover:text-[var(--color-primary)]" style={{ color: 'var(--text)' }}>
            {title}
          </h3>
          <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--text-sub)' }}>{excerpt}</p>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-sub)' }}>
            <Calendar size={11} />{date}
          </div>
        </div>
      </div>
    </Link>
  )
}
