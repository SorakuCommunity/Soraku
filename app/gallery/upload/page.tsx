'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { galleryUploadSchema, type GalleryUploadData } from '@/lib/schemas'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Upload, ArrowLeft, Image } from 'lucide-react'
import Link from 'next/link'

const inputClass = 'w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all focus:border-[var(--color-primary)] min-h-[44px]'

export default function GalleryUploadPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [preview, setPreview] = useState('')
  const [saving,  setSaving]  = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<GalleryUploadData>({
    resolver: zodResolver(galleryUploadSchema),
  })

  const imageUrl = watch('image_url')

  const onSubmit = async (values: GalleryUploadData) => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('gallery').insert({
      title:      values.title,
      image_url:  values.image_url,
      description: values.description,
      tags:       values.tags,
      user_id:    user.id,
      approved:   false,
      created_at: new Date().toISOString(),
    })

    setSaving(false)
    if (error) { toast.error('Gagal upload: ' + error.message); return }

    toast.success('Upload berhasil! Menunggu persetujuan admin.')
    router.push('/gallery')
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/gallery" className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-all"
            style={{ color: 'var(--text-sub)' }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Upload ke Gallery</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            {/* Preview */}
            {imageUrl && (
              <div className="aspect-video rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover"
                  onError={() => {}} />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>URL Gambar *</label>
              <input {...register('image_url')} placeholder="https://..." type="url"
                className={inputClass} style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text)' }} />
              {errors.image_url && <p className="text-xs mt-1 text-red-400">{errors.image_url.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>Judul *</label>
              <input {...register('title')} placeholder="Judul karya..."
                className={inputClass} style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text)' }} />
              {errors.title && <p className="text-xs mt-1 text-red-400">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>Deskripsi</label>
              <textarea {...register('description')} placeholder="Ceritakan tentang karya ini..." rows={3}
                className={inputClass + ' resize-none'} style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text)', minHeight: 'auto' }} />
            </div>
          </div>

          <p className="text-xs px-1" style={{ color: 'var(--text-sub)' }}>
            * Karya akan ditinjau oleh admin sebelum ditampilkan.
          </p>

          <button type="submit" disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60 min-h-[44px]"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
            <Upload size={16} />
            {saving ? 'Mengupload...' : 'Upload Karya'}
          </button>
        </form>
      </div>
    </div>
  )
}
