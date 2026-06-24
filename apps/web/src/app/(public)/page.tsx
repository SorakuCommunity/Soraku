'use client'
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef, type ElementType } from 'react'
import {
  ArrowRight, Calendar, BookOpen, Eye, Heart, MessageCircle, Clock, Users,
  Sparkles, ImageIcon, Tv2, Code, Palette, Zap, Trophy, Layers, ChevronRight,
  Star, Award, Medal,
} from 'lucide-react'
import { DiscordIcon, InstagramIcon, FacebookIcon, XIcon, TikTokIcon, YouTubeIcon } from '@/components/icons/custom-icons'
import { motion, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'
import { EventsSection } from '@/components/events/events-section'
import { ArticlesSection } from '@/components/blog/articles-section'

const DISCORD_GUILD_ID = '1116971049045729302'

const SOCIAL_LINKS = [
  { slug: 'discord', name: 'Discord', href: 'https://discord.gg/qm3XJvRa6B', Icon: DiscordIcon },
  { slug: 'instagram', name: 'Instagram', href: 'https://www.instagram.com/soraku.moe', Icon: InstagramIcon },
  { slug: 'facebook', name: 'Facebook', href: 'https://www.facebook.com/share/1HQs9ZZeCw/', Icon: FacebookIcon },
  { slug: 'x', name: 'X', href: 'https://twitter.com/@AppSoraa', Icon: XIcon },
  { slug: 'tiktok', name: 'TikTok', href: 'https://www.tiktok.com/@soraku.id', Icon: TikTokIcon },
  { slug: 'youtube', name: 'YouTube', href: 'https://youtube.com/@chsoraku', Icon: YouTubeIcon },
]

const CATEGORIES = [
  { label: 'Anime & Manga', color: '#2563EB' },
  { label: 'Belajar Bareng', color: '#8B5CF6' },
  { label: 'VTuber', color: '#EC4899' },
  { label: 'Fanart', color: '#10B981' },
  { label: 'Web Development', color: '#F59E0B' },
  { label: 'Game Dev', color: '#E8C2A8' },
  { label: 'Design', color: '#F97316' },
  { label: 'Komunitas', color: '#14B8A6' },
  { label: 'AI/ML', color: '#8B5CF6' },
  { label: 'Mobile Dev', color: '#3B82F6' },
  { label: 'Tech Talk', color: '#06B6D4' },
  { label: 'Creative', color: '#F472B6' },
]

const PLATFORM_FEATURES = [
  { Icon: Calendar, label: 'Events', desc: 'Turnamen & gathering komunitas', color: '#2563EB' },
  { Icon: BookOpen, label: 'Blog', desc: 'Artikel & ulasan dari kreator', color: '#8B5CF6' },
  { Icon: ImageIcon, label: 'Galeri', desc: 'Fanart & karya anggota', color: '#EC4899' },
  { Icon: Tv2, label: 'VTuber', desc: 'Virtual YouTuber komunitas', color: '#10B981' },
  { Icon: Code, label: 'Projects', desc: 'Showcase karya & portofolio', color: '#F59E0B' },
  { Icon: Palette, label: 'Classes', desc: 'Belajar bareng mentor ahli', color: '#F97316' },
]

interface EventItem {
  id: string; slug: string; title: string; coverurl: string | null
  startdate: string; enddate: string | null; isonline: boolean; tags: string[]; status: string
}
interface BlogItem {
  id: string; slug: string; title: string; excerpt: string | null; coverurl: string | null
  publishedat: string; viewcount: number; likecount: number; commentcount: number
  tags: string[]; author: { username: string | null; displayname: string | null; avatarurl: string | null } | null
}
interface DmMember { username: string; avatar: string | null; status: string; activity?: string }

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          let start = 0
          const increment = Math.ceil(end / (duration / 16))
          const timer = setInterval(() => {
            start += increment
            if (start >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(start)
            }
          }, 16)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref}>{count.toLocaleString('id-ID')}{suffix}</span>
}







// ─── Platform Features Grid ──────────────────────────────────────────────────
// ─── Bento Grid What Soraku Offers ──────────────────────────────────────────
const BENTO_DIRECTIONS = [
  { x: -30, y: 0 }, { x: 0, y: -30 }, { x: 30, y: 0 },
  { x: 0, y: 30 }, { x: -30, y: 0 }, { x: 30, y: 0 },
]
const BENTO_GRID = [
  { col: '1', colEnd: 'span 1', row: '1 / span 2' },
  { col: '2', colEnd: 'span 1', row: '1' },
  { col: '2', colEnd: 'span 2', row: '2' },
  { col: '3', colEnd: 'span 1', row: '1' },
  { col: '1', colEnd: 'span 2', row: '3 / span 2' },
  { col: '3', colEnd: 'span 1', row: '3 / span 2' },
]

