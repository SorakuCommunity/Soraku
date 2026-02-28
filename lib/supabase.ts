/**
 * lib/supabase.ts — Re-export untuk kompatibilitas import @/lib/supabase
 * Beberapa file mengimport dari '@/lib/supabase' (bukan '@/lib/supabase/server')
 */

export { createClient, createAdminClient } from './supabase/server'
