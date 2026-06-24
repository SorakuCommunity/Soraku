import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, Eye, Clock } from 'lucide-react'
import { db } from '@/lib/supabase/server'
import { formatRelativeTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.soraku.id'

type Props = { params: Promise<{ slug: string }> }

type CategoryPost = {
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)
  return {
    title: `${categoryName} | Blog Soraku`,
    description: `Artikel dan review tentang ${slug} dari Soraku.`,
    alternates: { canonical: `${BASE}/blog/category/${slug}` },
  }
}

function PostCard({ post }: { post: CategoryPost }) {
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

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  const { data: posts, error } = await (await db())
    .from('posts')
    .select('id,slug,title,excerpt,coverurl,tags,publishedat,viewcount,likecount,authorid')
    .eq('ispublished', true)
    .contains('tags', [slug])
    .order('publishedat', { ascending: false })
    .limit(50)

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Blog
        </Link>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-sm text-muted">Gagal memuat artikel.</p>
        </div>
      </div>
    )
  }

  const authorIds = [...new Set((posts ?? []).map((p) => p.authorid).filter(Boolean))]

  const { data: authors } = authorIds.length > 0
    ? await (await db()).from('users').select('id,username,displayname,avatarurl').in('id', authorIds)
    : { data: [] }

  const authorMap = new Map((authors ?? []).map((a) => [a.id, a]))

  const items: CategoryPost[] = (posts ?? []).map((p) => ({
    ...p,
    author: p.authorid ? (authorMap.get(p.authorid) ?? null) : null,
  }))

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Blog
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter text-foreground sm:text-4xl">
          Kategori: <span className="text-primary">{categoryName}</span>
        </h1>
        <p className="mt-2 text-sm text-muted">
          Artikel dengan tag {slug}.
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <BookOpen className="mb-4 h-16 w-16 text-muted" />
          <p className="text-sm text-muted">Belum ada artikel dalam kategori ini.</p>
        </div>
      )}
    </div>
  )
}
