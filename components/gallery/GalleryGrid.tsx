'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Search, X, ZoomIn, Hash, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface GalleryItem {
  id: string
  image_url: string
  caption: string | null
  description: string | null
  hashtags: string[] | null
  users?: { display_name: string | null; username: string | null; avatar_url: string | null } | null
}

interface Props {
  items: GalleryItem[]
}

type SortOption = 'newest' | 'oldest'

export function GalleryGrid({ items }: Props) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [zoomIndex, setZoomIndex] = useState<number | null>(null)

  // All unique hashtags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    items.forEach(item => item.hashtags?.forEach(t => tags.add(t)))
    return [...tags].slice(0, 20)
  }, [items])

  const filtered = useMemo(() => {
    let result = [...items]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(i =>
        i.caption?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.hashtags?.some(t => t.toLowerCase().includes(q))
      )
    }
    if (activeTag) {
      result = result.filter(i => i.hashtags?.includes(activeTag))
    }
    if (sort === 'oldest') result.reverse()
    return result
  }, [items, search, activeTag, sort])

  const zoomItem = zoomIndex !== null ? filtered[zoomIndex] : null

  const navigateZoom = (dir: 1 | -1) => {
    if (zoomIndex === null) return
    const next = zoomIndex + dir
    if (next >= 0 && next < filtered.length) setZoomIndex(next)
  }

  return (
    <>
      {/* ─── Filters ──────────────────────────────────────────────── */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soraku-sub" />
            <input
              type="text"
              placeholder="Cari karya..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full glass border border-soraku-border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 bg-transparent placeholder:text-soraku-sub"
            />
          </div>
          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            className="glass border border-soraku-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 bg-soraku-dark text-soraku-text"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
        </div>

        {/* Hashtag filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  activeTag === tag
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'glass border-soraku-border text-soraku-sub hover:border-purple-500/50'
                }`}
              >
                <Hash className="w-3 h-3" />{tag}
              </button>
            ))}
          </div>
        )}

        {/* Results count */}
        <p className="text-soraku-sub text-sm">
          {filtered.length} karya {search || activeTag ? '(difilter)' : 'disetujui'}
        </p>
      </div>

      {/* ─── Grid 2 columns ───────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <p className="text-soraku-sub">Tidak ada karya yang cocok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="glass rounded-2xl overflow-hidden group cursor-pointer hover:border-purple-500/50 transition-all"
              onClick={() => setZoomIndex(idx)}
            >
              <div className="relative aspect-video bg-soraku-muted overflow-hidden">
                <Image
                  src={item.image_url}
                  alt={item.caption ?? 'Gallery'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-soraku-card/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-5 h-5 text-white drop-shadow-lg" />
                </div>
              </div>
              <div className="p-5">
                {item.caption && (
                  <p className="font-medium text-sm line-clamp-1 mb-1">{item.caption}</p>
                )}
                {item.description && (
                  <p className="text-soraku-sub text-xs line-clamp-2 mb-3">{item.description}</p>
                )}
                {item.hashtags && item.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.hashtags.slice(0, 4).map(tag => (
                      <span
                        key={tag}
                        className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full"
                        onClick={e => { e.stopPropagation(); setActiveTag(tag) }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                {item.users && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-soraku-border">
                    {item.users.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.users.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-purple-500/20" />
                    )}
                    <span className="text-soraku-sub text-xs">{item.users.display_name ?? item.users.username ?? 'Anonymous'}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ─── Zoom Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {zoomItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setZoomIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] glass rounded-3xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setZoomIndex(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-soraku-dark/80 flex items-center justify-center text-white hover:bg-soraku-dark transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Navigation */}
              {zoomIndex! > 0 && (
                <button
                  onClick={() => navigateZoom(-1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-soraku-dark/80 flex items-center justify-center text-white hover:bg-soraku-dark transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {zoomIndex! < filtered.length - 1 && (
                <button
                  onClick={() => navigateZoom(1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-soraku-dark/80 flex items-center justify-center text-white hover:bg-soraku-dark transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Image */}
              <div className="relative h-[60vh] bg-soraku-muted">
                <Image
                  src={zoomItem.image_url}
                  alt={zoomItem.caption ?? 'Gallery'}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Info */}
              <div className="p-6">
                {zoomItem.caption && <p className="font-semibold mb-2">{zoomItem.caption}</p>}
                {zoomItem.description && <p className="text-soraku-sub text-sm mb-3">{zoomItem.description}</p>}
                {zoomItem.hashtags && zoomItem.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {zoomItem.hashtags.map(tag => (
                      <span key={tag} className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
