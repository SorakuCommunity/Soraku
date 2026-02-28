import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="text-center">
        <div className="text-8xl mb-6">404</div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>Halaman Tidak Ditemukan</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-sub)' }}>
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>
        <Link href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all min-h-[44px]"
          style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
