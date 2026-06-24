'use client'

import Link from 'next/link'
import { Search, Users, MessageCircle, TrendingUp, ArrowRight, Filter, Plus, Hash, Clock, Pin, Bell, Heart } from 'lucide-react'

const FEATURED_GROUPS = [
  { name: 'Anime & Manga Club', members: '2.4k', color: 'border-primary/30', bg: 'bg-primary/10', iconColor: 'text-primary', status: 'Active now' },
  { name: 'VTuber Enthusiasts', members: '1.8k', color: 'border-violet-500/30', bg: 'bg-violet-500/10', iconColor: 'text-violet-400', status: '2m ago' },
  { name: 'Creative Arts', members: '1.2k', color: 'border-rose-500/30', bg: 'bg-rose-500/10', iconColor: 'text-rose-400', status: '5m ago' },
  { name: 'Tech & Dev', members: '980', color: 'border-emerald-500/30', bg: 'bg-emerald-500/10', iconColor: 'text-emerald-400', status: '1m ago' },
]

const PINNED_ANNOUNCEMENTS = [
  { title: 'Selamat datang di komunitas Soraku!', author: 'Admin', time: '3d ago', badge: 'NEW' },
  { title: 'Aturan komunitas & panduan diskusi', author: 'Moderator', time: '1w ago', badge: 'PINNED' },
]

const RECENT_DISCUSSIONS = [
  { title: 'Rekomendasi anime musim panas 2026?', author: 'RinaChan', replies: 34, time: '2h ago' },
  { title: 'Share hasil fanart terbaru kalian!', author: 'DoodleMaster', replies: 28, time: '4h ago' },
  { title: 'VTuber model design tips & tricks', author: 'VirtualArt', replies: 21, time: '6h ago' },
  { title: 'Diskusi: Manga VS Anime, mana lebih baik?', author: 'StoryWeaver', replies: 17, time: '8h ago' },
  { title: 'Japanese language study group - Week 12', author: 'NihongoNerd', replies: 15, time: '12h ago' },
  { title: 'Cosplay meetup Jakarta Agustus 2026', author: 'CosplayIndo', replies: 23, time: '5h ago' },
]

const TRENDING_TOPICS = [
  '#SummerAnime2026', '#FanartFriday', '#VTuberDebut', '#StudyJapanese', '#CosplayMeetup', '#MangaRecommendation',
]

