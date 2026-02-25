import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { fetchAnimeLofiTracks } from '@/lib/spotify'
import { MusicPlayer } from '@/components/MusicPlayer'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'
import type { BlogPost } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('blog_posts')
    .select('*, users(display_name, avatar_url, username)')
    .eq('slug', slug)
    .eq('status', 'published')
    .is('deleted_at', null)
    .single()

  if (!data) notFound()

  const post = data as BlogPost
  const tracks = await fetchAnimeLofiTracks()

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/Blog"
          className="inline-flex items-center gap-2 text-soraku-sub hover:text-pink-400 transition-colors text-sm mb-8">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Blog
        </Link>

        {/* ── Spotify Player (single row, top of content) ── */}
        {tracks.length > 0 && (
          <div className="glass rounded-2xl p-3 mb-8 border border-soraku-border">
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                {tracks[0]?.album?.images?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tracks[0].album.images[0].url}
                    alt={tracks[0].name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-soraku-sub mb-0.5">🎵 Musik untuk baca artikel</p>
                <p className="text-sm font-medium line-clamp-1">{tracks[0]?.name}</p>
                <p className="text-xs text-soraku-sub line-clamp-1">{tracks[0]?.artists?.map(a => a.name).join(', ')}</p>
              </div>
              <div className="shrink-0 w-48">
                <MusicPlayer tracks={tracks.slice(0, 5)} compact />
              </div>
            </div>
          </div>
        )}

        {/* ── Article header ── */}
        <article>
          {post.thumbnail && (
            <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden mb-8">
              <Image src={post.thumbnail} alt={post.title} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-soraku-dark/60 to-transparent" />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 text-xs text-pink-400 bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-full">
                <Tag className="w-3 h-3" />{tag}
              </span>
            ))}
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold mb-5 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-soraku-sub mb-8 pb-8 border-b border-soraku-border flex-wrap">
            <span className="flex items-center gap-2">
              {post.users?.avatar_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.users.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
              )}
              <User className="w-4 h-4" />
              {post.users?.display_name ?? 'Soraku Team'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.created_at)}
            </span>
          </div>

          {/* ── Content ── */}
          <div className="prose-custom">
            {post.content.split('\n\n').map((para, i) => (
              <p key={i} className="text-soraku-sub leading-relaxed text-base mb-5">
                {para}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  )
}
