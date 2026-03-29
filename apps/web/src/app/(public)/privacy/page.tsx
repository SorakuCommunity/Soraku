import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Kebijakan Privasi — Soraku' }
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-black">Kebijakan Privasi</h1>
      <p className="text-muted-foreground/60 mb-10 text-sm">Terakhir diperbarui: Maret 2026</p>
      <div className="prose prose-sm prose-invert text-muted-foreground/80 max-w-none space-y-6 leading-relaxed">
        <section>
          <h2 className="text-foreground mb-2 text-lg font-black">Informasi yang Kami Kumpulkan</h2>
          <p>
            Soraku Community mengumpulkan informasi yang kamu berikan secara langsung, seperti nama
            pengguna, alamat email, dan data profil yang kamu isi saat mendaftar. Kami juga
            mengumpulkan data penggunaan untuk meningkatkan layanan.
          </p>
        </section>
        <section>
          <h2 className="text-foreground mb-2 text-lg font-black">Penggunaan Informasi</h2>
          <p>
            Informasi yang kami kumpulkan digunakan untuk mengelola akun, mengirimkan notifikasi
            terkait event dan komunitas, serta meningkatkan pengalaman pengguna di platform Soraku.
          </p>
        </section>
        <section>
          <h2 className="text-foreground mb-2 text-lg font-black">Keamanan Data</h2>
          <p>
            Kami berkomitmen menjaga keamanan data pribadimu. Data disimpan secara aman dan tidak
            kami jual atau bagikan ke pihak ketiga tanpa persetujuanmu, kecuali diwajibkan oleh
            hukum.
          </p>
        </section>
        <section>
          <h2 className="text-foreground mb-2 text-lg font-black">Kontak</h2>
          <p>
            Jika ada pertanyaan terkait kebijakan privasi, hubungi kami melalui Discord Soraku
            Community.
          </p>
        </section>
      </div>
    </div>
  )
}
