import type { Metadata } from 'next'
import { Suspense } from 'react'
import SearchClient from './SearchClient'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.soraku.id'

export const metadata: Metadata = {
  title: 'Cari | Soraku',
  description: 'Cari artikel anime & budaya Jepang di Soraku.',
  alternates: { canonical: `${BASE}/search` },
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-8"><p className="text-sm text-muted">Memuat...</p></div>}>
      <SearchClient />
    </Suspense>
  )
}
