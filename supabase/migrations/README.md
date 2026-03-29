# Soraku — Database Migrations

## Naming Convention
```
YYYYMMDD_deskripsi_singkat.sql
```
Contoh: `20260311_soraku_schema.sql`, `20260311_auto_create_user_trigger.sql`

File dijalankan **urut alfabetis** (sekaligus urut tanggal).

## Cara Tambah Migration Baru

1. Buat file baru di folder ini dengan naming convention di atas
2. Tulis SQL yang **idempotent** — gunakan `IF NOT EXISTS`, `ON CONFLICT DO NOTHING`, `OR REPLACE`, dll.
3. Jalankan:
```bash
pnpm migrate
```

## Cara Jalankan Manual

```bash
# Dari root monorepo
pnpm migrate

# Atau langsung
NEXT_PUBLIC_SUPABASE_URL=https://jrgknsxqwuygcoocnnnb.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=xxx \
tsx scripts/migrate.ts
```

## Status Migration

Tercatat di tabel `soraku._migrations`:
```sql
SELECT * FROM soraku._migrations ORDER BY applied_at;
```

## Tips Menulis Migration

- Selalu gunakan `CREATE TABLE IF NOT EXISTS`
- Untuk alter kolom: `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
- Untuk type/enum: wrap dalam `DO $$ BEGIN ... EXCEPTION WHEN duplicate_object THEN NULL; END $$`
- Untuk function: selalu gunakan `CREATE OR REPLACE FUNCTION`
- Untuk trigger: `DROP TRIGGER IF EXISTS` dulu, lalu `CREATE TRIGGER`
