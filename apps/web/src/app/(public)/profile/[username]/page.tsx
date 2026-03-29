'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Globe,
  Lock,
  Calendar,
  AlertCircle,
  Pencil,
  Instagram,
  Twitter,
  Youtube,
  ExternalLink,
  Share2,
  Check,
  Star,
  ImageIcon,
  Zap,
  UserPlus,
  UserCheck,
  ChevronRight,
} from 'lucide-react'
import { DiscordIcon } from '@/components/icons/custom-icons'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LevelData {
  level: number
  xpcurrent: number
  xprequired: number
  reputationscore: number
}
interface BadgeData {
  id: string
  badgename: string
  badgeicon: string
  badgecls?: string
}
interface GalleryItem {
  id: string
  imageurl: string
  title: string | null
}
interface PublicProfile {
  id: string
  username: string | null
  displayname: string | null
  avatarurl: string | null
  coverurl: string | null
  bio: string | null
  role: string
  supporterrole: string | null
  sociallinks?: Record<string, string>
  isprivate: boolean
  createdat?: string
  level: LevelData
  galleryCount: number
  galleryPosts: GalleryItem[]
  badges: BadgeData[]
  followers: number
  following: number
  isFollowing: boolean
}

// ─── Config ───────────────────────────────────────────────────────────────────

const ROLE_META: Record<string, { label: string; svg: string; color: string; ring: string }> = {
  OWNER: { label: 'Owner', svg: 'owner.svg', color: '#eab308', ring: 'ring-yellow-400/30' },
  MANAGER: { label: 'Manager', svg: 'owner.svg', color: '#fbbf24', ring: 'ring-yellow-300/25' },
  ADMIN: { label: 'Admin', svg: 'admin.svg', color: '#ef4444', ring: 'ring-red-400/30' },
  AGENSI: { label: 'Agensi', svg: 'admin.svg', color: '#f97316', ring: 'ring-orange-400/25' },
  KREATOR: { label: 'Kreator', svg: 'premium.svg', color: '#a855f7', ring: 'ring-purple-400/30' },
  USER: { label: 'Member', svg: 'member.svg', color: '#6366f1', ring: 'ring-primary/20' },
}

const SUPPORT_META: Record<string, { label: string; color: string }> = {
  VVIP: { label: 'VVIP', color: 'text-purple-300' },
  VIP: { label: 'VIP', color: 'text-emerald-300' },
  DONATUR: { label: 'Donatur', color: 'text-green-400' },
}

const LEVEL_TITLES: [number, string][] = [
  [50, 'Soraku Legend'],
  [40, 'Community Hero'],
  [30, 'Elite Member'],
  [20, 'Senpai'],
  [10, 'Otaku'],
  [1, 'Newcomer'],
]
const getLevelTitle = (lv: number) => LEVEL_TITLES.find(([m]) => lv >= m)?.[1] ?? 'Newcomer'

const SOCIAL_CONFIG = [
  {
    key: 'discord',
    label: 'Discord',
    Icon: DiscordIcon,
    getHref: (v: string) => `https://discord.com/users/${v}`,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    Icon: Instagram,
    getHref: (v: string) => `https://instagram.com/${v.replace('@', '')}`,
  },
  {
    key: 'x',
    label: 'X',
    Icon: Twitter,
    getHref: (v: string) => `https://x.com/${v.replace('@', '')}`,
  },
  {
    key: 'youtube',
    label: 'YouTube',
    Icon: Youtube,
    getHref: (v: string) => (v.startsWith('http') ? v : `https://youtube.com/${v}`),
  },
  {
    key: 'website',
    label: 'Website',
    Icon: Globe,
    getHref: (v: string) => (v.startsWith('http') ? v : `https://${v}`),
  },
] as const

// ─── XP Ring ──────────────────────────────────────────────────────────────────

function XpRing({ pct, color, size = 88 }: { pct: number; color: string; size?: number }) {
  const r = (size - 6) / 2
  const circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size} className="pointer-events-none absolute inset-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="3"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ - (pct / 100) * circ}
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  )
}

// ─── Follow Button ────────────────────────────────────────────────────────────

