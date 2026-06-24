'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Eye, Heart, MessageCircle, Clock, ChevronRight, TrendingUp, Zap, Star } from 'lucide-react'
import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, type Variants } from 'framer-motion'

interface BlogItem {
  id: string; slug: string; title: string; excerpt: string | null; coverurl: string | null
  publishedat: string; viewcount: number; likecount: number; commentcount: number
  tags: string[]; author: { username: string | null; displayname: string | null; avatarurl: string | null } | null
}

const FILTERS = ['Latest', 'Trending', 'Popular', 'Community Picks']
const SEED = (id: string) => {
  let h = 0; for (let i = 0; i < id.length; i++) h = ((h << 5) - h) + id.charCodeAt(i)
  return Math.abs(h)
}
const getReadTime = (id: string) => 3 + (SEED(id) % 10)
const getBadge = (id: string, i: number): { label: string; color: string; bg: string; border: string } | null => {
  const r = SEED(id + 'b') % 10
  if (r < 3) return { label: 'Trending', color: '#EF4444', bg: 'bg-red-500/10', border: 'border-red-500/30' }
  if (r < 5) return { label: "Editor's Pick", color: '#8B5CF6', bg: 'bg-purple-500/10', border: 'border-purple-500/30' }
  if (r < 7 && i === 0) return { label: 'Recommended', color: '#F59E0B', bg: 'bg-amber-500/10', border: 'border-amber-500/30' }
  return null
}
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

