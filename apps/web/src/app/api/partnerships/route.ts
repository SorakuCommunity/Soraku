export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { ok } from '@/lib/api'

// GET /api/partnerships
// Tabel partnerships di Supabase — dikelola lewat admin panel
// Schema: id, name, logourl, website, category, isactive, sortorder, createdat
export async function GET() {
  try {
    const { data } = await adminDb()
      .from('partnerships')
      .select('id,name,logourl,website,category,isactive,sortorder')
      .eq('isactive', true)
      .order('sortorder', { ascending: true })

    return ok(data ?? [])
  } catch {
    // Jika tabel belum ada, return array kosong — tidak crash
    return ok([])
  }
}
