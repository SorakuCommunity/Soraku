// components/komunitas/KomunitasClient.tsx — SORAKU v1.0.a3.4
// Filter tabs + glass post/gallery/discussion grid
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Clock, TrendingUp, MessageCircle, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface GalleryItem {
  id: string
  image_url: string
  caption: string | null
  created_at: string
  likes: number | null
  user_id: string
}

interface Discussion {
  id: string
  title: string
  url: string
  createdAt: string
  author: { login: string; avatarUrl: string }
  upvoteCount: number
  comments: { totalCount: number }
}

type Tab = 'newest' | 'popular' | 'trending'

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'newest',   label: 'Terbaru',  icon: <Clock size={14} /> },
  { id: 'popular',  label: 'Populer',  icon: <Heart size={14} /> },
  { id: 'trending', label: 'Trending', icon: <TrendingUp size={14} /> },
]

export function KomunitasClient({
  gallery,
  discussions,
}: {
  gallery: GalleryItem[]
  discussions: Record<string, unknown>[]
}) {
  const [activeTab, setActiveTab] = useState<Tab>('newest')

  const sortedGallery = [...gallery].sort((a, b) => {
    if (activeTab === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    if (activeTab === 'popular') {
      return (b.likes ?? 0) - (a.likes ?? 0)
    }
    // trending: blend of likes + recency
    const scoreA = (a.likes ?? 0) * 0.7 + new Date(a.created_at).getTime() / 1e12 * 0.3
    const scoreB = (b.likes ?? 0) * 0.7 + new Date(b.created_at).getTime() / 1e12 * 0.3
    return scoreB - scoreA
  })

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap sm:flex-nowrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 w-full sm:w-auto justify-center"
            style={{
              backgroundColor: activeTab === tab.id
                ? 'var(--color-primary)'
                : 'rgba(255,255,255,0.05)',
              color: activeTab === tab.id ? '#fff' : 'var(--text-sub)',
              border: `1px solid ${activeTab === tab.id ? 'transparent' : 'rgba(255,255,255,0.10)'}`,
              boxShadow: activeTab === tab.id ? '0 0 20px var(--color-primary)40' : 'none',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          {sortedGallery.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-10">
              {sortedGallery.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <GalleryCard item={item} />
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </motion.div>
      </AnimatePresence>

      {/* GitHub Discussions */}
      {discussions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle size={16} style={{ color: 'var(--color-primary)' }} />
            <h2 className="font-bold text-base" style={{ color: 'var(--text)' }}>Diskusi Komunitas</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(discussions as unknown as Discussion[]).slice(0, 8).map(d => (
              <a
                key={d.id}
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl backdrop-blur-xl group"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderColor: 'rgba(255,255,255,0.09)',
                }}
              >
                <Image
                  src={d.author.avatarUrl}
                  alt={d.author.login}
                  width={36}
                  height={36}
                  className="rounded-full shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors"
                    style={{ color: 'var(--text)' }}>
                    {d.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs" style={{ color: 'var(--text-sub)' }}>
                      {d.author.login}
                    </span>
                    <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-sub)' }}>
                      <Heart size={10} /> {d.upvoteCount}
                    </span>
                    <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-sub)' }}>
                      <MessageCircle size={10} /> {d.comments.totalCount}
                    </span>
                  </div>
                </div>
                <ExternalLink size={14} className="shrink-0 mt-0.5 opacity-40 group-hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--text-sub)' }} />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function GalleryCard({ item }: { item: GalleryItem }) {
  return (
    <div
      className="group relative rounded-xl overflow-hidden border transition-all duration-300 hover:scale-[1.03] hover:shadow-xl cursor-pointer"
      style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderColor: 'rgba(255,255,255,0.09)',
      }}
    >
      <div className="aspect-square relative">
        <Image
          src={item.image_url}
          alt={item.caption ?? ''}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}>
          {item.caption && (
            <p className="text-white text-xs line-clamp-2 font-medium">{item.caption}</p>
          )}
          <div className="flex items-center gap-1.5 mt-1">
            <Heart size={10} className="text-red-400" />
            <span className="text-xs text-white/70">{item.likes ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">🎌</div>
      <p className="text-sm" style={{ color: 'var(--text-sub)' }}>
        Belum ada konten. Jadilah yang pertama berbagi!
      </p>
      <Link
        href="/gallery/upload"
        className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        Upload Karya
      </Link>
    </div>
  )
}
