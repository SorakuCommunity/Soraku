'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Clock, Eye, BookOpen, X } from 'lucide-react'
import { db } from '@/lib/supabase/client'

type SearchResult = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  coverurl: string | null
  tags: string[]
  publishedat: string
  viewcount: number
}

function formatTime(date: string) {
  const d = new Date(date)
  const diff = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diff < 60) return 'baru saja'
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function SearchClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''

  const [input, setInput] = useState(q)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const doSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const { data } = await (await db())
        .from('posts')
        .select('id,slug,title,excerpt,coverurl,tags,publishedat,viewcount')
        .eq('ispublished', true)
        .ilike('title', `%${query}%`)
        .order('publishedat', { ascending: false })
        .limit(20)
      setResults((data ?? []) as SearchResult[])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (q) doSearch(q)
  }, [q, doSearch])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    } else {
      router.push('/search')
    }
  }

  function clearSearch() {
    setInput('')
    setResults([])
    router.push('/search')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Cari artikel..."
            className="w-full rounded-md border-2 border-black bg-surface py-3 pl-11 pr-10 text-sm font-bold text-foreground shadow-[3px_3px_0px_#000] outline-none transition-all focus:shadow-[1px_1px_0px_#000] focus:translate-x-[2px] focus:translate-y-[2px]"
          />
          {input && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {!q && (
        <div className="flex flex-col items-center justify-center py-20">
          <Search className="mb-4 h-16 w-16 text-muted" />
          <p className="text-sm text-muted">Masukkan kata kunci untuk mencari artikel.</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-sm text-muted">Mencari...</p>
        </div>
      )}

      {!loading && q && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <BookOpen className="mb-4 h-16 w-16 text-muted" />
          <p className="text-sm text-muted">
            Tidak ada hasil untuk &quot;{q}&quot;.
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2">
          {results.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-md border-2 border-black bg-surface shadow-[3px_3px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000]"
            >
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/20 to-violet-500/15">
                {post.coverurl ? (
                  <Image
                    src={post.coverurl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="400px"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-sm font-bold leading-tight text-foreground group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-[10px] text-muted">{post.excerpt}</p>
                <div className="mt-auto flex items-center gap-3 pt-3 text-[9px] text-muted">
                  <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{formatTime(post.publishedat)}</span>
                  <span className="flex items-center gap-1"><Eye className="h-2.5 w-2.5" />{post.viewcount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
