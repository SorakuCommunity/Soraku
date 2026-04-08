import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Lisensi | Soraku' }
export default function LicensePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-black">Lisensi Soraku</h1>
      <p className="text-muted-foreground/60 mb-10 text-sm">
        Versi 1.0 &middot; Berlaku sejak 10 Februari 2026
      </p>

      <div className="text-muted-foreground/80 space-y-8 text-sm leading-relaxed">
        {/* === Soraku Source License === */}
        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">
            Soraku Community Source License
          </h2>
          <p className="text-muted-foreground/60 mb-4 text-xs">
            Hak Cipta (c) 2023&ndash;2026 Soraku Community &middot; Semua hak dilindungi
            undang-undang.
          </p>
          <p>
            <span className="text-foreground font-medium">Pemilik dan Pemegang Hak Cipta:</span>
            <br />
            Riu (Koordinator dan Pengembang Utama) &mdash; Soraku Community, Indonesia
          </p>
          <p className="mt-1">
            Kontak resmi: <span className="text-foreground font-medium">contact@soraku.id</span>{' '}
            (umum) ·<span className="text-foreground font-medium">admin@soraku.id</span>{' '}
            (admin/teknis)
            <br />
            Platform: <span className="text-foreground font-medium">www.soraku.id</span>
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">Bagian I &mdash; Definisi</h2>
          <ul className="ml-2 space-y-2">
            <li>
              <span className="text-foreground font-semibold">&ldquo;Perangkat lunak&rdquo;</span>{' '}
              mengacu pada seluruh kode sumber, aset digital, konfigurasi, dokumentasi, dan materi
              terkait yang terdapat dalam repositori.
            </li>
            <li>
              <span className="text-foreground font-semibold">&ldquo;Kontributor&rdquo;</span>{' '}
              adalah setiap individu atau entitas yang berkontribusi pada pengembangan perangkat
              lunak ini atas seizin pemilik.
            </li>
            <li>
              <span className="text-foreground font-semibold">&ldquo;Penggunaan&rdquo;</span>{' '}
              mencakup akses, salinan, modifikasi, distribusi, sublisensing, dan penggunaan dalam
              sistem produksi maupun pengembangan.
            </li>
            <li>
              <span className="text-foreground font-semibold">&ldquo;Platform Soraku&rdquo;</span>{' '}
              merujuk pada layanan komunitas yang dioperasikan di domain www.soraku.id beserta
              seluruh subdomain dan API terkait.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">
            Bagian II &mdash; Hak yang Diberikan
          </h2>
          <p>
            Dengan tunduk pada syarat dan ketentuan lisensi ini, pemilik memberikan izin terbatas,
            tidak eksklusif, dan tidak dapat dialihkan kepada kontributor resmi yang terdaftar
            untuk:
          </p>
          <ol className="mt-2 ml-2 list-inside list-decimal space-y-2">
            <li>
              Membaca dan mempelajari kode sumber untuk keperluan kontribusi pada Platform Soraku.
            </li>
            <li>
              Memodifikasi kode sumber dalam lingkup pekerjaan yang ditugaskan oleh koordinator
              proyek.
            </li>
            <li>
              Menjalankan salinan lokal perangkat lunak untuk keperluan pengembangan dan pengujian.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">Bagian III &mdash; Pembatasan</h2>
          <p>
            Tanpa izin tertulis eksplisit dari pemilik,{' '}
            <span className="text-foreground font-bold">dilarang keras</span> untuk:
          </p>
          <ol className="mt-2 ml-2 list-inside list-decimal space-y-2">
            <li>
              Mendistribusikan, menjual, menyewakan, atau memberikan perangkat lunak ini kepada
              pihak ketiga mana pun.
            </li>
            <li>
              Menggunakan perangkat lunak ini sebagai dasar produk atau layanan komersial lain.
            </li>
            <li>
              Menghapus, mengubah, atau menyembunyikan atribusi hak cipta, nama merek
              &ldquo;Soraku&rdquo;, atau identitas tim.
            </li>
            <li>
              Mendeploy instansi terpisah yang dapat menyerupai atau bersaing dengan Platform
              Soraku.
            </li>
            <li>
              Menggunakan nama, logo, maskot, atau identitas visual Soraku untuk tujuan di luar
              kontribusi resmi.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">Bagian IV &mdash; Kontribusi</h2>
          <p>
            Setiap kontribusi yang dikirimkan ke repositori dianggap sebagai karya yang diserahkan
            kepada proyek Soraku Community. Kontributor menyatakan bahwa:
          </p>
          <ol className="mt-2 ml-2 list-inside list-decimal space-y-2">
            <li>Kontributor memiliki hak penuh atas karya yang dikontribusikan.</li>
            <li>Kontribusi tidak melanggar hak pihak ketiga mana pun.</li>
            <li>
              Kontributor setuju bahwa pemilik dapat menggunakan kontribusi tanpa kompensasi
              tambahan.
            </li>
          </ol>
          <p className="mt-2">
            Kontributor tetap mendapatkan atribusi nama dalam catatan kontribusi proyek.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">
            Bagian V &mdash; Penolakan Garansi
          </h2>
          <p>
            Perangkat lunak ini disediakan &ldquo;sebagaimana adanya&rdquo; tanpa garansi dalam
            bentuk apa pun, baik tersurat maupun tersirat, termasuk garansi kelayakan untuk tujuan
            tertentu atau tidak adanya pelanggaran hak pihak ketiga.
          </p>
          <p className="mt-2">
            Pemilik tidak bertanggung jawab atas kerusakan, kerugian data, gangguan layanan, atau
            dampak lain yang timbul dari penggunaan perangkat lunak ini di luar konteks Platform
            Soraku yang resmi.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">
            Bagian VI &mdash; Pemutusan Lisensi
          </h2>
          <p>Hak yang diberikan lisensi ini berakhir secara otomatis apabila:</p>
          <ol className="mt-2 ml-2 list-inside list-decimal space-y-2">
            <li>Kontributor melanggar ketentuan mana pun dalam lisensi ini.</li>
            <li>Kontributor tidak lagi menjadi bagian aktif dari tim pengembang Soraku.</li>
            <li>Pemilik menerbitkan pemberitahuan tertulis mengenai pemutusan tersebut.</li>
          </ol>
          <p className="mt-2">
            Setelah pemutusan, kontributor wajib menghentikan semua penggunaan dan menghapus salinan
            perangkat lunak yang dimiliki.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">
            Bagian VII &mdash; Hukum yang Berlaku
          </h2>
          <p>
            Lisensi ini diatur dan ditafsirkan berdasarkan hukum Republik Indonesia. Setiap
            perselisihan diselesaikan melalui musyawarah mufakat terlebih dahulu sebelum ditempuh
            jalur hukum.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">Bagian VIII &mdash; Kontak</h2>
          <p>Untuk pertanyaan lisensi, izin khusus, atau kerja sama:</p>
          <ul className="mt-2 ml-2 list-inside list-disc space-y-1">
            <li>
              Surel: <span className="text-foreground font-medium">contact@soraku.id</span> (umum)
            </li>
            <li>
              Surel: <span className="text-foreground font-medium">admin@soraku.id</span>
              (admin/teknis)
            </li>
            <li>
              Platform: <span className="text-foreground font-medium">www.soraku.id</span>
            </li>
            <li>
              Discord: <span className="text-foreground font-medium">discord.gg/qm3XJvRa6B</span>
            </li>
          </ul>
        </section>

        {/* === Source code === */}
        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">Kode Sumber</h2>
          <p>
            Kode sumber Soraku tersedia di repositori GitHub resmi untuk transparansi dan
            kontribusi. Penggunaan kode sumber tetap mengikuti Soraku Community Source License di
            atas.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <a
              href="https://github.com/SorakuCommunity/Soraku"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold transition-all hover:border-white/[0.15] hover:bg-white/[0.08]"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              SorakuCommunity/Soraku
            </a>
          </div>
        </section>

        <div className="mt-8 border-t border-white/[0.06] pt-6">
          <p className="text-muted-foreground/40 text-xs">
            Soraku Community Source License v1.0 &middot; &copy; 2023&ndash;2026 Soraku Community
          </p>
        </div>
      </div>
    </div>
  )
}
