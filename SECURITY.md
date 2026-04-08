# Kebijakan Keamanan — Soraku Community Platform

## Ruang Lingkup

Kebijakan ini berlaku untuk seluruh komponen platform Soraku yang aktif:

| Komponen         | Domain atau Lokasi                       | Status |
| ---------------- | ---------------------------------------- | ------ |
| Web Application  | https://www.soraku.id                    | Aktif  |
| API              | https://apisoraku.vercel.app             | Aktif  |
| Discord Bot      | Railway (layanan internal)               | Aktif  |
| Supabase Backend | Database dan Auth (jrgknsxqwuygcoocnnnb) | Aktif  |

Komponen di luar daftar di atas, termasuk layanan pihak ketiga yang
diintegrasikan (Discord, Upstash, Supabase Auth), tunduk pada kebijakan
keamanan masing-masing penyedia.

## Melaporkan Kerentanan

Kami menganggap serius setiap laporan kerentanan keamanan. Jika kamu
menemukan celah keamanan pada platform Soraku, mohon ikuti prosedur berikut.

**Jangan ungkapkan kerentanan secara publik sebelum kami berkesempatan
menanganinya.**

Kirimkan laporan melalui salah satu jalur berikut:

1. Surel langsung: admin@soraku.id
   Gunakan subjek: [SECURITY] Nama Singkat Kerentanan

2. Discord DM kepada koordinator (Riu) di server Soraku:
   https://discord.gg/qm3XJvRa6B

Sertakan informasi berikut dalam laporan:

- Deskripsi kerentanan secara singkat dan jelas
- Langkah reproduksi yang dapat diverifikasi
- Komponen atau endpoint yang terdampak
- Dampak potensial terhadap pengguna atau data
- Bukti konsep jika tersedia (screenshot, log, kode minimal)

## Waktu Respons

| Tahap                           | Target Waktu  |
| ------------------------------- | ------------- |
| Konfirmasi penerimaan laporan   | 48 jam        |
| Penilaian awal kerentanan       | 3 hari kerja  |
| Pembaruan status kepada pelapor | Setiap 7 hari |
| Penerapan perbaikan kritis      | 14 hari       |
| Penerapan perbaikan non-kritis  | 30 hari       |

Waktu respons dapat bervariasi tergantung pada kompleksitas kerentanan dan
kapasitas tim saat ini.

## Tingkat Keparahan

Kami menggunakan klasifikasi berikut untuk menilai kerentanan:

**Kritis**
Kerentanan yang memungkinkan eksekusi kode jarak jauh, pengambilalihan akun,
akses data seluruh pengguna, atau bypass autentikasi total.

**Tinggi**
Kerentanan yang memungkinkan akses tidak sah ke data pengguna lain, eskalasi
hak akses (privilege escalation), atau injeksi SQL yang berdampak luas.

**Sedang**
Kerentanan yang memungkinkan Cross-Site Scripting (XSS), CSRF pada fungsi
sensitif, atau kebocoran informasi sistem yang dapat dimanfaatkan lebih lanjut.

**Rendah**
Kerentanan dengan dampak terbatas, termasuk informasi versi yang terekspos
atau misconfiguration minor yang tidak langsung membahayakan pengguna.

## Kebijakan Pengungkapan

Soraku Community mengadopsi kebijakan pengungkapan terkoordinasi
(Coordinated Vulnerability Disclosure):

1. Pelapor mengirimkan laporan secara privat kepada tim kami.

2. Tim mengevaluasi laporan dan memberikan konfirmasi penerimaan.

3. Perbaikan dikembangkan dan diuji secara internal.

4. Pembaruan didistribusikan ke production.

5. Setelah perbaikan aktif, pelapor dapat mengungkapkan temuannya secara
   publik dengan koordinasi bersama tim kami.

Kami memohon pelapor untuk memberikan waktu minimal 30 hari setelah
perbaikan diterapkan sebelum mengungkapkan detail teknis secara publik.

## Praktik Keamanan Platform

Berikut adalah langkah-langkah keamanan yang saat ini kami terapkan:

Autentikasi dan Sesi:

- OAuth 2.0 dengan PKCE untuk Discord dan Google
- Cookie sesi dengan flag HttpOnly dan Secure
- Validasi sesi di setiap API route menggunakan `getSession()`
- Service Role Key Supabase tidak pernah terekspos ke client

Basis Data:

- Row Level Security (RLS) aktif di seluruh tabel Supabase
- Schema `soraku` terpisah dari schema publik
- Semua input divalidasi menggunakan Zod sebelum menyentuh database
- Admin API menggunakan `adminDb()` yang hanya berjalan di sisi server

API:

- Semua endpoint sensitif memerlukan sesi yang valid
- Rate limiting diterapkan pada endpoint autentikasi
- CORS dikonfigurasi hanya untuk domain resmi Soraku
- Environment variable sensitif tidak pernah dikirim ke client

Infrastruktur:

- Deployment via Vercel dengan HTTPS enforced
- Database Supabase dengan enkripsi data at-rest
- Secret disimpan sebagai environment variable, tidak pernah di-commit
- Dependabot aktif untuk pembaruan dependensi otomatis

## Kerentanan yang Tidak Masuk Lingkup

Laporan berikut tidak akan diproses dalam program ini:

- Serangan yang memerlukan akses fisik ke perangkat pengguna
- Teknik rekayasa sosial terhadap anggota tim
- Kerentanan pada dependensi pihak ketiga yang sudah memiliki CVE resmi
- Spam atau penyalahgunaan fitur yang tidak melibatkan celah teknis
- Missing security headers dengan dampak yang dapat diabaikan
- Kebijakan rate limiting yang bersifat minor

## Penghargaan

Kami sangat menghargai kontribusi komunitas dalam menjaga keamanan platform.
Bagi pelapor yang menemukan dan melaporkan kerentanan valid dengan itikad baik:

- Nama atau alias kamu akan dicantumkan dalam Soraku Security Hall of Fame
  (dengan persetujuanmu)
- Pelapor kerentanan kritis atau tinggi dapat mendapatkan status khusus
  di server Discord Soraku

## Pembaruan Kebijakan

Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan signifikan akan
diumumkan melalui server Discord Soraku.

Versi saat ini: 1.0
Berlaku sejak: 21 Maret 2026
Pemilik: Soraku Community, Indonesia

Terima kasih telah membantu menjaga Soraku tetap aman untuk semua anggota.

echo.soraku@gmail.com · https://www.soraku.id
