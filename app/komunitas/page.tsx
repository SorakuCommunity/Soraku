import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getGitHubDiscussions } from '@/lib/github'
import { MessageCircle, Radio, Calendar, Mic2, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Komunitas – Soraku' }
export const revalidate = 600 // 10 minutes

export default async function KomunitasPage() {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from('events')
    .select('id, title, cover_url, description, start_date, type, slug')
    .in('status', ['active', 'upcoming'])
    .order('start_date', { ascending: true })
    .limit(9)

  let discussions: unknown[] = []
  try {
    discussions = await getGitHubDiscussions('SorakuCommunity', 'Soraku', 10)
  } catch {}

  const features = [
    { icon: <MessageCircle size={20} />, title: 'Diskusi Anime', desc: 'Bahas episode terbaru, rekomendasi, dan teori seru bersama ribuan anggota.' },
    { icon: <Radio size={20} />,        title: 'Discord Chat',  desc: 'Server Discord aktif 24/7 dengan berbagai channel topik spesifik.' },
    { icon: <Mic2 size={20} />,         title: 'Voice Channel', desc: 'Nonton bareng, ngobrol santai, dan karaoke online kapan saja.' },
    { icon: <Calendar size={20} />,     title: 'Event',         desc: 'Event online dan offline reguler — cosplay, quiz, dan banyak lagi.' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text)' }}>Komunitas Soraku</h1>
        <p className="max-w-xl mx-auto text-sm" style={{ color: 'var(--text-sub)' }}>
          Bergabunglah bersama ribuan penggemar Anime dan Manga Indonesia.
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-16">
        {features.map(f => (
          <div key={f.title} className="p-4 sm:p-6 rounded-xl border"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--color-primary)' }}>
              {f.icon}
            </div>
            <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>{f.title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)' }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Discord CTA */}
      <div className="mb-16 p-6 sm:p-8 rounded-2xl text-center border"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--glass-border)' }}>
        <div className="text-3xl mb-3">💬</div>
        <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>Gabung Discord Kami</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-sub)' }}>Server aktif dengan 1000+ member dari seluruh Indonesia.</p>
        <a href="https://discord.gg/CJJ7KEJMbg" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm min-h-[44px] hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#5865F2', color: '#fff' }}>
          Bergabung ke Discord
        </a>
      </div>

      {/* Events */}
      {events && events.length > 0 && (
        <div className="mb-16">
          <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>Event Mendatang</h2>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {events.map(e => (
              <div key={e.id} className="rounded-xl border overflow-hidden"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                {e.cover_url && (
                  <div className="aspect-video overflow-hidden">
                    <img src={e.cover_url} alt={e.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-3">
                  <h3 className="font-semibold text-xs mb-1 truncate" style={{ color: 'var(--text)' }}>{e.title}</h3>
                  {e.start_date && (
                    <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                      {new Date(e.start_date).toLocaleDateString('id-ID')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GitHub Discussions */}
      {(discussions as {id:string;title:string;url:string;author:{login:string}}[]).length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>Diskusi GitHub</h2>
          <div className="space-y-3">
            {(discussions as {id:string;title:string;url:string;author:{login:string};upvoteCount:number;comments:{totalCount:number}}[]).map(d => (
              <a key={d.id} href={d.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl border transition-all hover:bg-[var(--hover-bg)]"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: 'var(--text)' }}>{d.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-sub)' }}>oleh {d.author?.login}</p>
                </div>
                <ExternalLink size={14} className="flex-shrink-0 ml-3" style={{ color: 'var(--text-sub)' }} />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
