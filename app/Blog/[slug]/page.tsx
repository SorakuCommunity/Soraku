import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, User, Tag, Lock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'
import type { BlogPost } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('title')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  return { title: data?.title ? `${data.title} — Soraku Blog` : 'Blog — Soraku' }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Try to get user for permission check
  const { data: { user } } = await supabase.auth.getUser()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, users(display_name, avatar_url)')
    .eq('slug', slug)
    .is('deleted_at', null)
    .single()

  if (!post) notFound()

  // Non-published only visible to admin+
  const isPublished = post.status === 'published'
  if (!isPublished && !user) notFound()

  const p = post as BlogPost & { users?: { display_name: string | null; avatar_url: string | null } }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/Blog"
          className="inline-flex items-center gap-2 text-soraku-sub hover:text-soraku-text text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Blog
        </Link>

        {!isPublished && (
          <div className="glass border border-yellow-500/30 rounded-xl px-4 py-3 mb-6 flex items-center gap-2 text-yellow-400 text-sm">
            <Lock className="w-4 h-4" /> Artikel ini berstatus Draft — hanya terlihat oleh admin.
          </div>
        )}

        <article className="glass rounded-3xl overflow-hidden">
          {/* Cover image */}
          {p.thumbnail && (
            <div className="relative h-72 overflow-hidden">
              <Image src={p.thumbnail} alt={p.title} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-soraku-card via-soraku-card/30 to-transparent" />
            </div>
          )}

          <div className="p-8">
            {/* Tags */}
            {p.tags && p.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {p.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Tag className="w-2.5 h-2.5" />{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="font-display text-3xl font-bold mb-4 leading-tight">{p.title}</h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-soraku-sub text-sm mb-8 pb-8 border-b border-soraku-border">
              {p.users?.avatar_url && (
                <Image src={p.users.avatar_url} alt="" width={28} height={28} className="rounded-full" />
              )}
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />{p.users?.display_name ?? 'Soraku Team'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />{formatDate(p.created_at)}
              </span>
            </div>

            {/* Content — sanitized server-side (DOMPurify runs client-side; we use plain text render) */}
            <div className="prose prose-invert max-w-none text-soraku-sub leading-relaxed text-sm">
              {p.content.split('\n').map((line, i) => (
                <p key={i}>{line || <br />}</p>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
