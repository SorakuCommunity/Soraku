'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Tag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { galleryUploadSchema, type GalleryUploadFormData } from '@/lib/schemas'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function GalleryUploadPage() {
  const router = useRouter()
  const supabase = createClient()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<GalleryUploadFormData>({
    resolver: zodResolver(galleryUploadSchema),
    defaultValues: { caption: '', description: '', hashtags: [] },
  })

  const onDrop = useCallback((files: File[]) => {
    const f = files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, '').toLowerCase()
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags(p => [...p, t])
      setTagInput('')
    }
  }

  const onSubmit = async (data: GalleryUploadFormData) => {
    if (!file) { toast.error('Pilih gambar dulu'); return }
    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { toast.error('Login dulu'); return }

      const ext = file.name.split('.').pop()
      const path = `gallery/${user.id}/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('gallery').upload(path, file)
      if (upErr) throw upErr

      const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(path)
      const { error: insErr } = await supabase.from('gallery').insert({
        user_id: user.id,
        image_url: publicUrl,
        caption: data.caption ?? null,
        description: data.description ?? null,
        hashtags: tags,
        status: 'pending',
      })
      if (insErr) throw insErr

      toast.success('Upload berhasil! Menunggu moderasi.')
      router.push('/gallery')
    } catch (e) {
      console.error(e)
      toast.error('Upload gagal. Coba lagi.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-2">
          Upload <span className="grad-text">Karya</span>
        </h1>
        <p className="text-soraku-sub mb-8">
          Bagikan karya ke komunitas. Menunggu moderasi sebelum tampil.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dropzone */}
          <div>
            <label className="block text-sm font-medium mb-2">Gambar *</label>
            {preview ? (
              <div className="relative rounded-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="preview" className="w-full max-h-80 object-contain bg-soraku-card" />
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreview(null) }}
                  className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-soraku-border hover:border-purple-500/50 hover:bg-white/5'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-10 h-10 text-soraku-sub mx-auto mb-3" />
                <p className="text-soraku-sub text-sm">
                  {isDragActive ? 'Lepas gambar di sini...' : 'Drag & drop atau klik untuk pilih'}
                </p>
                <p className="text-xs text-soraku-sub/60 mt-1">JPG, PNG, GIF, WEBP – Maks 10MB</p>
              </div>
            )}
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Caption</label>
            <input
              {...register('caption')}
              placeholder="Caption singkat..."
              maxLength={200}
              className="w-full glass border border-soraku-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 bg-transparent placeholder:text-soraku-sub"
            />
            {errors.caption && <p className="text-red-400 text-xs mt-1">{errors.caption.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Deskripsi</label>
            <textarea
              {...register('description')}
              rows={3}
              maxLength={1000}
              placeholder="Ceritakan tentang karyamu..."
              className="w-full glass border border-soraku-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 bg-transparent placeholder:text-soraku-sub resize-none"
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              <Tag className="inline w-4 h-4 mr-1" /> Hashtag
            </label>
            <div className="flex gap-2 mb-3">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="Ketik dan tekan Enter..."
                className="flex-1 glass border border-soraku-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 bg-transparent placeholder:text-soraku-sub"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2.5 glass border border-soraku-border rounded-xl text-sm hover:bg-purple-500/20 hover:border-purple-500/50 transition-colors"
              >
                Tambah
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(t => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs px-3 py-1 rounded-full"
                  >
                    #{t}
                    <button type="button" onClick={() => setTags(p => p.filter(x => x !== t))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full bg-soraku-gradient text-white py-3.5 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" /> Upload Karya
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
