import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client (with service role for bypassing RLS)
export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? anonKey;
  if (!url || !serviceKey) {
    throw new Error('[Soraku] Supabase env vars missing');
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
