'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Eye,
  Loader2,
  Plus,
  X,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Image as ImageIcon,
  Minus,
  Upload,
  AlertCircle,
  RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import MarkdownRenderer from '@/components/blog/MarkdownRenderer'
import { ImageUrlInput } from '@/components/ui/image-url-input'

function ToolbarBtn({
  icon: Icon,
  label,
  onClick,
}: {
  icon: any
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="text-muted-foreground/60 hover:bg-muted/40 hover:text-foreground flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  )
}

function insertMarkdown(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  setValue: (v: string) => void,
  before: string,
  after = '',
  placeholder = 'teks'
) {
  const el = ref.current
  if (!el) return
  const start = el.selectionStart,
    end = el.selectionEnd
  const sel = el.value.slice(start, end) || placeholder
  const newVal = el.value.slice(0, start) + before + sel + after + el.value.slice(end)
  setValue(newVal)
  setTimeout(() => {
    el.focus()
    const ns = start + before.length
    el.setSelectionRange(ns, ns + sel.length)
  }, 0)
}

export default function AdminBlogEditPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const taRef = useRef<HTMLTextAreaElement>(null)

  const [fetching, setFetching] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
  const [uploading, setUploading] = useState(false)
  const [ispublished, setIspublished] = useState(false)
  const [replacing, setReplacing] = useState(false)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [coverurl, setCoverurl] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const res = await fetch(`/api/admin/blog/${id}`)
      const json = await res.json()
      if (!res.ok) {
        setFetchError(json?.error?.message ?? 'Artikel tidak ditemukan.')
        setFetching(false)
        return
      }
      const d = json.data
      setTitle(d.title ?? '')
      setSlug(d.slug ?? '')
      setExcerpt(d.excerpt ?? '')
      setContent(d.content ?? '')
      setCoverurl(d.coverurl ?? '')
      setTags(d.tags ?? [])
      setIspublished(d.ispublished ?? false)
      setFetching(false)
    })()
  }, [id])

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput('')
  }

  const uploadContentImage = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('bucket', 'blog')
      fd.append('folder', 'content')
      const res = await fetch('/api/upload/image', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok && data?.data?.url)
        insertMarkdown(taRef, setContent, '![', `](${data.data.url})`, 'deskripsi gambar')
      else setError('Gagal upload gambar.')
    } catch {
      setError('Gagal upload.')
    } finally {
      setUploading(false)
    }
  }

  const ins = useCallback(
    (before: string, after = '', ph = 'teks') =>
      insertMarkdown(taRef, setContent, before, after, ph),
    []
  )

  const handleReplace = async () => {
    if (!confirm('Yakin ingin mengganti isi artikel? Perubahan tidak bisa dibatalkan.')) return
    setReplacing(true)
    setError(null)
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || undefined,
        content: content.trim() || undefined,
        coverurl: coverurl.trim() || '',
        tags,
        ispublished,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data?.error?.message ?? 'Gagal mengganti artikel.')
      setReplacing(false)
      return
    }
    setReplacing(false)
    setError('✅ Artikel berhasil diperbarui!')
    setTimeout(() => setError(null), 3000)
  }

  const handleSubmit = async (publish: boolean) => {
    if (!title.trim() || !slug.trim()) {
      setError('Judul dan slug wajib diisi.')
      return
    }
    setLoading(true)
    setError(null)
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || undefined,
        content: content.trim() || undefined,
        coverurl: coverurl.trim() || '',
        tags,
        ispublished: publish,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data?.error?.message ?? 'Gagal menyimpan.')
      setLoading(false)
      return
    }
    router.push('/admin/blog')
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const readMins = Math.max(1, Math.ceil(wordCount / 200))

  if (fetching)
    return (
      <div className="text-muted-foreground flex items-center justify-center gap-2 py-24">
        <Loader2 className="h-5 w-5 animate-spin" /> Memuat...
      </div>
    )
  if (fetchError)
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <AlertCircle className="text-destructive/60 h-8 w-8" />
        <p className="text-muted-foreground text-sm">{fetchError}</p>
        <Link href="/admin/blog" className="text-primary text-xs hover:underline">
          ← Kembali
        </Link>
      </div>
    )

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="border-border text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-xl border transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Edit Artikel</h1>
            <p className="text-muted-foreground/50 text-xs">
              {wordCount} kata · ~{readMins} menit baca {ispublished && '· 🟢 Live'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReplace}
            disabled={replacing || loading}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-400 transition-colors hover:bg-amber-500/20 disabled:opacity-40"
          >
            {replacing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RotateCcw className="h-3.5 w-3.5" />
            )}{' '}
            Ganti
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="border-border text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}{' '}
            {ispublished ? 'Unpublish' : 'Draft'}
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-colors disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}{' '}
            {ispublished ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-xl border px-4 py-3 text-sm">
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)}>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul artikel..."
            className="border-border/30 placeholder:text-muted-foreground/20 focus:border-primary/50 w-full rounded-xl border-0 border-b-2 bg-transparent px-0 py-2 text-2xl font-black transition-colors outline-none"
          />
          <div className="text-muted-foreground/40 flex items-center gap-2 text-xs">
            <span>/blog/</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="border-border/40 focus:border-primary/40 flex-1 border-b border-dashed bg-transparent font-mono text-xs transition-colors outline-none"
            />
          </div>

          <div className="glass-card overflow-hidden rounded-xl">
            <div className="border-border/30 bg-card/20 flex items-center justify-between border-b px-3 py-2">
              <div className="flex gap-1">
                {(['write', 'preview'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-all',
                      activeTab === tab
                        ? 'bg-primary text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {tab === 'write' ? 'Tulis' : 'Preview'}
                  </button>
                ))}
              </div>
              {activeTab === 'write' && (
                <div className="flex flex-wrap items-center gap-0.5">
                  <ToolbarBtn
                    icon={Bold}
                    label="Bold"
                    onClick={() => ins('**', '**', 'teks tebal')}
                  />
                  <ToolbarBtn
                    icon={Italic}
                    label="Italic"
                    onClick={() => ins('*', '*', 'teks miring')}
                  />
                  <div className="bg-border/40 mx-1 h-4 w-px" />
                  <ToolbarBtn
                    icon={Heading1}
                    label="H1"
                    onClick={() => ins('# ', '', 'Heading 1')}
                  />
                  <ToolbarBtn
                    icon={Heading2}
                    label="H2"
                    onClick={() => ins('## ', '', 'Heading 2')}
                  />
                  <ToolbarBtn
                    icon={Heading3}
                    label="H3"
                    onClick={() => ins('### ', '', 'Heading 3')}
                  />
                  <div className="bg-border/40 mx-1 h-4 w-px" />
                  <ToolbarBtn icon={List} label="List" onClick={() => ins('- ', '', 'item')} />
                  <ToolbarBtn
                    icon={ListOrdered}
                    label="Ordered"
                    onClick={() => ins('1. ', '', 'item')}
                  />
                  <ToolbarBtn icon={Quote} label="Quote" onClick={() => ins('> ', '', 'kutipan')} />
                  <div className="bg-border/40 mx-1 h-4 w-px" />
                  <ToolbarBtn icon={Code} label="Code" onClick={() => ins('`', '`', 'code')} />
                  <ToolbarBtn
                    icon={Link2}
                    label="Link"
                    onClick={() => ins('[', '](url)', 'teks')}
                  />
                  <ToolbarBtn icon={Minus} label="Divider" onClick={() => ins('\n---\n', '', '')} />
                  <div className="bg-border/40 mx-1 h-4 w-px" />
                  <label
                    title="Upload"
                    className="text-muted-foreground/60 hover:bg-muted/40 hover:text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors"
                  >
                    {uploading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) uploadContentImage(f)
                      }}
                    />
                  </label>
                  <ToolbarBtn
                    icon={ImageIcon}
                    label="Image URL"
                    onClick={() => ins('![alt](', ')', 'url')}
                  />
                </div>
              )}
            </div>
            {activeTab === 'write' ? (
              <textarea
                ref={taRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={28}
                placeholder="Tulis konten artikel..."
                className="placeholder:text-muted-foreground/15 w-full resize-none bg-transparent px-4 py-3 font-mono text-sm leading-relaxed outline-none"
              />
            ) : (
              <div className="min-h-[400px] px-4 py-3">
                {content.trim() ? (
                  <MarkdownRenderer content={content} />
                ) : (
                  <p className="text-muted-foreground/30 text-sm italic">Belum ada konten.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="glass-card p-4">
            <ImageUrlInput
              label="Cover / Thumbnail"
              value={coverurl}
              onChange={setCoverurl}
              placeholder="https://... atau paste gambar"
              hint="Rekomendasi 1280×720px"
              previewClass="h-32"
              required={false}
            />
          </div>
          <div className="glass-card p-4">
            <label className="text-muted-foreground/60 mb-1.5 block text-xs font-semibold tracking-wide uppercase">
              Deskripsi Singkat
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Deskripsi untuk SEO dan preview..."
              className="border-border/50 bg-background/40 focus:ring-primary/30 w-full resize-none rounded-xl border px-3 py-2 text-sm transition-all outline-none focus:ring-2"
            />
          </div>
          <div className="glass-card space-y-2 p-4">
            <label className="text-muted-foreground/60 block text-xs font-semibold tracking-wide uppercase">
              Tags / Hashtag
            </label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="anime, review..."
                className="border-border/50 bg-background/40 focus:ring-primary/30 flex-1 rounded-xl border px-3 py-1.5 text-sm transition-all outline-none focus:ring-2"
              />
              <button
                onClick={addTag}
                className="bg-primary/15 text-primary hover:bg-primary/25 flex h-8 w-8 items-center justify-center rounded-xl transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex min-h-[24px] flex-wrap gap-1.5">
              {tags.map((t: string) => (
                <span
                  key={t}
                  className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs"
                >
                  #{t}
                  <button onClick={() => setTags(tags.filter((x) => x !== t))}>
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="glass-card space-y-1.5 p-4">
            <p className="text-muted-foreground/50 text-xs font-semibold tracking-wide uppercase">
              Info Artikel
            </p>
            {[
              ['Kata', wordCount],
              ['Baca', `~${readMins} menit`],
              ['Karakter', content.length],
            ].map(([k, v]) => (
              <div
                key={String(k)}
                className="text-muted-foreground/60 flex justify-between text-xs"
              >
                <span>{k}</span>
                <span className="font-mono">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
