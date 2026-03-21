import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Masukan — Soraku' }
export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-6">
      <div className="border-border/40 bg-primary/10 mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border text-3xl">
        💬
      </div>
      <h1 className="mb-3 text-3xl font-black">Kirim Masukan</h1>
      <p className="text-muted-foreground/70 mb-8 leading-relaxed">
        Kami sangat menghargai masukanmu untuk membuat Soraku lebih baik. Sampaikan saran, laporan
        bug, atau ide kreatifmu langsung di Discord kami.
      </p>
      <a
        href="https://discord.gg/qm3XJvRa6B"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-primary hover:bg-primary/90 shadow-primary/20 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-colors"
      >
        Buka Discord Soraku
      </a>
      <p className="text-muted-foreground/40 mt-6 text-xs">Atau kirim email ke: admin@soraku.id</p>
    </div>
  )
}
