import { fetchDiscussionByNumber } from '@/lib/github'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { MessageSquare, ThumbsUp, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export default async function DiscussionPage({ params }: Props) {
  const { slug } = await params
  const num = parseInt(slug, 10)
  if (isNaN(num)) notFound()

  const d = await fetchDiscussionByNumber(num)
  if (!d) notFound()

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/komunitas"
          className="inline-flex items-center gap-2 text-soraku-sub hover:text-soraku-primary mb-8 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Komunitas
        </Link>

        {/* Main discussion */}
        <div className="glass rounded-2xl p-8 mb-6">
          <span className="text-xs bg-soraku-muted/50 px-2 py-1 rounded-full mb-4 inline-block">
            {d.category.emoji} {d.category.name}
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-5">{d.title}</h1>

          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-soraku-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={d.author.avatarUrl}
              alt={d.author.login}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium">{d.author.login}</p>
              <p className="text-xs text-soraku-sub">{formatDate(d.createdAt)}</p>
            </div>
            <div className="ml-auto flex items-center gap-1 text-soraku-sub text-sm">
              <ThumbsUp className="w-4 h-4" />
              {d.upvoteCount}
            </div>
          </div>

          <div className="text-soraku-sub leading-relaxed whitespace-pre-wrap text-sm">
            {d.body}
          </div>
        </div>

        {/* Comments */}
        <h2 className="flex items-center gap-2 font-semibold text-lg mb-4">
          <MessageSquare className="w-5 h-5 text-soraku-primary" />
          {d.comments.totalCount} Komentar
        </h2>

        <div className="space-y-4">
          {d.comments.nodes.map((c) => (
            <div key={c.id} className="glass rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.author.avatarUrl}
                  alt={c.author.login}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{c.author.login}</p>
                  <p className="text-xs text-soraku-sub">{formatDate(c.createdAt)}</p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-soraku-sub text-xs">
                  <ThumbsUp className="w-3 h-3" />
                  {c.upvoteCount}
                </div>
              </div>
              <p className="text-soraku-sub text-sm leading-relaxed whitespace-pre-wrap">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
