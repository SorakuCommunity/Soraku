'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { Upload, ImageIcon, X, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = ['fanart', 'cosplay', 'digital', 'foto', 'lainnya']
const MAX_SIZE_MB = 8
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

export default function GalleryUploadPage() {
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const titleRef = useRef<HTMLInputElement>(null)
  const categoryRef = useRef<HTMLSelectElement>(null)
  const tagsRef = useRef<HTMLInputElement>(null)
  const descRef = useRef<HTMLTextAreaElement>(null)

  const handleFile = (f: File) => {
    setError(null)
    if (!f.type.startsWith('image/')) {
      setError('File harus berupa gambar (jpg/png/webp/gif)')
      return
    }
    if (f.size > MAX_SIZE_BYTES) {
      setError(
        `Ukuran maksimal ${MAX_SIZE_MB}MB. File kamu: ${(f.size / 1024 / 1024).toFixed(1)}MB`
      )
      return
    }
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }

  const resetForm = () => {
    setFile(null)
    setPreview(null)
    setProgress(0)
    if (titleRef.current) titleRef.current.value = ''
    if (categoryRef.current) categoryRef.current.value = ''
    if (tagsRef.current) tagsRef.current.value = ''
    if (descRef.current) descRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Pilih gambar dulu')
      return
    }
    if (!titleRef.current?.value.trim()) {
      setError('Judul karya wajib diisi')
      return
    }

    setLoading(true)
    setError(null)
    setProgress(10)

    const form = new FormData()
    form.append('file', file)
    form.append('title', titleRef.current?.value ?? '')
    form.append('description', descRef.current?.value ?? '')

    // Gabung kategori + tags
    const cat = categoryRef.current?.value ?? ''
    const rawTags = tagsRef.current?.value ?? ''
    const allTags = [cat, ...rawTags.split(',').map((t) => t.trim())].filter(Boolean).join(',')
    form.append('tags', allTags)

    try {
      setProgress(30)
      const res = await fetch('/api/gallery/upload', { method: 'POST', body: form })
      setProgress(80)

      // Handle non-JSON response (e.g. Vercel 413, Next.js HTML error)
      const contentType = res.headers.get('content-type') ?? ''
      if (!contentType.includes('application/json')) {
        console.error('[upload] non-JSON response:', res.status, res.statusText)
        setError(
          res.status === 413
            ? `File terlalu besar untuk diupload (${(file.size / 1024 / 1024).toFixed(1)}MB). Coba kompres dulu.`
            : `Server error (${res.status}). Coba lagi atau hubungi admin.`
        )
        return
      }

      const json = await res.json()
      setProgress(100)

      if (!res.ok || json.error) {
        setError(json.error?.message ?? json.error ?? 'Upload gagal. Coba lagi.')
      } else {
        setSuccess(true)
        resetForm()
      }
    } catch (err) {
      console.error('[upload] fetch error:', err)
      // Distinguish network error vs other
      const message =
        err instanceof TypeError && err.message.includes('fetch')
          ? 'Koneksi gagal. Periksa internet kamu dan coba lagi.'
          : 'Terjadi kesalahan. Coba lagi.'
      setError(message)
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="glass-card rounded-3xl p-12">
          <CheckCircle className="mx-auto mb-4 h-14 w-14 text-green-400" />
          <h2 className="mb-2 text-2xl font-black">Upload Berhasil! 🎉</h2>
          <p className="text-muted-foreground mb-8">
            Karya kamu sudah masuk antrian review. Moderator akan memeriksa sebelum tampil di galeri
            publik.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSuccess(false)}
              className="bg-primary hover:bg-primary/90 rounded-xl px-6 py-3 text-sm font-bold text-white transition-colors"
            >
              Upload Lagi
            </button>
            <Link
              href="/gallery"
              className="border-border text-muted-foreground hover:border-primary/40 hover:text-foreground rounded-xl border px-6 py-3 text-sm font-medium transition-colors"
            >
              Lihat Galeri
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/gallery"
        className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Galeri
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-black">
          Upload <span className="text-gradient">Karya</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Bagikan karya kreatifmu ke komunitas Soraku. Semua upload akan direview moderator.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drop zone */}
        <div
          className={cn(
            'relative cursor-pointer rounded-2xl border-2 border-dashed transition-all',
            dragOver
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-border hover:border-primary/40'
          )}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            const f = e.dataTransfer.files[0]
            if (f) handleFile(f)
          }}
          onClick={() => !loading && document.getElementById('file-input')?.click()}
        >
          {preview ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className="max-h-72 w-full rounded-2xl object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setPreview(null)
                  setFile(null)
                  setError(null)
                }}
                className="bg-background/80 text-foreground hover:bg-background absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-xl backdrop-blur-sm transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              {/* File info */}
              <div className="bg-background/80 text-muted-foreground absolute bottom-3 left-3 rounded-lg px-2.5 py-1 text-xs backdrop-blur-sm">
                {(file!.size / 1024 / 1024).toFixed(1)}MB
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
              <div className="bg-primary/10 text-primary mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
                <ImageIcon className="h-7 w-7" />
              </div>
              <p className="font-semibold">Drag & drop gambar di sini</p>
              <p className="text-muted-foreground mt-1 text-sm">atau klik untuk pilih file</p>
              <p className="text-muted-foreground/50 mt-3 text-xs">
                PNG, JPG, WEBP, GIF · Maks. {MAX_SIZE_MB}MB
              </p>
            </div>
          )}
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
            }}
          />
        </div>

        {/* Progress bar */}
        {loading && progress > 0 && (
          <div className="bg-muted/30 relative h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="border-destructive/30 bg-destructive/8 text-destructive animate-in fade-in slide-in-from-top-1 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm duration-150">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form fields */}
        <div className="glass-card space-y-5 rounded-2xl p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Judul Karya <span className="text-destructive">*</span>
            </label>
            <input
              ref={titleRef}
              required
              type="text"
              placeholder="Nama karya kamu"
              disabled={loading}
              className="border-border bg-card/50 placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:ring-2 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Kategori <span className="text-destructive">*</span>
            </label>
            <select
              ref={categoryRef}
              required
              disabled={loading}
              className="border-border bg-card/50 focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:ring-2 focus:outline-none disabled:opacity-50"
            >
              <option value="">Pilih kategori</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-background capitalize">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Tags{' '}
              <span className="text-muted-foreground text-xs font-normal">
                (pisahkan dengan koma)
              </span>
            </label>
            <input
              ref={tagsRef}
              type="text"
              placeholder="naruto, sasuke, fanart"
              disabled={loading}
              className="border-border bg-card/50 placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:ring-2 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Deskripsi{' '}
              <span className="text-muted-foreground text-xs font-normal">(opsional)</span>
            </label>
            <textarea
              ref={descRef}
              rows={3}
              placeholder="Ceritakan tentang karya ini..."
              disabled={loading}
              className="border-border bg-card/50 placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20 w-full resize-none rounded-xl border px-4 py-2.5 text-sm transition-colors focus:ring-2 focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        <div className="border-accent/20 bg-accent/5 text-accent/80 rounded-xl border px-4 py-3 text-sm">
          💡 Karya kamu akan direview oleh moderator sebelum tampil di galeri publik.
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="bg-primary shadow-primary/20 hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Mengupload…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Karya
            </>
          )}
        </button>
      </form>
    </div>
  )
}
