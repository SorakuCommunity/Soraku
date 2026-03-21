import Link from 'next/link'
export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="text-gradient block text-[6rem] leading-none font-black">空</span>
      <h1 className="mt-4 text-2xl font-bold">404 — Halaman tidak ditemukan</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Halaman yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
      <Link
        href="/"
        className="bg-primary shadow-primary/20 mt-6 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
      >
        Kembali ke Beranda
      </Link>
    </section>
  )
}
