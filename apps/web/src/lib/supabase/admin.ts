import { createClient } from '@supabase/supabase-js'
import { env } from '@/env'

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
// Support dua nama ENV — SUPABASE_SERVICE_ROLE_KEY (standar) + SUPABASE_SERVICE_KEY (legacy fallback)
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SERVICE_KEY ?? ''

if (!SERVICE_KEY) {
  console.error(
    '[supabase/admin] ⚠ SUPABASE_SERVICE_ROLE_KEY tidak ditemukan — adminDb() akan gagal!'
  )
}

/** Admin client — bypass RLS. HANYA dipakai di API routes server-side. */
export function createAdminClient() {
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/** Admin query ke schema soraku */
export function adminDb() {
  return createAdminClient().schema('soraku')
}
