import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { UserSession } from '@/lib/supabase/types'

/**
 * getSession — ambil session user yang sedang login.
 * Pakai .maybeSingle() bukan .single() agar tidak throw
 * ketika row di soraku.users belum ada (user baru, callback race).
 */
export async function getSession(): Promise<UserSession | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error || !user) return null

    const meta = user.user_metadata ?? {}

    // maybeSingle() → null jika tidak ada row, tidak throw
    const { data } = await createAdminClient()
      .schema('soraku')
      .from('users')
      .select('username, displayname, avatarurl, role, supporterrole')
      .eq('id', user.id)
      .maybeSingle()

    return {
      id: user.id,
      username: data?.username ?? meta.user_name ?? meta.preferred_username ?? null,
      displayname: data?.displayname ?? meta.full_name ?? meta.name ?? null,
      avatarurl: data?.avatarurl ?? meta.avatar_url ?? meta.picture ?? null,
      email: user.email ?? null,
      role: (data?.role ?? 'USER') as UserSession['role'],
      supporterrole: data?.supporterrole ?? null,
      issupporter: data?.supporterrole != null,
    }
  } catch (e) {
    console.error('[getSession] error:', e)
    return null
  }
}

export const isStaff = (r: string) => ['OWNER', 'MANAGER', 'ADMIN'].includes(r)
export const isManager = (r: string) => ['OWNER', 'MANAGER'].includes(r)
export const isOwner = (r: string) => r === 'OWNER'
