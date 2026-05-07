'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Save,
  LogOut,
  Camera,
  ExternalLink,
  Star,
  Check,
  AlertCircle,
  Eye,
  Lock,
} from 'lucide-react'
import { DiscordIcon, InstagramIcon, YouTubeIcon, XIcon } from '@/components/icons/custom-icons'
import { cn } from '@/lib/utils'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
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

interface Profile {
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
  level: LevelData
  badges: BadgeData[]
}

// ─── Config ───────────────────────────────────────────────────────────────────

const ROLE_META: Record<string, { label: string; svg: string; color: string }> = {
  OWNER: { label: 'Owner', svg: 'owner.svg', color: '#eab308' },
  MANAGER: { label: 'Manager', svg: 'owner.svg', color: '#fbbf24' },
  ADMIN: { label: 'Admin', svg: 'admin.svg', color: '#ef4444' },
  AGENSI: { label: 'Agensi', svg: 'admin.svg', color: '#f97316' },
  KREATOR: { label: 'Kreator', svg: 'premium.svg', color: '#a855f7' },
  USER: { label: 'Member', svg: 'member.svg', color: '#6366f1' },
}

const SUPPORT_META: Record<string, { label: string; color: string }> = {
  VVIP: { label: 'VVIP', color: 'text-purple-300 bg-purple-500/10 border-purple-500/20' },
  VIP: { label: 'VIP', color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' },
  DONATUR: { label: 'Donatur', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
}

const SOCIAL_CONFIG = [
  { key: 'discord', label: 'Discord ID', Icon: DiscordIcon, placeholder: 'Contoh: 1234567890' },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon, placeholder: '@username' },
  { key: 'x', label: 'X (Twitter)', Icon: XIcon, placeholder: '@username' },
  { key: 'youtube', label: 'YouTube', Icon: YouTubeIcon, placeholder: 'Channel URL / Handle' },
] as const

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileMePage() {
  const router = useRouter()
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)

  // Form state
  const [displayname, setDisplayname] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatarurl, setAvatarurl] = useState('')
  const [coverurl, setCoverurl] = useState('')
  const [isprivate, setIsprivate] = useState(false)
  const [socials, setSocials] = useState<Record<string, string>>({})

  const [dirty, setDirty] = useState(false)

  const showToast = (type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/profile')
      if (!res.ok) {
        router.push('/login')
        return
      }
      const { data } = await res.json()
      setProfile(data)
      setDisplayname(data.displayname ?? '')
      setUsername(data.username ?? '')
      setBio(data.bio ?? '')
      setAvatarurl(data.avatarurl ?? '')
      setCoverurl(data.coverurl ?? '')
      setIsprivate(data.isprivate ?? false)
      setSocials(data.sociallinks ?? {})
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
      setDirty(false)
    }
  }, [router])

  useEffect(() => {
    load()
  }, [load])

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayname: displayname.trim(),
          username: username.trim(),
          bio: bio.trim(),
          avatarurl,
          coverurl,
          isprivate,
          sociallinks: socials,
        }),
      })
      const { data, error } = await res.json()
      if (!res.ok) {
        showToast('err', error?.message ?? 'Gagal menyimpan.')
        return
      }
      setProfile((p) => (p ? { ...p, ...data } : p))
      setDirty(false)
      showToast('ok', 'Profil berhasil disimpan ✓')
    } catch {
      showToast('err', 'Terjadi kesalahan.')
    } finally {
      setSaving(false)
    }
  }

  const handleImgUrl = (type: 'avatar' | 'cover', url: string) => {
    if (type === 'avatar') {
      setAvatarurl(url)
    } else {
      setCoverurl(url)
    }
    setDirty(true)
  }

  const handleSocialChange = (key: string, val: string) => {
    setSocials((p) => ({ ...p, [key]: val }))
    setDirty(true)
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    router.push('/')
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse space-y-6 px-4 pt-6 pb-24">
        <div className="bg-muted/20 h-8 w-48 rounded" />
        <div className="bg-muted/15 h-48 sm:h-64 rounded-xl" />
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="bg-muted/20 h-32 w-32 rounded-full -mt-16 ml-8 border-4 border-background" />
          <div className="flex-1 space-y-4 pt-4">
             <div className="bg-muted/20 h-6 w-full max-w-md rounded" />
             <div className="bg-muted/15 h-10 w-full max-w-sm rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const rm = ROLE_META[profile.role] ?? ROLE_META.USER
  const sm = profile.supporterrole ? SUPPORT_META[profile.supporterrole] : null

  return (
    <div className="mx-auto max-w-4xl px-4 pt-6 pb-24 relative">
      {/* Toast Notification */}
      {toast && (
        <div
          className={cn(
            'fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full px-6 py-3 text-sm font-bold shadow-xl transition-all animate-in slide-in-from-bottom-5',
            toast.type === 'ok'
              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 backdrop-blur-md'
              : 'border border-red-500/30 bg-red-500/10 text-red-500 backdrop-blur-md'
          )}
        >
          {toast.type === 'ok' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Floating Save Button (shows when dirty) */}
      {dirty && (
        <div className="fixed bottom-24 sm:bottom-10 right-4 sm:right-10 z-40 animate-in slide-in-from-bottom-5 fade-in duration-300">
           <Button 
             onClick={save} 
             disabled={saving} 
             className="rounded-full shadow-xl shadow-primary/20 h-14 px-8 text-base font-bold"
           >
             {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Menyimpan...
                </>
             ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Simpan Perubahan
                </>
             )}
           </Button>
        </div>
      )}

      {/* Header Actions */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan Profil</h1>
          <p className="text-muted-foreground mt-1">Kelola informasi publik dan privasi akun Anda.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="hidden sm:flex">
             <Link href={`/profile/\${profile.username}`}>
                <Eye className="mr-2 h-4 w-4" /> Lihat Publik
             </Link>
          </Button>
          <Button variant="destructive" onClick={logout} className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border-transparent">
             <LogOut className="mr-2 h-4 w-4" /> Keluar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Content Column */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Visual Editor Card (Cover + Avatar) */}
            <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
              <div className="p-0 relative">
                {/* Cover Image Editor */}
                <div 
                  className="group relative h-40 sm:h-52 w-full bg-muted/50 cursor-pointer overflow-hidden"
                  onClick={() => {
                    const url = prompt('Masukkan URL gambar cover baru (kosongkan untuk menghapus):', coverurl)
                    if (url !== null) handleImgUrl('cover', url)
                  }}
                >
                  {coverurl ? (
                    <Image src={coverurl} alt="Cover" fill className="object-cover transition-transform duration-500 group-hover:scale-105" priority />
                  ) : (
                    <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, \${rm.color}, transparent)` }} />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex flex-col items-center justify-center gap-2">
                     <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all bg-background/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
                        <Camera className="h-5 w-5 text-foreground" />
                     </div>
                     <span className="text-xs font-bold text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all delay-75 drop-shadow-md">
                        Ubah Cover
                     </span>
                  </div>
                </div>

                {/* Avatar Editor */}
                <div className="px-6 pb-6 relative">
                  <div className="absolute -top-16 sm:-top-20 left-6 sm:left-8 z-10">
                    <div 
                      className="group relative rounded-full bg-background p-1.5 cursor-pointer shadow-md"
                      onClick={() => {
                        const url = prompt('Masukkan URL avatar baru (kosongkan untuk menghapus):', avatarurl)
                        if (url !== null) handleImgUrl('avatar', url)
                      }}
                    >
                      <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border border-border/50">
                        {avatarurl ? (
                          <AvatarImage src={avatarurl} alt="Avatar" className="object-cover" />
                        ) : (
                          <AvatarFallback className="text-4xl font-bold bg-muted" style={{ color: rm.color }}>
                            {(displayname || profile.username || '?').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="absolute inset-1.5 rounded-full bg-black/0 group-hover:bg-black/50 transition-all flex flex-col items-center justify-center">
                        <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                      </div>
                    </div>
                  </div>

                  {/* Badges Info below cover on the right */}
                  <div className="flex justify-end pt-4 pb-4 h-16 sm:h-20 items-start">
                     <div className="flex gap-2">
                        <Badge variant="outline" className="py-1 px-3 shadow-sm border-border/50" style={{ color: rm.color }}>
                           <img src={`/roles/\${rm.svg}`} alt="" className="h-3.5 w-3.5 mr-1.5" />
                           {rm.label}
                        </Badge>
                        {sm && (
                          <Badge variant="secondary" className={cn("py-1 px-3 shadow-sm", sm.color)}>
                            {sm.label === 'VVIP' ? '✨' : sm.label === 'VIP' ? '⭐' : '💚'} {sm.label}
                          </Badge>
                        )}
                     </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Basic Info Card */}
            <Card className="border-border/50 bg-card/50 shadow-sm">
               <CardHeader>
                  <CardTitle>Informasi Dasar</CardTitle>
                  <CardDescription>Nama dan bio yang akan ditampilkan di profil publik Anda.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-sm font-semibold">Nama Tampilan</label>
                        <Input 
                          value={displayname} 
                          onChange={(e) => { setDisplayname(e.target.value); setDirty(true) }} 
                          placeholder="Nama Panggilan / Nickname" 
                          maxLength={50}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-semibold">Username</label>
                        <div className="relative">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">@</span>
                           <Input 
                             value={username} 
                             onChange={(e) => { setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')); setDirty(true) }} 
                             placeholder="username" 
                             className="pl-8"
                             maxLength={30}
                           />
                        </div>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-semibold flex justify-between">
                        <span>Bio Profil</span>
                        <span className="text-muted-foreground font-normal text-xs">{bio.length}/300</span>
                     </label>
                     <textarea
                        value={bio}
                        onChange={(e) => { setBio(e.target.value); setDirty(true) }}
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                        placeholder="Ceritakan sedikit tentang dirimu..."
                        maxLength={300}
                     />
                  </div>
               </CardContent>
            </Card>

            {/* Social Links Card */}
            <Card className="border-border/50 bg-card/50 shadow-sm">
               <CardHeader>
                  <CardTitle>Tautan Sosial</CardTitle>
                  <CardDescription>Tambahkan tautan agar orang lain mudah menemukan Anda.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  {SOCIAL_CONFIG.map(({ key, label, Icon, placeholder }) => (
                     <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 sm:w-40 text-sm font-medium text-muted-foreground">
                           <Icon className="h-4 w-4" /> {label}
                        </div>
                        <Input 
                           value={socials[key] ?? ''}
                           onChange={(e) => handleSocialChange(key, e.target.value)}
                           placeholder={placeholder}
                           className="flex-1"
                        />
                     </div>
                  ))}
               </CardContent>
            </Card>

         </div>

         {/* Sidebar Column */}
         <div className="space-y-6">
            
            {/* Privacy Settings */}
            <Card className={cn(
              "border-border/50 shadow-sm transition-colors duration-300",
              isprivate ? "border-primary/50 bg-primary/5 shadow-primary/10" : "bg-card/50"
            )}>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Lock className="h-5 w-5" /> Keamanan & Privasi
                  </CardTitle>
                  <CardDescription>Atur visibilitas akun Anda untuk publik.</CardDescription>
               </CardHeader>
               <CardContent>
                  <button
                    onClick={() => { setIsprivate(p => !p); setDirty(true) }}
                    className={cn(
                      "w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all",
                      isprivate ? "border-primary bg-primary/10" : "border-border/50 hover:bg-muted/50"
                    )}
                  >
                     <div className={cn(
                        "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all mt-0.5",
                        isprivate ? "border-primary bg-primary" : "border-muted-foreground/30"
                     )}>
                        {isprivate && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                     </div>
                     <div>
                        <div className="font-bold text-sm">Profil Privat</div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                           Hanya Anda yang dapat melihat informasi lengkap. Detail profil akan disembunyikan dari publik.
                        </p>
                     </div>
                  </button>
               </CardContent>
            </Card>

            {/* Level Stats */}
            <Card className="border-border/50 bg-card/50 shadow-sm overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Star className="h-24 w-24" />
               </div>
               <CardHeader>
                  <CardTitle>Statistik Level</CardTitle>
               </CardHeader>
               <CardContent className="relative z-10 space-y-4">
                  <div className="flex items-end justify-between">
                     <div>
                        <div className="text-3xl font-black">{profile.level.level}</div>
                        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Level Saat Ini</div>
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <div className="flex justify-between text-xs font-semibold">
                        <span>XP Progress</span>
                        <span>{profile.level.xpcurrent.toLocaleString()} / {profile.level.xprequired.toLocaleString()}</span>
                     </div>
                     <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                           className="h-full bg-primary rounded-full transition-all duration-1000"
                           style={{ width: `\${Math.min(100, Math.round((profile.level.xpcurrent / Math.max(1, profile.level.xprequired)) * 100))}%` }}
                        />
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Badges Preview */}
            <Card className="border-border/50 bg-card/50 shadow-sm">
               <CardHeader>
                  <CardTitle>Badge Koleksi</CardTitle>
                  <CardDescription>Badge yang berhasil Anda kumpulkan.</CardDescription>
               </CardHeader>
               <CardContent>
                  {profile.badges.length > 0 ? (
                     <div className="flex flex-wrap gap-2">
                        {profile.badges.map(b => (
                           <Badge key={b.id} variant="outline" className={cn("py-1", b.badgecls)}>
                              <span className="mr-1.5">{b.badgeicon}</span> {b.badgename}
                           </Badge>
                        ))}
                     </div>
                  ) : (
                     <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-lg">
                        Belum ada badge.
                     </div>
                  )}
               </CardContent>
            </Card>

         </div>
      </div>

      <div className="mt-8 flex justify-center sm:hidden">
         <Button variant="outline" asChild className="w-full">
            <Link href={`/profile/\${profile.username}`}>
               <Eye className="mr-2 h-4 w-4" /> Lihat Publik
            </Link>
         </Button>
      </div>

    </div>
  )
}
