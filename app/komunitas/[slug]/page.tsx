import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fetchDiscussionByNumber } from '@/lib/github'
import { ArrowLeft, ThumbsUp, MessageSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Props { params: Promise<{ slug: string }> }

export default async function KomunitasDetailPage({ params }: Props) {
  const { slug } = await params
  const num = parseInt(slug)
  if (isNaN(num)) notFound()

  const d = await fetchDiscussionByNumber(num)
  if (!d) notFound()

  const discussion = d as {
    number: number
    title: string
    bodyHTML: string
    createdAt: string
    url: string
    author: { login: string; avatarUrl: string }
    upvoteCount: number
    category: { name: string; emoji: string }
    comments: { nodes: Array<{ id: string; bodyHTML: string; createdAt: string; author: { login: string; avatarUrl: string } }> }
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-2xl mx-auto">
        <Link href="/komunitas" className="inline-flex items-center gap-2 text-sm mb-6 hover:underline"
          style={{ color: 'var(--text-sub)' }}>
          <ArrowLeft size={14} /> Kembali ke Komunitas
        </Link>

        {/* Discussion Header */}
        <article className="p-6 rounded-xl border mb-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-sub)' }}>
              {discussion.category.emoji} {discussion.category.name}
            </span>
          </div>

          <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>
            {discussion.title}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <img src={discussion.author.avatarUrl} alt={discussion.author.login}
              className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                {discussion.author.login}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                {formatDate(discussion.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-1 ml-auto text-xs" style={{ color: 'var(--text-sub)' }}>
              <ThumbsUp size={12} /> {discussion.upvoteCount}
              <MessageSquare size={12} className="ml-2" /> {discussion.comments.nodes.length}
            </div>
          </div>

          <div
            className="prose prose-sm max-w-none"
            style={{ color: 'var(--text)' }}
            dangerouslySetInnerHTML={{ __html: discussion.bodyHTML }}
          />
        </article>

        {/* Comments */}
        {discussion.comments.nodes.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>
              {discussion.comments.nodes.length} Komentar
            </h2>
            {discussion.comments.nodes.map((comment) => (
              <div key={comment.id} className="p-4 rounded-xl border"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <img src={comment.author.avatarUrl} alt={comment.author.login}
                    className="w-6 h-6 rounded-full" />
                  <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                    {comment.author.login}
                  </span>
                  <span className="text-xs ml-auto" style={{ color: 'var(--text-sub)' }}>
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <div
                  className="prose prose-sm max-w-none text-sm"
                  style={{ color: 'var(--text-sub)' }}
                  dangerouslySetInnerHTML={{ __html: comment.bodyHTML }}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <a href={discussion.url} target="_blank" rel="noopener noreferrer"
            className="text-sm hover:underline" style={{ color: 'var(--color-primary)' }}>
            Buka di GitHub untuk ikut berdiskusi →
          </a>
        </div>
      </div>
    </div>
  )
}
