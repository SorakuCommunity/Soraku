/**
 * lib/supabase.ts — Barrel export untuk @/lib/supabase
 */

import { createClient as createSupabaseJs } from '@supabase/supabase-js'

export { createClient, createAdminClient } from './supabase/server'

// Sync client — untuk webhook/API routes tanpa cookies
export function createServerSupabaseClient() {
  return createSupabaseJs(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// Aliases
export const createSupabaseServer    = createServerSupabaseClient
export const createServiceClient     = createServerSupabaseClient
export const createAdminSupabase     = createServerSupabaseClient
