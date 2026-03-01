export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { sanitizeHtml } from '@/lib/sanitize'
import { getTrack } from '@/lib/spotify'
import type { Metadata } from 'next'

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('blog_posts').select('title, excerpt').eq('slug', slug).single()
  return { title: data?.title ?? 'Blog', description: data?.excerpt }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, users!inner(username, avatar_url)')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  const safeContent = sanitizeHtml(post.content ?? '')
  const track = post.spotify_id ? await getTrack(post.spotify_id) : null

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      {post.cover_image && (
        <div className="aspect-video rounded-2xl overflow-hidden mb-8">
          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: 'var(--text)' }}>{post.title}</h1>

      {/* Spotify Player */}
      {track && (
        <div className="mb-8 rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <iframe
            src={`https://open.spotify.com/embed/track/${post.spotify_id}?utm_source=generator&theme=0`}
            width="100%" height="80" frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-sm sm:prose max-w-none"
        style={{ color: 'var(--text)' }}
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />
    </article>
  )
}
