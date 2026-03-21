import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Eye, Heart, Clock, Search, X } from 'lucide-react'
import { db } from '@/lib/supabase/server'
import { formatRelativeTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog — Soraku Community',
  description: 'Artikel, review, dan ulasan anime & budaya Jepang dari komunitas Soraku.',
}

const ALL_TAGS = [
  'Semua',
  'anime',
  'manga',
  'cosplay',
  'review',
  'list',
  'panduan',
  'event',
  'musik',
  'vtuber',
  'gaming',
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
        className="group glass-card border-border/50 hover:border-primary/30 col-span-3 flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 sm:col-span-4 sm:flex-row lg:col-span-3"
      >
        {/* Cover */}
        <div className="from-primary/20 via-accent/10 relative h-48 flex-shrink-0 overflow-hidden bg-gradient-to-br to-violet-500/15 sm:h-auto sm:w-72 lg:w-96">
          {post.coverurl ? (
            <Image
              src={post.coverurl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-primary/6 text-7xl font-black select-none">空</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-transparent" />
          <div className="bg-primary absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black text-white shadow-md">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Featured
          </div>
        </div>
        {/* Content */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t: string) => (
              <span
                key={t}
                className="border-primary/25 bg-primary/10 text-primary/80 rounded-full border px-2.5 py-0.5 text-[10px] font-bold capitalize"
              >
                {t}
              </span>
            ))}
          </div>
          <h2 className="group-hover:text-primary line-clamp-3 text-xl leading-snug font-black transition-colors sm:text-2xl">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-muted-foreground/70 mt-2 line-clamp-2 flex-1 text-sm leading-relaxed">
              {post.excerpt}
            </p>
          )}
          <div className="border-border/30 mt-4 flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-2">
              {author?.avatarurl ? (
                <Image
                  src={author.avatarurl}
                  alt={name}
                  width={24}
                  height={24}
                  className="rounded-full"
                  unoptimized
                />
              ) : (
                <div className="bg-primary/20 text-primary flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-muted-foreground/60 text-xs">{name}</span>
            </div>
            <div className="text-muted-foreground/40 flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.viewcount ?? 0}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {post.likecount ?? 0}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readingTime(post.excerpt)} min
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group glass-card border-border/50 hover:border-primary/30 flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1"
    >
      {/* Cover */}
      <div className="from-primary/15 via-accent/8 relative aspect-video w-full overflow-hidden bg-gradient-to-br to-violet-500/10">
        {post.coverurl ? (
          <Image
            src={post.coverurl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="text-primary/20 h-8 w-8" />
          </div>
        )}
        <div className="from-background/40 absolute inset-0 bg-gradient-to-t to-transparent" />
      </div>
      {/* Content */}
      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="group-hover:text-primary line-clamp-2 flex-1 text-sm leading-snug font-bold transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-muted-foreground/60 mt-1.5 line-clamp-2 text-xs leading-relaxed">
            {post.excerpt}
          </p>
        )}
        {/* Author row */}
        <div className="mt-2.5 flex items-center gap-1.5">
          {author?.avatarurl ? (
            <Image
              src={author.avatarurl}
              alt={name}
              width={16}
              height={16}
              className="flex-shrink-0 rounded-full"
              unoptimized
            />
          ) : (
            <div className="bg-primary/20 text-primary flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[8px] font-black">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-muted-foreground/50 truncate text-[10px]">{name}</span>
          <span className="text-muted-foreground/30 ml-auto text-[10px]">
            {formatRelativeTime(post.publishedat)}
          </span>
        </div>
        {/* Stats */}
        <div className="border-border/20 text-muted-foreground/35 mt-2 flex items-center gap-2.5 border-t pt-2 text-[10px]">
          <span className="flex items-center gap-1">
            <Eye className="h-2.5 w-2.5" />
            {post.viewcount ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-2.5 w-2.5" />
            {post.likecount ?? 0}
          </span>
          <span className="ml-auto flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            {readingTime(post.excerpt)} min
          </span>
        </div>
        {/* Hashtags di bawah */}
        {post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((t: string) => (
              <span
                key={t}
                className="bg-muted/30 text-muted-foreground/50 rounded-full px-1.5 py-0.5 text-[9px] capitalize"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ tag?: string; q?: string }>
}) {
  const params = await searchParams
  const activeTag = params?.tag ?? 'Semua'
  const searchQ = params?.q ?? ''
  const query = (await db())
    .from('posts')
    .select('id,slug,title,excerpt,tags,publishedat,coverurl,viewcount,likecount,authorid')
    .eq('ispublished', true)
    .order('publishedat', { ascending: false })

  let filteredQuery = activeTag === 'Semua' ? query : query.contains('tags', [activeTag])
  if (searchQ) filteredQuery = filteredQuery.ilike('title', `%${searchQ}%`)
  const { data: rawPosts } = await filteredQuery

  // Fetch authors
  const authorIds = [...new Set((rawPosts ?? []).filter((p) => p.authorid).map((p) => p.authorid!))]
  let authorsMap: Record<string, any> = {}
  if (authorIds.length > 0) {
    const { data: users } = await (await db())
      .from('users')
      .select('id,username,displayname,avatarurl')
      .in('id', authorIds)
    authorsMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]))
  }

  const posts: PostItem[] = (rawPosts ?? []).map((p) => ({
    ...p,
    viewcount: p.viewcount ?? 0,
    likecount: p.likecount ?? 0,
    author: p.authorid ? (authorsMap[p.authorid] ?? null) : null,
  }))

  const [featured, ...rest] = posts

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-primary/70 mb-2 text-xs font-bold tracking-widest uppercase">
          Komunitas
        </p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Blog <span className="text-gradient">Soraku</span>
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl text-sm">
          Artikel, review anime, tips cosplay, dan cerita dari komunitas Soraku Indonesia.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-4 max-w-sm">
        <Search className="text-muted-foreground/40 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <form action="/blog" method="GET">
          {activeTag !== 'Semua' && <input type="hidden" name="tag" value={activeTag} />}
          <input
            name="q"
            defaultValue={searchQ}
            placeholder="Cari artikel..."
            className="border-border/50 bg-card/30 placeholder:text-muted-foreground/30 focus:border-primary/40 focus:ring-primary/10 w-full rounded-xl border py-2 pr-4 pl-9 text-sm transition-all outline-none focus:ring-2"
          />
        </form>
        {searchQ && (
          <a
            href={activeTag !== 'Semua' ? `/blog?tag=${activeTag}` : '/blog'}
            className="text-muted-foreground/40 hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Tag filters */}
      <div className="mb-8 flex flex-wrap gap-1.5">
        {ALL_TAGS.map((tag) => (
          <Link
            key={tag}
            href={tag === 'Semua' ? '/blog' : `/blog?tag=${tag}`}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-all ${
              activeTag === tag
                ? 'bg-primary shadow-primary/20 text-white shadow-md'
                : 'border-border/50 text-muted-foreground/70 hover:border-primary/40 hover:text-foreground border'
            }`}
          >
            {tag === 'Semua' ? '✨ Semua' : `#${tag}`}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="mb-3 text-4xl">🔍</p>
          <p className="text-muted-foreground">Belum ada artikel dengan tag ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
          {/* Featured — span 3 cols mobile, full width */}
          {featured && <PostCard post={featured} featured />}
          {/* Regular grid — 3 col mobile, 3 col on sm, 6 col on lg (3 per row = 2 articles) */}
          {rest.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
