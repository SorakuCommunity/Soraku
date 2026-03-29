import { adminDb } from '@/lib/supabase/admin'
import { ok, err } from '@/lib/api'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/auth/check-username?username=xxx
export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username')?.toLowerCase().trim()

  if (!username) return err('Username diperlukan', 400)
  if (username.length < 3) return err('Username minimal 3 karakter', 400)
  if (username.length > 30) return err('Username maksimal 30 karakter', 400)
  if (!/^[a-z0-9_]+$/.test(username)) return err('Hanya huruf kecil, angka, underscore', 400)

  // Reserved words
  const RESERVED = new Set([
    'me',
    'admin',
    'administrator',
    'soraku',
    'system',
    'support',
    'help',
    'api',
    'auth',
    'login',
    'register',
    'logout',
    'signin',
    'signup',
    'root',
    'null',
    'undefined',
    'profile',
    'user',
    'users',
    'dashboard',
    'dash',
    'staff',
    'team',
    'mod',
    'moderator',
  ])
  if (RESERVED.has(username)) return err('Username ini tidak tersedia', 409)

  const { data } = await adminDb().from('users').select('id').eq('username', username).maybeSingle()

  if (data) return err('Username sudah dipakai', 409)
  return ok({ available: true })
}
