'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Heart,
  MessageCircle,
  Eye,
  Bookmark,
  Share2,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  Filter,
  Grid3X3,
  List,
} from 'lucide-react'

const TAGS = [
  'All',
  'Web Dev',
  'Mobile',
  'AI/ML',
  'Design',
  'Creative',
  'Tools',
  'Games',
  'Music',
  'Open Source',
]

const TAG_BORDER: Record<string, string> = {
  'Web Dev': 'border-blue-500',
  Mobile: 'border-emerald-500',
  'AI/ML': 'border-purple-500',
  Design: 'border-pink-500',
  Creative: 'border-orange-500',
  Tools: 'border-cyan-500',
  Games: 'border-rose-500',
  Music: 'border-amber-500',
  'Open Source': 'border-indigo-500',
}

const TAG_GRADIENT: Record<string, string> = {
  'Web Dev': 'from-blue-600 to-blue-950',
  Mobile: 'from-emerald-600 to-emerald-950',
  'AI/ML': 'from-purple-600 to-purple-950',
  Design: 'from-pink-600 to-pink-950',
  Creative: 'from-orange-600 to-orange-950',
  Tools: 'from-cyan-600 to-cyan-950',
  Games: 'from-rose-600 to-rose-950',
  Music: 'from-amber-600 to-amber-950',
  'Open Source': 'from-indigo-600 to-indigo-950',
}

interface Project {
  title: string
  author: string
  description: string
  likes: number
  comments: number
  views: string
  saves: number
  tag: string
}

const PROJECTS: Project[] = [
  {
    title: 'AniChat - Discord Bot for Anime Fans',
    author: 'Rizky Pratama',
    description:
      'Anime-themed Discord bot with character lookup, quote generator, and trivia games for server communities.',
    likes: 142,
    comments: 28,
    views: '2.4k',
    saves: 67,
    tag: 'AI/ML',
  },
  {
    title: 'Wayang Kulit Digital Archive',
    author: 'Dewi Saraswati',
    description:
      'Preserving Indonesian shadow puppetry through high-res scans, interactive stories, and educational content.',
    likes: 215,
    comments: 42,
    views: '5.2k',
    saves: 134,
    tag: 'Creative',
  },
  {
    title: 'KopiTracker - Coffee Shop Finder',
    author: 'Adi Nugroho',
    description:
      'Discover hidden gem coffee shops across Java with crowd-sourced reviews, maps, and brew guides.',
    likes: 98,
    comments: 15,
    views: '1.8k',
    saves: 89,
    tag: 'Mobile',
  },
  {
    title: 'PixelForge - Pixel Art Studio',
    author: 'Juno Kim',
    description:
      'Browser-based pixel art editor with animation layers, palette management, and tilemap export.',
    likes: 176,
    comments: 31,
    views: '3.7k',
    saves: 95,
    tag: 'Tools',
  },
  {
    title: 'Nusantara Sans Typeface',
    author: 'Maya Indah',
    description:
      'A modern open-source font family inspired by traditional Indonesian scripts and calligraphy.',
    likes: 203,
    comments: 38,
    views: '4.1k',
    saves: 156,
    tag: 'Design',
  },
  {
    title: 'SoundScape - Ambient Mixer',
    author: 'Liam Chen',
    description:
      'Generative ambient music tool with nature samples, lo-fi beats, and real-time effect chains.',
    likes: 131,
    comments: 22,
    views: '2.9k',
    saves: 78,
    tag: 'Music',
  },
  {
    title: 'QuestBoard - RPG Campaign Manager',
    author: 'Sari Wulandari',
    description:
      'Collaborative campaign tracking tool for tabletop RPG groups with maps, NPCs, and quest logs.',
    likes: 87,
    comments: 19,
    views: '1.5k',
    saves: 62,
    tag: 'Games',
  },
  {
    title: 'DevKit CLI',
    author: 'Alex Rivera',
    description:
      'Opinionated project scaffolding CLI with built-in linting, testing, and deployment configuration.',
    likes: 64,
    comments: 11,
    views: '1.1k',
    saves: 43,
    tag: 'Tools',
  },
  {
    title: 'Batik Pattern Explorer',
    author: 'Ratna Sari',
    description:
      'Interactive explorer of Indonesian batik patterns with cultural history, meanings, and color palettes.',
    likes: 189,
    comments: 35,
    views: '4.5k',
    saves: 142,
    tag: 'Design',
  },
  {
    title: 'ChatFlow - Messenger App',
    author: 'Dimas Prayoga',
    description:
      'Real-time chat application with end-to-end encryption, file sharing, and custom emoji reactions.',
    likes: 112,
    comments: 24,
    views: '2.1k',
    saves: 71,
    tag: 'Web Dev',
  },
  {
    title: 'NeuralSnap - AI Enhancer',
    author: 'Yuki Tanaka',
    description:
      'On-device AI image upscaling and restoration for vintage photographs and low-res artwork.',
    likes: 157,
    comments: 33,
    views: '3.4k',
    saves: 108,
    tag: 'AI/ML',
  },
  {
    title: 'RhythmRush',
    author: 'Bagas Firmansyah',
    description:
      'Fast-paced rhythm game with electronic soundtrack, custom beatmap editor, and online leaderboards.',
    likes: 234,
    comments: 47,
    views: '6.8k',
    saves: 188,
    tag: 'Games',
  },
]

