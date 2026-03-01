'use client'
// app/gallery/upload/page.tsx — SORAKU v1.0.a3.5
// Gallery upload: file drag-drop OR URL, Supabase Storage bucket "gallery"
// Role USER+ can upload. Pending admin approval after submit.
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Upload, ArrowLeft, Image as ImageIcon, X, Link as LinkIcon, FolderOpen } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const inputClass = 'w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)20] min-h-[44px]'
const glassCard  = { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.10)' }

type Mode = 'file' | 'url'

export default function GalleryUploadPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [mode,      setMode]      = useState<Mode>('file')
  const [file,      setFile]      = useState<File | null>(null)
  const [preview,   setPreview]   = useState('')
  const [urlInput,  setUrlInput]  = useState('')
  const [title,     setTitle]     = useState('')
  const [caption,   setCaption]   = useState('')
  const [tags,      setTags]      = useState('')
  const [dragging,  setDragging]  = useState(false)
  const [saving,    setSaving]    = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) { toast.error('Hanya file gambar yang diperbolehkan.'); return }
    if (f.size > 8 * 1024 * 1024)    { toast.error('Ukuran maksimum file 8MB.'); return }
    setFile(f)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { toast.error('Judul wajib diisi.'); return }

    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    let imageUrl = ''

    if (mode === 'file' && file) {
      // Upload to Supabase Storage bucket "gallery"
      const ext  = file.name.split('.').pop() ?? 'jpg'
      const path = `${user.id}/${Date.now()}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from('gallery')
        .upload(path, file, { contentType: file.type, upsert: false })

      if (uploadErr) {
        setSaving(false)
        toast.error('Upload gagal: ' + uploadErr.message)
        return
      }

      const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(path)
      imageUrl = urlData.publicUrl

    } else if (mode === 'url' && urlInput.trim()) {
      imageUrl = urlInput.trim()
    } else {
      setSaving(false)
      toast.error(mode === 'file' ? 'Pilih file gambar terlebih dahulu.' : 'Masukkan URL gambar.')
      return
    }

    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean)

    const { error } = await supabase.from('gallery').insert({
      title:      title.trim(),
      image_url:  imageUrl,
      caption:    caption.trim() || null,
      tags:       tagArray.length > 0 ? tagArray : null,
      user_id:    user.id,
      approved:   false,
      likes:      0,
      created_at: new Date().toISOString(),
    })

    setSaving(false)
    if (error) { toast.error('Gagal menyimpan: ' + error.message); return }

    toast.success('Upload berhasil! Menunggu persetujuan admin.')
    router.push('/gallery')
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/gallery"
            className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-all"
            style={{ color: 'var(--text-sub)' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Upload ke Gallery</h1>
            <p className="text-xs" style={{ color: 'var(--text-sub)' }}>Karya akan ditinjau admin sebelum ditampilkan</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Mode toggle */}
          <div className="flex rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
            {(['file', 'url'] as Mode[]).map(m => (
              <button
                key={m} type="button"
                onClick={() => { setMode(m); setFile(null); setPreview('') }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all"
                style={{
                  backgroundColor: mode === m ? 'var(--color-primary)' : 'rgba(255,255,255,0.03)',
                  color:           mode === m ? '#fff' : 'var(--text-sub)',
                }}>
                {m === 'file' ? <><FolderOpen size={14} /> Upload File</> : <><LinkIcon size={14} /> URL Gambar</>}
              </button>
            ))}
          </div>

          {/* Upload area / URL input */}
          <div className="p-5 rounded-2xl border space-y-4" style={glassCard}>

            <AnimatePresence mode="wait">
              {mode === 'file' ? (
                <motion.div key="file"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  {preview ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button"
                        onClick={() => { setFile(null); setPreview('') }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                        style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff' }}>
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={e => { e.preventDefault(); setDragging(true) }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={onDrop}
                      onClick={() => fileRef.current?.click()}
                      className="flex flex-col items-center justify-center py-12 rounded-xl border-2 border-dashed cursor-pointer transition-all"
                      style={{
                        borderColor:     dragging ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)',
                        backgroundColor: dragging ? 'var(--color-primary)08' : 'transparent',
                      }}>
                      <ImageIcon size={32} className="mb-3" style={{ color: dragging ? 'var(--color-primary)' : 'var(--text-sub)' }} />
                      <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                        {dragging ? 'Lepas file di sini' : 'Drag & drop atau klik untuk pilih'}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-sub)' }}>PNG, JPG, GIF, WebP — maks. 8MB</p>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
                </motion.div>
              ) : (
                <motion.div key="url"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  {urlInput && (
                    <div className="aspect-video rounded-xl overflow-hidden mb-3">
                      <img src={urlInput} alt="Preview" className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>URL Gambar *</label>
                    <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)}
                      placeholder="https://cdn.example.com/image.jpg"
                      className={inputClass}
                      style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Title */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>Judul *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Judul karya..."
                className={inputClass}
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
            </div>

            {/* Caption */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>Caption (opsional)</label>
              <textarea value={caption} onChange={e => setCaption(e.target.value)}
                placeholder="Ceritakan tentang karya ini..." rows={2}
                className={inputClass + ' resize-none'}
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)', minHeight: 'auto' }} />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>Tags (pisah dengan koma)</label>
              <input type="text" value={tags} onChange={e => setTags(e.target.value)}
                placeholder="anime, fanart, digital art"
                className={inputClass}
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary, #6E8FA6))',
              boxShadow:  '0 4px 24px var(--color-primary)40',
            }}>
            {saving
              ? <><div className="w-4 h-4 border-2 rounded-full animate-spin border-white border-t-transparent" /> Mengupload...</>
              : <><Upload size={15} /> Upload Karya</>}
          </button>
        </form>
      </div>
    </div>
  )
}
