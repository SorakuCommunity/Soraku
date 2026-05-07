'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Globe,
  Lock,
  Calendar,
  Pencil,
  ExternalLink,
  Share2,
  Check,
  Star,
  ImageIcon,
  Zap,
  UserPlus,
  UserCheck,
  MoreHorizontal,
} from 'lucide-react'
import { DiscordIcon, InstagramIcon, YouTubeIcon, XIcon } from '@/components/icons/custom-icons'
import { cn } from '@/lib/utils'
import {
  Button,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Separator,
} from '@soraku/ui'

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
    getHref: (v: string) => `https://discord.com/users/\${v}`,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    Icon: InstagramIcon,
    getHref: (v: string) => `https://instagram.com/\${v.replace('@', '')}`,
  },
  {
    key: 'x',
    label: 'X',
    Icon: XIcon,
    getHref: (v: string) => `https://x.com/\${v.replace('@', '')}`,
  },
  {
    key: 'youtube',
    label: 'YouTube',
    Icon: YouTubeIcon,
    getHref: (v: string) => (v.startsWith('http') ? v : `https://youtube.com/\${v}`),
  },
  {
    key: 'website',
    label: 'Website',
    Icon: Globe,
    getHref: (v: string) => (v.startsWith('http') ? v : `https://\${v}`),
  },
] as const

// ─── Components ───────────────────────────────────────────────────────────────

