import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Ketentuan Penggunaan — Soraku' }
export default function TosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-black">Ketentuan Penggunaan</h1>
      <p className="text-muted-foreground/60 mb-10 text-sm">Terakhir diperbarui: Maret 2026</p>
      <div className="text-muted-foreground/80 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-foreground mb-2 text-lg font-black">1. Penerimaan Ketentuan</h2>
          <p>
            Dengan menggunakan platform Soraku Community, kamu menyetujui ketentuan penggunaan ini.
            Jika tidak setuju, mohon hentikan penggunaan platform.
          </p>
        </section>
        <section>
          <h2 className="text-foreground mb-2 text-lg font-black">2. Penggunaan yang Diizinkan</h2>
          <p>
            Platform Soraku digunakan untuk berbagi konten anime, manga, VTuber, dan budaya Jepang.
            Pengguna wajib menjaga sopan santun dan menghormati sesama anggota komunitas.
          </p>
        </section>
        <section>
          <h2 className="text-foreground mb-2 text-lg font-black">3. Konten Terlarang</h2>
          <p>
            Dilarang mengunggah konten yang melanggar hukum, mengandung ujaran kebencian, spam, atau
            materi dewasa tanpa izin. Pelanggaran dapat mengakibatkan penangguhan akun.
          </p>
        </section>
        <section>
          <h2 className="text-foreground mb-2 text-lg font-black">4. Hak Kekayaan Intelektual</h2>
          <p>
            Konten yang kamu unggah tetap menjadi milikmu. Dengan mengunggah, kamu memberikan Soraku
            lisensi untuk menampilkan konten tersebut di platform.
          </p>
        </section>
      </div>
    </div>
  )
}
