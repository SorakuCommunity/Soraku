import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Ketentuan Penggunaan | Soraku' }
export default function TosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-black">Ketentuan Penggunaan</h1>
      <p className="text-muted-foreground/60 mb-10 text-sm">Terakhir diperbarui: 29 Maret 2026 &middot; Berlaku sejak 10 Februari 2026</p>

      <div className="text-muted-foreground/80 space-y-8 text-sm leading-relaxed">

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">1. Penerimaan Ketentuan</h2>
          <p>
            Selamat datang di Soraku Community (&ldquo;Soraku&rdquo;, &ldquo;kami&rdquo;). Dengan mengakses atau menggunakan
            platform di <span className="text-foreground font-semibold">www.soraku.id</span>, kamu (&ldquo;pengguna&rdquo;)
            menyetujui Ketentuan Penggunaan ini. Jika tidak setuju dengan ketentuan apa pun, mohon hentikan penggunaan platform.
          </p>
          <p className="mt-2">
            Ketentuan ini berlaku untuk semua pengguna, termasuk pengunjung, anggota terdaftar, kreator, dan admin.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">2. Deskripsi Layanan</h2>
          <p>
            Soraku adalah platform komunitas non-profit yang berfokus pada budaya pop Jepang &mdash; anime, manga, VTuber,
            gaming, J-Music, dan cosplay. Platform menyediakan:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
            <li>Blog dan artikel komunitas.</li>
            <li>Event dan turnamen gaming (online/offline).</li>
            <li>Galeri karya (fanart, cosplay, kreasi).</li>
            <li>Sistem profil dengan badge dan level.</li>
            <li>Integrasi dengan server Discord komunitas.</li>
            <li>Notifikasi real-time untuk aktivitas komunitas.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">3. Akun dan Registrasi</h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Kamu harus berusia minimal 13 tahun untuk membuat akun.</li>
            <li>Registrasi dilakukan melalui Discord OAuth atau Google OAuth.</li>
            <li>Kamu bertanggung jawab menjaga kerahasiaan kredensial akun.</li>
            <li>Satu orang hanya boleh memiliki satu akun aktif.</li>
            <li>Kamu wajib memberikan informasi yang akurat saat registrasi.</li>
            <li>Soraku berhak menangguhkan atau menghapus akun yang melanggar ketentuan.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">4. Perilaku Pengguna</h2>
          <p className="mb-2">Sebagai anggota komunitas Soraku, kamu setuju untuk:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Bersikap sopan, saling menghormati, dan menjaga lingkungan komunitas yang positif.</li>
            <li>Tidak melakukan diskriminasi, perundungan (bullying), atau pelecehan dalam bentuk apa pun.</li>
            <li>Menghargai hak kekayaan intelektual orang lain.</li>
            <li>Tidak membagikan informasi pribadi orang lain tanpa izin.</li>
            <li>Mematuhi panduan komunitas dan keputusan moderator.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">5. Konten Terlarang</h2>
          <p className="mb-2">Konten berikut dilarang di platform Soraku:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Konten yang melanggar hukum Republik Indonesia.</li>
            <li>Ujaran kebencian, diskriminasi SARA, atau ekstremisme.</li>
            <li>Konten pornografi, cabul, atau eksplisit secara seksual.</li>
            <li>Spam, iklan tidak sah, atau skema penipuan.</li>
            <li>Malware, phising, atau tautan berbahaya.</li>
            <li>Konten yang mengandung kekerasan eksplisit atau mengerikan.</li>
            <li>Pelanggaran hak cipta atau merek dagang pihak ketiga.</li>
            <li>Informasi palsu atau menyesatkan yang bertujuan menipu.</li>
          </ul>
          <p className="mt-2">
            Pelanggaran dapat mengakibatkan peringatan, penangguhan sementara, atau penghapusan akun permanen.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">6. Konten dan Hak Kekayaan Intelektual</h2>

          <h3 className="text-foreground font-bold mt-4 mb-1">a. Konten Platform</h3>
          <p>
            Seluruh elemen original platform Soraku &mdash; termasuk desain antarmuka, kode sumber, logo,
            maskot, dan dokumentasi &mdash; dilindungi hak cipta &copy; 2023&ndash;2026 Soraku Community.
            Penggunaan di luar platform tanpa izin tertulis dilarang.
          </p>

          <h3 className="text-foreground font-bold mt-4 mb-1">b. Konten Pengguna</h3>
          <p>
            Konten yang kamu unggah (artikel, fanart, cosplay, komentar) tetap menjadi milikmu.
            Dengan mengunggah konten, kamu memberikan Soraku lisensi non-eksklusif untuk menampilkan,
            menyimpan, dan mendistribusikan konten tersebut di dalam platform.
          </p>

          <h3 className="text-foreground font-bold mt-4 mb-1">c. Konten Pihak Ketiga</h3>
          <p>
            Karakter anime, manga, game, dan materi terkait yang ditampilkan di platform adalah milik
            pemegang hak cipta masing-masing. Soraku adalah komunitas non-komersial dan tidak mengklaim
            kepemilikan atas konten tersebut. Pengguna bertanggung jawab atas konten yang diunggah.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">7. Event dan Turnamen</h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Pendaftaran event mengikuti syarat yang ditetapkan pada halaman event masing-masing.</li>
            <li>Event berbayar memiliki ketentuan pembayaran dan kebijakan pengembalian yang terpisah.</li>
            <li>Soraku berhak membatalkan atau mengubah jadwal event tanpa pemberitahuan sebelumnya.</li>
            <li>Peserta event harus mematuhi peraturan turnamen yang berlaku.</li>
            <li>Keputusan panitia event bersifat final.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">8. Pembatasan Tanggung Jawab</h2>
          <p>
            Platform Soraku disediakan &ldquo;sebagaimana adanya&rdquo; tanpa jaminan apa pun. Kami tidak
            bertanggung jawab atas:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
            <li>Gangguan layanan, kehilangan data, atau kerusakan yang timbul dari penggunaan platform.</li>
            <li>Konten yang diunggah oleh pengguna lain.</li>
            <li>Kerugian yang timbul dari interaksi dengan pengguna lain.</li>
            <li>Layanan pihak ketiga yang terintegrasi dengan platform.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">9. Penangguhan dan Penghapusan Akun</h2>
          <p>
            Soraku berhak menangguhkan atau menghapus akun yang melanggar ketentuan ini tanpa
            pemberitahuan sebelumnya. Pengguna dapat mengajukan banding melalui email atau Discord
            dalam waktu 14 hari setelah penangguhan.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">10. Perubahan Ketentuan</h2>
          <p>
            Ketentuan ini dapat diubah dari waktu ke waktu. Perubahan signifikan akan diumumkan di
            platform. Penggunaan berkelanjutan setelah perubahan dianggap sebagai persetujuan terhadap
            ketentuan yang baru.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">11. Hukum yang Berlaku</h2>
          <p>
            Ketentuan ini diatur dan ditafsirkan berdasarkan hukum Republik Indonesia. Setiap
            perselisihan diselesaikan melalui musyawarah mufakat terlebih dahulu sebelum ditempuh
            jalur hukum.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-lg font-black">12. Kontak</h2>
          <p>
            Untuk pertanyaan terkait Ketentuan Penggunaan:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
            <li>Email: <span className="text-foreground font-medium">echo.soraku@gmail.com</span></li>
            <li>Discord: <span className="text-foreground font-medium">discord.gg/qm3XJvRa6B</span></li>
            <li>Platform: <span className="text-foreground font-medium">www.soraku.id/feedback</span></li>
          </ul>
        </section>

        <div className="border-t border-white/[0.06] pt-6 mt-8">
          <p className="text-xs text-muted-foreground/40">
            Ketentuan Penggunaan ini berlaku untuk seluruh layanan Soraku Community.
            &copy; 2023&ndash;2026 Soraku Community. Seluruh hak dilindungi.
          </p>
        </div>
      </div>
    </div>
  )
}
