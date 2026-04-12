import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import { YouTubeIcon, XIcon } from '@/components/icons/custom-icons'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data } = await (await db())
    .from('vtubers')
    .select('name,charactername,description')
    .eq('slug', slug)
    .eq('ispublished', true)
    .single()
  if (!data) return { title: 'VTuber Not Found' }
  return {
    title: `${data.charactername ?? data.name} | Soraku VTubers`,
    description: data.description ?? undefined,
  }
}

export default async function VTuberDetailPage({ params }: Props) {
  const { slug } = await params
  const { data: vt } = await (await db())
    .from('vtubers')
    .select('*')
    .eq('slug', slug)
    .eq('ispublished', true)
    .single()

  if (!vt) notFound()

  const socials = (vt.sociallinks ?? {}) as Record<string, string>

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/vtubers"
        className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke VTubers
      </Link>

      <div className="glass-card overflow-hidden">
        {/* Cover */}
        {vt.coverurl && (
          <div className="relative h-48 w-full sm:h-64">
            <Image src={vt.coverurl} alt={vt.name} fill sizes="100vw" className="object-cover" />
            <div className="from-card/90 absolute inset-0 bg-gradient-to-t to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            {vt.avatarurl && (
              <div
                className={`border-primary/30 relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-2 ${vt.coverurl ? '-mt-14' : ''}`}
              >
                <Image
                  src={vt.avatarurl}
                  alt={vt.charactername ?? vt.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black tracking-tight">{vt.charactername ?? vt.name}</h1>
              {vt.charactername && <p className="text-muted-foreground text-sm">CV: {vt.name}</p>}
              {vt.debutdate && (
                <p className="text-muted-foreground/60 mt-1 text-xs">
                  Debut: {formatDate(vt.debutdate)}
                </p>
              )}
              {vt.subscribercount && (
                <p className="text-primary/80 mt-1 text-xs">
                  {vt.subscribercount.toLocaleString('id-ID')} subscriber
                </p>
              )}
            </div>
          </div>

          {vt.description && (
            <p className="text-muted-foreground mt-6 text-sm leading-relaxed">{vt.description}</p>
          )}

          {/* Tags */}
          {vt.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {vt.tags.map((t: string) => (
                <span key={t} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Live badge */}
          {vt.islive && vt.liveurl && (
            <a
              href={vt.liveurl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-500/15 px-4 py-2.5 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/25"
            >
              🔴 Sedang Live | Tonton Sekarang
            </a>
          )}

          {/* Social links */}
          {Object.keys(socials).length > 0 && (
            <div className="mt-6 flex items-center gap-3">
              {socials.youtube && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border bg-card/50 text-muted-foreground flex h-10 w-10 items-center justify-center rounded-xl border transition-colors hover:border-red-500/40 hover:text-red-400"
                >
                  <YouTubeIcon className="h-4 w-4" />
                </a>
              )}
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-primary flex h-10 w-10 items-center justify-center rounded-xl border transition-colors"
                >
                  <XIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
