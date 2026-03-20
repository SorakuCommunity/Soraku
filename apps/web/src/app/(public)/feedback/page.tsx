import type { Metadata } from "next";
export const metadata: Metadata = { title: "Masukan — Soraku" };
export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 text-center">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-border/40 bg-primary/10 text-3xl">
        💬
      </div>
      <h1 className="text-3xl font-black mb-3">Kirim Masukan</h1>
      <p className="text-muted-foreground/70 mb-8 leading-relaxed">
        Kami sangat menghargai masukanmu untuk membuat Soraku lebih baik.
        Sampaikan saran, laporan bug, atau ide kreatifmu langsung di Discord kami.
      </p>
      <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
        Buka Discord Soraku
      </a>
      <p className="mt-6 text-xs text-muted-foreground/40">Atau kirim email ke: admin@soraku.id</p>
    </div>
  );
}