function BentoGridFeatures() {
  const [slide, setSlide] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => setSlide((p) => (p + 1) % PLATFORM_FEATURES.length), 12000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const containerV: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
  const itemV: Variants = {
    hidden: (d: any) => ({ opacity: 0, x: d?.x ?? 0, y: d?.y ?? 0 }),
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <section className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
      <SH eyebrow="Platform" title="What Soraku Offers" />
      {/* Desktop Bento */}
      <motion.div
        variants={containerV} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        className="hidden lg:grid lg:grid-cols-3 lg:gap-4"
      >
        {PLATFORM_FEATURES.map((f, i) => (
          <motion.div
            key={f.label} variants={itemV} custom={BENTO_DIRECTIONS[i]}
            style={{ gridColumn: `${BENTO_GRID[i].col} / ${BENTO_GRID[i].colEnd}`, gridRow: BENTO_GRID[i].row }}
            className="group rounded-md border-2 border-white/[0.07] bg-card p-6 shadow-[4px_4px_0px_rgba(37,99,235,0.12)] transition-all duration-200 hover:scale-[1.02] hover:border-primary/30 hover:shadow-[6px_6px_0px_rgba(37,99,235,0.25)]"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md border-2" style={{ borderColor: `${f.color}30`, background: `${f.color}15` }}>
              <f.Icon className="h-6 w-6" style={{ color: f.color }} />
            </div>
            <h3 className="mb-1.5 text-base font-black text-foreground">{f.label}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground/70">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
      {/* Mobile Carousel */}
      <div className="lg:hidden">
        <div className="relative overflow-hidden rounded-md border-2 border-white/[0.07] bg-card shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {PLATFORM_FEATURES.map((f) => (
              <div key={f.label} className="min-w-0 w-full flex-shrink-0 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md border-2" style={{ borderColor: `${f.color}30`, background: `${f.color}15` }}>
                  <f.Icon className="h-6 w-6" style={{ color: f.color }} />
                </div>
                <h3 className="mb-1.5 text-base font-black text-foreground">{f.label}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground/70">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {PLATFORM_FEATURES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all ${i === slide ? 'w-6 bg-primary' : 'w-2 bg-white/[0.12]'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Achievement Bento Grid ──────────────────────────────────────────────────
interface AchieveBadge {
  icon: ElementType; title: string; desc: string; tier: string; color: string; special?: boolean
  progress?: number; rarity?: string; xp: number
}
const ACHIEVE_BADGES: AchieveBadge[] = [
  { icon: Zap, title: 'Top Contributor', desc: 'Aktif membantu anggota lain', tier: 'Silver', color: '#9CA3AF', xp: 500 },
  { icon: Star, title: 'Rising Creator', desc: 'Dapatkan 50 likes total', tier: 'Bronze', color: '#B45309', xp: 200 },
  { icon: Trophy, title: 'Legendary Streak', desc: '120 Day Streak berturut-turut', tier: 'Epic', color: '#8B5CF6', xp: 5000, special: true, progress: 85, rarity: 'Epic' },
  { icon: Medal, title: 'Project Completed', desc: 'Selesaikan 10 proyek', tier: 'Gold', color: '#F59E0B', xp: 1000 },
  { icon: Users, title: 'Community Mentor', desc: 'Bantu 25 anggota baru', tier: 'Platinum', color: '#10B981', xp: 2000 },
  { icon: Award, title: 'Epic Reputation', desc: '2.5K Reputation points', tier: 'Epic', color: '#3B82F6', xp: 2500, special: true, progress: 62, rarity: 'Rare' },
  { icon: Code, title: 'Open Source Hero', desc: 'Kontribusi ke 5 repositori', tier: 'Gold', color: '#EC4899', xp: 1500 },
  { icon: Heart, title: 'Verified Member', desc: 'Akun terverifikasi', tier: 'Bronze', color: '#06B6D4', xp: 100 },
  { icon: Layers, title: 'Early Adopter', desc: 'Bergabung di tahun pertama Soraku', tier: 'Bronze', color: '#6366F1', xp: 150 },
]

const ACHIEVE_GRID = [
  { col: '1', colEnd: 'span 1', row: '1' },
  { col: '2', colEnd: 'span 1', row: '1' },
  { col: '3', colEnd: 'span 1', row: '1 / span 2' },
  { col: '1', colEnd: 'span 1', row: '2' },
  { col: '2', colEnd: 'span 1', row: '2' },
  { col: '1', colEnd: 'span 2', row: '3' },
  { col: '3', colEnd: 'span 1', row: '3' },
  { col: '3', colEnd: 'span 1', row: '4' },
  { col: '1', colEnd: 'span 2', row: '4' },
]

const ACHIEVE_DIRECTIONS = [
  { x: -30, y: 0 }, { x: 0, y: -30 }, { x: 30, y: 0 },
  { x: 0, y: 30 }, { x: -30, y: 0 }, { x: 30, y: 0 },
  { x: 0, y: -30 }, { x: 0, y: 30 },
  { x: 0, y: 30 },
]

function AchievementBento() {
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setSlide((p) => (p + 1) % ACHIEVE_BADGES.length), 12000)
    return () => clearInterval(timer)
  }, [])

  const containerV: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
  const itemV: Variants = {
    hidden: (d: any) => ({ opacity: 0, x: d?.x ?? 0, y: d?.y ?? 0 }),
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <section className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
      <SH eyebrow="Gamification" title="Pencapaian & Badge" href="/leaderboard" />
      {/* Desktop Bento */}
      <motion.div
        variants={containerV} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        className="hidden lg:grid lg:grid-cols-3 lg:gap-4"
      >
        {ACHIEVE_BADGES.map((a, i) => (
          <motion.div
            key={a.title} variants={itemV} custom={ACHIEVE_DIRECTIONS[i]}
            style={{ gridColumn: `${ACHIEVE_GRID[i].col} / ${ACHIEVE_GRID[i].colEnd}`, gridRow: ACHIEVE_GRID[i].row }}
            className={`group rounded-md border-2 bg-card shadow-[4px_4px_0px_rgba(37,99,235,0.12)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[6px_6px_0px_rgba(37,99,235,0.25)] p-6 ${a.special ? 'border-primary/25' : 'border-white/[0.07]'}`}
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md border-2" style={{ borderColor: `${a.color}30`, background: `${a.color}15` }}>
              <a.icon className="h-5 w-5" style={{ color: a.color }} />
            </div>
            <h3 className="text-sm font-black text-foreground">{a.title}</h3>
            <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground/60">{a.desc}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-sm border-2 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider" style={{ borderColor: `${a.color}30`, color: a.color }}>{a.tier}</span>
              {a.special && a.rarity && (
                <span className="rounded-sm border-2 border-amber-400/30 px-1.5 py-0.5 text-[8px] font-bold text-amber-400">{a.rarity}</span>
              )}
            </div>
            {a.special && a.progress !== undefined && (
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-[8px] text-muted-foreground/50">
                  <span>Progress</span>
                  <span>{a.progress}%</span>
                </div>
                <div className="h-1.5 rounded-sm bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-sm bg-primary transition-all" style={{ width: `${a.progress}%` }} />
                </div>
              </div>
            )}
            <p className="mt-2 text-[9px] font-bold text-muted-foreground/40">+{a.xp} XP</p>
          </motion.div>
        ))}
      </motion.div>
      {/* Mobile Carousel */}
      <div className="lg:hidden">
        <div className="relative overflow-hidden rounded-md border-2 border-white/[0.07] bg-card shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {ACHIEVE_BADGES.map((a) => (
              <div key={a.title} className="min-w-0 w-full flex-shrink-0 p-6">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md border-2" style={{ borderColor: `${a.color}30`, background: `${a.color}15` }}>
                  <a.icon className="h-5 w-5" style={{ color: a.color }} />
                </div>
                <h3 className="text-sm font-black text-foreground">{a.title}</h3>
                <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground/60">{a.desc}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-sm border-2 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider" style={{ borderColor: `${a.color}30`, color: a.color }}>{a.tier}</span>
                  {a.special && a.rarity && (
                    <span className="rounded-sm border-2 border-amber-400/30 px-1.5 py-0.5 text-[8px] font-bold text-amber-400">{a.rarity}</span>
                  )}
                </div>
                {a.special && a.progress !== undefined && (
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[8px] text-muted-foreground/50">
                      <span>Progress</span>
                      <span>{a.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-sm bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-sm bg-primary transition-all" style={{ width: `${a.progress}%` }} />
                    </div>
                  </div>
                )}
                <p className="mt-2 text-[9px] font-bold text-muted-foreground/40">+{a.xp} XP</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {ACHIEVE_BADGES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all ${i === slide ? 'w-6 bg-primary' : 'w-2 bg-white/[0.12]'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}



function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Discord Widget ───────────────────────────────────────────────────────────
function useDiscord() {
  const [d, setD] = useState<{ presence: number | null; name: string; loading: boolean; members: DmMember[] }>(
    { presence: null, name: 'Soraku', loading: true, members: [] }
  )
  useEffect(() => {
    fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        setD({
          presence: j?.presence_count ?? null,
          name: j?.name ?? 'Soraku',
          loading: false,
          members: (j?.members ?? []).slice(0, 6).map((m: any) => ({
            username: m.username,
            avatar: m.avatar_url ?? null,
            status: m.status ?? 'online',
            activity: m.game?.name,
          })),
        })
      })
      .catch(() => setD((p) => ({ ...p, loading: false })))
  }, [])
  return d
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SH({ eyebrow, title, href }: { eyebrow: string; title: string; href?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between sm:mb-8">
      <div>
        <p className="mb-1.5 text-[9px] font-black tracking-[0.3em] text-primary/70 uppercase">{eyebrow}</p>
        <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl lg:text-3xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="group flex items-center gap-1 text-xs font-bold text-muted-foreground/60 transition-colors hover:text-primary">
          View All <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}

// ─── Brutal Card ──────────────────────────────────────────────────────────────
function BrutalCard({ children, className, href }: { children: React.ReactNode; className?: string; href?: string }) {
  const base = cn(
    'rounded-md border-2 border-white/[0.07] bg-card shadow-[4px_4px_0px_rgba(37,99,235,0.12)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_rgba(37,99,235,0.2)]',
    className
  )
  if (href) return <Link href={href} className={base}>{children}</Link>
  return <div className={base}>{children}</div>
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({ discord, isLoggedIn }: { discord: ReturnType<typeof useDiscord>; isLoggedIn: boolean }) {
  return (
    <section className="relative overflow-hidden">
      {/* Geometric decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="geo-circle absolute -top-20 -right-20 h-80 w-80 opacity-30" />
        <div className="geo-diamond absolute top-40 -left-10 h-32 w-32 opacity-20" />
        <div className="geo-circle absolute bottom-20 right-1/4 h-24 w-24 opacity-20" />
        <div className="absolute top-60 right-20 h-16 w-16 border-2 border-primary/10 rounded" style={{ transform: 'rotate(30deg)' }} />
      </div>

      {/* Mobile */}
      <div className="relative flex min-h-[90svh] flex-col justify-center px-6 pt-20 pb-16 lg:hidden">
        <div className="relative z-10">
          <span className="mb-3 inline-flex items-center gap-2 rounded-md border-2 border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
            {discord.loading ? '—' : (discord.presence?.toLocaleString('id-ID') ?? '—')} online now
          </span>

          <h1 className="mb-3 mt-4 text-[clamp(2.8rem,10vw,4rem)] leading-[1.05] font-black tracking-tighter text-foreground">
            Find Your{' '}
            <span className="text-gradient">Scene</span>
            <br />at Soraku
          </h1>
          <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground/80">
            Unleash your creativity, learn new skills, and connect with fellow anime & pop culture enthusiasts in Indonesia.
          </p>

          <div className="mb-6 flex flex-wrap gap-1.5">
            {CATEGORIES.slice(0, 4).map((c) => (
              <span key={c.label} className="rounded-sm border-2 px-2.5 py-1 text-[10px] font-bold"
                style={{ color: c.color, borderColor: `${c.color}40`, background: `${c.color}10` }}
              >
                {c.label}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {!isLoggedIn && (
              <Link href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-[3px_3px_0px_rgba(37,99,235,0.3)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_rgba(37,99,235,0.4)]">
                <Sparkles className="h-4 w-4" /> Join Soraku
              </Link>
            )}
            <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-indigo-500/20 bg-indigo-500/10 px-6 py-3 text-sm font-bold text-indigo-300/70 transition-all hover:border-indigo-400/35 hover:bg-indigo-500/20 hover:text-indigo-300">
              <DiscordIcon className="h-4 w-4" /> Discord
            </a>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="relative hidden min-h-[90vh] items-center lg:grid lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_540px]">
        <div className="relative z-10 px-10 py-20 xl:px-16">
          <span className="mb-4 inline-flex items-center gap-2 rounded-md border-2 border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 pulse-dot" />
            {discord.loading ? '—' : (discord.presence?.toLocaleString('id-ID') ?? '—')} online now
          </span>

          <h1 className="mb-5 mt-6 text-[clamp(3.5rem,7vw,5.5rem)] leading-[0.9] font-black tracking-tighter text-foreground">
            Find Your{' '}
            <span className="text-gradient">Scene</span>
            <br />
            at <span className="text-foreground">Soraku</span>
          </h1>

          <div className="mb-5 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent opacity-60" />

          <p className="mb-8 max-w-md text-base leading-relaxed text-muted-foreground xl:text-lg">
            Unleash your creativity, learn new skills, and connect with fellow anime & pop culture enthusiasts in Indonesia.
          </p>

          <div className="mb-8 flex flex-wrap gap-2">
            {CATEGORIES.slice(0, 6).map((c) => (
              <span key={c.label} className="rounded-sm border-2 px-3 py-1.5 text-xs font-bold"
                style={{ color: c.color, borderColor: `${c.color}35`, background: `${c.color}0d` }}
              >
                {c.label}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {!isLoggedIn && (
              <Link href="/register"
                className="group flex items-center gap-2 rounded-md bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-[4px_4px_0px_rgba(37,99,235,0.3)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_rgba(37,99,235,0.4)]">
                <Sparkles className="h-4 w-4" /> Join Soraku <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
            <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md border-2 border-indigo-500/20 bg-indigo-500/8 px-7 py-3.5 text-sm font-bold text-indigo-300/70 transition-all hover:border-indigo-400/35 hover:bg-indigo-500/20 hover:text-indigo-300">
              <DiscordIcon className="h-4 w-4" /> Join Discord
            </a>
          </div>
        </div>

        {/* Right decorative panel */}
        <div className="relative flex items-center justify-center">
          <div className="relative h-[500px] w-[400px] xl:h-[560px] xl:w-[460px]">
            {/* Large circle */}
            <div className="geo-circle absolute top-10 right-10 h-80 w-80 xl:h-96 xl:w-96" />
            {/* Inner circle */}
            <div className="geo-circle absolute top-20 right-20 h-60 w-60 xl:h-72 xl:w-72 border-primary/20" />
            {/* Center diamond */}
            <div className="geo-diamond absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 border-primary/30 bg-primary/5" />
            {/* Floating labels */}
            <div className="absolute top-[15%] right-0 z-10 rounded-md border-2 border-white/10 bg-card px-4 py-2 shadow-[3px_3px_0px_rgba(37,99,235,0.15)]">
              <p className="text-xs font-bold text-foreground">💬 2.4k Active</p>
            </div>
            <div className="absolute bottom-[20%] left-0 z-10 rounded-md border-2 border-white/10 bg-card px-4 py-2 shadow-[3px_3px_0px_rgba(37,99,235,0.15)]">
              <p className="text-xs font-bold text-foreground">🌱 Learn & Grow</p>
            </div>
            <div className="absolute bottom-[45%] -right-4 z-10 rounded-md border-2 border-white/10 bg-card px-4 py-2 shadow-[3px_3px_0px_rgba(37,99,235,0.15)]">
              <p className="text-xs font-bold text-foreground">✨ Creative Hub</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Category Marquee ─────────────────────────────────────────────────────────
function CategoryMarquee() {
  const items = [...CATEGORIES, ...CATEGORIES]
  return (
    <div className="relative overflow-hidden border-t-2 border-b-2 border-white/[0.05] py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="marquee-track flex gap-4 whitespace-nowrap">
        {items.map((c, i) => (
          <span key={i} className="inline-flex flex-shrink-0 items-center gap-2 rounded-sm border-2 px-3.5 py-1.5 text-xs font-bold"
            style={{ color: c.color, borderColor: `${c.color}30`, background: `${c.color}0a` }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Why Join Soraku ──────────────────────────────────────────────────────────
const WHY_FEATURES = [
  { emoji: '🚀', title: 'Build Real Projects', desc: 'Publish websites, applications, startups, open-source projects, and portfolios.' },
  { emoji: '🌎', title: 'Join Communities', desc: 'Connect with developers, designers, students, creators, and innovators.' },
  { emoji: '🏆', title: 'Earn Reputation', desc: 'Gain XP, achievements, badges, and community recognition.' },
  { emoji: '📅', title: 'Attend Events', desc: 'Participate in workshops, webinars, competitions, and hackathons.' },
  { emoji: '🤝', title: 'Grow Your Network', desc: 'Meet collaborators, mentors, and future teammates.' },
  { emoji: '💡', title: 'Showcase Your Work', desc: 'Share your projects and get discovered by the community.' },
]

function WhyJoinSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [visible, setVisible] = useState<Set<number>>(new Set())
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    const obs: IntersectionObserver[] = []
    cardRefs.current.forEach((ref, i) => {
      if (!ref) return
      const o = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setVisible((p) => new Set(p).add(i))
            setActiveIndex(i)
          }
        },
        { threshold: 0.25 }
      )
      o.observe(ref)
      obs.push(o)
    })
    const lastRef = cardRefs.current[cardRefs.current.length - 1]
    if (lastRef) {
      const o = new IntersectionObserver(
        ([e]) => { if (!e.isIntersecting && e.boundingClientRect.top > 0) setActiveIndex(-1) },
        { threshold: 0 }
      )
      o.observe(lastRef)
      obs.push(o)
    }
    return () => obs.forEach((o) => o.disconnect())
  }, [])

  return (
    <section className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
      <div className="lg:grid lg:grid-cols-[1fr_1.3fr] lg:gap-14">
        {/* Left — Sticky */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-1.5 text-[9px] font-black tracking-[0.3em] text-primary/70 uppercase">Why Soraku</p>
          <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl lg:text-3xl mb-3">
            Why Join Soraku?
          </h2>
          <p className="text-sm text-muted-foreground/70 mb-6">
            Build, Learn, Share, and Grow Together.
          </p>

          {/* Illustration */}
          <div className="relative mb-6 h-48 overflow-hidden rounded-md border-2 border-white/[0.07] bg-card">
            <div className="geo-circle absolute -top-10 -right-10 h-32 w-32 opacity-30" />
            <div className="geo-diamond absolute bottom-4 left-4 h-16 w-16 opacity-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="mb-1 text-4xl">🌱</p>
              <p className="text-xs font-bold text-muted-foreground/60">Grow Together</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <div className="rounded-md border-2 border-white/[0.07] bg-card p-4 text-center">
              <p className="text-xl font-black text-foreground"><AnimatedCounter end={6400} suffix="+" /></p>
              <p className="text-[10px] text-muted-foreground/60">Members</p>
            </div>
            <div className="rounded-md border-2 border-white/[0.07] bg-card p-4 text-center">
              <p className="text-xl font-black text-foreground"><AnimatedCounter end={500} suffix="+" /></p>
              <p className="text-[10px] text-muted-foreground/60">Online Today</p>
            </div>
          </div>

          <Link href="/register"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-[3px_3px_0px_rgba(37,99,235,0.3)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]">
            <Sparkles className="h-4 w-4" /> Join Community <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Right — Scroll Area */}
        <div className="relative mt-10 lg:mt-0 lg:max-h-[580px] lg:overflow-y-auto lg:pr-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(37,99,235,0.3) transparent' }}>
          {/* Progress Line */}
          <div className="absolute left-[15px] top-0 bottom-0 hidden w-0.5 bg-white/[0.06] lg:block" />
          <div
            className="absolute left-[15px] hidden w-0.5 bg-primary/50 transition-all duration-500 lg:block"
            style={{
              top: activeIndex >= 0 ? `${activeIndex * 25 + 8}%` : '0%',
              height: activeIndex >= 0 ? '8%' : '0%',
            }}
          />

          {WHY_FEATURES.map((f, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el }}
              className={`relative mb-5 rounded-md border-2 bg-card p-5 transition-all duration-700 ${
                visible.has(i)
                  ? 'translate-y-0 border-white/[0.07] opacity-100 shadow-[4px_4px_0px_rgba(37,99,235,0.12)]'
                  : 'translate-y-6 border-transparent opacity-0 shadow-none'
              } hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_rgba(37,99,235,0.2)]`}
            >
              {/* Progress Dot */}
              <div
                className={`absolute left-[9px] top-6 hidden h-3 w-3 rounded-full border-2 transition-all duration-300 lg:block ${
                  activeIndex === i
                    ? 'border-primary bg-primary shadow-[0_0_8px_rgba(37,99,235,0.5)]'
                    : visible.has(i)
                      ? 'border-primary/40 bg-primary/20'
                      : 'border-white/[0.08] bg-card'
                }`}
              />

              <div className="flex items-start gap-4 pl-5 lg:pl-0">
                <span className="flex-shrink-0 text-2xl">{f.emoji}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-sm font-black text-foreground">{f.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground/70">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const discord = useDiscord()
  const [data, setData] = useState<{
    events: EventItem[]; blogs: BlogItem[]; gallery: any[]; partnerships: any[]; sponsorships: any[]
  }>({ events: [], blogs: [], gallery: [], partnerships: [], sponsorships: [] })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string } | null | 'loading'>('loading')

  useEffect(() => {
    fetch('/api/home')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.data) setData(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setUser(d.data ?? null))
      .catch(() => setUser(null))
  }, [])

  const isLoggedIn = user !== 'loading' && user !== null

  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <HeroSection discord={discord} isLoggedIn={isLoggedIn} />

      {/* Category Marquee */}
      <CategoryMarquee />

      {/* Community Stats */}
      <section className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
        <SH eyebrow="Stats" title="Komunitas dalam Angka" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { end: 100, suffix: '+', label: 'Members', Icon: Users },
            { end: data.blogs.length + data.gallery.length, suffix: '+', label: 'Posts', Icon: MessageCircle },
            { end: discord.presence ?? 0, suffix: '', label: 'Discord Online', Icon: Zap },
            { end: data.events.length, suffix: ' Events', label: 'Community', Icon: Heart },
          ].map((s) => (
            <BrutalCard key={s.label} className="p-5 text-center">
              <s.Icon className="mx-auto mb-3 h-6 w-6 text-primary" />
              <p className="text-2xl font-black text-foreground">
                <AnimatedCounter end={s.end} suffix={s.suffix} />
              </p>
              <p className="text-xs text-muted-foreground/60">{s.label}</p>
            </BrutalCard>
          ))}
        </div>
      </section>

      {/* Platform Features */}
      <BentoGridFeatures />

      {/* Events */}
      <section className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <SH eyebrow="Upcoming" title="Event Komunitas" href="/events" />
        <EventsSection events={data.events} loading={loading} />
      </section>

      {/* Blog */}
      <section className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <SH eyebrow="Community" title="Artikel & Kreasi" href="/blog" />
        <ArticlesSection blogs={data.blogs} loading={loading} />
      </section>

      {/* Why Join Soraku */}
      <WhyJoinSection />

      {/* Achievement Showcase */}
      <AchievementBento />

      {/* Discord */}
      <section className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-center mb-8">
          <p className="mb-1.5 text-[9px] font-black tracking-[0.3em] text-primary/70 uppercase">Real-time</p>
          <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl lg:text-3xl">Server Discord</h2>
        </div>
        <div className="mx-auto max-w-4xl">
          <BrutalCard className="overflow-hidden">
            <div className="flex items-center justify-between border-b-2 border-white/[0.06] bg-white/[0.02] px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-indigo-500/20 bg-indigo-500/10">
                  <DiscordIcon className="h-6 w-6 text-indigo-300" />
                </div>
                <div>
                  <p className="text-base font-black text-foreground">{discord.name}</p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 pulse-dot" />
                    {discord.loading ? '—' : (discord.presence?.toLocaleString('id-ID') ?? '—')} online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden text-right sm:block">
                  <p className="text-2xl font-black tabular-nums text-foreground">500+</p>
                  <p className="text-[10px] text-muted-foreground/50">Total Members</p>
                </div>
                <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0px_rgba(99,102,241,0.3)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]">
                  <DiscordIcon className="h-4 w-4" /> Join
                </a>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="mb-3 text-[9px] font-black tracking-[0.2em] text-muted-foreground/40 uppercase">Online Now</p>
              {discord.loading ? (
                <div className="flex gap-3">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className="h-12 w-12 animate-pulse rounded-md border-2 border-white/[0.04] bg-white/[0.02]" />
                  ))}
                </div>
              ) : discord.members.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground/40">Widget unavailable</p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {discord.members.map((m, i) => (
                      <div key={i} className="group relative">
                        <div className="relative">
                          {m.avatar ? (
                            <div className="h-12 w-12 overflow-hidden rounded-md border-2 border-white/10 transition-all group-hover:border-primary/30">
                              <Image src={m.avatar} alt="" width={48} height={48} className="object-cover" unoptimized />
                            </div>
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-indigo-500/15 bg-indigo-500/8 text-sm font-black text-indigo-300/60 transition-all group-hover:border-indigo-500/30">
                              {m.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className={cn(
                            'absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-background',
                            m.status === 'online' ? 'bg-emerald-400' : m.status === 'idle' ? 'bg-amber-400' : m.status === 'dnd' ? 'bg-red-500' : 'bg-white/25'
                          )} />
                        </div>
                        <p className="mt-1.5 text-center text-[9px] font-medium text-muted-foreground/40 truncate max-w-[48px]">{m.username}</p>
                      </div>
                    ))}
                    {discord.presence && discord.presence > discord.members.length && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-dashed border-white/[0.06] text-[10px] font-bold text-muted-foreground/30">
                        +{discord.presence - discord.members.length}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['💬 General','🎨 Art','💻 Tech','🎮 Gaming'].map((ch) => (
                      <span key={ch} className="rounded-sm border-2 border-white/[0.04] bg-white/[0.02] px-2.5 py-1 text-[9px] font-bold text-muted-foreground/40">{ch}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </BrutalCard>
        </div>
      </section>

      {/* Sponsors & Partners */}
      {(data.partnerships.length > 0 || data.sponsorships.length > 0) && (
        <section className="container mx-auto border-t-2 border-white/[0.04] px-4 py-10 pt-12 sm:px-6 sm:py-14">
          {data.sponsorships.length > 0 && (
            <div className="mb-12">
              <SH eyebrow="Support" title="Sponsor" />
              <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8">
                {data.sponsorships.map((p: any) => (
                  <a key={p.id} href={p.website ?? '#'} target="_blank" rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2 transition-all hover:translate-y-[-1px]">
                    <BrutalCard className="flex h-14 w-14 items-center justify-center p-2 sm:h-16 sm:w-16">
                      {p.logourl ? (
                        <Image src={p.logourl} alt={p.name} width={56} height={56} className="object-contain opacity-40 transition-opacity group-hover:opacity-90" unoptimized />
                      ) : (
                        <Heart className="h-5 w-5 text-muted-foreground/40" />
                      )}
                    </BrutalCard>
                    <p className="text-[9px] font-bold tracking-wide text-muted-foreground/40 uppercase transition-colors">{p.name}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
          {data.partnerships.length > 0 && (
            <div>
              <SH eyebrow="Collaboration" title="Partners" />
              <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8">
                {data.partnerships.map((p: any) => (
                  <a key={p.id} href={p.website ?? '#'} target="_blank" rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2 transition-all hover:translate-y-[-1px]">
                    <BrutalCard className="flex h-14 w-14 items-center justify-center p-2 sm:h-16 sm:w-16">
                      {p.logourl ? (
                        <Image src={p.logourl} alt={p.name} width={56} height={56} className="object-contain opacity-35 transition-opacity group-hover:opacity-85" unoptimized />
                      ) : (
                        <Heart className="h-5 w-5 text-muted-foreground/35" />
                      )}
                    </BrutalCard>
                    <p className="text-[9px] font-bold tracking-wide text-muted-foreground/35 uppercase transition-colors">{p.name}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Social Media Marquee */}
      <div className="relative overflow-hidden border-t-2 border-b-2 border-white/[0.04] py-3">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
        <div className="marquee-track mb-2 flex gap-3 whitespace-nowrap">
          {[...Array(4)].map((_, i) =>
            SOCIAL_LINKS.map((s) => (
              <a key={`r1-${i}-${s.slug}`} href={s.href} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-sm border-2 border-white/[0.05] bg-white/[0.02] px-4 py-2 transition-all hover:bg-white/[0.06]">
                <s.Icon className="h-4 w-4 text-muted-foreground/20 transition-colors group-hover:text-foreground/70" />
                <span className="text-xs font-semibold text-muted-foreground/15 transition-colors group-hover:text-foreground/50">{s.name}</span>
              </a>
            ))
          )}
        </div>
        <div className="marquee-track-reverse flex gap-3 whitespace-nowrap">
          {[...Array(4)].map((_, i) =>
            [...SOCIAL_LINKS].reverse().map((s) => (
              <a key={`r2-${i}-${s.slug}`} href={s.href} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-sm border-2 border-white/[0.05] bg-white/[0.02] px-4 py-2 transition-all hover:bg-white/[0.06]">
                <s.Icon className="h-4 w-4 text-muted-foreground/15 transition-colors group-hover:text-foreground/65" />
                <span className="text-xs font-semibold text-muted-foreground/12 transition-colors group-hover:text-foreground/45">{s.name}</span>
              </a>
            ))
          )}
        </div>
      </div>

      {/* CTA — only if not logged in */}
      {!isLoggedIn && user !== 'loading' && (
        <section className="container mx-auto px-4 py-20 sm:px-6 sm:py-28">
          <BrutalCard className="relative mx-auto max-w-3xl overflow-hidden px-8 py-14 text-center sm:px-16">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="relative z-10">
              <div className="mb-5 text-4xl">🚀</div>
              <h2 className="mb-4 text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-4xl">
                Be Part of{' '}
                <span className="text-gradient">Soraku</span>
              </h2>
              <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
                Free forever. A warm, supportive community for every anime & pop culture lover in Indonesia.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/register"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-[4px_4px_0px_rgba(37,99,235,0.3)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_rgba(37,99,235,0.4)]">
                  <Sparkles className="h-4 w-4" /> Join Free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/about"
                  className="inline-flex items-center gap-2 rounded-md border-2 border-white/[0.08] px-8 py-3.5 text-sm font-bold text-muted-foreground/65 transition-all hover:border-white/[0.15] hover:text-foreground">
                  About Soraku
                </Link>
              </div>
            </div>
          </BrutalCard>
        </section>
      )}
    </main>
  )
}