const containerV: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const itemV: Variants = {
  hidden: (d: any) => ({ opacity: 0, y: 20 }),
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export function ArticlesSection({ blogs, loading }: { blogs: BlogItem[]; loading: boolean }) {
  const [filter, setFilter] = useState('Latest')
  const [slide, setSlide] = useState(0)
  const pauseRef = useRef(false)
  const touchX = useRef(0)

  const sorted = [...blogs].sort((a, b) => {
    if (filter === 'Trending') return b.viewcount - a.viewcount
    if (filter === 'Popular') return (b.likecount + b.commentcount) - (a.likecount + a.commentcount)
    if (filter === 'Community Picks') return (b.likecount * 2 + b.commentcount * 3) - (a.likecount * 2 + a.commentcount * 3)
    return new Date(b.publishedat).getTime() - new Date(a.publishedat).getTime()
  })
  const featured = sorted[0]
  const list = sorted.slice(1, 7)

  const goTo = useCallback((i: number) => setSlide(((i % list.length) + list.length) % list.length), [list.length])

  useEffect(() => {
    if (pauseRef.current || list.length <= 1) return
    const t = setInterval(() => goTo(slide + 1), 12000)
    return () => clearInterval(t)
  }, [slide, list.length, goTo])

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {[1,2,3,4].map((i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-sm border-2 border-white/[0.04] bg-white/[0.03]" />
        ))}
      </div>
    )
  }
  if (!blogs.length) {
    return (
      <div className="rounded-md border-2 border-white/[0.07] bg-card py-14 text-center shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
        <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground/50">Belum ada artikel</p>
      </div>
    )
  }

  const renderThumb = (blog: BlogItem, size: 'lg' | 'sm') => (
    <div className={`relative overflow-hidden ${size === 'lg' ? 'h-full min-h-[200px] sm:min-h-[260px]' : 'h-40'}`}>
      {blog.coverurl ? (
        <Image src={blog.coverurl} alt={blog.title} fill className="object-cover transition-transform duration-[250ms] group-hover:scale-105" unoptimized sizes={size === 'lg' ? '50vw' : '(max-width:1024px)50vw,33vw'} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/8 via-card to-accent/5" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
    </div>
  )

  return (
    <>
      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-sm border-2 px-3.5 py-1.5 text-[10px] font-bold transition-all ${
              filter === f
                ? 'border-primary bg-primary text-primary-foreground shadow-[2px_2px_0px_rgba(37,99,235,0.25)]'
                : 'border-white/[0.1] text-muted-foreground/60 hover:border-primary/30 hover:text-foreground'
            }`}
          >
            {f === 'Trending' && <TrendingUp className="mr-1 inline h-3 w-3" />}
            {f === 'Popular' && <Zap className="mr-1 inline h-3 w-3" />}
            {f === 'Community Picks' && <Star className="mr-1 inline h-3 w-3" />}
            {f}
          </button>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        {/* Featured Article */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href={`/blog/${featured.slug}`}
              className="group mb-6 grid grid-cols-[1fr_1.2fr] overflow-hidden rounded-md border-2 border-white/[0.07] bg-card shadow-[4px_4px_0px_rgba(37,99,235,0.12)] transition-all duration-[250ms] hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[6px_6px_0px_rgba(37,99,235,0.25)]"
            >
              {renderThumb(featured, 'lg')}
              <div className="flex flex-col justify-center p-6">
                <div className="flex items-center gap-2">
                  <span className="rounded-sm border-2 border-primary/20 bg-primary/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary/80">
                    {featured.tags?.[0] ?? 'General'}
                  </span>
                  {getBadge(featured.id, 0) && (
                    <span className={`rounded-sm border-2 px-2 py-0.5 text-[8px] font-bold ${getBadge(featured.id, 0)!.bg} ${getBadge(featured.id, 0)!.border}`} style={{ color: getBadge(featured.id, 0)!.color }}>
                      {getBadge(featured.id, 0)!.label}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-xl font-black text-foreground leading-tight group-hover:text-primary transition-colors duration-[250ms] line-clamp-2">
                  {featured.title}
                </h3>
                {featured.excerpt && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground/70 line-clamp-2">{featured.excerpt}</p>
                )}
                <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground/50">
                  {featured.author && (
                    <span className="flex items-center gap-1.5">
                      {featured.author.avatarurl && (
                        <Image src={featured.author.avatarurl} alt="" width={18} height={18} className="rounded-sm border border-white/[0.06]" unoptimized />
                      )}
                      {featured.author.displayname ?? featured.author.username}
                    </span>
                  )}
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{getReadTime(featured.id)} min read</span>
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{featured.viewcount}</span>
                  <span>{fmtDate(featured.publishedat)}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Article Grid */}
        {list.length > 0 && (
          <motion.div
            variants={containerV} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-3 gap-4"
          >
            {list.map((blog, i) => {
              const badge = getBadge(blog.id, i + 1)
              return (
                <motion.div key={blog.id} variants={itemV} custom={i}>
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-md border-2 border-white/[0.07] bg-card shadow-[3px_3px_0px_rgba(37,99,235,0.1)] transition-all duration-[250ms] hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[5px_5px_0px_rgba(37,99,235,0.25)]"
                  >
                    {renderThumb(blog, 'sm')}
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="rounded-sm border-2 border-primary/15 bg-primary/8 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-primary/70">
                          {blog.tags?.[0] ?? 'General'}
                        </span>
                        {badge && (
                          <span className={`rounded-sm border-2 px-1.5 py-0.5 text-[7px] font-bold ${badge.bg} ${badge.border}`} style={{ color: badge.color }}>
                            {badge.label}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 text-sm font-black text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-[250ms]">
                        {blog.title}
                      </h3>
                      {blog.excerpt && (
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground/60 line-clamp-2 flex-1">{blog.excerpt}</p>
                      )}
                      <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground/40 border-t-2 border-white/[0.04] pt-3">
                        <div className="flex items-center gap-2">
                          {blog.author && (
                            <span className="truncate max-w-[80px]">{blog.author.displayname ?? blog.author.username}</span>
                          )}
                          <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{getReadTime(blog.id)}m</span>
                        </div>
                        <span className="flex items-center gap-1"><Eye className="h-2.5 w-2.5" />{blog.viewcount}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>

      {/* Mobile carousel */}
      <div className="lg:hidden">
        <div
          className="relative overflow-hidden rounded-md border-2 border-white/[0.07] bg-card shadow-[4px_4px_0px_rgba(37,99,235,0.12)]"
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchX.current
            if (Math.abs(dx) > 50) goTo(slide + (dx < 0 ? 1 : -1))
          }}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${((slide % list.length) + list.length) % list.length * 100}%)` }}
          >
            {[featured, ...list].filter(Boolean).map((blog) => (
              <div key={blog!.id} className="min-w-0 w-full flex-shrink-0">
                <Link
                  href={`/blog/${blog!.slug}`}
                  className="group flex flex-col rounded-md"
                >
                  <div className="relative h-48 overflow-hidden rounded-t-md">
                    {blog!.coverurl ? (
                      <Image src={blog!.coverurl} alt={blog!.title} fill className="object-cover transition-transform duration-[250ms] group-hover:scale-105" unoptimized />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/8 via-card to-accent/5" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                    <span className="absolute top-3 left-3 rounded-sm border-2 border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
                      {blog!.tags?.[0] ?? 'General'}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-black text-foreground line-clamp-2">{blog!.title}</h3>
                    {blog!.excerpt && <p className="mt-1 text-xs text-muted-foreground/60 line-clamp-2">{blog!.excerpt}</p>}
                    <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground/40">
                      {blog!.author && <span>{blog!.author.displayname ?? blog!.author.username}</span>}
                      <span className="flex items-center gap-1"><Eye className="h-2.5 w-2.5" />{blog!.viewcount}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex justify-center gap-1.5">
          {[featured, ...list].filter(Boolean).map((blog, i) => (
            <button key={blog!.id} onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${((slide % list.length) + list.length) % list.length === i ? 'w-5 bg-primary' : 'w-2 bg-white/[0.12]'}`}
            />
          ))}
        </div>
      </div>
    </>
  )
}
