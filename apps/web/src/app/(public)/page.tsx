'use client'
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import {
  ArrowRight,
  Calendar,
  BookOpen,
  ChevronRight,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  Users,
  Handshake,
  Sparkles,
  ImageIcon,
  Tv2,
  Hash,
  Volume2,
  Circle,
  Zap,
} from 'lucide-react'
import {
  DiscordIcon,
  InstagramIcon,
  FacebookIcon,
  XIcon,
  TikTokIcon,
  YouTubeIcon,
} from '@/components/icons/custom-icons'
import { cn } from '@/lib/utils'

// ─── Design tokens ────────────────────────────────────────────────────────────
const P = '#4FA3D1' // primary blue
const S = '#6E8FA6' // secondary
const L = '#D9DDE3' // light text
const AC = '#E8C2A8' // warm accent

// ─── Constants ────────────────────────────────────────────────────────────────
const SOCIAL_LINKS = [
  { slug: 'discord', name: 'Discord', href: 'https://discord.gg/qm3XJvRa6B', Icon: DiscordIcon },
  {
    slug: 'instagram',
    name: 'Instagram',
    href: 'https://www.instagram.com/soraku.moe',
    Icon: InstagramIcon,
  },
  {
    slug: 'facebook',
    name: 'Facebook',
    href: 'https://www.facebook.com/share/1HQs9ZZeCw/',
    Icon: FacebookIcon,
  },
  { slug: 'x', name: 'X', href: 'https://twitter.com/@AppSoraa', Icon: XIcon },
  { slug: 'tiktok', name: 'TikTok', href: 'https://www.tiktok.com/@soraku.id', Icon: TikTokIcon },
  { slug: 'youtube', name: 'YouTube', href: 'https://youtube.com/@chsoraku', Icon: YouTubeIcon },
]

const DISCORD_GUILD_ID = '1116971049045729302'

const CATEGORIES = [
  { label: 'Anime & Manga', color: '#4FA3D1', glow: 'rgba(79,163,209,0.5)' },
  { label: 'Gaming', color: '#a78bfa', glow: 'rgba(167,139,250,0.5)' },
  { label: 'VTuber', color: '#f472b6', glow: 'rgba(244,114,182,0.5)' },
  { label: 'Fanart', color: '#34d399', glow: 'rgba(52,211,153,0.5)' },
  { label: 'J-Music', color: '#fbbf24', glow: 'rgba(251,191,36,0.5)' },
  { label: 'Cosplay', color: '#E8C2A8', glow: 'rgba(232,194,168,0.5)' },
  { label: 'Kreator', color: '#818cf8', glow: 'rgba(129,140,248,0.5)' },
  { label: 'Komunitas', color: '#6ee7b7', glow: 'rgba(110,231,183,0.5)' },
  { label: 'Light Novel', color: '#fb923c', glow: 'rgba(251,146,60,0.5)' },
  { label: 'Nonton Bareng', color: '#e879f9', glow: 'rgba(232,121,249,0.5)' },
]

const PLATFORM_ITEMS = [
  {
    href: '/events',
    label: 'Events',
    desc: 'Turnamen & gathering komunitas',
    color: '#4FA3D1',
    icon: Calendar,
  },
  {
    href: '/blog',
    label: 'Blog',
    desc: 'Artikel & ulasan dari kreator',
    color: '#a78bfa',
    icon: BookOpen,
  },
  {
    href: '/gallery',
    label: 'Galeri',
    desc: 'Fanart & karya anggota',
    color: '#f472b6',
    icon: ImageIcon,
  },
  {
    href: '/vtubers',
    label: 'VTuber',
    desc: 'Virtual YouTuber komunitas',
    color: '#34d399',
    icon: Tv2,
  },
]