function ShareBtn({ username }: { username: string }) {
  const [ok, setOk] = useState(false)
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-9 w-9 rounded-full"
      onClick={() => {
        navigator.clipboard.writeText(`https://www.soraku.id/profile/\${username}`).catch(() => {})
        setOk(true)
        setTimeout(() => setOk(false), 2000)
      }}
    >
      {ok ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
    </Button>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="text-xl font-bold">{value}</span>
      <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-4 pt-6 pb-20">
      <div className="bg-muted/20 mb-6 h-4 w-24 rounded" />
      <div className="border bg-card rounded-xl overflow-hidden shadow-sm">
        <div className="bg-muted/15 h-48 sm:h-64 w-full" />
        <div className="px-6 pb-6 relative">
          <div className="absolute -top-16 left-6 h-32 w-32 rounded-full border-4 border-background bg-muted/20" />
          <div className="flex justify-end pt-4 pb-4">
             <div className="bg-muted/20 h-10 w-24 rounded-full" />
          </div>
          <div className="mt-2 space-y-3">
             <div className="bg-muted/20 h-8 w-48 rounded-md" />
             <div className="bg-muted/15 h-4 w-32 rounded-md" />
             <div className="bg-muted/15 h-16 w-full max-w-md rounded-md mt-4" />
          </div>
        </div>
      </div>
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
      fetch(`/api/users/\${username}`).then((r) => r.json()),
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
    const res = await fetch(`/api/users/\${username}/follow`, { method: 'POST' }).catch(() => null)
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
        <h1 className="text-2xl font-bold tracking-tight">Profil tidak ditemukan</h1>
        <p className="text-muted-foreground mt-2">@{username} tidak ada atau mungkin telah dihapus.</p>
        <Button onClick={() => router.back()} variant="outline" className="mt-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
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

  return (
    <div className="mx-auto max-w-4xl px-4 pt-6 pb-24">
      {/* Back nav */}
      <Button variant="ghost" size="sm" asChild className="mb-4 text-muted-foreground">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Beranda
        </Link>
      </Button>

      <Card className="overflow-hidden border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        {/* Cover Photo */}
        <div className="relative h-48 w-full sm:h-64 bg-muted/30">
          {profile.coverurl ? (
            <Image src={profile.coverurl} alt="Cover" fill className="object-cover" priority />
          ) : (
             <div 
               className="absolute inset-0 opacity-20"
               style={{ background: `linear-gradient(135deg, \${rm.color}, transparent)` }} 
             />
          )}
          {/* Private Overlay for Cover */}
          {profile.isprivate && !isSelf && (
             <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <Lock className="h-12 w-12 text-muted-foreground/30" />
             </div>
          )}
        </div>

        {/* Profile Content Container */}
        <div className="relative px-4 pb-6 sm:px-8 sm:pb-8">
          
          {/* Avatar & Top Actions */}
          <div className="flex justify-between items-end -mt-16 sm:-mt-20 mb-4 relative z-10">
            {/* Avatar */}
            <div className="relative rounded-full bg-background p-1.5 sm:p-2">
              <Avatar className="h-28 w-28 sm:h-36 sm:w-36 border border-border/50 shadow-md">
                {profile.avatarurl ? (
                  <AvatarImage src={profile.avatarurl} alt={name} className="object-cover" />
                ) : (
                  <AvatarFallback className="text-4xl font-bold bg-muted" style={{ color: rm.color }}>
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              {/* Level Badge Overlay */}
              <Badge 
                className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 border-2 border-background shadow-sm px-2 text-xs font-bold"
                style={{ backgroundColor: rm.color, color: '#fff' }}
              >
                Lvl {lvl.level}
              </Badge>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pb-2 sm:pb-4">
              <ShareBtn username={profile.username ?? username} />
              
              {isSelf ? (
                <Button asChild className="rounded-full font-semibold" variant="outline">
                  <Link href="/profile/me">
                    <Pencil className="mr-2 h-4 w-4" /> Edit Profil
                  </Link>
                </Button>
              ) : isLoggedIn ? (
                 <Button 
                   onClick={toggleFollow} 
                   className={cn("rounded-full font-semibold min-w-[110px]", profile.isFollowing && "bg-muted text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30")}
                   variant={profile.isFollowing ? "outline" : "default"}
                 >
                    {profile.isFollowing ? 'Mengikuti' : 'Ikuti'}
                 </Button>
              ) : (
                <Button asChild className="rounded-full font-semibold min-w-[110px]">
                  <Link href="/login">Ikuti</Link>
                </Button>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="text-muted-foreground font-medium">@{profile.username}</span>
                
                {/* Role Badge */}
                <Badge variant="outline" className="gap-1.5 py-0.5" style={{ borderColor: rm.color, color: rm.color }}>
                   <img src={`/roles/\${rm.svg}`} alt="" className="h-3 w-3" />
                   {rm.label}
                </Badge>

                {/* Supporter Badge */}
                {sm && (
                  <Badge variant="secondary" className={cn("gap-1 py-0.5", sm.color, "bg-secondary/50")}>
                    {sm.label === 'VVIP' ? '✨' : sm.label === 'VIP' ? '⭐' : '💚'} {sm.label}
                  </Badge>
                )}

                {/* Private Indicator */}
                {profile.isprivate && (
                  <Badge variant="secondary" className="gap-1 py-0.5 text-muted-foreground">
                    <Lock className="h-3 w-3" /> Privat
                  </Badge>
                )}
              </div>
            </div>

            {/* Private Content Block */}
            {profile.isprivate && !isSelf ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-muted/10 rounded-2xl border border-dashed border-border/40 mt-6">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-2">
                   <Lock className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-bold">Akun Privat</h3>
                <p className="text-muted-foreground text-sm max-w-[300px]">
                  Hanya pengikut yang disetujui yang dapat melihat apa yang dibagikan oleh pengguna ini.
                </p>
              </div>
            ) : (
              <>
                {/* Bio */}
                {profile.bio && (
                  <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed text-sm sm:text-base max-w-3xl">
                    {profile.bio}
                  </p>
                )}

                {/* Meta Info (Joined, Links) */}
                <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-muted-foreground font-medium">
                   {joinYear && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Bergabung sejak {joinYear}
                    </div>
                  )}
                   {socials.map(({ key, label, Icon, getHref }) => (
                    <a
                      key={key}
                      href={getHref(profile.sociallinks![key]!)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </a>
                  ))}
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-6 sm:gap-10 pt-2">
                  <Stat label="Mengikuti" value={(profile.following ?? 0).toLocaleString('id-ID')} />
                  <Stat label="Pengikut" value={followers.toLocaleString('id-ID')} />
                  <Stat label="Karya" value={profile.galleryCount.toLocaleString('id-ID')} />
                  <Stat label="Reputasi" value={lvl.reputationscore.toLocaleString('id-ID')} />
                </div>
                
                <Separator className="my-6" />

                {/* Tabs Area */}
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full sm:w-auto grid grid-cols-3 bg-transparent p-0 border-b border-border/40 rounded-none h-12">
                    <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-12 px-6 font-medium">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="gallery" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-12 px-6 font-medium">
                      Galeri
                    </TabsTrigger>
                    <TabsTrigger value="badges" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-12 px-6 font-medium">
                      Badges
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="pt-6 space-y-8 animate-in fade-in-50 duration-300">
                     {/* Level / XP */}
                     <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm font-bold">
                           <span className="flex items-center gap-2">
                              <Zap className="h-4 w-4" style={{ color: rm.color }} /> 
                              Level {lvl.level}: {lvlTitle}
                           </span>
                           <span className="text-muted-foreground">
                              {lvl.xpcurrent.toLocaleString()} / {lvl.xprequired.toLocaleString()} XP
                           </span>
                        </div>
                        <div className="h-2.5 w-full bg-muted/50 rounded-full overflow-hidden border border-border/50">
                           <div 
                              className="h-full rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `\${xpPct}%`, backgroundColor: rm.color }}
                           />
                        </div>
                     </div>
                     
                     {/* Latest Gallery Snippet */}
                     {profile.galleryPosts.length > 0 && (
                        <div className="space-y-4">
                           <h3 className="text-lg font-bold flex items-center gap-2">
                              <ImageIcon className="h-5 w-5 text-muted-foreground" /> Karya Terbaru
                           </h3>
                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {profile.galleryPosts.slice(0, 3).map(g => (
                                 <Link key={g.id} href="/gallery" className="group relative aspect-square rounded-xl overflow-hidden border border-border/30 bg-muted/20">
                                    <Image src={g.imageurl} alt={g.title ?? ''} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                                 </Link>
                              ))}
                           </div>
                        </div>
                     )}
                  </TabsContent>

                  {/* Gallery Tab */}
                  <TabsContent value="gallery" className="pt-6 animate-in fade-in-50 duration-300">
                     {profile.galleryPosts.length > 0 ? (
                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                          {profile.galleryPosts.map(g => (
                             <Link key={g.id} href="/gallery" className="group relative aspect-square rounded-xl overflow-hidden border border-border/30 bg-muted/20 shadow-sm hover:shadow-md transition-all">
                                <Image src={g.imageurl} alt={g.title ?? ''} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                             </Link>
                          ))}
                       </div>
                     ) : (
                       <div className="text-center py-16 text-muted-foreground">
                          <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-20" />
                          <p>Belum ada karya galeri.</p>
                       </div>
                     )}
                  </TabsContent>

                  {/* Badges Tab */}
                  <TabsContent value="badges" className="pt-6 animate-in fade-in-50 duration-300">
                     {profile.badges.length > 0 ? (
                       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                          {profile.badges.map(b => (
                             <Card key={b.id} className={cn("overflow-hidden border-border/50", b.badgecls)}>
                                <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2 h-full min-h-[100px]">
                                   <div className="text-2xl sm:text-3xl">{b.badgeicon}</div>
                                   <div className="text-sm font-bold leading-tight">{b.badgename}</div>
                                </CardContent>
                             </Card>
                          ))}
                       </div>
                     ) : (
                       <div className="text-center py-16 text-muted-foreground">
                          <Star className="h-10 w-10 mx-auto mb-3 opacity-20" />
                          <p>Belum ada badge yang diperoleh.</p>
                       </div>
                     )}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}