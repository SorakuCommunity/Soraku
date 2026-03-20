import { getTrending, getAiring, getPopular } from "@/lib/anilist"
import { AnimeCard } from "@/components/ui/AnimeCard"
import { ContinueWatching } from "@/components/ui/ContinueWatching"
import Link from "next/link"
import Image from "next/image"
import { Play, ChevronRight, TrendingUp, Zap, Star } from "lucide-react"
import { animeTitle, stripHtml } from "@/lib/utils"

export const revalidate = 3600

export default async function HomePage() {
  const [trending, airing, popular] = await Promise.all([
    getTrending(1, 15),
    getAiring(1, 12),
    getPopular(1, 12),
  ])

  const featured = trending[0]

  return (
    <div className="space-y-10">
      {featured && (
        <section className="-mx-4 -mt-4 relative overflow-hidden" style={{ height: "clamp(280px,45vw,480px)" }}>
          {(featured.bannerImage || featured.coverImage.extraLarge) && (
            <Image src={featured.bannerImage ?? featured.coverImage.extraLarge}
              alt={animeTitle(featured.title)} fill className="object-cover object-top" priority unoptimized />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-end pb-10 px-4">
            <div className="max-w-lg space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {featured.genres.slice(0, 3).map((g: string) => (
                  <span key={g} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-zinc-300">{g}</span>
                ))}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{animeTitle(featured.title)}</h1>
              {featured.description && (
                <p className="text-sm text-zinc-400 line-clamp-2">{stripHtml(featured.description)}</p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <Link href={`/anime/${featured.id}`}
                  className="flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/25">
                  <Play className="h-4 w-4 fill-white" /> Tonton Sekarang
                </Link>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  {featured.averageScore && <span>★ {(featured.averageScore / 10).toFixed(1)}</span>}
                  {featured.episodes && <span>{featured.episodes} Ep</span>}
                  {featured.seasonYear && <span>{featured.seasonYear}</span>}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <ContinueWatching />

      <Section title="Trending Sekarang" icon={TrendingUp} href="/search?sort=trending">
        {trending.slice(1, 13).map((a: any) => <AnimeCard key={a.id} anime={a} />)}
      </Section>

      <Section title="Sedang Tayang" icon={Zap} href="/search?sort=airing">
        {airing.map((a: any) => <AnimeCard key={a.id} anime={a} />)}
      </Section>

      <Section title="Paling Populer" icon={Star} href="/search?sort=popular">
        {popular.map((a: any) => <AnimeCard key={a.id} anime={a} />)}
      </Section>
    </div>
  )
}

function Section({ title, icon: Icon, href, children }: {
  title: string; icon: any; href: string; children: React.ReactNode
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-white">
          <Icon className="h-4 w-4 text-indigo-400" />{title}
        </h2>
        <Link href={href} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          Semua <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {children}
      </div>
    </section>
  )
}