export default function ShowcasePage() {
  const [activeTag, setActiveTag] = useState('All')
  const [activeTab, setActiveTab] = useState('Trending')
  const [liked, setLiked] = useState<Record<number, boolean>>({})
  const [saved, setSaved] = useState<Record<number, boolean>>({})

  const toggleLike = (i: number) => {
    setLiked((prev) => ({ ...prev, [i]: !prev[i] }))
  }

  const toggleSave = (i: number) => {
    setSaved((prev) => ({ ...prev, [i]: !prev[i] }))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold tracking-widest text-primary/70 uppercase">
          Showcase
        </p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Built by the <span className="text-gradient">Community</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Discover innovative projects created by our community members. From
          web apps to game mods, explore what people are building.
        </p>
      </div>

      {/* Tabs & View Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('Trending')}
            className={`rounded-md border-2 px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'Trending'
                ? 'border-primary bg-primary text-primary-foreground shadow-[2px_2px_0px_rgba(37,99,235,0.3)]'
                : 'border-white/10 text-muted-foreground hover:border-primary/40 hover:text-primary'
            }`}
          >
            <TrendingUp className="mr-1.5 inline h-3.5 w-3.5" />
            Trending
          </button>
          <button
            onClick={() => setActiveTab('Latest')}
            className={`rounded-md border-2 px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'Latest'
                ? 'border-primary bg-primary text-primary-foreground shadow-[2px_2px_0px_rgba(37,99,235,0.3)]'
                : 'border-white/10 text-muted-foreground hover:border-primary/40 hover:text-primary'
            }`}
          >
            <Clock className="mr-1.5 inline h-3.5 w-3.5" />
            Latest
          </button>
        </div>
        <div className="hidden items-center gap-1 sm:flex">
          <button className="rounded-md border-2 border-primary bg-primary p-1.5 text-primary-foreground">
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button className="rounded-md border-2 border-white/10 p-1.5 text-muted-foreground hover:border-primary/40 hover:text-primary">
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-8 flex items-center gap-3">
        <Filter className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
        <div className="scrollbar-hide flex gap-2 overflow-x-auto">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`rounded-sm border-2 px-2.5 py-1 text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                tag === activeTag
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-white/10 text-muted-foreground hover:border-primary/40 hover:text-primary'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p, i) => (
          <div
            key={i}
            className="group rounded-md border-2 border-white/[0.07] bg-card shadow-[4px_4px_0px_rgba(37,99,235,0.12)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_rgba(37,99,235,0.2)]"
          >
            {/* Thumbnail */}
            <div
              className={`relative flex h-36 items-center justify-center rounded-t-md bg-gradient-to-br ${TAG_GRADIENT[p.tag] ?? 'from-primary/20 to-primary/5'}`}
            >
              <Layers className="h-10 w-10 text-white/30" />
              <span
                className={`absolute top-3 left-3 rounded-sm border-2 bg-card px-2.5 py-1 text-xs font-bold ${TAG_BORDER[p.tag] ?? 'border-white/20'} text-foreground`}
              >
                {p.tag}
              </span>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="mb-0.5 text-base font-black text-foreground transition-colors group-hover:text-primary">
                {p.title}
              </h3>
              <p className="mb-2 text-xs text-muted-foreground/60">
                by {p.author}
              </p>
              <p className="mb-4 line-clamp-2 text-xs text-muted-foreground">
                {p.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground/50">
                <button
                  onClick={() => toggleLike(i)}
                  className="flex cursor-pointer items-center gap-1 transition-colors hover:text-red-400"
                >
                  <Heart
                    className={`h-3.5 w-3.5 ${liked[i] ? 'fill-red-500 text-red-500' : ''}`}
                  />
                  {p.likes + (liked[i] ? 1 : 0)}
                </button>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" /> {p.comments}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> {p.views}
                </span>
                <button
                  onClick={() => toggleSave(i)}
                  className="ml-auto flex cursor-pointer items-center gap-1 transition-colors hover:text-primary"
                >
                  <Bookmark
                    className={`h-3.5 w-3.5 ${saved[i] ? 'fill-primary text-primary' : ''}`}
                  />
                  {p.saves + (saved[i] ? 1 : 0)}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-md border-2 border-primary/20 bg-primary/5 p-8 text-center shadow-[4px_4px_0px_rgba(37,99,235,0.15)]">
        <Layers className="mx-auto mb-3 h-8 w-8 text-primary" />
        <h2 className="mb-2 text-xl font-black text-foreground">
          Showcase Your Work
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Share your projects, get feedback, and inspire the community. Every
          project starts with a single commit.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-[3px_3px_0px_rgba(37,99,235,0.3)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]"
        >
          Submit Project <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
