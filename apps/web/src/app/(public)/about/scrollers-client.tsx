'use client'

import { useEffect, useState } from 'react'
import {
  DiscordIcon,
  InstagramIcon,
  FacebookIcon,
  XIcon,
  TikTokIcon,
  YouTubeIcon,
  BlueSkyIcon,
  type IconProps,
} from '@/components/icons/custom-icons'

// Map slug → icon component (no passing functions from server)
const ICON_MAP: Record<string, React.FC<IconProps>> = {
  discord: DiscordIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  x: XIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
  bluesky: BlueSkyIcon,
}

const LABEL_MAP: Record<string, string> = {
  discord: 'Gabung Server',
  instagram: 'Follow',
  facebook: 'Like Page',
  x: 'Follow',
  tiktok: 'Follow',
  youtube: 'Subscribe',
  bluesky: 'Follow',
}

// Serializable social data (safe to pass from Server → Client)
export interface SocialData {
  slug: string
  name: string
  href: string
}

// ─── Social Card ──────────────────────────────────────────────────────────────

function SocialCard({ s }: { s: SocialData }) {
  const Icon = ICON_MAP[s.slug]
  if (!Icon) return null
  return (
    <a
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group border-border/50 bg-card/50 hover:border-primary/35 hover:bg-card flex flex-shrink-0 flex-col items-center gap-3 rounded-2xl border px-6 py-5 backdrop-blur-sm transition-all hover:-translate-y-1"
    >
      <div className="border-border/50 bg-background/80 text-muted-foreground group-hover:border-primary/30 group-hover:text-primary flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors">
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-center">
        <p className="text-foreground text-sm font-bold">{s.name}</p>
        <p className="text-primary/70 group-hover:text-primary mt-0.5 text-xs font-semibold transition-colors">
          {LABEL_MAP[s.slug] ?? 'Kunjungi'} →
        </p>
      </div>
    </a>
  )
}

// ─── Partner Card ─────────────────────────────────────────────────────────────

interface Partner {
  id: string
  name: string
  logo: string
  category: string
  website: string
}

function PartnerCard({ p }: { p: Partner }) {
  const BADGE: Record<string, string> = {
    media: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    komunitas: 'bg-primary/10 text-primary border-primary/20',
    event: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    sponsor: 'bg-yellow-400/10 text-yellow-300 border-yellow-400/20',
  }
  return (
    <a
      href={p.website}
      target="_blank"
      rel="noopener noreferrer"
      className="group border-border/50 bg-card/50 hover:border-primary/35 hover:bg-card flex min-w-[148px] flex-shrink-0 flex-col items-center gap-3 rounded-2xl border px-6 py-5 backdrop-blur-sm transition-all hover:-translate-y-1"
    >
      <div className="border-border/50 bg-background/80 flex h-12 w-12 items-center justify-center rounded-2xl border text-2xl">
        {p.logo}
      </div>
      <div className="text-center">
        <p className="text-foreground text-sm font-bold">{p.name}</p>
        <span
          className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize ${BADGE[p.category] ?? 'bg-muted/20 text-muted-foreground border-border/40'}`}
        >
          {p.category}
        </span>
      </div>
    </a>
  )
}

// ─── Scroller ────────────────────────────────────────────────────────────────

interface Props {
  type: 'social' | 'partner'
  socials?: SocialData[]
}

export function AboutScrollers({ type, socials }: Props) {
  const [partners, setPartners] = useState<Partner[]>([])

  useEffect(() => {
    if (type === 'partner') {
      fetch('/api/partnerships')
        .then((r) => r.json())
        .then((d) => setPartners(d.data ?? []))
        .catch(() => {})
    }
  }, [type])

  if (type === 'social' && socials && socials.length > 0) {
    const tripled = [...socials, ...socials, ...socials]
    return (
      <div className="relative overflow-hidden">
        <div className="from-background pointer-events-none absolute top-0 left-0 z-10 h-full w-16 bg-gradient-to-r to-transparent" />
        <div className="from-background pointer-events-none absolute top-0 right-0 z-10 h-full w-16 bg-gradient-to-l to-transparent" />
        <div className="marquee-track flex gap-4 px-4">
          {tripled.map((s, i) => (
            <SocialCard key={`${s.slug}-${i}`} s={s} />
          ))}
        </div>
      </div>
    )
  }

  if (type === 'partner') {
    if (partners.length === 0) {
      return (
        <div className="py-8 text-center">
          <p className="text-muted-foreground/40 text-sm">
            Partner ditampilkan setelah admin menambahkan data melalui panel admin.
          </p>
        </div>
      )
    }
    const tripled = [...partners, ...partners, ...partners]
    return (
      <div className="relative overflow-hidden">
        <div className="from-background pointer-events-none absolute top-0 left-0 z-10 h-full w-16 bg-gradient-to-r to-transparent" />
        <div className="from-background pointer-events-none absolute top-0 right-0 z-10 h-full w-16 bg-gradient-to-l to-transparent" />
        <div
          className="flex gap-4 px-4"
          style={{
            animation: 'marquee 35s linear infinite',
            width: 'max-content',
            display: 'flex',
          }}
        >
          {tripled.map((p, i) => (
            <PartnerCard key={`${p.id}-${i}`} p={p} />
          ))}
        </div>
      </div>
    )
  }

  return null
}
