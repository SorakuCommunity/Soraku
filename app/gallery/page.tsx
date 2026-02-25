'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Search, Upload, X, ZoomIn, Hash, SortAsc } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { GalleryItem } from '@/types'

type SortOption = 'newest' | 'oldest'

export default function GalleryPage() {
  const supabase = createClient()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>('newest')
  const [selected, setSelected] = useState<GalleryItem | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    let q = supabase
      .from('gallery')
      .select('*, users(display_name, username, avatar_url)')
      .eq('status', 'approved')
    if (sort === 'newest') q = q.order('created_at', { ascending: false })
    else q = q.order('created_at', { ascending: true })
    const { data } = await q.limit(100)
    setItems((data ?? []) as GalleryItem[])
    setLoading(false)
  }, [supabase, sort])

  useEffect(() => { load() }, [load])

  // Collect all tags
  const allTags = Array.from(new Set(items.flatMap(i => i.hashtags ?? [])))

  // Filter
  const filtered = items.filter(item => {
    const matchSearch = !search ||
      item.caption?.toLowerCase().includes(search.toLowerCase()) ||
      item.hashtags?.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
      item.users?.display_name?.toLowerCase().includes(search.toLowerCase())
    const matchTag = !activeTag || item.hashtags?.includes(activeTag)
    return matchSearch && matchTag
  })

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ── Intro section ── */}
        <div className="glass rounded-3xl overflow-hidden border border-purple-500/10 mb-10">
          <div className="relative h-40 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1400&q=80"
              alt="Gallery" fill className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-soraku-dark via-soraku-dark/80 to-transparent" />
          </div>
          <div className="p-8 -mt-16 relative z-10">
            <h1 className="font-display text-5xl font-bold mb-3">
              Gallery <span className="grad-text">Soraku</span>
            </h1>
            <p className="text-soraku-sub max-w-2xl mb-4">
              Koleksi karya terbaik dari seluruh komunitas. Mulai dari fanart anime, foto events, potret pribadi,
              cosplay, hingga ilustrasi digital — semua ada di sini!
            </p>
            <div className="flex flex-wrap gap-3">
              {['🎨 Fanart', '📸 Foto Events', '👤 Potret', '🎭 Cosplay', '🖼️ Ilustrasi'].map(cat => (
                <span key={cat} className="text-xs glass border border-soraku-border px-3 py-1.5 rounded-full text-soraku-sub">{cat}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Filters & Search ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soraku-sub" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari karya, hashtag, atau kreator..."
              className="w-full glass border border-soraku-border rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-purple-500 bg-transparent placeholder:text-soraku-sub"
            />
          </div>
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-soraku-sub" />
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              className="glass border border-soraku-border rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:border-purple-500 text-soraku-sub"
            >
              <option value="newest" className="bg-soraku-card">Terbaru</option>
              <option value="oldest" className="bg-soraku-card">Terlama</option>
            </select>
            <Link href="/gallery/upload"
              className="flex items-center gap-2 bg-soraku-gradient text-white px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
              <Upload className="w-4 h-4" />
              Upload
            </Link>
          </div>
        </div>

        {/* ── Hashtag filter ── */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveTag(null)}
              className={cn(
                'flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-all',
                !activeTag ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'glass border-soraku-border text-soraku-sub hover:border-purple-500/40'
              )}>
              Semua
            </button>
            {allTags.slice(0, 20).map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={cn(
                  'flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-all',
                  activeTag === tag ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'glass border-soraku-border text-soraku-sub hover:border-purple-500/40'
                )}>
                <Hash className="w-3 h-3" />{tag}
              </button>
            ))}
          </div>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl aspect-square animate-pulse bg-soraku-muted/30" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <p className="text-soraku-sub">Tidak ada karya yang ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl overflow-hidden group cursor-pointer hover:border-purple-500/50 hover:scale-[1.01] transition-all"
                onClick={() => setSelected(item)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.caption ?? ''}
                    fill className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-soraku-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                {(item.caption || item.hashtags?.length > 0) && (
                  <div className="p-4">
                    {item.caption && (
                      <p className="text-sm font-medium line-clamp-1 mb-2">{item.caption}</p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {item.hashtags?.slice(0, 4).map(t => (
                        <span key={t} className="text-xs text-soraku-primary bg-purple-500/10 px-2 py-0.5 rounded-full">#{t}</span>
                      ))}
                    </div>
                    {item.users?.display_name && (
                      <p className="text-xs text-soraku-sub mt-2">oleh {item.users.display_name}</p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Zoom Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-3xl w-full glass rounded-3xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.image_url}
                  alt={selected.caption ?? ''}
                  className="w-full max-h-[70vh] object-contain bg-soraku-dark"
                />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="p-6">
                {selected.caption && (
                  <h3 className="font-semibold text-lg mb-2">{selected.caption}</h3>
                )}
                {selected.description && (
                  <p className="text-soraku-sub text-sm mb-4 leading-relaxed">{selected.description}</p>
                )}
                {selected.hashtags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selected.hashtags.map(t => (
                      <span key={t} className="text-xs text-soraku-primary bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                {selected.users?.display_name && (
                  <p className="text-xs text-soraku-sub">Oleh: {selected.users.display_name}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
