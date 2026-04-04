/**
 * lib/db/index.ts — Drizzle ORM client
 * ENV via @/env (T3 Env — type-safe, validated).
 *
 * DB_URL diset di Vercel sebagai optional — tidak block build jika kosong.
 * Jika diakses tanpa DB_URL, throw error yang jelas.
 */
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { env } from '@/env'

function createDb() {
  if (!env.DB_URL) {
    throw new Error(
      '[db] DB_URL belum diset di Vercel.\n' +
        'Supabase → Project Settings → Database → Connection string → Transaction (port 6543)'
    )
  }
  const client = postgres(env.DB_URL, { prepare: false })
  return drizzle(client, { schema })
}

export const db = createDb()
