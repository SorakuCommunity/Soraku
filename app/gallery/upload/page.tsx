'use client'
// app/gallery/upload/page.tsx — SORAKU v1.0.a3.5
// Upload to Supabase Storage (bucket: gallery) + gallery table insert
// Supports both file upload AND URL input (tab toggle)
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Upload, ArrowLeft, ImageIcon, X, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const inputStyle = { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }
const inputClass = 'w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 min-h-[44px]'

export default function GalleryUploadPage() {
  const router   = useRouter()
  const supabase = createClient()
  const fileRef  = useRef<HTMLInputElement>(null)

  const [tab,      setTab]     = useState<'file' | 'url'>('file')
  const [file,     setFile]    = useState<File | null>(null)
  const [preview,  setPreview] = useState('')
  const [urlInput, setUrlInput]= useState('')
  const [title,    setTitle]   = useState('')
  const [caption,  setCaption] = useState('')
  const [tags,     setTags]    = useState('')
  const [saving,   setSaving]  = useState(false)
  const [dragOver, setDragOver]= useState(false)

  const handleFile = (f: File | null) => {
    if (!f) return
    if (!f.type.startsWith('image/')) { toast.error('File harus berupa gambar'); return }
    if (f.size > 8 * 1024 * 1024)    { toast.error('Ukuran maksimal 8MB'); return }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const clearFile = () => {
    if (preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    setFile(null); setPreview('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = async () => {
    if (!title.trim()) { toast.error('Judul wajib diisi'); return }
    const hasFile = tab === 'file' && !!file
    const hasUrl  = tab === 'url'  && !!urlInput.trim()
    if (!hasFile && !hasUrl) { toast.error('Pilih file atau masukkan URL gambar'); return }

    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login?next=/gallery/upload'); setSaving(false); return }

    let imageUrl = urlInput.trim()

    if (hasFile && file) {
      const ext  = file.name.split('.').pop() ?? 'jpg'
      const path = `${user.id}/${Date.now()}.${ext}`
      const { data: sd, error: se } = await supabase.storage
        .from('gallery').upload(path, file, { contentType: file.type })
      if (se) { toast.error('Upload gagal: ' + se.message); setSaving(false); return }
      imageUrl = supabase.storage.from('gallery').getPublicUrl(sd.path).data.publicUrl
    }

    const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean)
    const { error } = await supabase.from('gallery').insert({
      title:     title.trim(),
      image_url: imageUrl,
      caption:   caption.trim() || null,
      tags:      tagArr.length ? tagArr : null,
      user_id:   user.id,
      approved:  false,
      likes:     0,
    })

    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success('Upload berhasil! Menunggu persetujuan admin.')
    router.push('/gallery')
  }

  const previewSrc = tab === 'file' ? preview : urlInput

  return (
    <div className="min-h-screen py-10 px-4" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-lg mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/gallery"
            className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:bg-white/5"
            style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text-sub)' }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Upload ke Gallery</h1>
            <p className="text-xs" style={{ color: 'var(--text-sub)' }}>Karya ditinjau admin sebelum tampil</p>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-2">
          {([
            { id: 'file' as const, label: 'Upload File', icon: <Upload size={12} /> },
            { id: 'url'  as const, label: 'URL Gambar',  icon: <LinkIcon size={12} /> },
          ]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: tab === t.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                color:           tab === t.id ? '#fff' : 'var(--text-sub)',
                border:          `1px solid ${tab === t.id ? 'transparent' : 'rgba(255,255,255,0.10)'}`,
              }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.10)' }}>

          {/* Preview */}
          {previewSrc && (
            <div className="relative aspect-video">
              <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
              {tab === 'file' && (
                <button onClick={clearFile}
                  className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0,0,0,0.65)', color: '#fff' }}>
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          <div className="p-5 space-y-4">
            {/* Drop zone */}
            {tab === 'file' && !file && (
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0] ?? null) }}
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
                style={{
                  borderColor:     dragOver ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)',
                  backgroundColor: dragOver ? 'var(--color-primary)0a' : 'transparent',
                }}>
                <ImageIcon size={30} className="mx-auto mb-2.5" style={{ color: dragOver ? 'var(--color-primary)' : 'var(--text-sub)' }} />
                <p className="text-sm font-medium" style={{ color: dragOver ? 'var(--color-primary)' : 'var(--text)' }}>
                  Drag & drop atau klik pilih file
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-sub)' }}>JPG, PNG, WebP, GIF · Max 8MB</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => handleFile(e.target.files?.[0] ?? null)} />
              </div>
            )}

            {tab === 'url' && (
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-sub)' }}>URL Gambar *</label>
                <input value={urlInput} onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://..." type="url" className={inputClass} style={inputStyle} />
              </div>
            )}

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-sub)' }}>Judul *</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Judul karya..." className={inputClass} style={inputStyle} />
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-sub)' }}>Caption</label>
              <textarea value={caption} onChange={e => setCaption(e.target.value)}
                placeholder="Deskripsi singkat..." rows={2}
                className={inputClass + ' resize-none'} style={{ ...inputStyle, minHeight: 'auto' }} />
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-sub)' }}>Tags (pisah koma)</label>
              <input value={tags} onChange={e => setTags(e.target.value)}
                placeholder="fanart, anime, original..." className={inputClass} style={inputStyle} />
            </div>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.01] disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), #6E8FA6)', boxShadow: '0 4px 24px var(--color-primary)40' }}>
          {saving
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Upload size={15} />}
          {saving ? 'Mengupload...' : 'Upload Karya'}
        </button>
      </div>
    </div>
  )
}
