import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Youtube, Instagram, Twitter } from 'lucide-react'
import { db } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Agensi — Soraku Community',
  description:
    'Talent management Soraku Community — VTuber, kreator, cosplayer, dan musisi Indonesia.',
}

type VtuberRow = {
  id: string
  slug: string
  name: string
  charactername: string | null
  avatarurl: string | null
  description: string | null
  debutdate: string | null
  tags: string[] | null
  sociallinks: Record<string, string> | null
  isactive: boolean
  islive: boolean
}

function VtuberCard({ v }: { v: VtuberRow }) {
  const socials = v.sociallinks ?? {}
  return (
    <div className="glass-card group overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      <div className="from-primary/15 via-accent/8 relative h-28 bg-gradient-to-br to-violet-500/10">
        <span className="absolute inset-0 flex items-center justify-center text-4xl opacity-10">
          空
        </span>
        <div className="absolute bottom-0 left-6 translate-y-1/2">
          {v.avatarurl ? (
            <div className="border-background relative h-16 w-16 overflow-hidden rounded-2xl border-4 shadow-lg">
              <Image
                src={v.avatarurl}
                alt={v.charactername ?? v.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ) : (
            <div className="border-background to-accent/20 flex h-16 w-16 items-center justify-center rounded-2xl border-4 bg-gradient-to-br from-violet-500/30 text-2xl shadow-lg">
              ✨
            </div>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="rounded-full border border-violet-500/30 bg-violet-500/8 px-2.5 py-0.5 text-xs font-semibold text-violet-400">
            VTuber
          </span>
        </div>
        {v.islive && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
            </span>
          </div>
        )}
      </div>

      <div className="px-6 pt-10 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="group-hover:text-primary font-bold transition-colors">
              {v.charactername ?? v.name}
            </h3>
            {v.debutdate && (
              <p className="text-muted-foreground text-xs">
                Sejak {new Date(v.debutdate).getFullYear()}
              </p>
            )}
          </div>
          <span
            className={`text-xs font-medium ${v.isactive ? 'text-green-400' : 'text-muted-foreground'}`}
          >
            {v.isactive ? '● Aktif' : '○ Tidak aktif'}
          </span>
        </div>

        <p className="text-muted-foreground/80 mt-3 line-clamp-2 text-sm leading-relaxed">
          {v.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {(v.tags ?? []).slice(0, 3).map((t) => (
            <span
              key={t}
              className="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-xs"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          {socials.youtube && (
            <a
              href={socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/8 text-red-400 transition-colors hover:bg-red-500/15"
            >
              <Youtube className="h-3.5 w-3.5" />
            </a>
          )}
          {socials.instagram && (
            <a
              href={socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/8 text-rose-400 transition-colors hover:bg-rose-500/15"
            >
              <Instagram className="h-3.5 w-3.5" />
            </a>
          )}
          {socials.twitter && (
            <a
              href={socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/8 text-sky-400 transition-colors hover:bg-sky-500/15"
            >
              <Twitter className="h-3.5 w-3.5" />
            </a>
          )}
          <Link
            href={`/vtubers/${v.slug}`}
            className="bg-primary/10 text-primary hover:bg-primary/20 ml-auto rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
          >
            Profil VTuber
          </Link>
        </div>
      </div>
    </div>
  )
}

export default async function AgensiPage() {
  const { data: vtubers } = await (await db())
    .from('vtubers')
    .select(
      'id,slug,name,charactername,avatarurl,description,debutdate,tags,sociallinks,isactive,islive'
    )
    .eq('ispublished', true)
    .order('createdat', { ascending: true })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="text-primary/70 mb-3 text-xs font-bold tracking-widest uppercase">Platform</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Agensi <span className="text-gradient">Soraku</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-xl">
          Talent management Soraku Community — mendukung kreator, VTuber, cosplayer, dan musisi
          Indonesia.
        </p>
        <Link
          href="/vtubers"
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/8 px-5 py-2.5 text-sm font-medium text-violet-300 transition-colors hover:bg-violet-500/15"
        >
          ✨ Lihat VTuber →
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(vtubers ?? []).map((v) => (
          <VtuberCard key={v.id} v={v} />
        ))}
        <div className="glass-card border-border hover:border-primary/30 flex flex-col items-center justify-center border-2 border-dashed p-8 text-center transition-colors">
          <span className="mb-3 text-4xl">🌸</span>
          <p className="text-muted-foreground font-medium">Talent Baru</p>
          <p className="text-muted-foreground/50 mt-1 text-xs">Segera bergabung</p>
        </div>
      </div>

      <div className="glass-card mt-16 px-8 py-10 text-center">
        <p className="text-primary/70 mb-3 text-xs font-bold tracking-widest uppercase">
          Bergabung
        </p>
        <h2 className="text-2xl font-bold">Ingin Menjadi Talent Soraku?</h2>
        <p className="text-muted-foreground mt-2">
          Kami selalu terbuka untuk kreator baru. Hubungi kami di Discord!
        </p>
        <a
          href="https://discord.gg/qm3XJvRa6B"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
        >
          Hubungi via Discord
        </a>
      </div>
    </div>
  )
}
