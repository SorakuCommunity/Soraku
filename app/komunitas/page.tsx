import { fetchDiscussions } from '@/lib/github'
import { fetchDiscordStats } from '@/lib/discord'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { MessageSquare, ThumbsUp, Clock, Users, Mic, MapPin, Github, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'

export const revalidate = 60
export const metadata: Metadata = { title: 'Komunitas — Soraku' }

const DISCORD_INVITE = 'https://discord.gg/CJJ7KEJMbg'

export default async function KomunitasPage() {
  const [discussions, discord] = await Promise.all([
    fetchDiscussions(),
    fetchDiscordStats(),
  ])

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* ─── Header ──────────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold mb-4">
            <span className="grad-text">Komunitas</span> Soraku
          </h1>
          <p className="text-soraku-sub">Diskusi, berbagi, dan terhubung dengan sesama penggemar.</p>
        </div>

        {/* ─── Discord Section (top) ────────────────────────────────── */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {/* Discord Chat */}
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-2xl p-6 hover:border-indigo-500/50 hover:scale-[1.02] transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-semibold mb-1 group-hover:text-indigo-400 transition-colors">Chat Discord</h3>
            <p className="text-soraku-sub text-sm mb-3">Obrolan real-time 24/7 di server Discord Soraku.</p>
            {discord.memberCount > 0 && (
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-soraku-sub">
                  <Users className="w-3 h-3" /> {discord.memberCount.toLocaleString()} member
                </span>
                <span className="flex items-center gap-1 text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {discord.onlineCount.toLocaleString()} online
                </span>
              </div>
            )}
          </a>

          {/* Voice Channels */}
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-2xl p-6 hover:border-purple-500/50 hover:scale-[1.02] transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
              <Mic className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-semibold mb-1 group-hover:text-purple-400 transition-colors">Voice Channel</h3>
            <p className="text-soraku-sub text-sm mb-3">Nonton bareng, ngobrol, dan ngemil di voice channel.</p>
            <span className="text-xs text-purple-400 flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> Buka Discord
            </span>
          </a>

          {/* Offline Meetups */}
          <div className="glass rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className="font-semibold mb-1">Offline Meetup</h3>
            <p className="text-soraku-sub text-sm mb-3">Kumpul bareng komunitas di acara anime & manga lokal.</p>
            <Link href="/events" className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors">
              <ExternalLink className="w-3 h-3" /> Lihat Events
            </Link>
          </div>
        </div>

        {/* ─── GitHub Discussions (bottom) ─────────────────────────── */}
        <div className="mb-6 flex items-center gap-3">
          <Github className="w-5 h-5 text-soraku-sub" />
          <h2 className="font-semibold text-lg">Diskusi Komunitas</h2>
          {discussions.length === 0 && (
            <span className="text-xs text-soraku-sub bg-soraku-muted/50 px-2 py-0.5 rounded-full">
              Memerlukan konfigurasi GitHub token
            </span>
          )}
        </div>

        {discussions.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <Github className="w-10 h-10 text-soraku-sub mx-auto mb-4 opacity-40" />
            <p className="text-soraku-sub text-sm">
              Belum ada diskusi tersedia. Set <code className="text-purple-400 text-xs bg-purple-500/10 px-1.5 py-0.5 rounded">GITHUB_TOKEN</code>,{' '}
              <code className="text-purple-400 text-xs bg-purple-500/10 px-1.5 py-0.5 rounded">GITHUB_REPO_OWNER</code>,{' '}
              dan <code className="text-purple-400 text-xs bg-purple-500/10 px-1.5 py-0.5 rounded">GITHUB_REPO_NAME</code> di environment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {discussions.map((d) => (
              <Link
                key={d.id}
                href={`/komunitas/${d.number}`}
                className="glass rounded-2xl p-5 block group hover:border-purple-500/50 transition-all"
              >
                <div className="flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.author.avatarUrl} alt={d.author.login} className="w-9 h-9 rounded-full shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-soraku-sub bg-soraku-muted/50 px-2 py-0.5 rounded-full">
                        {d.category.emoji} {d.category.name}
                      </span>
                    </div>
                    <h2 className="font-semibold group-hover:text-purple-400 transition-colors line-clamp-1 mb-1 text-sm">{d.title}</h2>
                    <p className="text-soraku-sub text-xs line-clamp-2 mb-2">{d.body}</p>
                    <div className="flex items-center gap-4 text-xs text-soraku-sub">
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{d.comments.totalCount}</span>
                      <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{d.upvoteCount}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(d.createdAt)}</span>
                      <span className="text-soraku-sub/70">oleh {d.author.login}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
