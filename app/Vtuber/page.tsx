import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'VTuber – Soraku' }

export default async function VtuberPage() {
  const supabase = await createClient()
  const { data: vtubers } = await supabase
    .from('vtubers')
    .select('id, name, slug, description, agency, avatar_url')
    .eq('active', true)
    .order('name')

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>VTuber</h1>
        <p className="text-sm" style={{ color: 'var(--text-sub)' }}>Kenali VTuber dan kreator konten dalam ekosistem Soraku.</p>
      </div>

      {!vtubers?.length ? (
        <div className="text-center py-24">
          <p className="text-4xl mb-4">🎭</p>
          <p style={{ color: 'var(--text-sub)' }}>Belum ada VTuber terdaftar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {vtubers.map(v => (
            <Link key={v.id} href={`/Vtuber/${v.slug}`}
              className="group rounded-2xl border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              {/* Avatar */}
              <div className="aspect-square overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
                {v.avatar_url ? (
                  <img src={v.avatar_url} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">🎭</div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-xs sm:text-sm truncate" style={{ color: 'var(--text)' }}>{v.name}</h3>
                {v.agency && (
                  <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-primary)' }}>{v.agency}</p>
                )}
                {v.description && (
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-sub)' }}>{v.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
