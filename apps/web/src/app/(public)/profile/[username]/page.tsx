'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft, Globe, Lock, Calendar, Pencil, Share2, Check,
  Star, ImageIcon, Zap, Briefcase,
  GraduationCap, Award,
} from 'lucide-react'
import { DiscordIcon, InstagramIcon, YouTubeIcon, XIcon } from '@/components/icons/custom-icons'
import { cn } from '@/lib/utils'

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

const ROLE_META: Record<string, { label: string; color: string }> = {
  OWNER: { label: 'Owner', color: '#eab308' },
  MANAGER: { label: 'Manager', color: '#fbbf24' },
  ADMIN: { label: 'Admin', color: '#ef4444' },
  AGENSI: { label: 'Agensi', color: '#f97316' },
  KREATOR: { label: 'Kreator', color: '#a855f7' },
  USER: { label: 'Member', color: '#6366f1' },
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
    key: 'discord', label: 'Discord', Icon: DiscordIcon,
    getHref: (v: string) => `https://discord.com/users/${v}`,
  },
  {
    key: 'instagram', label: 'Instagram', Icon: InstagramIcon,
    getHref: (v: string) => `https://instagram.com/${v.replace('@', '')}`,
  },
  {
    key: 'x', label: 'X', Icon: XIcon,
    getHref: (v: string) => `https://x.com/${v.replace('@', '')}`,
  },
  {
    key: 'youtube', label: 'YouTube', Icon: YouTubeIcon,
    getHref: (v: string) => (v.startsWith('http') ? v : `https://youtube.com/${v}`),
  },
  {
    key: 'website', label: 'Website', Icon: Globe,
    getHref: (v: string) => (v.startsWith('http') ? v : `https://${v}`),
  },
] as const

