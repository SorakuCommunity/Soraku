import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Upload, Palette } from 'lucide-react'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Gallery — Soraku' }
export const revalidate = 60

export default async function GalleryPage() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('gallery')
    .select('id, image_url, caption, description, hashtags, users(display_name, username, avatar_url)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(100)

  // Supabase returns users as array from JOIN — normalize to single object
  const gallery = (items ?? []).map((item) => ({
    ...item,
    users: Array.isArray(item.users) ? item.users[0] ?? null : item.users,
  }))

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                <Palette className="w-5 h-5 text-pink-400" />
              </div>
              <h1 className="font-display text-4xl font-bold">
                Gallery <span className="grad-text">Soraku</span>
              </h1>
            </div>
            <p className="text-soraku-sub max-w-xl">
              Karya fanart, ilustrasi, dan kreasi terbaik dari komunitas Soraku.
              Setiap karya dikurasi oleh moderator kami.
            </p>
          </div>
          <Link
            href="/gallery/upload"
            className="inline-flex items-center gap-2 bg-soraku-gradient text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            <Upload className="w-4 h-4" /> Upload Karya
          </Link>
        </div>

        {/* Client-side gallery with filter & zoom modal */}
        <GalleryGrid items={gallery} />
      </div>
    </div>
  )
}