// ─── Types ────────────────────────────────────────────────────────────────────
interface EventItem {
  id: string
  slug: string
  title: string
  coverurl: string | null
  startdate: string
  enddate: string | null
  isonline: boolean
  tags: string[]
  status: string
}
interface Author {
  username: string | null
  displayname: string | null
  avatarurl: string | null
}
interface BlogItem {
  id: string
  slug: string
  title: string
  excerpt: string | null
  coverurl: string | null
  publishedat: string
  viewcount: number
  likecount: number
  commentcount: number
  tags: string[]
  author: Author | null
}
interface GalleryItem {
  id: string
  imageurl: string | null
  title: string | null
  tags: string[] | null
}
interface Partnership {
  id: string
  name: string
  logourl: string | null
  website: string | null
  category: string | null
}
interface DmMember {
  username: string
  avatar: string | null
  status: string
  activity?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
function getStatus(status: string) {
  if (status === 'live')
    return {
      label: 'Live',
      dot: 'bg-red-400 animate-pulse',
      cls: 'text-red-400 border-red-500/30 bg-red-500/10',
    }
  if (status === 'upcoming')
    return {
      label: 'Upcoming',
      dot: 'bg-[#4FA3D1] animate-pulse',
      cls: 'text-[#4FA3D1] border-[#4FA3D1]/30 bg-[#4FA3D1]/10',
    }
  return { label: 'Selesai', dot: 'bg-white/25', cls: 'text-white/30 border-white/10 bg-white/5' }
}

function useDiscord() {
  const [d, setD] = useState<{
    presence: number | null
    name: string
    loading: boolean
    members: DmMember[]
  }>({ presence: null, name: 'Soraku Community', loading: true, members: [] })
  useEffect(() => {
    fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        setD({
          presence: j?.presence_count ?? null,
          name: j?.name ?? 'Soraku Community',
          loading: false,
          members: (j?.members ?? []).slice(0, 8).map((m: any) => ({
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

// ─── Category Marquee ─────────────────────────────────────────────────────────
function CategoryMarquee() {
  const items = [...CATEGORIES, ...CATEGORIES, ...CATEGORIES, ...CATEGORIES]
  return (
    <div className="relative overflow-hidden border-y border-white/[0.04] py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#1C1E22] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#1C1E22] to-transparent" />
      <div
        className="flex gap-3 whitespace-nowrap"
        style={{ animation: 'marquee-scroll 38s linear infinite' }}
      >
        {items.map((c, i) => (
          <span
            key={i}
            className="inline-flex flex-shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-[12px] font-semibold"
            style={{
              color: c.color,
              borderColor: c.color + '28',
              background: c.color + '0d',
              textShadow: `0 0 8px ${c.glow}`,
              boxShadow: `0 0 10px ${c.color}12`,
            }}
          >
            <span
              className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
              style={{ background: c.color, boxShadow: `0 0 5px ${c.glow}` }}
            />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────
function SH({ eyebrow, title, href }: { eyebrow: string; title: string; href?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between sm:mb-8">
      <div>
        <p
          className="mb-1.5 text-[9px] font-black tracking-[0.3em] uppercase"
          style={{ color: P + '80' }}
        >
          {eyebrow}
        </p>
        <h2
          className="text-xl font-black tracking-tight sm:text-2xl lg:text-3xl"
          style={{ color: L }}
        >
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group flex items-center gap-1 text-xs font-bold transition-colors"
          style={{ color: S + '80' }}
        >
          Lihat Semua{' '}
          <ChevronRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            style={{ color: P }}
          />
        </Link>
      )}
    </div>
  )
}

// ─── Glass Card wrapper ───────────────────────────────────────────────────────
function GlassCard({
  children,
  className,
  href,
}: {
  children: React.ReactNode
  className?: string
  href?: string
}) {
  const base = cn(
    'relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.028] backdrop-blur-sm transition-all duration-300',
    className
  )
  if (href)
    return (
      <Link
        href={href}
        className={cn(
          base,
          'hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-xl hover:shadow-black/30'
        )}
      >
        {children}
      </Link>
    )
  return <div className={base}>{children}</div>
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({ event }: { event: EventItem }) {
  const st = getStatus(event.status)
  return (
    <GlassCard href={`/events/${event.slug}`}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
        {event.coverurl ? (
          <Image
            src={event.coverurl}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
            sizes="(max-width:640px)50vw,(max-width:1024px)33vw,16vw"
          />
        ) : (
          <Image
            src={EVENT_FALLBACK}
            alt="Event cover"
            fill
            className="object-cover"
            unoptimized
            sizes="(max-width:640px)50vw,(max-width:1024px)33vw,16vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <span
          className={cn(
            'absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-full border px-2 py-1 text-[9px] font-black backdrop-blur-md',
            st.cls
          )}
        >
          <span className={cn('h-1.5 w-1.5 flex-shrink-0 rounded-full', st.dot)} />
          {st.label}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <p className="mb-1 flex items-center gap-1 text-[9px] text-white/35">
          <Clock className="h-2.5 w-2.5" />
          {fmtDate(event.startdate)}
        </p>
        <h3 className="line-clamp-2 text-[11px] leading-snug font-black text-white/90 sm:text-sm">
          {event.title}
        </h3>
      </div>
    </GlassCard>
  )
}

// ─── Blog Card ────────────────────────────────────────────────────────────────
// Fallback image from dribbble
const BLOG_FALLBACK =
  'https://cdn.dribbble.com/userupload/25695983/file/original-0f88b9cf84315de3c021720b318e8279.png?resize=1024x768&vertical=center'
const EVENT_FALLBACK =
  'https://cdn.dribbble.com/userupload/10296709/file/original-0e04efb308e6970fce37f47f67bf5484.png?format=webp&resize=400x300&vertical=center'

function BlogCard({ blog }: { blog: BlogItem }) {
  return (
    <GlassCard href={`/blog/${blog.slug}`}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
        {blog.coverurl ? (
          <Image
            src={blog.coverurl}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
            sizes="(max-width:640px)50vw,(max-width:1024px)33vw,16vw"
          />
        ) : (
          <Image
            src={BLOG_FALLBACK}
            alt="Blog cover"
            fill
            className="object-cover"
            unoptimized
            sizes="(max-width:640px)50vw,(max-width:1024px)33vw,16vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
        {blog.author?.avatarurl && (
          <div className="absolute top-2.5 left-2.5 h-6 w-6 overflow-hidden rounded-full border border-white/20 shadow-sm">
            <Image
              src={blog.author.avatarurl}
              alt=""
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        {blog.author && (
          <p className="mb-1 truncate text-[9px] text-white/35">
            {blog.author.displayname ?? blog.author.username ?? ''} · {fmtDate(blog.publishedat)}
          </p>
        )}
        <h3 className="mb-1.5 line-clamp-2 text-[11px] leading-snug font-black text-white/90 sm:text-sm">
          {blog.title}
        </h3>
        <div className="flex items-center gap-2.5 text-[9px] text-white/28">
          <span className="flex items-center gap-1">
            <Eye className="h-2.5 w-2.5" />
            {blog.viewcount}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-2.5 w-2.5" />
            {blog.likecount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-2.5 w-2.5" />
            {blog.commentcount}
          </span>
        </div>
      </div>
    </GlassCard>
  )
}

// ─── Gallery Card ─────────────────────────────────────────────────────────────
function GalleryCard({ item, idx }: { item: GalleryItem; idx: number }) {
  const heights = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-[3/5]', 'aspect-square', 'aspect-[4/3]']
  return (
    <GlassCard href="/gallery" className="group">
      <div className={cn('relative overflow-hidden rounded-2xl', heights[idx % heights.length])}>
        {item.imageurl ? (
          <Image
            src={item.imageurl}
            alt={item.title ?? ''}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
            sizes="(max-width:640px)50vw,25vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#f472b6]/10 to-[#a78bfa]/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        {(item.tags ?? []).length > 0 && (
          <span className="absolute top-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[9px] font-semibold text-white/70 capitalize backdrop-blur-sm">
            {(item.tags ?? [])[0]}
          </span>
        )}
      </div>
    </GlassCard>
  )
}

// ─── Discord Glass Card ───────────────────────────────────────────────────────
function DiscordCard({ discord }: { discord: ReturnType<typeof useDiscord> }) {
  const SC: { [k: string]: string } = {
    online: 'bg-emerald-400',
    idle: 'bg-amber-400',
    dnd: 'bg-red-500',
    offline: 'bg-white/25',
  }
  return (
    <GlassCard className="shadow-2xl shadow-black/40 backdrop-blur-xl">
      {/* Shimmer top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/15">
            <Image src="/logo.png" alt="S" fill className="object-cover" sizes="40px" />
          </div>
          <div>
            <p className="text-sm font-black" style={{ color: L }}>
              {discord.name}
            </p>
            <p className="text-[10px]" style={{ color: S + '80' }}>
              Server Discord Resmi
            </p>
          </div>
        </div>
        <a
          href="https://discord.gg/qm3XJvRa6B"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-xl bg-indigo-500 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-400"
        >
          <DiscordIcon className="h-3.5 w-3.5" /> Gabung
        </a>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 divide-x divide-white/[0.06] border-b border-white/[0.06]">
        <div className="flex flex-col items-center gap-1 py-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 flex-shrink-0 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-2xl font-black tabular-nums" style={{ color: L }}>
              {discord.loading ? '—' : (discord.presence?.toLocaleString('id-ID') ?? '—')}
            </span>
          </div>
          <span className="text-[10px]" style={{ color: S + '70' }}>
            Member Online
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 py-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" style={{ color: S + '60' }} />
            <span className="text-2xl font-black" style={{ color: L }}>
              500+
            </span>
          </div>
          <span className="text-[10px]" style={{ color: S + '70' }}>
            Total Member
          </span>
        </div>
      </div>
      {/* Members */}
      <div className="px-5 py-4">
        <p
          className="mb-3 text-[9px] font-black tracking-[0.2em] uppercase"
          style={{ color: S + '50' }}
        >
          Sedang Online
        </p>
        {discord.loading ? (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex animate-pulse items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2"
              >
                <div className="h-7 w-7 rounded-full bg-white/8" />
                <div className="h-3 flex-1 rounded bg-white/6" />
              </div>
            ))}
          </div>
        ) : discord.members.length === 0 ? (
          <p className="py-4 text-center text-sm" style={{ color: S + '40' }}>
            Widget tidak tersedia
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {discord.members.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.03] px-3 py-2"
              >
                <div className="relative flex-shrink-0">
                  {m.avatar ? (
                    <div className="h-7 w-7 overflow-hidden rounded-full border border-white/10">
                      <Image
                        src={m.avatar}
                        alt=""
                        width={28}
                        height={28}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/25 text-[10px] font-black text-white/60">
                      {m.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span
                    className={cn(
                      'absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-[1.5px] border-[#1C1E22]',
                      SC[m.status] ?? SC.online
                    )}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold" style={{ color: L + 'B0' }}>
                    {m.username}
                  </p>
                  {m.activity && (
                    <p className="truncate text-[9px]" style={{ color: S + '50' }}>
                      {m.activity}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="px-5 pb-5">
        <a
          href="https://discord.gg/qm3XJvRa6B"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/8 py-2.5 text-xs font-semibold text-indigo-300/70 transition-colors hover:bg-indigo-500/15 hover:text-indigo-300"
        >
          Buka Server Discord <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </GlassCard>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function GridSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 ${cols === 6 ? 'xl:grid-cols-6' : ''}`}
    >
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-white/[0.025]" />
      ))}
    </div>
  )
}

// Dummy data for display when database is empty
const DUMMY_EVENTS: EventItem[] = [
  {
    id: '1',
    slug: 'event-1',
    title: 'Virtual Gathering',
    coverurl: EVENT_FALLBACK,
    startdate: new Date().toISOString(),
    enddate: null,
    isonline: true,
    tags: [],
    status: 'upcoming',
  },
  {
    id: '2',
    slug: 'event-2',
    title: 'Art Contest',
    coverurl: EVENT_FALLBACK,
    startdate: new Date().toISOString(),
    enddate: null,
    isonline: true,
    tags: [],
    status: 'upcoming',
  },
  {
    id: '3',
    slug: 'event-3',
    title: 'Watch Party',
    coverurl: EVENT_FALLBACK,
    startdate: new Date().toISOString(),
    enddate: null,
    isonline: true,
    tags: [],
    status: 'upcoming',
  },
  {
    id: '4',
    slug: 'event-4',
    title: 'Meet & Greet',
    coverurl: EVENT_FALLBACK,
    startdate: new Date().toISOString(),
    enddate: null,
    isonline: true,
    tags: [],
    status: 'upcoming',
  },
] as const

const DUMMY_BLOGS: BlogItem[] = [
  {
    id: '1',
    slug: 'blog-1',
    title: 'Welcome to Soraku Community',
    excerpt: 'Welcome to the community',
    coverurl: BLOG_FALLBACK,
    publishedat: new Date().toISOString(),
    viewcount: 0,
    likecount: 0,
    commentcount: 0,
    tags: ['announcement'],
    author: null,
  },
  {
    id: '2',
    slug: 'blog-2',
    title: 'Getting Started with VTuber',
    excerpt: 'Learn about VTuber culture',
    coverurl: BLOG_FALLBACK,
    publishedat: new Date().toISOString(),
    viewcount: 0,
    likecount: 0,
    commentcount: 0,
    tags: ['vtuber'],
    author: null,
  },
  {
    id: '3',
    slug: 'blog-3',
    title: 'Community Guidelines',
    excerpt: 'Rules and guidelines',
    coverurl: BLOG_FALLBACK,
    publishedat: new Date().toISOString(),
    viewcount: 0,
    likecount: 0,
    commentcount: 0,
    tags: ['guide'],
    author: null,
  },
  {
    id: '4',
    slug: 'blog-4',
    title: 'How to Join Events',
    excerpt: 'Join our events',
    coverurl: BLOG_FALLBACK,
    publishedat: new Date().toISOString(),
    viewcount: 0,
    likecount: 0,
    commentcount: 0,
    tags: ['event'],
    author: null,
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const discord = useDiscord()
  const [data, setData] = useState<{
    events: EventItem[]
    blogs: BlogItem[]
    gallery: GalleryItem[]
    partnerships: Partnership[]
    sponsorships: Partnership[]
  }>({ events: [], blogs: [], gallery: [], partnerships: [], sponsorships: [] })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string } | null | 'loading'>('loading')

  // Use dummy data when API returns empty
  const displayEvents = data.events.length > 0 ? data.events : loading ? DUMMY_EVENTS : []
  const displayBlogs = data.blogs.length > 0 ? data.blogs : loading ? DUMMY_BLOGS : []

  useEffect(() => {
    fetch('/api/home')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.data) setData(d.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setUser(d.data ?? null))
      .catch(() => setUser(null))
  }, [])

  const isLoggedIn = user !== 'loading' && user !== null

  return (
    <main className="text-foreground min-h-screen overflow-x-hidden bg-[#1C1E22]">
      {/* ══════════════════════════════════════════════════════
          HERO
          Mobile: Centered text, no mascot
          Desktop: Mascot seamless kanan + teks kiri
          ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* MOBILE */}
        <div className="relative flex min-h-[95svh] flex-col justify-center px-6 pt-24 pb-14 lg:hidden">
          {/* Removed blur effects by user request */}
          <div className="relative z-10">
            <span
              className="mb-3 block text-xl tracking-wide"
              style={{ fontFamily: "var(--font-script,'Style Script',cursive)", color: `${AC}B0` }}
            >
              {/* 
               Belajar, Berkarya, Bersama 
               Removed by user request
              */}
              {/* Removed text above */}
            </span>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full bg-emerald-400" />
              <span
                className="text-[10px] font-bold tracking-[0.18em] uppercase"
                style={{ color: `${S}90` }}
              >
                {discord.loading ? '—' : (discord.presence?.toLocaleString('id-ID') ?? '—')} online
                sekarang
              </span>
            </div>
            <h1 className="mb-4 text-[clamp(2.8rem,13vw,4.8rem)] leading-[0.9] font-black tracking-tighter">
              Temukan Duniamu
              <br />
              di{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(130deg,${P} 0%,#90c8e8 38%,${AC} 72%,#d4a882 100%)`,
                  WebkitBackgroundClip: 'text',
                }}
              >
                Soraku
              </span>
            </h1>
            <div
              className="mb-4 h-[2px] w-10 rounded-full"
              style={{ background: `linear-gradient(90deg,${P},${AC})`, opacity: 0.5 }}
            />
            <p className="mb-6 max-w-xs text-sm leading-relaxed" style={{ color: `${S}90` }}>
              Wujudkan imajinasi, asah kreativitas, dan jalin koneksi bermakna bersama komunitas
              anime Indonesia.
            </p>
            <div className="mb-8 flex flex-wrap gap-1.5">
              {CATEGORIES.slice(0, 5).map((c, i) => (
                <span
                  key={i}
                  className="rounded-full border bg-white/[0.04] px-3 py-1 text-[10px] font-semibold"
                  style={{ color: c.color, borderColor: c.color + '25' }}
                >
                  {c.label}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {!isLoggedIn && (
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110"
                  style={{ background: `linear-gradient(135deg,${P},#3a8fbe)` }}
                >
                  <Sparkles className="h-4 w-4" /> Bergabung
                </Link>
              )}
              <a
                href="https://discord.gg/qm3XJvRa6B"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/25 bg-indigo-500/8 px-5 py-3 text-sm font-bold text-indigo-300/70 transition-colors hover:bg-indigo-500/15"
              >
                <DiscordIcon className="h-4 w-4" /> Discord
              </a>
            </div>
          </div>
        </div>

        {/* DESKTOP — removed blur effects */}
        <div className="relative hidden min-h-[95vh] items-center lg:grid lg:grid-cols-[1fr_500px] xl:grid-cols-[1fr_560px]">
          {/* Glow - removed by user request */}
          {/* Left */}
          <div className="relative z-10 px-10 py-20 xl:px-16">
            <span
              className="mb-4 block text-2xl tracking-wide xl:text-3xl"
              style={{ fontFamily: "var(--font-script,'Style Script',cursive)", color: `${AC}B0` }}
            >
              {/* 
               Belajar, Berkarya, Bersama 
               Removed by user request
              */}
              {/* Removed text above */}
            </span>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span
                className="text-[10px] font-bold tracking-[0.2em] uppercase"
                style={{ color: `${S}90` }}
              >
                {discord.loading ? '—' : (discord.presence?.toLocaleString('id-ID') ?? '—')} online
                sekarang
              </span>
            </div>
            <h1 className="mb-5 text-[clamp(3.5rem,6vw,5.5rem)] leading-[0.9] font-black tracking-tighter">
              Temukan
              <br />
              Duniamu
              <br />
              di{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(130deg,${P} 0%,#90c8e8 38%,${AC} 72%,#d4a882 100%)`,
                  WebkitBackgroundClip: 'text',
                }}
              >
                Soraku
              </span>
            </h1>
            <div
              className="mb-5 h-[2px] w-12 rounded-full"
              style={{ background: `linear-gradient(90deg,${P},${AC})`, opacity: 0.45 }}
            />
            <p
              className="mb-8 max-w-md text-base leading-relaxed xl:text-lg"
              style={{ color: `${S}90` }}
            >
              Wujudkan imajinasi, asah kreativitas, dan jalin koneksi bermakna. Di sini, setiap
              langkahmu adalah bagian dari cerita besar kita bersama.
            </p>
            <div className="mb-10 flex flex-wrap gap-2">
              {CATEGORIES.slice(0, 6).map((c, i) => (
                <span
                  key={i}
                  className="cursor-default rounded-full border bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold"
                  style={{ color: c.color, borderColor: c.color + '28' }}
                >
                  {c.label}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {!isLoggedIn && (
                <Link
                  href="/register"
                  className="group flex items-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:brightness-110"
                  style={{ background: `linear-gradient(135deg,${P},#3a8fbe)` }}
                >
                  <Sparkles className="h-4 w-4" /> Bergabung Gratis{' '}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
              <a
                href="https://discord.gg/qm3XJvRa6B"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-2xl border border-indigo-500/20 bg-indigo-500/7 px-7 py-3.5 text-sm font-bold text-indigo-300/70 transition-colors hover:bg-indigo-500/15 hover:text-indigo-300"
              >
                <DiscordIcon className="h-4 w-4" /> Gabung Discord
              </a>
            </div>
          </div>

          {/* Right — MASCOT seamless, NO card - removed blur */}
          <div className="relative h-full min-h-[95vh]">
            <Image
              src="/logo-full.png"
              alt="Soraku Mascot"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Fades menyatu */}
            <div className="absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-[#1C1E22] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-[#1C1E22] via-[#1C1E22]/60 to-transparent" />
            <div className="absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#1C1E22] to-transparent" />
            {/* Float badges */}
            {[
              { text: '🌸 Komunitas', top: '22%', left: '1rem', delay: '0s' },
              { text: '🎌 Anime & Manga', top: '40%', left: '0.5rem', delay: '1s' },
              { text: '✨ Non-profit', top: '58%', left: '1.5rem', delay: '2s' },
            ].map((b, i) => (
              <div
                key={i}
                className="float-badge absolute z-20"
                style={{ top: b.top, left: b.left, animationDelay: b.delay }}
              >
                <span className="rounded-full border border-white/10 bg-black/20 px-3.5 py-1.5 text-[11px] font-semibold text-white/50 backdrop-blur-md">
                  {b.text}
                </span>
              </div>
            ))}
            {/* Live pill */}
            <div className="absolute right-6 bottom-8 z-20">
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold text-emerald-400 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CATEGORY MARQUEE ══ */}
      <CategoryMarquee />

      {/* ══════════════════════════════════════════════════════
          PLATFORM SORAKU — glass cards
          ══════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
        <SH eyebrow="Platform" title="Fitur Soraku" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {PLATFORM_ITEMS.map((p, i) => (
            <GlassCard key={p.href} href={p.href} className="group min-h-[140px] sm:min-h-[180px]">
              {/* Hover glow */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 50% 100%,${p.color}1A,transparent 65%)`,
                }}
              />
              <div className="relative z-10 flex h-full flex-col p-4 sm:p-5">
                <div
                  className="mb-auto flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: `${p.color}18`, border: `1px solid ${p.color}28` }}
                >
                  <p.icon className="h-4 w-4" style={{ color: p.color }} />
                </div>
                <div className="mt-8">
                  <h3
                    className="mb-1 text-base font-black transition-colors group-hover:text-white sm:text-lg"
                    style={{ color: p.color }}
                  >
                    {p.label}
                  </h3>
                  <p className="text-[10px] leading-relaxed sm:text-xs" style={{ color: `${S}70` }}>
                    {p.desc}
                  </p>
                </div>
                <div
                  className="mt-3 flex items-center gap-1 text-[10px] font-bold opacity-0 transition-opacity group-hover:opacity-50"
                  style={{ color: p.color }}
                >
                  Jelajahi <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ══ EVENTS ══ */}
      <section className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <SH eyebrow="Upcoming" title="Event Komunitas" href="/events" />
        {loading ? (
          <GridSkeleton />
        ) : displayEvents.length === 0 && !loading ? (
          <div className="py-14 text-center">
            <Calendar className="mx-auto mb-3 h-8 w-8" style={{ color: `${S}30` }} />
            <p className="text-sm" style={{ color: `${S}50` }}>
              Belum ada event
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {displayEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>

      {/* ══ BLOG ══ */}
      <section className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <SH eyebrow="Komunitas" title="Artikel & Kreasi" href="/blog" />
        {loading ? (
          <GridSkeleton />
        ) : displayBlogs.length === 0 && !loading ? (
          <div className="py-14 text-center">
            <BookOpen className="mx-auto mb-3 h-8 w-8" style={{ color: `${S}30` }} />
            <p className="text-sm" style={{ color: `${S}50` }}>
              Belum ada artikel
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {displayBlogs.map((b) => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        )}
      </section>

      {/* ══ GALLERY ══ */}
      <section className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <SH eyebrow="Karya" title="Galeri Anggota" href="/gallery" />
        {loading ? (
          <GridSkeleton cols={8} />
        ) : data.gallery.length === 0 ? (
          <div className="py-14 text-center">
            <ImageIcon className="mx-auto mb-3 h-8 w-8" style={{ color: `${S}30` }} />
            <p className="text-sm" style={{ color: `${S}50` }}>
              Belum ada karya
            </p>
          </div>
        ) : (
          <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
            {data.gallery.map((g, i) => (
              <div key={g.id} className="mb-3 break-inside-avoid">
                <GalleryCard item={g} idx={i} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ══ DISCORD REAL-TIME ══ */}
      <section className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
        <SH eyebrow="Real-time" title="Server Discord" />
        <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-[1fr_360px] lg:gap-8">
          <DiscordCard discord={discord} />
          {/* Desktop right panel */}
          <div className="hidden flex-col justify-between lg:flex">
            <div>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
                <DiscordIcon className="h-7 w-7 text-indigo-300" />
              </div>
              <h3 className="mb-3 text-2xl font-black" style={{ color: L }}>
                Gabung Server Discord Soraku
              </h3>
              <p className="mb-6 text-sm leading-relaxed" style={{ color: `${S}80` }}>
                Chat bareng, nonton bareng, dan ketemu teman sefrekuensi. Aktif 24/7 bersama ratusan
                member online setiap harinya.
              </p>
              <div className="space-y-2">
                {[
                  '💬 Chat anime & gaming',
                  '🎭 VTuber fans & fanart',
                  '🗓️ Info event & giveaway',
                  '🎵 J-Music & cosplay',
                ].map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-sm"
                    style={{ color: `${S}60` }}
                  >
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <a
              href="https://discord.gg/qm3XJvRa6B"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-400"
            >
              <DiscordIcon className="h-5 w-5" /> Masuk ke Discord
            </a>
          </div>
        </div>
      </section>

      {/* ══ PARTNERSHIP & SPONSOR ══ */}
      {(data.partnerships.length > 0 || data.sponsorships.length > 0) && (
        <section className="container mx-auto border-t border-white/[0.04] px-4 py-10 pt-12 sm:px-6 sm:py-14">
          {data.sponsorships.length > 0 && (
            <div className="mb-12">
              <SH eyebrow="Dukungan" title="Sponsor" />
              <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8">
                {data.sponsorships.map((p) => (
                  <a
                    key={p.id}
                    href={p.website ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2 transition-all hover:-translate-y-0.5"
                  >
                    <GlassCard className="flex h-14 w-14 items-center justify-center p-2 group-hover:border-white/[0.14] sm:h-16 sm:w-16">
                      {p.logourl ? (
                        <Image
                          src={p.logourl}
                          alt={p.name}
                          width={56}
                          height={56}
                          className="object-contain opacity-40 transition-opacity duration-400 group-hover:opacity-90"
                        />
                      ) : (
                        <Handshake className="h-5 w-5" style={{ color: `${S}40` }} />
                      )}
                    </GlassCard>
                    <p
                      className="text-[9px] font-bold tracking-wide uppercase transition-colors"
                      style={{ color: `${S}40` }}
                    >
                      {p.name}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
          {data.partnerships.length > 0 && (
            <div>
              <SH eyebrow="Kolaborasi" title="Partner" />
              <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8">
                {data.partnerships.map((p) => (
                  <a
                    key={p.id}
                    href={p.website ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2 transition-all hover:-translate-y-0.5"
                  >
                    <GlassCard className="flex h-14 w-14 items-center justify-center p-2 group-hover:border-white/[0.12] sm:h-16 sm:w-16">
                      {p.logourl ? (
                        <Image
                          src={p.logourl}
                          alt={p.name}
                          width={56}
                          height={56}
                          className="object-contain opacity-35 transition-opacity duration-400 group-hover:opacity-85"
                        />
                      ) : (
                        <Handshake className="h-5 w-5" style={{ color: `${S}35` }} />
                      )}
                    </GlassCard>
                    <p
                      className="text-[9px] font-bold tracking-wide uppercase transition-colors"
                      style={{ color: `${S}35` }}
                    >
                      {p.name}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ══ SOCIAL MEDIA MARQUEE ══ */}
      <div className="relative overflow-hidden border-t border-white/[0.04] py-3">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#1C1E22] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#1C1E22] to-transparent" />
        <div className="marquee-track mb-2 flex gap-3 whitespace-nowrap">
          {[...Array(4)].map((_, i) =>
            SOCIAL_LINKS.map((s) => (
              <a
                key={`r1-${i}-${s.slug}`}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.02] px-4 py-2 transition-all hover:bg-white/[0.06]"
              >
                <s.Icon className="h-4 w-4 text-white/22 transition-colors group-hover:text-white/70" />
                <span className="text-xs font-semibold text-white/18 transition-colors group-hover:text-white/50">
                  {s.name}
                </span>
              </a>
            ))
          )}
        </div>
        <div className="marquee-track-reverse flex gap-3 whitespace-nowrap">
          {[...Array(4)].map((_, i) =>
            [...SOCIAL_LINKS].reverse().map((s) => (
              <a
                key={`r2-${i}-${s.slug}`}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.02] px-4 py-2 transition-all hover:bg-white/[0.06]"
              >
                <s.Icon className="h-4 w-4 text-white/18 transition-colors group-hover:text-white/65" />
                <span className="text-xs font-semibold text-white/15 transition-colors group-hover:text-white/45">
                  {s.name}
                </span>
              </a>
            ))
          )}
        </div>
      </div>

      {/* ══ JOIN CTA — only if not logged in ══ */}
      {!isLoggedIn && user !== 'loading' && (
        <section className="container mx-auto px-4 py-20 sm:px-6 sm:py-28">
          {/* Glass CTA card */}
          <GlassCard className="relative mx-auto max-w-3xl overflow-hidden px-8 py-14 text-center sm:px-16">
            {/* Glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{ background: `radial-gradient(ellipse at 50% 0%,${P}18,transparent 60%)` }}
            />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="relative z-10">
              <div className="mb-5 text-4xl">🌸</div>
              <h2
                className="mb-4 text-2xl font-black tracking-tight sm:text-3xl md:text-4xl"
                style={{ color: L }}
              >
                Jadilah bagian dari{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg,${P},${AC})`,
                    WebkitBackgroundClip: 'text',
                  }}
                >
                  Soraku
                </span>
              </h2>
              <p
                className="mx-auto mb-8 max-w-sm text-sm leading-relaxed sm:text-base"
                style={{ color: `${S}80` }}
              >
                Gratis selamanya. Komunitas hangat, supportif, dan penuh semangat untuk semua
                pecinta anime di Indonesia.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:brightness-110"
                  style={{
                    background: `linear-gradient(135deg,${P},#3a8fbe)`,
                    boxShadow: `0 8px 25px ${P}25`,
                  }}
                >
                  <Sparkles className="h-4 w-4" /> Daftar Gratis <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] px-8 py-3.5 text-sm font-semibold transition-all hover:border-white/[0.15]"
                  style={{ color: `${S}65` }}
                >
                  Tentang Soraku
                </Link>
              </div>
            </div>
          </GlassCard>
        </section>
      )}
    </main>
  )
}
