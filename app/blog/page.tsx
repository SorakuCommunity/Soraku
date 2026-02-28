export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Blog – Soraku' }

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image, created_at, author_id, users!inner(username, avatar_url)')
    .eq('published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>Blog</h1>
        <p className="text-sm" style={{ color: 'var(--text-sub)' }}>Artikel, review anime, dan berita komunitas terbaru.</p>
      </div>

      {!posts?.length ? (
        <div className="text-center py-24">
          <BookOpen size={40} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--text-sub)' }} />
          <p style={{ color: 'var(--text-sub)' }}>Belum ada artikel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {posts.map((post) => {
            const author = Array.isArray(post.users) ? post.users[0] : post.users
            return (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className="group rounded-xl overflow-hidden border transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                {post.cover_image && (
                  <div className="aspect-video overflow-hidden">
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                )}
                <div className="p-3 sm:p-4">
                  <h2 className="font-semibold text-xs sm:text-sm mb-1 line-clamp-2" style={{ color: 'var(--text)' }}>{post.title}</h2>
                  {post.excerpt && (
                    <p className="text-xs line-clamp-2 mb-2" style={{ color: 'var(--text-sub)' }}>{post.excerpt}</p>
                  )}
                  {author && (
                    <div className="flex items-center gap-1.5">
                      {(author as { avatar_url?: string }).avatar_url && (
                        <img src={(author as { avatar_url: string }).avatar_url} className="w-4 h-4 rounded-full" alt="" />
                      )}
                      <span className="text-xs" style={{ color: 'var(--text-sub)' }}>
                        {(author as { username?: string }).username}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
