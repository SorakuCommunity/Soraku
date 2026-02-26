import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Twitter, Youtube, Twitch, Instagram, ArrowLeft, Star, Globe, Music } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('vtubers')
    .select('name, description')
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single()
  return { title: data?.name ? `${data.name} — Soraku` : 'VTuber — Soraku' }
}

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  twitter: Twitter,
  youtube: Youtube,
  twitch: Twitch,
  instagram: Instagram,
  tiktok: Music,
  website: Globe,
}

const SOCIAL_COLORS: Record<string, string> = {
  twitter: 'hover:text-blue-400',
  youtube: 'hover:text-red-400',
  twitch: 'hover:text-purple-400',
  instagram: 'hover:text-pink-400',
  tiktok: 'hover:text-cyan-400',
  website: 'hover:text-green-400',
}

export default async function VtuberDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: vtuber } = await supabase
    .from('vtubers')
    .select('*')
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single()

  if (!vtuber) notFound()

  // Build socials from columns + social_links JSONB
  const socials: { platform: string; url: string }[] = []
  const cols = ['twitter', 'youtube', 'twitch', 'instagram', 'tiktok'] as const
  for (const col of cols) {
    if (vtuber[col]) socials.push({ platform: col, url: vtuber[col] })
  }

  // Also from social_links JSONB if present
  if (vtuber.social_links && typeof vtuber.social_links === 'object') {
    for (const [platform, url] of Object.entries(vtuber.social_links as Record<string, string>)) {
      if (url && !socials.find(s => s.platform === platform)) {
        socials.push({ platform, url })
      }
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/Vtuber"
          className="inline-flex items-center gap-2 text-soraku-sub hover:text-soraku-text text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke VTuber
        </Link>

        {/* Profile card */}
        <div className="glass rounded-3xl overflow-hidden mb-8">
          {/* Banner / Avatar */}
          <div className="relative h-56 bg-soraku-muted">
            {vtuber.avatar_url ? (
              <Image src={vtuber.avatar_url} alt={vtuber.name} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Star className="w-16 h-16 text-soraku-sub/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-soraku-card via-soraku-card/30 to-transparent" />
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                {vtuber.generation && (
                  <span className="inline-block text-xs bg-purple-500/15 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full mb-2">
                    {vtuber.generation}
                  </span>
                )}
                <h1 className="font-display text-3xl font-bold">{vtuber.name}</h1>
              </div>
            </div>

            {(vtuber.description || vtuber.bio) && (
              <p className="text-soraku-sub leading-relaxed mb-6">
                {vtuber.description ?? vtuber.bio}
              </p>
            )}

            {/* Social Links */}
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {socials.map(({ platform, url }) => {
                  const Icon = SOCIAL_ICONS[platform] ?? Globe
                  const colorClass = SOCIAL_COLORS[platform] ?? 'hover:text-white'
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 glass border border-soraku-border px-4 py-2 rounded-xl text-sm text-soraku-sub ${colorClass} transition-colors capitalize`}
                    >
                      <Icon className="w-4 h-4" /> {platform}
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Back CTA */}
        <div className="text-center">
          <Link
            href="/Vtuber"
            className="inline-flex items-center gap-2 glass border border-soraku-border px-6 py-2.5 rounded-full text-sm hover:border-purple-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Lihat Semua VTuber
          </Link>
        </div>
      </div>
    </div>
  )
}
