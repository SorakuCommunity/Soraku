# Security Policy

## Melaporkan Kerentanan

Jika kamu menemukan celah keamanan di platform Soraku, **jangan** buat GitHub Issue publik.

Kirimkan laporan ke: **echo.soraku@gmail.com**

Sertakan:
- Deskripsi kerentanan
- Langkah reproduksi
- Dampak potensial
- Saran perbaikan (opsional)

Kami akan merespons dalam **48 jam** dan bekerja sama untuk memperbaikinya.

## Versi yang Didukung

| Versi | Status |
|-------|--------|
| 1.0.a3.1 | ✅ Aktif |
| < 1.0.a3 | ❌ Tidak didukung |

## Praktik Keamanan

- Semua auth via Supabase Auth (OAuth2)
- RLS aktif di semua tabel database
- Rate limiting via Redis
- Input sanitized dengan DOMPurify
- Validasi dengan Zod di client dan server
- Tidak ada secret di source code
