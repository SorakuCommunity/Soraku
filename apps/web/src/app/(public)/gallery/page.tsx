import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Upload, ImageIcon, ZoomIn } from 'lucide-react'
import { db } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Galeri — Soraku Community',
  description: 'Galeri karya anggota komunitas Soraku — fanart, cosplay, digital art, dan foto.',
}

// DB: gallery tidak punya kolom category — pakai tags sebagai kategori
const CATEGORIES = [
  { slug: 'Semua', emoji: '✨' },
  { slug: 'fanart', emoji: '🎨' },
  { slug: 'cosplay', emoji: '👘' },
  { slug: 'digital', emoji: '💻' },
  { slug: 'foto', emoji: '📷' },
  { slug: 'lainnya', emoji: '🌸' },
]

const COLORS = [
  'from-pink-500/20 to-rose-400/15',
  'from-violet-500/20 to-purple-400/15',
  'from-blue-500/20 to-cyan-400/15',
  'from-amber-500/20 to-yellow-400/15',
  'from-green-500/20 to-emerald-400/15',
  'from-primary/20 to-accent/15',
]

export default async function GalleryPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const activeCategory = params?.category ?? 'Semua'

  let query = (await db())
    .from('gallery')
    .select('id,imageurl,title,description,tags,status,createdat')
    .eq('status', 'approved')
    .order('createdat', { ascending: false })
    .limit(48)

  // Filter by tag karena gallery tidak punya kolom category
  if (activeCategory !== 'Semua') {
    query = query.contains('tags', [activeCategory])
  }

  const { data: items } = await query

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-primary/70 mb-3 text-xs font-bold tracking-widest uppercase">
            Komunitas
          </p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Galeri <span className="text-gradient">Karya</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-sm">
            Fanart, cosplay, dan karya kreatif dari anggota Soraku.
          </p>
        </div>
        <Link
          href="/gallery/upload"
          className="bg-primary shadow-primary/20 hover:shadow-primary/30 flex flex-shrink-0 items-center gap-2 self-start rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 sm:self-auto"
        >
          <Upload className="h-4 w-4" /> Upload Karya
        </Link>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map(({ slug, emoji }) => (
          <Link
            key={slug}
            href={slug === 'Semua' ? '/gallery' : `/gallery?category=${slug}`}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all ${
              activeCategory === slug
                ? 'bg-primary shadow-primary/20 text-white shadow-md'
                : 'border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground border hover:-translate-y-0.5'
            }`}
          >
            <span>{emoji}</span>
            <span>{slug}</span>
          </Link>
        ))}
      </div>

      {(items ?? []).length > 0 ? (
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {(items ?? []).map((item, idx) => (
            <div
              key={item.id}
              className="group border-border/50 bg-card/40 hover:border-primary/30 hover:shadow-primary/8 relative mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              {item.imageurl ? (
                <div
                  className={`relative w-full ${idx % 3 === 0 ? 'h-52' : idx % 3 === 1 ? 'h-36' : 'h-44'}`}
                >
                  <Image
                    src={item.imageurl}
                    alt={item.title ?? 'Karya galeri'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
              ) : (
                <div
                  className={`w-full bg-gradient-to-br ${COLORS[idx % COLORS.length]} flex items-center justify-center ${
                    idx % 3 === 0 ? 'h-52' : idx % 3 === 1 ? 'h-36' : 'h-44'
                  }`}
                >
                  <ImageIcon className="text-foreground/10 h-8 w-8" />
                </div>
              )}

              <div className="bg-background/70 absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <ZoomIn className="text-foreground/80 h-6 w-6" />
                <span className="text-foreground/70 text-xs font-semibold">Lihat</span>
              </div>

              {(item.tags ?? []).length > 0 && (
                <div className="absolute top-2 left-2">
                  <span className="bg-background/70 text-foreground/70 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize backdrop-blur-sm">
                    {(item.tags ?? [])[0]}
                  </span>
                </div>
              )}

              <div className="p-3">
                <p className="truncate text-xs font-semibold">{item.title ?? 'Karya'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="mb-3 text-4xl">🖼️</p>
          <p className="text-muted-foreground">Belum ada karya di kategori ini.</p>
          <Link
            href="/gallery/upload"
            className="text-primary mt-4 inline-flex items-center gap-2 text-sm hover:underline"
          >
            Upload karya pertama <Upload className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  )
}
