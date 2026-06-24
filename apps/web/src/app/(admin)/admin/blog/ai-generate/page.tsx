'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Save,
  FileText,
  Hash,
  Quote,
  ImageIcon,
  RefreshCw,
  X,
  BookOpen,
  MessageSquare,
  PenTool,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const CONTENT_TYPES = [
  { id: 'article', label: 'Article', icon: FileText },
  { id: 'seo_title', label: 'SEO Title', icon: Hash },
  { id: 'seo_description', label: 'SEO Description', icon: Quote },
  { id: 'excerpt', label: 'Excerpt', icon: BookOpen },
  { id: 'tags', label: 'Tags', icon: Hash },
  { id: 'slug', label: 'Slug', icon: PenTool },
  { id: 'faq', label: 'FAQ', icon: MessageSquare },
  { id: 'cover_prompt', label: 'Cover Image Prompt', icon: ImageIcon },
  { id: 'rewrite', label: 'Rewrite', icon: RefreshCw },
  { id: 'expand', label: 'Expand', icon: Maximize2 },
  { id: 'summarize', label: 'Summarize', icon: Minimize2 },
] as const

const TONES = ['Professional', 'Casual', 'Educational', 'Entertaining'] as const

function OutputField({
  label,
  value,
  field,
  onCopy,
  copiedField,
}: {
  label: string
  value: string
  field: string
  onCopy: (text: string, field: string) => void
  copiedField: string | null
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
          {label}
        </label>
        <button
          onClick={() => onCopy(value, field)}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
        >
          {copiedField === field ? (
            <><Check className="h-3 w-3" /> Copied</>
          ) : (
            <><Copy className="h-3 w-3" /> Copy</>
          )}
        </button>
      </div>
      <div className="rounded-md border-2 border-border bg-card px-3 py-2 text-xs">
        {value}
      </div>
    </div>
  )
}

