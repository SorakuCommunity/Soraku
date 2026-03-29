import { getAnimeById, getPopular } from "@/lib/anilist"
import { AnimeCard } from "@/components/ui/AnimeCard"
import { EpisodeList } from "@/components/ui/EpisodeList"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Play, Star, Calendar, Clock, Tv, ChevronLeft } from "lucide-react"
import { animeTitle, stripHtml } from "@/lib/utils"
import type { Metadata } from "next"

export const revalidate = 3600

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const anime = await getAnimeById(Number(id))
  if (!anime) return { title: "Anime tidak ditemukan" }
  return {
    title:       animeTitle(anime.title),
    description: anime.description ? stripHtml(anime.description).slice(0, 160) : undefined,
    openGraph:   { images: anime.bannerImage ? [anime.bannerImage] : [anime.coverImage.extraLarge] },
  }
}

export default async function AnimePage({ params }: Props) {
  const { id } = await params
  const anime = await getAnimeById(Number(id))
  if (!anime) notFound()

  const title   = animeTitle(anime.title)
  const studios = anime.studios?.nodes?.map((s: any) => s.name).join(", ") ?? ""
  const score   = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
        <ChevronLeft className="h-4 w-4" /> Kembali
      </Link>

      {/* Banner */}
      <div className="relative -mx-4 overflow-hidden rounded-xl" style={{ height: "260px" }}>
        {(anime.bannerImage || anime.coverImage.extraLarge) && (
          <Image src={anime.bannerImage ?? anime.coverImage.extraLarge} alt={title}
            fill className="object-cover object-center" priority unoptimized />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/30 to-transparent" />
      </div>

      {/* Info grid */}
      <div className="flex gap-5 -mt-16 relative">
        {/* Cover */}
        <div className="relative flex-shrink-0 w-28 sm:w-36 rounded-lg overflow-hidden shadow-xl border border-white/[.08]" style={{ aspectRatio: "2/3" }}>
          <Image src={anime.coverImage.extraLarge ?? anime.coverImage.large} alt={title}
            fill className="object-cover" unoptimized />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 pt-16 space-y-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">{title}</h1>
            {anime.title.native && <p className="text-sm text-zinc-500 mt-0.5">{anime.title.native}</p>}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
            {score && <span className="flex items-center gap-1 text-yellow-400 font-semibold"><Star className="h-3.5 w-3.5 fill-current" />{score}</span>}
            {anime.format && <span>{anime.format}</span>}
            {anime.episodes && <span className="flex items-center gap-1"><Tv className="h-3 w-3" />{anime.episodes} ep</span>}
            {anime.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{anime.duration} mnt</span>}
            {anime.seasonYear && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{anime.seasonYear}</span>}
            <span className={`font-medium ${anime.status === "RELEASING" ? "text-green-400" : "text-zinc-400"}`}>
              {anime.status === "RELEASING" ? "● Ongoing" : anime.status === "FINISHED" ? "Selesai" : anime.status}
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1.5">
            {anime.genres.map((g: string) => (
              <span key={g} className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] text-indigo-300">
                {g}
              </span>
            ))}
          </div>

          {/* Studios */}
          {studios && <p className="text-xs text-zinc-500">Studio: <span className="text-zinc-300">{studios}</span></p>}
        </div>
      </div>

      {/* Description */}
      {anime.description && (
        <p className="text-sm text-zinc-400 leading-relaxed">
          {stripHtml(anime.description)}
        </p>
      )}

      {/* Episode list (client component for source switching) */}
      <EpisodeList animeId={String(anime.id)} animeTitle={title} animeCover={anime.coverImage.large} />
    </div>
  )
}