const ACTIVE_MEMBERS = ['RN', 'DM', 'VA', 'SW', 'NN', 'CI', 'RK', 'AB', 'MS', 'TW', 'YK', 'ZN']

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <p className="mb-2 text-xs font-bold tracking-widest text-primary uppercase">Community</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Where <span className="text-gradient">Otaku</span> Connect
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Join discussions, share your work, and find your people. Soraku community is where Indonesian anime & pop culture fans gather.
        </p>
      </div>

      {/* Search + Stats bar */}
      <div className="mb-10 grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="flex items-center gap-3 rounded-md border-2 border-white/10 bg-card px-4 py-3 shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 text-sm text-muted-foreground/60">Search discussions, groups, topics...</span>
          <Filter className="h-4 w-4 shrink-0 text-muted-foreground/40" />
        </div>
        <div className="flex items-center gap-4 rounded-md border-2 border-white/10 bg-card px-6 py-3 shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
          <div className="text-center">
            <p className="text-lg font-black text-foreground">6.4k</p>
            <p className="text-[10px] text-muted-foreground/60">Members</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-lg font-black text-foreground">31k</p>
            <p className="text-[10px] text-muted-foreground/60">Posts</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-lg font-black text-foreground">12</p>
            <p className="text-[10px] text-muted-foreground/60">Groups</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-lg font-black text-foreground">200+</p>
            <p className="text-[10px] text-muted-foreground/60">Online Now</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Main feed */}
        <div className="space-y-8">
          {/* Pinned Announcements */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Pin className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-black text-foreground">Pinned Announcements</h2>
            </div>
            <div className="space-y-2">
              {PINNED_ANNOUNCEMENTS.map((a, i) => (
                <div
                  key={i}
                  className="rounded-md border-2 border-white/[0.07] bg-card px-5 py-4 shadow-[4px_4px_0px_rgba(37,99,235,0.12)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_rgba(37,99,235,0.2)]"
                >
                  <div className="flex items-start gap-3">
                    <Pin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-foreground">{a.title}</h3>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground/60">
                        <Bell className="h-3 w-3" />
                        {a.author} &middot; {a.time}
                      </p>
                    </div>
                    <span className="rounded-sm border-2 border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {a.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Groups */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-foreground">Featured Groups</h2>
              <button className="flex items-center gap-1 text-xs font-semibold text-primary">
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {FEATURED_GROUPS.map((g) => (
                <div
                  key={g.name}
                  className={`rounded-md border-2 ${g.color} bg-card p-4 shadow-[4px_4px_0px_rgba(37,99,235,0.12)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_rgba(37,99,235,0.2)]`}
                >
                  <div className={`mb-3 inline-flex rounded-sm p-2 ${g.bg}`}>
                    <Users className={`h-4 w-4 ${g.iconColor}`} />
                  </div>
                  <h3 className="mb-1 text-sm font-bold text-foreground">{g.name}</h3>
                  <p className="text-xs text-muted-foreground/60">{g.members} members</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {g.status}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Discussions */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-foreground">Recent Discussions</h2>
              <button className="flex items-center gap-1 text-xs font-semibold text-primary">
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-2">
              {RECENT_DISCUSSIONS.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 rounded-md border-2 border-white/[0.07] bg-card px-5 py-4 shadow-[4px_4px_0px_rgba(37,99,235,0.12)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_rgba(37,99,235,0.2)]"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-foreground">{d.title}</h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground/60">
                      <Users className="h-3 w-3 shrink-0" />
                      {d.author}
                      <span className="mx-0.5">&middot;</span>
                      <Clock className="h-3 w-3 shrink-0" />
                      {d.time}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground/60">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {d.replies}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Trending Topics */}
          <div className="rounded-md border-2 border-white/[0.07] bg-card p-5 shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-foreground">
              <TrendingUp className="h-4 w-4 text-primary" /> Trending Topics
            </h3>
            <div className="space-y-2.5">
              {TRENDING_TOPICS.map((tag) => (
                <div
                  key={tag}
                  className="flex cursor-pointer items-center gap-2 rounded-sm border-2 border-white/10 px-2.5 py-1 text-xs font-semibold text-muted-foreground/70 transition-colors hover:text-primary"
                >
                  <Hash className="h-3 w-3 shrink-0 text-primary/60" />
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Active Members */}
          <div className="rounded-md border-2 border-white/[0.07] bg-card p-5 shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-foreground">
              <Heart className="h-4 w-4 text-primary" /> Active Members
            </h3>
            <div className="mb-4 grid grid-cols-6 gap-2">
              {ACTIVE_MEMBERS.map((initials, i) => (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary"
                >
                  {initials}
                </div>
              ))}
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-[2px_2px_0px_rgba(37,99,235,0.3)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]">
              Join 200+ members online <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Create Post CTA */}
          <div className="rounded-md border-2 border-indigo-500/20 bg-indigo-500/5 p-5 shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
            <div className="mb-3 inline-flex rounded-sm bg-indigo-500/20 p-2">
              <Plus className="h-5 w-5 text-indigo-400" />
            </div>
            <h3 className="mb-2 text-sm font-black text-foreground">Create a Post</h3>
            <p className="mb-4 text-xs text-muted-foreground">
              Share your thoughts, art, or questions with the community.
            </p>
            <a
              href="https://discord.gg/qm3XJvRa6B"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-[2px_2px_0px_rgba(99,102,241,0.3)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]"
            >
              Join Discord <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