function FollowButton({
  username,
  isFollowing: init,
  onToggle,
}: {
  username: string
  isFollowing: boolean
  onToggle: (v: boolean) => void
}) {
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState(init)

  const toggle = async () => {
    setLoading(true)
    const res = await fetch(`/api/users/${username}/follow`, { method: 'POST' }).catch(() => null)
    if (res?.ok) {
      const { data } = await res.json()
      setState(data.following)
      onToggle(data.following)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={cn(
        'flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold transition-all duration-200',
        loading && 'pointer-events-none opacity-50',
        state
          ? 'border-border/40 text-muted-foreground/70 border bg-transparent hover:border-red-400/30 hover:text-red-400'
          : 'bg-primary shadow-primary/20 hover:bg-primary/90 text-white shadow-lg hover:-translate-y-0.5'
      )}
    >
      {state ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
      {state ? 'Mengikuti' : 'Ikuti'}
    </button>
  )
}

// ─── Share ────────────────────────────────────────────────────────────────────

function ShareBtn({ username }: { username: string }) {
  const [ok, setOk] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(`https://www.soraku.id/profile/${username}`).catch(() => {})
        setOk(true)
        setTimeout(() => setOk(false), 2000)
      }}
      className="border-border/25 text-muted-foreground/50 hover:text-foreground hover:border-border/50 flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all"
    >
      {ok ? (
        <>
          <Check className="h-3 w-3 text-emerald-400" />
          Disalin
        </>
      ) : (
        <>
          <Share2 className="h-3 w-3" />
          Bagikan
        </>
      )}
    </button>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse px-4 pt-8 pb-20">
      <div className="bg-muted/20 mb-6 h-3 w-20 rounded" />
      <div className="space-y-6">
        <div className="bg-muted/15 h-44 rounded-3xl" />
        <div className="flex items-center gap-4">
          <div className="bg-muted/20 h-20 w-20 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <div className="bg-muted/20 h-5 w-36 rounded" />
            <div className="bg-muted/15 h-3 w-24 rounded" />
          </div>
        </div>
        <div className="bg-muted/12 h-16 rounded-2xl" />
      </div>
    </div>
  )
}

