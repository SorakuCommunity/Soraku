import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { YouTubeIcon, XIcon } from '@/components/icons/custom-icons'
import { db } from '@/lib/supabase/server'
import { Sparkles, Tv, Play } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'VTubers | Soraku',
  description: 'Virtual YouTuber dari Soraku Indonesia.',
}

export default async function VTuberPage() {
  const { data: vtubers } = await (await db())
    .from('vtubers')
    .select(
      'id,slug,name,charactername,avatarurl,coverurl,description,debutdate,tags,sociallinks,isactive,islive,liveurl,subscribercount'
    )
    .eq('ispublished', true)
    .order('createdat', { ascending: true })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-12 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-md border-2 border-black bg-primary px-3 py-1.5 text-[10px] font-bold text-white shadow-[2px_2px_0px_#000]">
          <Sparkles className="h-3 w-3" />
          Virtual YouTuber
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tighter text-foreground sm:text-5xl">
          Virtual <span className="text-primary">YouTuber</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted">
          Kenalan dengan VTuber dari Soraku, kreator virtual yang menghibur dan
          menginspirasi.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(vtubers ?? []).map((v) => {
          const socials = (v.sociallinks ?? {}) as Record<string, string>
          return (
            <div
              key={v.id}
              className="group overflow-hidden rounded-md border-2 border-black bg-surface shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
            >
              <div className="relative h-32 bg-gradient-to-br from-primary/20 via-accent/10 to-violet-500/20">
                {v.coverurl ? (
                  <Image
                    src={v.coverurl}
                    alt={v.charactername ?? v.name}
                    fill
                    className="object-cover opacity-40"
                    sizes="400px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl opacity-20">空</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-4 translate-y-1/2">
                  {v.avatarurl ? (
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border-2 border-black bg-surface shadow-[2px_2px_0px_#000]">
                      <Image
                        src={v.avatarurl}
                        alt={v.charactername ?? v.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-md border-2 border-black bg-gradient-to-br from-primary/30 to-violet-500/30 text-2xl shadow-[2px_2px_0px_#000]">
                      <Tv className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
                {v.islive && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-sm border border-black bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-[1px_1px_0px_#000]">
                      <Play className="h-2.5 w-2.5 fill-white" />
                      LIVE
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 pt-10">
                <h3 className="text-sm font-bold text-foreground">
                  <Link href={`/vtubers/${v.slug}`} className="hover:text-primary">
                    {v.charactername ?? v.name}
                  </Link>
                </h3>
                {v.charactername && (
                  <p className="mt-0.5 text-[10px] text-muted">{v.name}</p>
                )}
                {v.description && (
                  <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-muted">
                    {v.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2">
                  {socials.youtube && (
                    <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-red-500">
                      <YouTubeIcon className="h-4 w-4" />
                    </a>
                  )}
                  {socials.twitter && (
                    <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-sky-400">
                      <XIcon className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <Link
                  href={`/vtubers/${v.slug}`}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-sm border-2 border-black bg-surface px-3 py-1.5 text-[10px] font-bold text-foreground shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000]"
                >
                  Lihat Profil
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {(vtubers ?? []).length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Tv className="mb-4 h-16 w-16 text-muted" />
          <p className="text-sm text-muted">Belum ada VTuber.</p>
        </div>
      )}
    </div>
  )
}