function ShareBtn({ username }: { username: string }) {
  const [ok, setOk] = useState(false)
  return (
    <button
      className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-white/[0.12] bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
      onClick={() => {
        navigator.clipboard.writeText(`https://www.soraku.id/profile/${username}`).catch(() => {})
        setOk(true)
        setTimeout(() => setOk(false), 2000)
      }}
    >
      {ok ? <Check className="h-4 w-4 text-green-400" /> : <Share2 className="h-4 w-4" />}
    </button>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-lg font-black text-foreground">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">{label}</p>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 animate-pulse">
      <div className="bg-white/[0.06] mb-6 h-4 w-24 rounded-md" />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-80 w-full">
          <div className="rounded-md border-2 border-white/[0.07] bg-card p-6 shadow-[4px_4px_0px_rgba(37,99,235,0.12)] space-y-4">
            <div className="bg-white/[0.06] mx-auto h-24 w-24 rounded-md" />
            <div className="bg-white/[0.06] h-6 w-3/4 mx-auto rounded-md" />
            <div className="bg-white/[0.06] h-4 w-1/2 mx-auto rounded-md" />
            <div className="bg-white/[0.06] h-16 w-full rounded-md" />
          </div>
        </div>
        <div className="flex-1">
          <div className="rounded-md border-2 border-white/[0.07] bg-card p-6 shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
            <div className="bg-white/[0.06] h-8 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>()
  const router = useRouter()
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isSelf, setIsSelf] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [followers, setFollowers] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')

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

  const toggleFollow = async () => {
    if (!profile) return
    const res = await fetch(`/api/users/${username}/follow`, { method: 'POST' }).catch(() => null)
    if (res?.ok) {
      const { data } = await res.json()
      setProfile((prev) => prev ? { ...prev, isFollowing: data.following } : null)
      setFollowers((prev) => data.following ? prev + 1 : prev - 1)
    }
  }

  if (loading) return <Skeleton />

  if (notFound || !profile) {
    return (
      <div className="mx-auto max-w-lg px-4 py-32 text-center">
        <div className="mb-4 text-5xl">👤</div>
        <h1 className="text-2xl font-black text-foreground">Profil tidak ditemukan</h1>
        <p className="text-muted-foreground mt-2 text-sm">@{username} tidak ada atau mungkin telah dihapus.</p>
        <button onClick={() => router.back()} className="mt-8 rounded-md border-2 border-white/[0.12] bg-card px-6 py-2 text-sm font-bold text-foreground shadow-[2px_2px_0px_rgba(37,99,235,0.12)] hover:border-primary/40 hover:shadow-[3px_3px_0px_rgba(37,99,235,0.25)] transition-all">
          <ArrowLeft className="mr-2 inline h-4 w-4" /> Kembali
        </button>
      </div>
    )
  }

  const rm = ROLE_META[profile.role] ?? ROLE_META.USER
  const sm = profile.supporterrole ? SUPPORT_META[profile.supporterrole] : null
  const name = profile.displayname ?? profile.username ?? '—'
  const lvl = profile.level
  const xpPct = Math.min(100, Math.round((lvl.xpcurrent / Math.max(1, lvl.xprequired)) * 100))
  const lvlTitle = getLevelTitle(lvl.level)
  const socials = SOCIAL_CONFIG.filter((s) => profile.sociallinks?.[s.key])
  const joinYear = profile.createdat
    ? new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date(profile.createdat))
    : null

  const tabs = ['overview', 'gallery', 'badges'] as const
  const tabLabels: Record<string, string> = { overview: 'Overview', gallery: 'Galeri', badges: 'Badges' }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      {/* Back */}
      <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Beranda
      </Link>

      {/* Banner */}
      <div className="relative h-36 sm:h-48 rounded-md border-2 border-white/[0.07] overflow-hidden mb-6 shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
        {profile.coverurl ? (
          <Image src={profile.coverurl} alt="Cover" fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-card to-muted/20" />
        )}
        {profile.isprivate && !isSelf && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Lock className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ─── Left Sidebar ────────────────────────────────────────────── */}
        <div className="lg:w-80 w-full flex-shrink-0">
          <div className="rounded-md border-2 border-white/[0.07] bg-card p-6 shadow-[4px_4px_0px_rgba(37,99,235,0.12)] space-y-5">
            {/* Avatar */}
            <div className="relative -mt-14 sm:-mt-16 mx-auto w-fit">
              <div className="rounded-md border-2 border-white/[0.12] bg-background p-1">
                {profile.avatarurl ? (
                  <Image src={profile.avatarurl} alt={name} width={96} height={96} className="rounded-sm object-cover" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-sm bg-muted text-3xl font-black" style={{ color: rm.color }}>
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span
                className="absolute -bottom-1 -right-1 rounded-sm border-2 border-background px-1.5 py-0.5 text-[9px] font-black text-white shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
                style={{ backgroundColor: rm.color }}
              >
                Lvl {lvl.level}
              </span>
            </div>

            {/* Name & Role */}
            <div className="text-center">
              <h1 className="text-lg font-black text-foreground">{name}</h1>
              <p className="text-xs text-muted-foreground">@{profile.username}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                <span
                  className="rounded-sm border-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{ borderColor: `${rm.color}40`, color: rm.color }}
                >
                  {rm.label}
                </span>
                {sm && (
                  <span className="rounded-sm border-2 border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ color: sm.color.includes('text-') ? undefined : sm.color }}>
                    {sm.label === 'VVIP' ? '✨' : sm.label === 'VIP' ? '⭐' : '💚'} {sm.label}
                  </span>
                )}
                {profile.isprivate && (
                  <span className="rounded-sm border-2 border-white/[0.06] px-2 py-0.5 text-[9px] font-bold text-muted-foreground/60">
                    <Lock className="inline h-2.5 w-2.5 mr-0.5" /> Privat
                  </span>
                )}
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-xs leading-relaxed text-foreground/80 whitespace-pre-wrap text-center">{profile.bio}</p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 rounded-md border-2 border-white/[0.06] bg-white/[0.02] p-4">
              <Stat label="Reputasi" value={lvl.reputationscore.toLocaleString('id-ID')} />
              <Stat label="Pengikut" value={followers.toLocaleString('id-ID')} />
              <Stat label="Mengikuti" value={(profile.following ?? 0).toLocaleString('id-ID')} />
              <Stat label="Karya" value={profile.galleryCount.toLocaleString('id-ID')} />
            </div>

            {/* XP Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="flex items-center gap-1 text-muted-foreground/80">
                  <Zap className="h-3 w-3" style={{ color: rm.color }} />
                  Level {lvl.level}: {lvlTitle}
                </span>
                <span className="text-muted-foreground/50">
                  {lvl.xpcurrent.toLocaleString()} / {lvl.xprequired.toLocaleString()} XP
                </span>
              </div>
              <div className="h-2 rounded-sm border-2 border-white/[0.06] bg-white/[0.03] overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all duration-1000 ease-out"
                  style={{ width: `${xpPct}%`, backgroundColor: rm.color }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isSelf ? (
                <Link
                  href="/profile/me"
                  className="flex-1 rounded-md border-2 border-white/[0.12] bg-card py-2 text-center text-xs font-bold text-foreground shadow-[2px_2px_0px_rgba(37,99,235,0.12)] hover:border-primary/40 transition-all"
                >
                  <Pencil className="mr-1.5 inline h-3.5 w-3.5" /> Edit Profil
                </Link>
              ) : isLoggedIn ? (
                <button
                  onClick={toggleFollow}
                  className={`flex-1 rounded-md border-2 py-2 text-xs font-bold shadow-[2px_2px_0px_rgba(37,99,235,0.12)] transition-all ${
                    profile.isFollowing
                      ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      : 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {profile.isFollowing ? 'Mengikuti' : 'Ikuti'}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex-1 rounded-md border-2 border-primary bg-primary py-2 text-center text-xs font-bold text-primary-foreground shadow-[2px_2px_0px_rgba(37,99,235,0.3)] hover:bg-primary/90 transition-all"
                >
                  Ikuti
                </Link>
              )}
              <ShareBtn username={profile.username ?? username} />
            </div>

            {/* Join Date */}
            {joinYear && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
                <Calendar className="h-3.5 w-3.5" />
                Bergabung sejak {joinYear}
              </div>
            )}

            {/* Social Links */}
            {socials.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Social</p>
                <div className="flex flex-wrap gap-1.5">
                  {socials.map(({ key, label, Icon, getHref }) => (
                    <a
                      key={key}
                      href={getHref(profile.sociallinks![key]!)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-sm border-2 border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[10px] font-bold text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Right Content ───────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {profile.isprivate && !isSelf ? (
            <div className="rounded-md border-2 border-dashed border-white/[0.06] bg-card p-12 text-center shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md border-2 border-white/[0.06] bg-white/[0.03]">
                <Lock className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <h3 className="text-base font-black text-foreground">Akun Privat</h3>
              <p className="text-xs text-muted-foreground/70 mt-1 max-w-xs mx-auto">
                Hanya pengikut yang disetujui yang dapat melihat konten pengguna ini.
              </p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="mb-6 flex border-b-2 border-white/[0.06]">
                {tabs.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${
                      activeTab === t
                        ? 'border-primary text-foreground'
                        : 'border-transparent text-muted-foreground/60 hover:text-foreground'
                    }`}
                  >
                    {tabLabels[t]}
                  </button>
                ))}
              </div>

              {/* Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Reputation Card */}
                  <div className="rounded-md border-2 border-white/[0.07] bg-card p-5 shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
                    <h3 className="text-sm font-black text-foreground flex items-center gap-2 mb-4">
                      <Award className="h-4 w-4 text-primary" />
                      Reputation
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-lg font-black text-foreground">{lvl.level}</p>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground/60">Level</p>
                      </div>
                      <div>
                        <p className="text-lg font-black text-foreground">{lvlTitle}</p>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground/60">Title</p>
                      </div>
                      <div>
                        <p className="text-lg font-black text-foreground">{lvl.reputationscore.toLocaleString('id-ID')}</p>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground/60">Total Rep</p>
                      </div>
                      <div>
                        <p className="text-lg font-black text-foreground">{xpPct}%</p>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground/60">Progress</p>
                      </div>
                    </div>
                  </div>

                  {/* Latest Gallery */}
                  {profile.galleryPosts.length > 0 && (
                    <div className="rounded-md border-2 border-white/[0.07] bg-card p-5 shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
                      <h3 className="text-sm font-black text-foreground flex items-center gap-2 mb-4">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        Karya Terbaru
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {profile.galleryPosts.slice(0, 3).map((g) => (
                          <Link
                            key={g.id}
                            href="/gallery"
                            className="group relative aspect-square rounded-sm border-2 border-white/[0.06] overflow-hidden bg-white/[0.02]"
                          >
                            <Image
                              src={g.imageurl}
                              alt={g.title ?? ''}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              unoptimized
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Activity placeholder */}
                  <div className="rounded-md border-2 border-white/[0.07] bg-card p-5 shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
                    <h3 className="text-sm font-black text-foreground flex items-center gap-2 mb-4">
                      <Zap className="h-4 w-4 text-primary" />
                      Aktivitas Terkini
                    </h3>
                    <div className="space-y-3">
                      {[
                        { icon: Star, text: 'Mendapatkan badge "Early Adopter"', time: '2 hari lalu' },
                        { icon: Briefcase, text: 'Bergabung dengan grup "Web Dev Indonesia"', time: '5 hari lalu' },
                        { icon: GraduationCap, text: 'Menyelesaikan kelas "React Fundamentals"', time: '1 minggu lalu' },
                      ].map((a, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-sm border-2 border-white/[0.06] bg-white/[0.02] flex-shrink-0">
                            <a.icon className="h-4 w-4 text-muted-foreground/60" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground/80">{a.text}</p>
                            <p className="text-[10px] text-muted-foreground/50">{a.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Gallery */}
              {activeTab === 'gallery' && (
                <div>
                  {profile.galleryPosts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {profile.galleryPosts.map((g) => (
                        <Link
                          key={g.id}
                          href="/gallery"
                          className="group relative aspect-square rounded-sm border-2 border-white/[0.06] overflow-hidden bg-white/[0.02] shadow-[2px_2px_0px_rgba(37,99,235,0.08)] hover:shadow-[4px_4px_0px_rgba(37,99,235,0.2)] transition-all hover:scale-[1.02]"
                        >
                          <Image
                            src={g.imageurl}
                            alt={g.title ?? ''}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                          />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border-2 border-white/[0.06] bg-card p-16 text-center shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
                      <ImageIcon className="h-8 w-8 mx-auto mb-3 opacity-20 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground/70">Belum ada karya galeri.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Badges */}
              {activeTab === 'badges' && (
                <div>
                  {profile.badges.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {profile.badges.map((b) => (
                        <div
                          key={b.id}
                          className={`rounded-md border-2 border-white/[0.07] bg-card p-4 text-center shadow-[2px_2px_0px_rgba(37,99,235,0.08)] hover:shadow-[4px_4px_0px_rgba(37,99,235,0.2)] transition-all ${b.badgecls ?? ''}`}
                        >
                          <div className="text-2xl mb-2">{b.badgeicon}</div>
                          <p className="text-[11px] font-bold text-foreground">{b.badgename}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border-2 border-white/[0.06] bg-card p-16 text-center shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
                      <Star className="h-8 w-8 mx-auto mb-3 opacity-20 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground/70">Belum ada badge yang diperoleh.</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
