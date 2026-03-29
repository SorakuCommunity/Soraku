"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, X, Clock } from "lucide-react"
import { getContinueWatching, removeFromHistory, type WatchProgress } from "@/lib/continue-watching"

export function ContinueWatching() {
  const [items, setItems] = useState<WatchProgress[]>([])

  useEffect(() => { setItems(getContinueWatching()) }, [])

  const remove = (episodeId: string) => {
    removeFromHistory(episodeId)
    setItems(getContinueWatching())
  }

  if (items.length === 0) return null

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4 text-indigo-400" />
        <h2 className="text-base font-bold text-white">Lanjut Nonton</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 ep-scroll">
        {items.map(item => {
          const pct = item.duration > 0 ? (item.progress / item.duration) * 100 : 0
          return (
            <Link key={item.episodeId}
              href={`/watch/${item.animeId}?ep=${encodeURIComponent(item.episodeId)}&source=${item.source}`}
              className="group relative flex-shrink-0 w-44 rounded-lg overflow-hidden bg-zinc-900 border border-white/[.06] hover:border-indigo-500/40 transition-all">
              {/* Cover */}
              <div className="relative aspect-video overflow-hidden bg-zinc-800">
                {item.animeCover ? (
                  <Image src={item.animeCover} alt={item.animeTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                ) : null}
                {/* Progress bar */}
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-zinc-700">
                  <div className="h-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
                </div>
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="h-9 w-9 rounded-full bg-indigo-500/90 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>
              {/* Info */}
              <div className="px-2.5 py-2">
                <p className="text-[11px] font-medium text-white line-clamp-1">{item.animeTitle}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Ep {item.episodeNum}</p>
              </div>
              {/* Remove */}
              <button onClick={e => { e.preventDefault(); remove(item.episodeId) }}
                className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80 z-10">
                <X className="h-2.5 w-2.5 text-white" />
              </button>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
