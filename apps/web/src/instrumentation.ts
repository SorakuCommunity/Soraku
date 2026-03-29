/**
 * instrumentation.ts — Soraku Auto Migration
 * Runs once saat server start. Buat tabel + schema jika belum ada.
 * Aman dijalankan berulang (idempotent — semua pakai IF NOT EXISTS).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return

  try {
    const { runAutoMigration } = await import('./lib/auto-migration')
    await runAutoMigration()
  } catch (e) {
    console.error('[instrumentation] auto-migration error:', e)
  }
}
