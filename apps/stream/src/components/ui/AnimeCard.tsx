"use client"
import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AniListMedia } from "@/lib/anilist"

interface Props {
  anime: AniListMedia
  className?: string
  showInfo?: boolean
}

export function AnimeCard({ anime, className, showInfo = true }: Props) {
  const title = anime.title.english ?? anime.title.romaji
  const href  = `/anime/${anime.id}`
  const isAiring = anime.status === "RELEASING"

  return (
    <Link href={href} className={cn("anime-card group relative block", className)}>
      {/* Cover image */}
      <div className="relative overflow-hidden rounded-md bg-zinc-900"
        style={{ aspectRatio: "2/3" }}>
        {anime.coverImage.extraLarge || anime.coverImage.large ? (
          <Image
            src={anime.coverImage.extraLarge ?? anime.coverImage.large}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 160px"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-zinc-800">
            <Play className="h-8 w-8 text-zinc-600" />
          </div>
        )}

        {/* Play overlay */}
        <div className="overlay absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/90">
            <Play className="h-5 w-5 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
          {isAiring && (
            <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold bg-indigo-500/80 text-white">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-white" />
              Airing
            </span>
          )}
          {anime.format && (
            <span className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-black/60 text-zinc-300">
              {anime.format}
            </span>
          )}
        </div>

        {/* Episode count */}
        {anime.episodes && (
          <span className="absolute bottom-1.5 right-1.5 rounded px-1.5 py-0.5 text-[10px] font-bold bg-black/70 text-zinc-300">
            {anime.episodes} ep
          </span>
        )}

        {/* Next airing */}
        {anime.nextAiringEpisode && (
          <span className="absolute bottom-1.5 left-1.5 rounded px-1.5 py-0.5 text-[10px] bg-black/70 text-indigo-300">
            Ep {anime.nextAiringEpisode.episode}
          </span>
        )}
      </div>

      {/* Info below card */}
      {showInfo && (
        <div className="mt-2 space-y-0.5">
          <p className="text-xs font-medium text-zinc-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">
            {title}
          </p>
          <p className="text-[11px] text-zinc-500">
            {anime.seasonYear ?? ""}{anime.season ? ` ${anime.season}` : ""}
            {anime.averageScore ? ` · ★ ${(anime.averageScore / 10).toFixed(1)}` : ""}
          </p>
        </div>
      )}
    </Link>
  )
}
