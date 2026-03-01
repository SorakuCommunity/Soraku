# Contributing to Soraku

Terima kasih sudah tertarik berkontribusi! Ikuti panduan berikut agar prosesnya lancar.

## Cara Berkontribusi

1. **Fork** repo ini
2. **Buat branch** baru: `git checkout -b feature/nama-fitur`
3. **Commit** perubahan: `git commit -m 'feat: deskripsi singkat'`
4. **Push** ke fork: `git push origin feature/nama-fitur`
5. **Buat Pull Request** ke branch `master`

## Konvensi Commit

Gunakan format [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Kegunaan |
|--------|----------|
| `feat:` | Fitur baru |
| `fix:` | Bug fix |
| `docs:` | Perubahan dokumentasi |
| `style:` | Formatting (bukan logic) |
| `refactor:` | Refactor code |
| `chore:` | Update deps, config |

## Standar Kode

- TypeScript strict mode — **no `any`** kecuali terpaksa
- Semua warna via **CSS variables**, bukan hardcode hex
- Semua form pakai **Zod** validation
- Semua HTML user input pakai **DOMPurify**
- Grid mobile minimal **3 kolom**
- Tidak ada secret di kode — gunakan `.env.local`

## Setup Dev

```bash
git clone https://github.com/SorakuCommunity/Soraku.git
cd Soraku
npm install
cp .env.example .env.local
# edit .env.local
npm run dev
```

## Butuh Bantuan?

Join Discord kami: https://discord.gg/CJJ7KEJMbg
