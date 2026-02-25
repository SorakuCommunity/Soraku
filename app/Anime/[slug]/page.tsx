import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Twitter, Youtube, Twitch, Instagram, Globe, ArrowLeft, ExternalLink } from 'lucide-react'
import { SpotifyIcon } from '@/components/icons'
import type { AnimeProfile } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

function SocialBtn({ href, label, Icon, color }: { href: string; label: string; Icon: React.ElementType; color: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className={`flex items-center gap-2 glass border border-soraku-border px-4 py-2.5 rounded-xl text-sm hover:scale-105 transition-all ${color}`}>
      <Icon className="w-4 h-4" />
      <span className="font-medium">{label}</span>
      <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
    </a>
  )
}

export default async function AnimeDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('anime_profiles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!data) {
    // Show fallback for demo slugs
    if (!['sakura-miko', 'nakiri-ayame', 'shirakami-fubuki'].includes(slug)) notFound()
  }

  const p = (data ?? {
    id: slug,
    name: slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    slug,
    generation: 'Demo',
    avatar_url: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&q=80',
    cover_url: null,
    description: 'Kreator anime pilihan komunitas Soraku.',
    bio: 'Ini adalah profil demo. Tambahkan data melalui Admin Panel → VTuber Manager.',
    twitter: null, youtube: null, twitch: null, instagram: null, tiktok: null, website: null,
    tags: ['Demo'], created_at: new Date().toISOString(),
  }) as AnimeProfile

  const socials = [
    p.twitter    && { href: p.twitter,    label: 'Twitter / X', Icon: Twitter,   color: 'hover:border-blue-400/50 hover:text-blue-400' },
    p.youtube    && { href: p.youtube,    label: 'YouTube',     Icon: Youtube,   color: 'hover:border-red-400/50 hover:text-red-400' },
    p.twitch     && { href: p.twitch,     label: 'Twitch',      Icon: Twitch,    color: 'hover:border-purple-400/50 hover:text-purple-400' },
    p.instagram  && { href: p.instagram,  label: 'Instagram',   Icon: Instagram, color: 'hover:border-pink-400/50 hover:text-pink-400' },
    p.website    && { href: p.website,    label: 'Website',     Icon: Globe,     color: 'hover:border-green-400/50 hover:text-green-400' },
    p.tiktok     && { href: p.tiktok,     label: 'TikTok',      Icon: SpotifyIcon, color: 'hover:border-white/50' },
  ].filter(Boolean) as { href: string; label: string; Icon: React.ElementType; color: string }[]

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Cover / Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <Image
          src={p.cover_url ?? p.avatar_url ?? 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1400&q=80'}
          alt={p.name} fill className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-soraku-dark/50 to-soraku-dark" />
        <div className="absolute top-6 left-4 md:left-8">
          <Link href="/Anime"
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm hover:border-purple-500/50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="shrink-0">
            <div className="w-36 h-36 rounded-2xl border-4 border-soraku-dark overflow-hidden glass shadow-xl">
              {p.avatar_url ? (
                <Image src={p.avatar_url} alt={p.name} width={144} height={144} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-soraku-muted flex items-center justify-center text-4xl font-bold">
                  {p.name[0]}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-12">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {p.generation && (
                <span className="text-xs font-semibold bg-purple-500/20 text-purple-400 px-2.5 py-1 rounded-full border border-purple-500/30">
                  {p.generation}
                </span>
              )}
              {p.tags?.map(t => (
                <span key={t} className="text-xs bg-soraku-muted/50 text-soraku-sub px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">{p.name}</h1>
            {p.description && (
              <p className="text-soraku-sub text-lg mb-4">{p.description}</p>
            )}
          </div>
        </div>

        {/* Bio */}
        {p.bio && (
          <div className="glass rounded-2xl p-6 mt-8 border border-soraku-border">
            <h2 className="font-semibold mb-3">Bio</h2>
            <p className="text-soraku-sub leading-relaxed whitespace-pre-wrap text-sm">{p.bio}</p>
          </div>
        )}

        {/* Social Links */}
        {socials.length > 0 && (
          <div className="mt-8">
            <h2 className="font-semibold mb-4">Media Sosial</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {socials.map(s => (
                <SocialBtn key={s.href} {...s} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
