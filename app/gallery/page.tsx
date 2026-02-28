'use client'
import { useState, useEffect } from 'react'
import { X, Search, Image } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface GalleryItem { id: string; title: string; image_url: string; tags: string[] | null }

export default function GalleryPage() {
  const [items, setItems]     = useState<GalleryItem[]>([])
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('')
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('gallery').select('id, title, image_url, tags').eq('approved', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setItems(data ?? []); setLoading(false) })
  }, [])

  const allTags = [...new Set(items.flatMap(i => i.tags ?? []))]
  const filtered = items.filter(i => {
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase())
    const matchTag    = !filter || (i.tags ?? []).includes(filter)
    return matchSearch && matchTag
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>Gallery</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-sub)' }}>Koleksi fanart dan karya original komunitas Soraku.</p>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-sub)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari karya..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 min-h-[44px]"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
          </div>
        </div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilter('')}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all min-h-[36px]"
              style={{
                backgroundColor: !filter ? 'var(--color-primary)' : 'transparent',
                color: !filter ? '#fff' : 'var(--text-sub)',
                borderColor: !filter ? 'var(--color-primary)' : 'var(--border)',
              }}>Semua</button>
            {allTags.slice(0, 10).map(tag => (
              <button key={tag} onClick={() => setFilter(filter === tag ? '' : tag)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all min-h-[36px]"
                style={{
                  backgroundColor: filter === tag ? 'var(--color-primary)' : 'transparent',
                  color: filter === tag ? '#fff' : 'var(--text-sub)',
                  borderColor: filter === tag ? 'var(--color-primary)' : 'var(--border)',
                }}>{tag}</button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl animate-pulse" style={{ backgroundColor: 'var(--bg-card)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <Image size={40} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--text-sub)' }} />
          <p style={{ color: 'var(--text-sub)' }}>Tidak ada karya ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map(item => (
            <button key={item.id} onClick={() => setSelected(item)}
              className="group aspect-square rounded-xl overflow-hidden border transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ borderColor: 'var(--border)' }}>
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelected(null)}>
          <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden border"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
              style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-sub)' }}>
              <X size={18} />
            </button>
            <img src={selected.image_url} alt={selected.title} className="w-full max-h-[70vh] object-contain" />
            <div className="p-4">
              <h3 className="font-semibold" style={{ color: 'var(--text)' }}>{selected.title}</h3>
              {selected.tags?.length ? (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {selected.tags.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-sub)' }}>{t}</span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
