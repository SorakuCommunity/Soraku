// app/gallery/page.tsx — SORAKU v1.0.a3.5
// Gallery: Glass upload card + Newest/Popular/Trending tabs + Supabase storage
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Upload, Image as ImageIcon, Flame, TrendingUp, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface GalleryItem {
  id: string
  title: string
  image_url: string
  tags: string[] | null
  likes: number
  created_at: string
  user_id: string
}

type Tab = 'newest' | 'popular' | 'trending'

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'newest',   label: 'Terbaru',  icon: Clock },
  { key: 'popular',  label: 'Populer',  icon: Heart },
  { key: 'trending', label: 'Trending', icon: Flame },
]

function sortItems(items: GalleryItem[], tab: Tab): GalleryItem[] {
  const now = Date.now()
  return [...items].sort((a, b) => {
    if (tab === 'popular')  return (b.likes ?? 0) - (a.likes ?? 0)
    if (tab === 'trending') {
      // Score = likes / hours since creation  (recency-weighted)
      const ageA = Math.max(1, (now - new Date(a.created_at).getTime()) / 3_600_000)
      const ageB = Math.max(1, (now - new Date(b.created_at).getTime()) / 3_600_000)
      return (b.likes / ageB) - (a.likes / ageA)
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

// ── Upload Card ──────────────────────────────────────────────────────────────
function UploadCard({ onUploaded }: { onUploaded: () => void }) {
  const [open,      setOpen]      = useState(false)
  const [title,     setTitle]     = useState('')
  const [file,      setFile]      = useState<File | null>(null)
  const [preview,   setPreview]   = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFile = (f: File) => {
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) handleFile(f)
  }, [])

  const submit = async () => {
    if (!file || !title.trim()) { toast.error('Judul & gambar wajib diisi'); return }
    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { toast.error('Login dulu yuk!'); setUploading(false); return }

      // Upload to Supabase Storage
      const ext  = file.name.split('.').pop()
      const path = `gallery/${user.id}/${Date.now()}.${ext}`
      const { error: storageErr } = await supabase.storage
        .from('uploads')
        .upload(path, file, { contentType: file.type })

      if (storageErr) throw storageErr

      const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(path)

      // Insert record
      const { error: dbErr } = await supabase.from('gallery').insert({
        title:     title.trim(),
        image_url: publicUrl,
        user_id:   user.id,
        approved:  false,
        likes:     0,
        tags:      [],
      })
      if (dbErr) throw dbErr

      toast.success('Upload berhasil! Menunggu persetujuan admin ✨')
      setOpen(false); setTitle(''); setFile(null); setPreview('')
      onUploaded()
    } catch (err: unknown) {
      toast.error('Upload gagal: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed transition-all duration-200 min-h-[72px]"
        style={{ borderColor: 'rgba(79,163,209,0.35)', color: 'var(--text-sub)' }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'rgba(79,163,209,0.15)', color: 'var(--color-primary)' }}>
          <Upload size={16} />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Upload Karya</p>
          <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
            Semua role bisa upload • perlu persetujuan admin
          </p>
        </div>
      </motion.button>

      {/* Upload Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl border p-6 space-y-4"
              style={{
                background:     'rgba(28,30,34,0.95)',
                backdropFilter: 'blur(24px)',
                borderColor:    'rgba(255,255,255,0.1)',
              }}
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg" style={{ color: 'var(--text)' }}>Upload Karya</h2>
                <button onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  style={{ color: 'var(--text-sub)' }}>
                  <X size={16} />
                </button>
              </div>

              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                className="relative aspect-video rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-colors hover:border-[var(--color-primary)]"
                style={{ borderColor: 'rgba(255,255,255,0.12)' }}
              >
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <ImageIcon size={28} className="mx-auto mb-2 opacity-30" style={{ color: 'var(--text-sub)' }} />
                    <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                      Drag & drop atau klik untuk pilih gambar
                    </p>
                    <p className="text-xs mt-1 opacity-50" style={{ color: 'var(--text-sub)' }}>
                      JPG, PNG, GIF, WebP — maks 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                />
              </div>

              {/* Title */}
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Judul karya..."
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-1 min-h-[44px]"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text)' }}
              />

              <p className="text-xs px-1" style={{ color: 'var(--text-sub)', opacity: 0.7 }}>
                * Karya akan ditinjau admin sebelum ditampilkan secara publik.
              </p>

              <div className="flex gap-3">
                <button onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border text-sm font-medium min-h-[44px] transition-colors hover:bg-white/5"
                  style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text-sub)' }}>
                  Batal
                </button>
                <button onClick={submit} disabled={uploading || !file || !title.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold min-h-[44px] transition-all hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
                  {uploading ? 'Mengupload...' : 'Upload'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function GalleryPage() {
  const [items,    setItems]    = useState<GalleryItem[]>([])
  const [tab,      setTab]      = useState<Tab>('newest')
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const [loading,  setLoading]  = useState(true)
  const supabase = createClient()

  const loadItems = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('gallery')
      .select('id, title, image_url, tags, likes, created_at, user_id')
      .eq('approved', true)
    setItems(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadItems() }, [loadItems])

  const handleLike = async (item: GalleryItem) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error('Login untuk memberi like'); return }
    await supabase.from('gallery').update({ likes: (item.likes ?? 0) + 1 }).eq('id', item.id)
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, likes: (i.likes ?? 0) + 1 } : i))
    if (selected?.id === item.id) setSelected(s => s ? { ...s, likes: (s.likes ?? 0) + 1 } : null)
  }

  const displayed = sortItems(items, tab)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-12">

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>
            Gallery
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-sub)' }}>
            Koleksi fanart dan karya original komunitas Soraku.
          </p>

          {/* Upload Card */}
          <UploadCard onUploaded={loadItems} />
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 min-h-[40px]"
              style={
                tab === key
                  ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                  : { backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-sub)', borderColor: 'rgba(255,255,255,0.08)' }
              }
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl animate-pulse"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-28">
            <ImageIcon size={40} className="mx-auto mb-4" style={{ color: 'var(--text-sub)', opacity: 0.25 }} />
            <p style={{ color: 'var(--text-sub)' }}>Belum ada karya yang disetujui.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
          >
            {displayed.map(item => (
              <motion.button
                key={item.id}
                variants={{ hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1 } }}
                onClick={() => setSelected(item)}
                className="group relative aspect-square rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Like badge */}
                {(item.likes ?? 0) > 0 && (
                  <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                    <Heart size={9} fill="currentColor" />
                    {item.likes}
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative w-full max-w-2xl rounded-2xl overflow-hidden border"
              style={{ backgroundColor: 'rgba(28,30,34,0.97)', borderColor: 'rgba(255,255,255,0.1)' }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-xl flex items-center justify-center min-h-[40px] min-w-[40px] hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-sub)' }}>
                <X size={18} />
              </button>
              <img
                src={selected.image_url}
                alt={selected.title}
                className="w-full max-h-[70vh] object-contain"
              />
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                    {selected.title}
                  </h3>
                  {selected.tags?.length ? (
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {selected.tags.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'var(--text-sub)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <button
                  onClick={() => handleLike(selected)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 min-h-[40px]"
                  style={{ backgroundColor: 'rgba(255,56,56,0.12)', color: '#ff5555' }}
                >
                  <Heart size={14} />
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