export default function AIGeneratePage() {
  const router = useRouter()
  const [contentType, setContentType] = useState('article')
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [tone, setTone] = useState('Professional')
  const [language, setLanguage] = useState<'id' | 'en'>('id')
  const [wordCount, setWordCount] = useState(1000)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const needsContent = ['rewrite', 'expand', 'summarize'].includes(contentType)

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const generate = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/admin/blog/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          keywords: keywords.trim() || undefined,
          tone,
          language,
          wordCount,
          contentType,
          ...(needsContent && content.trim() ? { content: content.trim() } : {}),
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json?.error?.message || 'Gagal generate konten')
        return
      }
      setResult(json?.data || json)
    } catch {
      setError('Terjadi kesalahan koneksi')
    } finally {
      setLoading(false)
    }
  }

  const saveAsDraft = async () => {
    if (!result) return
    setSaving(true)
    try {
      const title = result.title || topic
      const slug =
        result.slug ||
        topic
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()

      const payload: Record<string, any> = {
        title,
        slug,
        content: result.content || result.result || result.raw || '',
        excerpt: result.excerpt || '',
        tags: result.tags || [],
        ispublished: false,
      }

      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json?.error?.message || 'Gagal menyimpan draft')
        return
      }
      router.push('/admin/blog')
    } catch {
      setError('Gagal menyimpan draft')
    } finally {
      setSaving(false)
    }
  }

  const renderArticle = () => {
    if (!result) return null
    return (
      <div className="space-y-4">
        {result.title && (
          <OutputField
            label="Title"
            value={result.title}
            field="title"
            onCopy={copyToClipboard}
            copiedField={copiedField}
          />
        )}
        {result.slug && (
          <OutputField
            label="Slug"
            value={result.slug}
            field="slug"
            onCopy={copyToClipboard}
            copiedField={copiedField}
          />
        )}
        {result.excerpt && (
          <OutputField
            label="Excerpt"
            value={result.excerpt}
            field="excerpt"
            onCopy={copyToClipboard}
            copiedField={copiedField}
          />
        )}
        {result.content && (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                Content
              </label>
              <button
                onClick={() => copyToClipboard(result.content, 'content')}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
              >
                {copiedField === 'content' ? (
                  <><Check className="h-3 w-3" /> Copied</>
                ) : (
                  <><Copy className="h-3 w-3" /> Copy</>
                )}
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-md border-2 border-border bg-card p-3 font-mono text-xs leading-relaxed">
              {result.content}
            </div>
          </div>
        )}
        {result.tags?.length > 0 && (
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {result.tags.map((t: string) => (
                <span
                  key={t}
                  className="rounded-md border-2 border-border px-2 py-0.5 text-xs font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}
        {result.seoTitle && (
          <OutputField
            label="SEO Title"
            value={result.seoTitle}
            field="seoTitle"
            onCopy={copyToClipboard}
            copiedField={copiedField}
          />
        )}
        {result.seoDescription && (
          <OutputField
            label="SEO Description"
            value={result.seoDescription}
            field="seoDescription"
            onCopy={copyToClipboard}
            copiedField={copiedField}
          />
        )}
        {result.faq?.length > 0 && (
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              FAQ
            </label>
            <div className="space-y-2">
              {result.faq.map((item: any, i: number) => (
                <div
                  key={i}
                  className="rounded-md border-2 border-border bg-card p-3"
                >
                  <p className="text-xs font-bold">Q: {item.question}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    A: {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderOutput = () => {
    if (!result) return null

    if (contentType === 'article') {
      return renderArticle()
    }

    if (contentType === 'tags' || (contentType === 'tags' && Array.isArray(result.result))) {
      const tags = result.result || result.tags || []
      if (Array.isArray(tags)) {
        return (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t: string, i: number) => (
              <span
                key={i}
                className="rounded-md border-2 border-border px-2 py-0.5 text-xs font-medium"
              >
                #{t}
              </span>
            ))}
          </div>
        )
      }
    }

    if (contentType === 'faq' && Array.isArray(result.result || result.faq)) {
      const faqs = result.result || result.faq || []
      return (
        <div className="space-y-2">
          {faqs.map((item: any, i: number) => (
            <div
              key={i}
              className="rounded-md border-2 border-border bg-card p-3"
            >
              <p className="text-xs font-bold">
                Q: {item.question || item.Q}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                A: {item.answer || item.A}
              </p>
            </div>
          ))}
        </div>
      )
    }

    if (
      Array.isArray(result.result) &&
      ['seo_title', 'seo_description', 'slug'].includes(contentType)
    ) {
      return (
        <ul className="space-y-1">
          {result.result.map((item: string, i: number) => (
            <li
              key={i}
              className="flex items-center gap-2 rounded-md border-2 border-border bg-card px-3 py-2 text-xs"
            >
              <span className="text-muted-foreground/40 font-mono">{i + 1}.</span>
              <span>{item}</span>
              <button
                onClick={() => copyToClipboard(item, `${contentType}_${i}`)}
                className="ml-auto flex-shrink-0 text-muted-foreground hover:text-foreground"
              >
                {copiedField === `${contentType}_${i}` ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )
    }

    if (result.result && typeof result.result === 'string') {
      return (
        <div className="rounded-md border-2 border-border bg-card p-3">
          <p className="whitespace-pre-wrap text-xs leading-relaxed">
            {result.result}
          </p>
          <button
            onClick={() => copyToClipboard(result.result, 'result')}
            className="mt-2 text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
          >
            {copiedField === 'result' ? (
              <><Check className="h-3 w-3" /> Copied</>
            ) : (
              <><Copy className="h-3 w-3" /> Copy</>
            )}
          </button>
        </div>
      )
    }

    const textValue =
      result.result || result.content || result.title || result.raw
    if (textValue) {
      return (
        <div className="rounded-md border-2 border-border bg-card p-3">
          <pre className="whitespace-pre-wrap text-xs leading-relaxed">
            {typeof textValue === 'string'
              ? textValue
              : JSON.stringify(textValue, null, 2)}
          </pre>
        </div>
      )
    }

    return (
      <pre className="whitespace-pre-wrap text-xs leading-relaxed">
        {JSON.stringify(result, null, 2)}
      </pre>
    )
  }

  const currentType = CONTENT_TYPES.find((ct) => ct.id === contentType)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/blog"
          className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-border bg-card shadow-[2px_2px_0px_0px_#000] transition-all hover:shadow-[3px_3px_0px_0px_#000]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-primary/60 mb-1 text-[11px] font-bold tracking-widest uppercase">
            Admin Panel
          </p>
          <h1 className="flex items-center gap-2 text-2xl font-black">
            <Sparkles className="h-5 w-5" /> AI Blog Generator
          </h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Content Type
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CONTENT_TYPES.map((ct) => {
                const Icon = ct.icon
                return (
                  <button
                    key={ct.id}
                    onClick={() => setContentType(ct.id)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-md border-2 px-2.5 py-1.5 text-xs font-semibold transition-all',
                      contentType === ct.id
                        ? 'border-border bg-card shadow-[2px_2px_0px_0px_#000]'
                        : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {ct.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Topic <span className="text-destructive">*</span>
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              placeholder="Enter your blog topic..."
              className="w-full resize-none rounded-md border-2 border-border bg-card px-3 py-2 text-sm outline-none transition-all focus:shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Keywords{' '}
              <span className="text-muted-foreground/40">
                (optional, comma-separated)
              </span>
            </label>
            <input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="anime, review, rekomendasi"
              className="w-full rounded-md border-2 border-border bg-card px-3 py-2 text-sm outline-none transition-all focus:shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          {needsContent && (
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                Content to {contentType}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder="Paste the content to rewrite/expand/summarize..."
                className="w-full resize-none rounded-md border-2 border-border bg-card px-3 py-2 text-sm outline-none transition-all focus:shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-md border-2 border-border bg-card px-3 py-2 text-sm outline-none transition-all focus:shadow-[2px_2px_0px_0px_#000]"
            >
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Language
            </label>
            <div className="flex gap-1">
              {(['id', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    'rounded-md border-2 px-4 py-1.5 text-xs font-bold transition-all',
                    language === lang
                      ? 'border-border bg-card shadow-[2px_2px_0px_0px_#000]'
                      : 'border-transparent text-muted-foreground hover:border-border'
                  )}
                >
                  {lang === 'id' ? 'Indonesia' : 'English'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Word Count
            </label>
            <input
              type="number"
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              min={100}
              max={5000}
              className="w-full rounded-md border-2 border-border bg-card px-3 py-2 text-sm outline-none transition-all focus:shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          <button
            onClick={generate}
            disabled={loading || !topic.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-border bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-[3px_3px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0px_0px_#000]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate
              </>
            )}
          </button>

          {error && (
            <div className="flex items-start gap-2 rounded-md border-2 border-destructive/30 bg-destructive/10 p-3">
              <X className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-destructive" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-destructive">{error}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={generate}
                  className="text-destructive hover:text-destructive/80 flex items-center gap-1 text-xs font-semibold"
                >
                  <RefreshCw className="h-3 w-3" /> Retry
                </button>
                <button
                  onClick={() => setError(null)}
                  className="text-destructive/60 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="rounded-md border-2 border-border bg-card shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center justify-between border-b-2 border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-bold">Output</span>
                {currentType && (
                  <span className="rounded-md border-2 border-border px-1.5 py-0.5 text-[10px] font-semibold">
                    {currentType.label}
                  </span>
                )}
              </div>
              {result && (
                <button
                  onClick={saveAsDraft}
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-md border-2 border-border px-3 py-1.5 text-xs font-bold shadow-[2px_2px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Save className="h-3 w-3" />
                  )}
                  Save as Draft
                </button>
              )}
            </div>
            <div className="min-h-[300px] p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-xs font-medium text-muted-foreground">
                    Generating content...
                  </p>
                </div>
              ) : result ? (
                renderOutput()
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-12">
                  <Sparkles className="h-8 w-8 text-muted-foreground/20" />
                  <p className="text-xs font-medium text-muted-foreground/40">
                    Generated content will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
