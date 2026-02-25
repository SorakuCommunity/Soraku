import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { CheckCircle, ImageIcon, Upload } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Gallery'
}

export const revalidate = 60

export default async function GalleryPage() {
  const supabase = await createClient()
  
  const { data: items } = await supabase
    .from('gallery')
    .select('id, image_url, caption, hashtags, users(display_name, username)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-20">
          <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Belum ada karya yang disetujui
          </h2>
          <p className="text-gray-600 mb-8">
            Karya terbaik dari komunitas Soraku akan muncul di sini.
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Karya
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Soraku Gallery
        </h1>
        <p className="text-xl text-gray-600">
          Karya terbaik dari komunitas Soraku.
        </p>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="break-inside-avoid mb-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100">
                <Image
                  src={item.image_url}
                  alt={item.caption || 'Soraku Gallery'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-3 line-clamp-2 min-h-[2.5rem]">
                  {item.caption}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.hashtags?.slice(0, 3).map((t: string) => (
                    <span
                      key={t}
                      className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                {item.users && item.users.length > 0 && item.users[0]?.display_name && (
                  <div className="flex items-center text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    oleh {item.users[0].display_name}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}