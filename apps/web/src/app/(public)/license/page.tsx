import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Lisensi — Soraku' }
export default function LicensePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-black">Lisensi Konten</h1>
      <p className="text-muted-foreground/60 mb-10 text-sm">Maret 2026</p>
      <div className="text-muted-foreground/80 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-foreground mb-2 text-lg font-black">Konten Platform</h2>
          <p>
            Seluruh konten original di platform Soraku Community — termasuk desain, teks, dan
            ilustrasi yang dibuat oleh tim Soraku — dilindungi hak cipta © 2023–2026 Soraku
            Community.
          </p>
        </section>
        <section>
          <h2 className="text-foreground mb-2 text-lg font-black">Konten Pengguna</h2>
          <p>
            Karya yang diunggah anggota komunitas (fan art, tulisan, dll.) tetap menjadi hak milik
            pembuat aslinya. Soraku hanya menampilkan konten tersebut dengan izin pemilik.
          </p>
        </section>
        <section>
          <h2 className="text-foreground mb-2 text-lg font-black">Konten Pihak Ketiga</h2>
          <p>
            Karakter dan materi anime, manga, atau game yang ditampilkan adalah milik pemegang hak
            cipta masing-masing. Soraku adalah komunitas non-komersial dan tidak mengklaim
            kepemilikan atas konten tersebut.
          </p>
        </section>
      </div>
    </div>
  )
}
