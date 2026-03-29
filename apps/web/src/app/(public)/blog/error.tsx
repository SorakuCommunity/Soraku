'use client'
import Link from 'next/link'
export default function BlogError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-4 text-5xl">😢</p>
      <h2 className="mb-2 text-xl font-bold">Gagal memuat blog</h2>
      <p className="text-muted-foreground mb-6 text-sm">
        Terjadi kesalahan. Coba lagi atau kembali ke beranda.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-primary rounded-xl px-5 py-2.5 text-sm font-bold text-white"
        >
          Coba Lagi
        </button>
        <Link
          href="/"
          className="border-border text-muted-foreground rounded-xl border px-5 py-2.5 text-sm"
        >
          Beranda
        </Link>
      </div>
    </div>
  )
}