// ─── Stat ─────────────────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-0.5">
      <span className="text-lg font-black tabular-nums">{value}</span>
      <span className="text-muted-foreground/40 text-[10px] font-semibold tracking-wider uppercase">
        {label}
      </span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>()
  const router = useRouter()
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isSelf, setIsSelf] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [followers, setFollowers] = useState(0)

  useEffect(() => {
    if (!username) return
    Promise.all([
      fetch(`/api/users/${username}`).then((r) => r.json()),
      fetch('/api/auth/me', { cache: 'no-store' })
        .then((r) => r.json())
        .catch(() => ({ data: null })),
    ])
      .then(([pRes, meRes]) => {
        if (pRes.error || !pRes.data) {
          setNotFound(true)
          return
        }
        const p = pRes.data as PublicProfile
        setProfile(p)
        setFollowers(p.followers ?? 0)
        setIsLoggedIn(!!meRes.data)
        if (meRes.data?.username === username) setIsSelf(true)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [username])

  if (loading) return <Skeleton />

  if (notFound || !profile)
    return (
      <div className="mx-auto max-w-lg px-4 py-32 text-center">
        <div className="mb-4 text-5xl">👤</div>
        <h1 className="text-lg font-black">Profil tidak ditemukan</h1>
        <p className="text-muted-foreground/50 mt-2 text-sm">@{username} tidak ada.</p>
        <button
          onClick={() => router.back()}
          className="border-border/30 text-muted-foreground hover:text-foreground hover:border-border/50 mt-7 inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>
      </div>
    )

  const rm = ROLE_META[profile.role] ?? ROLE_META.USER
  const sm = profile.supporterrole ? SUPPORT_META[profile.supporterrole] : null
  const name = profile.displayname ?? profile.username ?? '—'
  const lvl = profile.level
  const xpPct = Math.min(100, Math.round((lvl.xpcurrent / Math.max(1, lvl.xprequired)) * 100))
  const lvlTitle = getLevelTitle(lvl.level)
  const socials = SOCIAL_CONFIG.filter((s) => profile.sociallinks?.[s.key])
  const joinYear = profile.createdat ? new Date(profile.createdat).getFullYear() : null

  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 pb-24">
      {/* Back nav */}
      <Link
        href="/"
        className="text-muted-foreground/40 hover:text-muted-foreground/70 mb-6 inline-flex items-center gap-1.5 text-xs transition-colors"
      >
        <ArrowLeft className="h-3 w-3" /> Beranda
      </Link>

      {/* ── COVER ── */}
      <div className="from-primary/20 via-primary/8 to-accent/15 relative h-40 overflow-hidden rounded-3xl bg-gradient-to-br sm:h-52">
        {profile.coverurl && <Image src={profile.coverurl} alt="" fill className="object-cover" />}
        {/* Bottom fade */}
        <div className="from-background absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t to-transparent" />
        {/* Role ambient glow */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 70% 50%, ${rm.color}20, transparent 70%)`,
          }}
        />

        {/* Top right actions */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <ShareBtn username={profile.username ?? username} />
          {isSelf && (
            <Link
              href="/profile/me"
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-black/25 px-3.5 py-2 text-xs font-semibold text-white/80 backdrop-blur-sm transition-all hover:bg-white/15"
            >
              <Pencil className="h-3 w-3" /> Edit
            </Link>
          )}
        </div>
      </div>

      {/* ── AVATAR + HEADER ── */}
      <div className="mt-4 flex items-end justify-between gap-4">
        {/* Avatar with XP ring */}
        <div className="relative -mt-12 h-[88px] w-[88px] flex-shrink-0">
          <XpRing pct={xpPct} color={rm.color} size={88} />
          <div className="border-background bg-card absolute inset-[4px] overflow-hidden rounded-2xl border-[3px] shadow-xl">
            {profile.avatarurl ? (
              <Image src={profile.avatarurl} alt={name} fill className="object-cover" />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-2xl font-black"
                style={{ color: rm.color + '80' }}
              >
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {/* Level badge */}
          <div
            className="border-background absolute -right-1.5 -bottom-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 px-1 text-[9px] font-black"
            style={{ background: rm.color + '20', color: rm.color, borderColor: rm.color + '40' }}
          >
            {lvl.level}
          </div>
        </div>

        {/* Follow / Edit */}
        <div className="flex items-center gap-2 pb-1">
          {isLoggedIn && !isSelf && (
            <FollowButton
              username={profile.username ?? username}
              isFollowing={profile.isFollowing}
              onToggle={(v) => setFollowers((n) => (v ? n + 1 : n - 1))}
            />
          )}
          {!isLoggedIn && !isSelf && (
            <Link
              href="/login"
              className="bg-primary/10 border-primary/20 text-primary/80 hover:bg-primary/15 flex items-center gap-2 rounded-xl border px-5 py-2 text-sm font-bold transition-all"
            >
              <UserPlus className="h-4 w-4" /> Ikuti
            </Link>
          )}
        </div>
      </div>

      {/* ── NAME + TAGS ── */}
      <div className="mt-4">
        <h1 className="text-2xl font-black tracking-tight">{name}</h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground/45">@{profile.username}</span>

          {/* Role badge */}
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase"
            style={{
              color: rm.color,
              background: rm.color + '15',
              border: `1px solid ${rm.color}25`,
            }}
          >
            <img
              src={`/roles/${rm.svg}`}
              alt=""
              className="h-3 w-3"
              style={{ filter: `drop-shadow(0 0 2px ${rm.color}60)` }}
            />
            {rm.label}
          </span>

          {/* Supporter badge */}
          {sm && (
            <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-black', sm.color)}>
              {sm.label === 'VVIP' ? '✨' : sm.label === 'VIP' ? '⭐' : '💚'} {sm.label}
            </span>
          )}

          {/* Level title */}
          <span className="text-muted-foreground/35">{lvlTitle}</span>

          {profile.isprivate && (
            <span className="text-muted-foreground/30 flex items-center gap-1">
              <Lock className="h-3 w-3" /> Privat
            </span>
          )}
          {joinYear && (
            <span className="text-muted-foreground/30 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {joinYear}
            </span>
          )}
        </div>
      </div>

      {profile.isprivate ? (
        <div className="border-border/30 mt-8 flex items-center justify-center gap-3 rounded-2xl border border-dashed px-5 py-6 text-center">
          <Lock className="text-muted-foreground/20 h-5 w-5" />
          <p className="text-muted-foreground/35 text-sm italic">Profil ini privat.</p>
        </div>
      ) : (
        <>
          {/* ── STATS ── */}
          <div className="border-border/15 mt-6 flex items-center gap-6 border-y py-5">
            <Stat label="Pengikut" value={followers.toLocaleString('id-ID')} />
            <div className="bg-border/20 h-6 w-px" />
            <Stat label="Mengikuti" value={(profile.following ?? 0).toLocaleString('id-ID')} />
            <div className="bg-border/20 h-6 w-px" />
            <Stat label="Karya" value={profile.galleryCount} />
            <div className="bg-border/20 h-6 w-px" />
            <Stat label="Reputasi" value={lvl.reputationscore.toLocaleString()} />
          </div>

          {/* ── BIO ── */}
          {profile.bio && (
            <p className="text-foreground/70 mt-6 text-sm leading-relaxed">{profile.bio}</p>
          )}

          {/* ── XP BAR ── */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground/50 flex items-center gap-1.5 font-semibold">
                <Zap className="h-3 w-3" style={{ color: rm.color }} />
                Level {lvl.level}
              </span>
              <span className="text-muted-foreground/30 tabular-nums">
                {lvl.xpcurrent.toLocaleString()} / {lvl.xprequired.toLocaleString()} XP
              </span>
            </div>
            <div className="bg-muted/15 h-1.5 w-full overflow-hidden rounded-full">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${xpPct}%`,
                  background: `linear-gradient(to right, ${rm.color}80, ${rm.color})`,
                }}
              />
            </div>
          </div>

          {/* ── BADGES ── */}
          {profile.badges.length > 0 && (
            <div className="mt-7">
              <p className="text-muted-foreground/30 mb-3 flex items-center gap-1.5 text-[9px] font-black tracking-[0.22em] uppercase">
                <Star className="h-3 w-3" /> Badge
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.badges.map((b) => (
                  <span
                    key={b.id}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold',
                      b.badgecls ?? 'border-primary/20 bg-primary/8 text-primary/70'
                    )}
                  >
                    <span>{b.badgeicon}</span>
                    {b.badgename}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── SOCIALS ── */}
          {socials.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              {socials.map(({ key, label, Icon, getHref }) => (
                <a
                  key={key}
                  href={getHref(profile.sociallinks![key]!)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border-border/20 text-muted-foreground/60 hover:border-border/40 hover:text-foreground flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all hover:-translate-y-0.5"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                  <ExternalLink className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-40" />
                </a>
              ))}
            </div>
          )}

          {/* ── GALLERY PREVIEW ── */}
          {profile.galleryPosts.length > 0 && (
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-muted-foreground/30 flex items-center gap-1.5 text-[9px] font-black tracking-[0.22em] uppercase">
                  <ImageIcon className="h-3 w-3" /> Galeri
                </p>
                <Link
                  href="/gallery"
                  className="group text-muted-foreground/30 hover:text-primary flex items-center gap-1 text-[10px] transition-colors"
                >
                  Lihat semua{' '}
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {profile.galleryPosts.slice(0, 6).map((g) => (
                  <Link
                    key={g.id}
                    href="/gallery"
                    className="group bg-muted/15 relative aspect-square overflow-hidden rounded-xl"
                  >
                    <Image
                      src={g.imageurl}
                      alt={g.title ?? ''}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/15" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {isSelf && (
        <p className="text-muted-foreground/25 mt-10 text-center text-xs">
          Ini profil publikmu —{' '}
          <Link href="/profile/me" className="text-primary/50 hover:text-primary transition-colors">
            edit profil
          </Link>
        </p>
      )}
    </div>
  )
}
