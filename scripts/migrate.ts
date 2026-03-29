/**
 * Soraku Auto Migration Runner
 * Baca file .sql di supabase/migrations/, jalankan yang belum dijalankan.
 * Sudah applied disimpan di soraku._migrations.
 *
 * Usage: pnpm migrate
 * ENV: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from '@supabase/supabase-js'
import { readdir, readFile } from 'fs/promises'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

// ── Env ───────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ ENV tidak lengkap: butuh NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const PROJECT_REF = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
if (!PROJECT_REF) { console.error('❌ Tidak bisa parse project ref dari URL'); process.exit(1) }

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── Jalankan SQL via Supabase Management API ──────────────────
async function runSql(sql: string): Promise<void> {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SERVICE_KEY}` },
      body:    JSON.stringify({ query: sql }),
    }
  )
  if (!res.ok) {
    const text = await res.text()
    // 400 dengan message "already exists" = idempotent, anggap OK
    if (text.includes('already exists')) return
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 500)}`)
  }
}

// ── Bootstrap: buat tabel _migrations jika belum ada ─────────
async function bootstrap(): Promise<void> {
  await runSql(`
    CREATE SCHEMA IF NOT EXISTS soraku;
    CREATE TABLE IF NOT EXISTS soraku._migrations (
      id         SERIAL PRIMARY KEY,
      name       TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      checksum   TEXT
    );
  `)
}

// ── Applied migrations ────────────────────────────────────────
async function getApplied(): Promise<Set<string>> {
  const { data } = await supabase
    .schema('soraku' as never)
    .from('_migrations')
    .select('name')
  return new Set(((data ?? []) as { name: string }[]).map(r => r.name))
}

async function markApplied(name: string, csum: string): Promise<void> {
  await supabase
    .schema('soraku' as never)
    .from('_migrations')
    .upsert({ name, checksum: csum }, { onConflict: 'name' })
}

// ── Simple non-crypto checksum ────────────────────────────────
function checksum(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return (h >>> 0).toString(16)
}

// ── Main ──────────────────────────────────────────────────────
async function main(): Promise<void> {
  console.log('\n🚀 Soraku Migration Runner')
  console.log(`📡 Project: ${PROJECT_REF}\n`)

  const root    = resolve(__dirname, '..')
  const migrDir = join(root, 'supabase', 'migrations')

  let files: string[]
  try {
    files = (await readdir(migrDir)).filter(f => f.endsWith('.sql')).sort()
  } catch {
    console.error(`❌ Folder tidak ditemukan: ${migrDir}`)
    process.exit(1)
  }

  if (!files.length) { console.log('ℹ  Tidak ada file .sql'); return }

  await bootstrap()
  const applied = await getApplied()

  console.log(`📋 ${files.length} file migration | ${applied.size} sudah applied\n`)

  let ran = 0, skipped = 0

  for (const file of files) {
    const name = file.replace(/\.sql$/, '')
    if (applied.has(name)) {
      console.log(`  ⏭  SKIP   ${file}`)
      skipped++
      continue
    }
    const sql  = await readFile(join(migrDir, file), 'utf-8')
    const csum = checksum(sql)
    process.stdout.write(`  ⏳ RUN    ${file} ... `)
    try {
      await runSql(sql)
      await markApplied(name, csum)
      console.log('✅')
      ran++
    } catch (e) {
      console.log(`❌\n     ${e}`)
      console.error('\n⚠  Migration dihentikan.')
      process.exit(1)
    }
  }

  console.log(`\n✨ Selesai: ${ran} dijalankan, ${skipped} diskip\n`)
}

main().catch(e => { console.error('Fatal:', e); process.exit(1) })
