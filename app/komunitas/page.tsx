import { fetchDiscussions } from '@/lib/github'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { MessageSquare, ThumbsUp, Clock } from 'lucide-react'

export const revalidate = 60
export const metadata = { title: 'Komunitas' }

export default async function KomunitasPage() {
  const discussions = await fetchDiscussions()

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold mb-4"><span className="grad-text">Komunitas</span> Soraku</h1>
          <p className="text-soraku-sub">Diskusi, berbagi, dan terhubung dengan sesama penggemar.</p>
        </div>

        {discussions.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <MessageSquare className="w-12 h-12 text-soraku-sub mx-auto mb-4 opacity-40" />
            <p className="text-soraku-sub">Belum ada diskusi. Konfigurasi GitHub token untuk memuat konten.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {discussions.map((d) => (
              <Link key={d.id} href={`/komunitas/${d.number}`}
                className="glass rounded-2xl p-6 block group hover:border-purple-500/50 transition-all">
                <div className="flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.author.avatarUrl} alt={d.author.login} className="w-10 h-10 rounded-full shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-soraku-sub bg-soraku-muted/50 px-2 py-0.5 rounded-full">
                        {d.category.emoji} {d.category.name}
                      </span>
                    </div>
                    <h2 className="font-semibold group-hover:text-purple-400 transition-colors line-clamp-2 mb-2">{d.title}</h2>
                    <p className="text-soraku-sub text-sm line-clamp-2 mb-3">{d.body}</p>
                    <div className="flex items-center gap-4 text-xs text-soraku-sub">
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{d.comments.totalCount}</span>
                      <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{d.upvoteCount}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(d.createdAt)}</span>
                      <span className="text-soraku-sub/70">oleh {d.author.login}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
