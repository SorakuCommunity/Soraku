import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getRoleBadgeColor } from '@/lib/utils'
import {
  Twitter,
  Instagram,
  Youtube,
  Twitch,
  Globe,
  Music,
  ExternalLink,
  Heart,
  ShoppingBag,
} from 'lucide-react'
import type { User } from '@/types'

interface Props {
  params: Promise<{ username: string }>
}

function SocialLink({
  href,
  label,
  Icon,
}: {
  href: string
  label: string
  Icon: React.ElementType
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl text-sm hover:border-purple-500/50 hover:scale-105 transition-all"
    >
      <Icon className="w-4 h-4 text-soraku-primary shrink-0" />
      <span className="flex-1 text-sm">{label}</span>
      <ExternalLink className="w-3 h-3 opacity-40 shrink-0" />
    </a>
  )
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('users').select('*').eq('username', username).single()
  if (!data) notFound()

  const user = data as User

  const socials = [
    user.twitter      && { href: user.twitter,       label: 'Twitter / X',    Icon: Twitter },
    user.instagram    && { href: user.instagram,     label: 'Instagram',      Icon: Instagram },
    user.youtube      && { href: user.youtube,       label: 'YouTube',        Icon: Youtube },
    user.twitch       && { href: user.twitch,        label: 'Twitch',         Icon: Twitch },
    user.spotify      && { href: user.spotify,       label: 'Spotify',        Icon: Music },
    user.official_website && { href: user.official_website, label: 'Website', Icon: Globe },
  ].filter(Boolean) as { href: string; label: string; Icon: React.ElementType }[]

  const fanZone = [
    user.kofi         && { href: user.kofi,          label: 'Ko-fi',          Icon: Heart },
    user.patreon      && { href: user.patreon,       label: 'Patreon',        Icon: Heart },
    user.saweria      && { href: user.saweria,       label: 'Saweria',        Icon: Heart },
    user.trakteer     && { href: user.trakteer,      label: 'Trakteer',       Icon: Heart },
    user.sociabuzz    && { href: user.sociabuzz,     label: 'Sociabuzz',      Icon: Heart },
    user.merchandise  && { href: user.merchandise,   label: 'Merchandise',    Icon: ShoppingBag },
  ].filter(Boolean) as { href: string; label: string; Icon: React.ElementType }[]

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile card */}
        <div className="glass rounded-3xl p-8 text-center">
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar_url}
              alt={user.display_name ?? ''}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-500/30 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-soraku-gradient mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white">
              {(user.display_name ?? 'U')[0].toUpperCase()}
            </div>
          )}
          <h1 className="font-display text-2xl font-bold mb-1">{user.display_name}</h1>
          <p className="text-soraku-sub text-sm mb-3">@{user.username}</p>
          <span
            className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}
          >
            {user.role}
          </span>
          {user.bio && (
            <p className="text-soraku-sub text-sm mt-4 leading-relaxed max-w-xs mx-auto">
              {user.bio}
            </p>
          )}
        </div>

        {/* Social links */}
        {socials.length > 0 && (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-soraku-sub mb-4">
              Media Sosial
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {socials.map((l) => (
                <SocialLink key={l.href} {...l} />
              ))}
            </div>
          </div>
        )}

        {/* Fan zone */}
        {fanZone.length > 0 && (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-soraku-sub mb-4">
              Fan Zone & Support
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {fanZone.map((l) => (
                <SocialLink key={l.href} {...l} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
