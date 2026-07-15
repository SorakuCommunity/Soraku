import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, Eye, Clock } from 'lucide-react'
import { db } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import BlogDetailClient from './BlogDetailClient'
import { BlogTracker } from './BlogTracker'

export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const { data } = await (await db())
      .from('posts')
      .select('title,excerpt,coverurl')
      .eq('slug', slug)
      .eq('ispublished', true)
      .single()
    if (!data) return { title: 'Artikel tidak ditemukan' }
    const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.soraku.id'
    return {
      title: `${data.title} | Soraku Blog`,
      description: data.excerpt ?? undefined,
      alternates: { canonical: `${BASE}/blog/${slug}` },
      robots: { index: true, follow: true },
      openGraph: { images: data.coverurl ? [data.coverurl] : undefined },
    }
  } catch {
    return { title: 'Soraku Blog' }
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params

  let post: any = null
  try {
    const { data } = await (await db())
      .from('posts')
      .select('id,slug,title,excerpt,content,tags,publishedat,coverurl,authorid,viewcount,likecount')
      .eq('slug', slug)
      .eq('ispublished', true)
      .single()
    post = data
  } catch {
    notFound()
  }

  if (!post) notFound()

  let author: any = null
  try {
    if (post.authorid) {
      const { data } = await (await db())
        .from('users')
        .select('username,displayname,avatarurl')
        .eq('id', post.authorid)
        .single()
      author = data
    }
  } catch {}

  let related: any[] = []
  try {
    const { data: relatedRaw } = await (await db())
      .from('posts')
      .select('id,slug,title,excerpt,coverurl,tags,publishedat,viewcount,likecount')
      .eq('ispublished', true)
      .neq('id', post.id)
      .order('publishedat', { ascending: false })
      .limit(3)
    related = relatedRaw ?? []
  } catch {}

  const authorName = author?.displayname ?? author?.username ?? 'Soraku Team'
  const readMins = Math.max(1, Math.ceil((post.content ?? '').split(' ').length / 200))
  const tags = Array.isArray(post.tags) ? post.tags : []

  const BASE_JSON = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.soraku.id'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt ?? undefined,
        image: post.coverurl ?? undefined,
        datePublished: post.publishedat,
        author: { '@type': 'Person', name: authorName },
        publisher: {
          '@type': 'Organization',
          name: 'Soraku',
          logo: { '@type': 'ImageObject', url: `${BASE_JSON}/og.png` },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Blog', item: `${BASE_JSON}/blog` },
          { '@type': 'ListItem', position: 2, name: post.title },
        ],
      },
    ],
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Script
        id="schema-blog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Blog
      </Link>

      {/* Cover */}
      <div className="relative mb-6 h-52 overflow-hidden rounded-lg border border-border bg-gradient-to-br from-primary/20 to-violet-500/15 shadow-sm sm:h-72">
        {post.coverurl ? (
          <Image
            src={post.coverurl}
            alt={post.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-16 w-16 text-primary/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        <div className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-[10px] font-bold text-foreground shadow-sm">
          <Eye className="h-3 w-3" />
          <span>{(post.viewcount ?? 0).toLocaleString()} views</span>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-[10px] font-bold text-foreground shadow-sm">
          <Clock className="h-3 w-3" />
          {readMins} min baca
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl leading-tight font-black tracking-tighter text-foreground sm:text-4xl">{post.title}</h1>

      {/* Author + date */}
      <div className="mt-4 flex items-center gap-3 border-b border-border pb-5">
        {author?.avatarurl ? (
          <Image
            src={author.avatarurl}
            alt={authorName}
            width={36}
            height={36}
            className="rounded-lg border border-border"
            unoptimized
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-primary/20 text-sm font-black text-primary shadow-sm">
            {authorName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-foreground">{authorName}</p>
          <p className="text-xs text-muted-foreground">
            {post.publishedat ? formatDate(post.publishedat) : ''} · {readMins} min baca
          </p>
        </div>
      </div>

      <BlogTracker id={post.id} title={post.title} />
      <BlogDetailClient
        slug={post.slug}
        content={post.content ?? ''}
        likecount={post.likecount ?? 0}
        siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soraku.vercel.app'}
        title={post.title}
        tags={tags}
        related={related}
      />
    </div>
  )
}
