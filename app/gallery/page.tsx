'use client'
// app/gallery/page.tsx — SORAKU v1.0.a3.4
// Filter tabs: Newest / Popular / Trending + Upload button for logged-in users + Like button
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Upload, Images, TrendingUp, Clock, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

interface GalleryItem {
  id: string; title: string; image_url: string
  caption: string | null; tags: string[] | null
  likes: number; created_at: string
}
type Tab = 'newest' | 'popular' | 'trending'

const TABS = [
  { id: 'newest'   as Tab, label: 'Terbaru',  icon: <Clock size={13} /> },
  { id: 'popular'  as Tab, label: 'Populer',  icon: <Heart size={13} /> },
  { id: 'trending' as Tab, label: 'Trending', icon: <TrendingUp size={13} /> },
]

function sorted(items: GalleryItem[], tab: Tab) {
  return [...items].sort((a, b) => {
    if (tab === 'newest')  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    if (tab === 'popular') return (b.likes ?? 0) - (a.likes ?? 0)
    const score = (i: GalleryItem) => (i.likes ?? 0) * 0.7 + (new Date(i.created_at).getTime() / 1e12) * 0.3
    return score(b) - score(a)
  })
}

export default function GalleryPage() {
  const supabase = createClient()
  const [items,    setItems]    = useState<GalleryItem[]>([])
  const [tab,      setTab]      = useState<Tab>('newest')
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [userId,   setUserId]   = useState<string | null>(null)
  const [liking,   setLiking]   = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
    supabase.from('gallery').select('id,title,image_url,caption,tags,likes,created_at')
      .eq('approved', true).then(({ data }) => { setItems(data ?? []); setLoading(false) })
  }, [])

  const handleLike = useCallback(async (item: GalleryItem, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!userId || liking) return
    setLiking(item.id)
    const newLikes = (item.likes ?? 0) + 1
    setItems(p => p.map(i => i.id === item.id ? { ...i, likes: newLikes } : i))
    if (selected?.id === item.id) setSelected(p => p ? { ...p, likes: newLikes } : p)
    await supabase.from('gallery').update({ likes: newLikes }).eq('id', item.id)
    setLiking(null)
  }, [userId, liking, selected])

  const filtered = sorted(
    items.filter(i => !search || i.title.toLowerCase().includes(search.toLowerCase())),
    tab
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>Gallery</h1>
        <p className="text-sm" style={{ color: 'var(--text-sub)' }}>Koleksi fanart dan karya original komunitas Soraku.</p>
      </div>

      {/* Filter row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center">
        <div className="flex gap-2">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: tab === t.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                color: tab === t.id ? '#fff' : 'var(--text-sub)',
                border: `1px solid ${tab === t.id ? 'transparent' : 'rgba(255,255,255,0.10)'}`,
                boxShadow: tab === t.id ? '0 0 16px var(--color-primary)40' : 'none',
              }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-1 justify-end w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-sub)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari..."
              className="w-full pl-8 pr-3 py-2 rounded-xl border text-sm outline-none min-h-[40px]"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.10)', color: 'var(--text)' }} />
          </div>
          {userId && (
            <Link href="/gallery/upload"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 shrink-0"
              style={{ backgroundColor: 'var(--color-primary)', boxShadow: '0 4px 16px var(--color-primary)40' }}>
              <Upload size={14} /><span className="hidden sm:inline">Upload</span>
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <Images size={40} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--text-sub)' }} />
          <p style={{ color: 'var(--text-sub)' }}>Tidak ada karya ditemukan.</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {filtered.map((item, i) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                className="group relative aspect-square rounded-xl overflow-hidden border cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                onClick={() => setSelected(item)}>
                <Image src={item.image_url} alt={item.title} fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width:640px) 33vw,(max-width:1024px) 20vw, 16vw" />
                <div className="absolute inset-0 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }}>
                  <div className="flex items-center justify-between">
                    <p className="text-white text-xs font-medium truncate flex-1 mr-1">{item.title}</p>
                    <button onClick={e => handleLike(item, e)} disabled={!userId || liking === item.id}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-xs font-medium hover:scale-110 transition-all"
                      style={{ backgroundColor: 'rgba(239,68,68,0.3)', color: '#fca5a5' }}>
                      <Heart size={10} className={liking === item.id ? 'animate-pulse' : ''} />
                      {item.likes ?? 0}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94 }}
              className="relative w-full max-w-xl rounded-2xl overflow-hidden border"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'rgba(255,255,255,0.12)' }}
              onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 z-10 p-2 rounded-xl"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff' }}><X size={16} /></button>
              <Image src={selected.image_url} alt={selected.title} width={800} height={600}
                className="w-full object-contain" style={{ maxHeight: '65vh' }} />
              <div className="p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{selected.title}</h3>
                  {selected.caption && <p className="text-xs mt-0.5" style={{ color: 'var(--text-sub)' }}>{selected.caption}</p>}
                  {selected.tags?.length ? (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {selected.tags.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'var(--text-sub)' }}>{t}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <button onClick={e => handleLike(selected, e)} disabled={!userId || liking === selected.id}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold hover:scale-105 transition-all shrink-0"
                  style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                  <Heart size={15} className={liking === selected.id ? 'animate-pulse' : ''} />
                  {selected.likes ?? 0}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
