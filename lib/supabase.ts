/**
 * lib/supabase.ts — Re-export untuk kompatibilitas import @/lib/supabase
 * Beberapa file mengimport dari '@/lib/supabase' (bukan '@/lib/supabase/server')
 */

import { createClient as createSupabaseJs } from '@supabase/supabase-js'

export { createClient, createAdminClient } from './supabase/server'

/**
 * createServerSupabaseClient — SYNC version (tanpa await, tanpa cookies)
 * Dipakai di webhook/API routes yang tidak butuh session user.
 * Menggunakan service role key agar bisa write ke DB.
 */
export function createServerSupabaseClient() {
  return createSupabaseJs(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
