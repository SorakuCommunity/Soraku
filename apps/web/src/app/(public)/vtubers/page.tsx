import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Youtube, Twitter } from 'lucide-react'
import { db } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'VTubers — Soraku Community',
  description: 'Virtual YouTuber dari Soraku Community Indonesia.',
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
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-primary/70 mb-3 text-xs font-bold tracking-widest uppercase">
          Agensi · VTuber
        </p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Virtual <span className="text-gradient">YouTuber</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-lg">
          Kenalan dengan VTuber dari Soraku Community — kreator virtual yang menghibur dan
          menginspirasi.
        </p>
      </div>

      {/* VTuber cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {(vtubers ?? []).map((v) => {
          const socials = (v.sociallinks ?? {}) as Record<string, string>
          return (
            <div
              key={v.id}
              className="glass-card group overflow-hidden transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Banner */}
              <div className="from-primary/20 via-accent/10 relative h-32 bg-gradient-to-br to-violet-500/20">
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
                {/* Live badge */}
                {v.islive && (
                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-1 rounded-full bg-red-500/90 px-2.5 py-0.5 text-[11px] font-bold text-white">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
                    </span>
                  </div>
                )}
                {/* Avatar */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                  {v.avatarurl ? (
                    <div className="border-background relative h-20 w-20 overflow-hidden rounded-2xl border-4 shadow-lg">
                      <Image
                        src={v.avatarurl}
                        alt={v.charactername ?? v.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ) : (
                    <div className="border-background from-primary/30 to-accent/30 flex h-20 w-20 items-center justify-center rounded-2xl border-4 bg-gradient-to-br text-3xl shadow-lg">
                      ✨
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 pt-14 pb-6 text-center">
                {v.debutdate && (
                  <p className="text-accent mb-1 text-xs font-bold tracking-widest uppercase">
                    Debut {new Date(v.debutdate).getFullYear()}
                  </p>
                )}
                <h2 className="text-xl font-bold">{v.charactername ?? v.name}</h2>
                {v.charactername && <p className="text-muted-foreground text-sm">{v.name}</p>}
                <p className="text-muted-foreground/80 mt-3 line-clamp-3 text-sm leading-relaxed">
                  {v.description}
                </p>

                {/* Subscriber count */}
                {v.subscribercount && (
                  <p className="text-muted-foreground/60 mt-2 text-xs">
                    {new Intl.NumberFormat('id-ID').format(v.subscribercount)} subscriber
                  </p>
                )}

                {/* Tags */}
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {(v.tags ?? []).map((tag: string) => (
                    <span
                      key={tag}
                      className="border-border text-muted-foreground rounded-full border px-2.5 py-0.5 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Socials */}
                <div className="mt-5 flex justify-center gap-2">
                  {socials.youtube && (
                    <a
                      href={socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/8 text-red-400 transition-colors hover:bg-red-500/15"
                    >
                      <Youtube className="h-4 w-4" />
                    </a>
                  )}
                  {socials.twitter && (
                    <a
                      href={socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/8 text-sky-400 transition-colors hover:bg-sky-500/15"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                  {v.islive && v.liveurl && (
                    <a
                      href={v.liveurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700"
                    >
                      🔴 Tonton Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Coming soon card */}
        <div className="glass-card border-primary/20 hover:border-primary/40 flex flex-col items-center justify-center border-2 border-dashed p-10 text-center transition-colors">
          <span className="mb-4 text-4xl">🌸</span>
          <p className="text-muted-foreground font-bold">VTuber Baru</p>
          <p className="text-muted-foreground/60 mt-1 text-sm">Segera hadir!</p>
        </div>
      </div>

      {/* CTA Discord */}
      <div className="glass-card mt-16 px-8 py-10 text-center">
        <p className="text-primary/70 mb-3 text-xs font-bold tracking-widest uppercase">
          Bergabung
        </p>
        <h2 className="text-2xl font-bold">Ikuti Live Stream Kami</h2>
        <p className="text-muted-foreground mt-2">
          Dapatkan notifikasi live stream dan konten terbaru dari VTuber Soraku.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href="https://youtube.com/@chsoraku"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700"
          >
            Subscribe YouTube
          </a>
          <a
            href="https://discord.gg/qm3XJvRa6B"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-6 py-3 text-sm font-bold text-indigo-300 transition-colors hover:bg-indigo-500/20"
          >
            Gabung Discord
          </a>
        </div>
      </div>
    </div>
  )
}
