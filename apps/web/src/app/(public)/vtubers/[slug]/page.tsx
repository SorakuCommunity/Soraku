import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Play } from 'lucide-react'
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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/vtubers"
        className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke VTubers
      </Link>

      <div className="overflow-hidden rounded-md border-2 border-black bg-surface shadow-[4px_4px_0px_#000]">
        {vt.coverurl && (
          <div className="relative h-48 w-full sm:h-64">
            <Image src={vt.coverurl} alt={vt.name} fill className="object-cover" sizes="900px" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-6">
            {vt.avatarurl && (
              <div className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 border-black bg-surface shadow-[2px_2px_0px_#000] ${vt.coverurl ? '-mt-14' : ''}`}>
                <Image
                  src={vt.avatarurl}
                  alt={vt.charactername ?? vt.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black tracking-tighter text-foreground">
                {vt.charactername ?? vt.name}
              </h1>
              {vt.charactername && <p className="text-sm text-muted">CV: {vt.name}</p>}
              {vt.debutdate && (
                <p className="mt-1 text-xs text-muted">Debut: {formatDate(vt.debutdate)}</p>
              )}
              {vt.subscribercount && (
                <p className="mt-1 text-xs font-bold text-primary">
                  {vt.subscribercount.toLocaleString('id-ID')} subscriber
                </p>
              )}
            </div>
          </div>

          {vt.description && (
            <p className="mt-6 text-sm leading-relaxed text-muted">{vt.description}</p>
          )}

          {vt.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {vt.tags.map((t: string) => (
                <span key={t} className="rounded-sm border border-black/30 bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                  {t}
                </span>
              ))}
            </div>
          )}

          {vt.islive && vt.liveurl && (
            <a
              href={vt.liveurl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-md border-2 border-black bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000]"
            >
              <Play className="h-4 w-4 fill-white" /> Sedang Live — Tonton Sekarang
            </a>
          )}

          {Object.keys(socials).length > 0 && (
            <div className="mt-6 flex items-center gap-3">
              {socials.youtube && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-black bg-surface text-muted shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:text-red-500 hover:shadow-[1px_1px_0px_#000]"
                >
                  <YouTubeIcon className="h-4 w-4" />
                </a>
              )}
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-black bg-surface text-muted shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:text-sky-400 hover:shadow-[1px_1px_0px_#000]"
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
