import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Kebijakan Privasi | Soraku' }
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-black">Kebijakan Privasi</h1>
      <p className="text-muted-foreground/60 mb-10 text-sm">
        Terakhir diperbarui: 29 Maret 2026 &middot; Berlaku sejak 10 Februari 2026
      </p>

      <div className="text-muted-foreground/80 space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">1. Pendahuluan</h2>
          <p>
            Soraku (&ldquo;Soraku&rdquo;, &ldquo;kami&rdquo;) menghargai privasi setiap
            pengguna (&ldquo;kamu&rdquo;, &ldquo;pengguna&rdquo;). Kebijakan Privasi ini menjelaskan
            bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadimu
            saat menggunakan platform di{' '}
            <span className="text-foreground font-semibold">www.soraku.id</span> beserta layanan
            terkait.
          </p>
          <p className="mt-2">
            Dengan menggunakan platform Soraku, kamu menyetujui praktik yang dijelaskan dalam
            kebijakan ini. Jika tidak setuju, mohon hentikan penggunaan platform.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">
            2. Informasi yang Kami Kumpulkan
          </h2>
          <p className="mb-2">Kami mengumpulkan beberapa jenis informasi:</p>

          <h3 className="text-foreground mt-4 mb-1 font-bold">a. Informasi yang Kamu Berikan</h3>
          <ul className="ml-2 list-inside list-disc space-y-1">
            <li>
              <span className="text-foreground font-medium">Akun</span> &mdash; nama pengguna, nama
              tampilan, alamat email, foto profil, dan bio saat mendaftar atau mengedit profil.
            </li>
            <li>
              <span className="text-foreground font-medium">Konten</span> &mdash; artikel blog,
              komentar, unggahan galeri, dan interaksi lainnya yang kamu buat di platform.
            </li>
            <li>
              <span className="text-foreground font-medium">Pendaftaran event</span> &mdash; nama
              tim, anggota tim, informasi kontak Discord, dan data terkait pendaftaran turnamen.
            </li>
            <li>
              <span className="text-foreground font-medium">Komunikasi</span> &mdash; masukan,
              saran, dan pesan yang kamu kirim melalui formulir feedback.
            </li>
          </ul>

          <h3 className="text-foreground mt-4 mb-1 font-bold">b. Informasi Otomatis</h3>
          <ul className="ml-2 list-inside list-disc space-y-1">
            <li>
              <span className="text-foreground font-medium">Data penggunaan</span> &mdash; halaman
              yang diklik, waktu akses, dan pola navigasi.
            </li>
            <li>
              <span className="text-foreground font-medium">Data perangkat</span> &mdash; jenis
              browser, sistem operasi, dan resolusi layar.
            </li>
            <li>
              <span className="text-foreground font-medium">Alamat IP</span> &mdash; digunakan untuk
              keamanan, pencegahan spam, dan analitik agregat.
            </li>
            <li>
              <span className="text-foreground font-medium">Cookie</span> &mdash; untuk menjaga sesi
              login dan preferensi pengguna.
            </li>
          </ul>

          <h3 className="text-foreground mt-4 mb-1 font-bold">c. Informasi dari Pihak Ketiga</h3>
          <ul className="ml-2 list-inside list-disc space-y-1">
            <li>
              <span className="text-foreground font-medium">OAuth</span> &mdash; saat login via
              Discord atau Google, kami menerima nama, email, dan foto profil dari penyedia
              tersebut.
            </li>
            <li>
              <span className="text-foreground font-medium">Supabase Auth</span> &mdash; sistem
              autentikasi yang mengelola sesi dan token akses.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">3. Penggunaan Informasi</h2>
          <p className="mb-2">Informasi yang dikumpulkan digunakan untuk:</p>
          <ul className="ml-2 list-inside list-disc space-y-1">
            <li>Membuat dan mengelola akun pengguna di platform Soraku.</li>
            <li>Menampilkan profil publik dan konten yang kamu buat.</li>
            <li>
              Mengirim notifikasi terkait event, artikel baru, aktivitas komunitas, dan pembaruan
              platform.
            </li>
            <li>Mengelola pendaftaran event dan turnamen.</li>
            <li>Meningkatkan pengalaman pengguna, performa platform, dan keamanan.</li>
            <li>Menganalisis penggunaan platform secara agregat untuk pengembangan fitur.</li>
            <li>Mencegah penyalahgunaan, spam, dan aktivitas yang melanggar ketentuan.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">
            4. Penyimpanan dan Keamanan Data
          </h2>
          <p>
            Data disimpan di server <span className="text-foreground font-semibold">Supabase</span>{' '}
            dengan infrastruktur berbasis PostgreSQL yang dilindungi enkripsi. Kami menerapkan
            langkah-langkah keamanan berikut:
          </p>
          <ul className="mt-2 ml-2 list-inside list-disc space-y-1">
            <li>Enkripsi data dalam transit (HTTPS/TLS) dan di istirahat (at rest).</li>
            <li>Row-Level Security (RLS) untuk membatasi akses data antar pengguna.</li>
            <li>Autentikasi berbasis token dengan masa berlaku terbatas.</li>
            <li>Akses admin dibatasi berdasarkan peran (Owner, Manager, Admin).</li>
            <li>Backup reguler basis data untuk mencegah kehilangan data.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">5. Pembagian Informasi</h2>
          <p>
            Kami <span className="text-foreground font-bold">tidak menjual</span> data pribadimu
            kepada pihak ketiga. Informasi hanya dibagikan dalam kondisi berikut:
          </p>
          <ul className="mt-2 ml-2 list-inside list-disc space-y-1">
            <li>
              <span className="text-foreground font-medium">Layanan infrastruktur</span> &mdash;
              Supabase (database & auth), Vercel (hosting), dan Discord (OAuth & webhook) sebagai
              penyedia layanan.
            </li>
            <li>
              <span className="text-foreground font-medium">Kewajiban hukum</span> &mdash; jika
              diwajibkan oleh hukum atau perintah pengadilan yang sah.
            </li>
            <li>
              <span className="text-foreground font-medium">Persetujuan</span> &mdash; dengan izin
              eksplisit darimu untuk tujuan tertentu.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">6. Hak Pengguna</h2>
          <p className="mb-2">Kamu memiliki hak untuk:</p>
          <ul className="ml-2 list-inside list-disc space-y-1">
            <li>
              <span className="text-foreground font-medium">Mengakses</span> data pribadi yang kami
              simpan tentangmu.
            </li>
            <li>
              <span className="text-foreground font-medium">Memperbarui</span> informasi profil
              kapan saja melalui halaman pengaturan.
            </li>
            <li>
              <span className="text-foreground font-medium">Menghapus akun</span> &mdash; hubungi
              kami untuk penghapusan akun dan data terkait.
            </li>
            <li>
              <span className="text-foreground font-medium">Mengatur privasi</span> &mdash; mengatur
              profil sebagai publik atau privat.
            </li>
            <li>
              <span className="text-foreground font-medium">Menolak notifikasi</span> &mdash;
              mengelola preferensi notifikasi.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">7. Retensi Data</h2>
          <p>
            Data akun disimpan selama akun aktif. Setelah penghapusan akun, data pribadi akan
            dihapus dalam waktu 30 hari. Data agregat dan anonim untuk analitik dapat disimpan lebih
            lama. Konten publik yang telah diunggah (artikel, komentar) mungkin tetap tersedia
            setelah penghapusan akun atas dasar atribusi anonim.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">8. Privasi Anak</h2>
          <p>
            Platform Soraku ditujukan untuk pengguna berusia 13 tahun ke atas. Kami tidak dengan
            sengaja mengumpulkan data pribadi dari anak di bawah 13 tahun. Jika menemukan akun yang
            dimiliki oleh anak di bawah usia tersebut, kami akan menghapusnya.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">9. Perubahan Kebijakan</h2>
          <p>
            Kebijakan ini dapat diperbarui dari waktu ke waktu. Perubahan signifikan akan
            diinformasikan melalui pengumuman di platform atau notifikasi. Tanggal &ldquo;Terakhir
            diperbarui&rdquo; di bagian atas menunjukkan revisi terbaru.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">10. Kontak</h2>
          <p>
            Untuk pertanyaan, permintaan data, atau keluhan terkait privasi, hubungi kami melalui:
          </p>
          <ul className="mt-2 ml-2 list-inside list-disc space-y-1">
            <li>
              Email: <span className="text-foreground font-medium">admin@soraku.id</span>
            </li>
            <li>
              Discord: <span className="text-foreground font-medium">discord.gg/qm3XJvRa6B</span>
            </li>
            <li>
              Platform: <span className="text-foreground font-medium">www.soraku.id/feedback</span>
            </li>
          </ul>
        </section>

        <div className="mt-8 border-t border-white/[0.06] pt-6">
           <p className="text-muted-foreground/40 text-xs">
             Kebijakan Privasi ini berlaku untuk seluruh layanan Soraku termasuk website,
             API, dan integrasi Discord. &copy; 2023&ndash;2026 Soraku. Seluruh hak
             dilindungi.
           </p>
        </div>
      </div>
    </div>
  )
}
