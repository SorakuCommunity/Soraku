import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Eye, Heart, Clock, Sparkles } from 'lucide-react'
import { db } from '@/lib/supabase/server'
import { formatRelativeTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.soraku.id'

export const metadata: Metadata = {
  title: 'Blog | Soraku',
  description: 'Artikel, review, dan ulasan anime & budaya Jepang dari Soraku.',
  alternates: { canonical: `${BASE}/blog` },
  openGraph: {
    title: 'Blog | Soraku',
    description: 'Artikel, review, dan ulasan anime & budaya Jepang dari Soraku.',
    url: `${BASE}/blog`,
    siteName: 'Soraku',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Soraku Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Soraku',
    description: 'Artikel, review, dan ulasan anime & budaya Jepang dari Soraku.',
    images: ['/og.png'],
  },
}

const ALL_TAGS = [
  'Semua', 'anime', 'manga', 'cosplay', 'review',
  'list', 'panduan', 'event', 'musik', 'vtuber', 'gaming',
]

type PostItem = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  coverurl: string | null
  tags: string[]
  publishedat: string
  viewcount: number
  likecount: number
  author: { username: string | null; displayname: string | null; avatarurl: string | null } | null
}

function readingTime(excerpt: string | null) {
  const words = (excerpt ?? '').split(' ').length
  return Math.max(1, Math.ceil(words / 200))
}

function PostCard({ post, featured }: { post: PostItem; featured?: boolean }) {
  const author = post.author
  const name = author?.displayname ?? author?.username ?? 'Soraku'

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group col-span-3 flex flex-col overflow-hidden rounded-md border-2 border-black bg-surface shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] sm:col-span-4 sm:flex-row lg:col-span-3"
      >
        <div className="relative h-48 flex-shrink-0 overflow-hidden bg-gradient-to-br from-primary/20 to-violet-500/15 sm:h-auto sm:w-72 lg:w-96">
          {post.coverurl ? (
            <Image
              src={post.coverurl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="400px"
            />
          ) : null}
        </div>
        <div className="flex flex-1 flex-col justify-center p-5">
          <div className="flex flex-wrap gap-2">
            {post.tags?.slice(0, 2).map((t) => (
              <span key={t} className="rounded-sm border border-black/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                {t}
              </span>
            ))}
          </div>
          <h2 className="mt-3 text-lg font-black leading-tight text-foreground group-hover:text-primary">
            {post.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-4 text-[10px] text-muted">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(post.publishedat)}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {readingTime(post.excerpt)} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {post.viewcount}
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-md border-2 border-black bg-surface shadow-[3px_3px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000]"
    >
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/20 to-violet-500/15">
        {post.coverurl ? (
          <Image
            src={post.coverurl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="400px"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-1">
          {post.tags?.slice(0, 2).map((t) => (
            <span key={t} className="rounded-sm border border-black/30 bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
              {t}
            </span>
          ))}
        </div>
        <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-tight text-foreground group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[10px] text-muted">{post.excerpt}</p>
        <div className="mt-auto flex items-center gap-3 pt-3 text-[9px] text-muted">
          <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{formatRelativeTime(post.publishedat)}</span>
          <span className="flex items-center gap-1"><Eye className="h-2.5 w-2.5" />{post.viewcount}</span>
        </div>
      </div>
    </Link>
  )
}

export default async function BlogPage() {
  const { data: posts } = await (await db())
    .from('blog')
    .select('id,slug,title,excerpt,coverurl,tags,publishedat,viewcount,likecount,author:profiles!userid(username,displayname,avatarurl)')
    .eq('ispublished', true)
    .order('publishedat', { ascending: false })
    .limit(50)

  const items = (posts ?? []) as unknown as PostItem[]
  const featured = items[0]
  const rest = items.slice(1)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-md border-2 border-black bg-primary px-3 py-1.5 text-[10px] font-bold text-white shadow-[2px_2px_0px_#000]">
          <Sparkles className="h-3 w-3" />
          Blog
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tighter text-foreground sm:text-5xl">
          Artikel & <span className="text-primary">Review</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted">
          Artikel, review, dan ulasan anime & budaya Jepang dari Soraku.
        </p>
      </div>

      {featured && <PostCard post={featured} featured />}

      {rest.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <BookOpen className="mb-4 h-16 w-16 text-muted" />
          <p className="text-sm text-muted">Belum ada artikel.</p>
        </div>
      )}
    </div>
  )
}
