'use client'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>Terjadi Kesalahan</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-sub)' }}>{error.message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset}
            className="px-5 py-2.5 rounded-xl font-medium text-sm border hover:bg-[var(--hover-bg)] transition-all min-h-[44px]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-sub)' }}>
            Coba Lagi
          </button>
          <Link href="/"
            className="px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all min-h-[44px] flex items-center"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
            Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
