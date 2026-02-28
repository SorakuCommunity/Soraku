export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ExternalLink, Twitter, Youtube, Instagram } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('vtubers').select('name, description').eq('slug', slug).single()
  return { title: `${data?.name ?? slug} – VTuber | Soraku`, description: data?.description }
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  twitter: <Twitter size={16} />, youtube: <Youtube size={16} />, instagram: <Instagram size={16} />,
}

export default async function VtuberDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: v } = await supabase
    .from('vtubers')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (!v) notFound()

  const socials = (v.socials as Record<string, string>) ?? {}

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/Vtuber" className="text-sm hover:underline mb-6 inline-block" style={{ color: 'var(--text-sub)' }}>
        ← Kembali ke VTuber
      </Link>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        {/* Cover */}
        {v.cover_url && (
          <div className="h-48 sm:h-64 overflow-hidden">
            <img src={v.cover_url} alt={v.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-6 flex-wrap sm:flex-nowrap">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0"
              style={{ backgroundColor: 'var(--bg-muted)' }}>
              {v.avatar_url ? (
                <img src={v.avatar_url} alt={v.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">🎭</div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>{v.name}</h1>
              {v.agency && (
                <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-primary)' }}>{v.agency}</p>
              )}
              {v.description && (
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-sub)' }}>{v.description}</p>
              )}

              {/* Social links */}
              {Object.keys(socials).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(socials).map(([platform, url]) => (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:bg-[var(--hover-bg)] min-h-[36px]"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-sub)' }}>
                      {SOCIAL_ICONS[platform] ?? <ExternalLink size={12} />}
                      {platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
