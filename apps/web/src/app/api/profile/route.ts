export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { ok, err, UNAUTHORIZED, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

const SELECT =
  'id,username,displayname,avatarurl,coverurl,bio,role,supporterrole,sociallinks,isprivate,createdat'

const UpdateSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_]+$/, 'Hanya huruf kecil, angka, dan underscore')
    .optional(),
  displayname: z.string().min(1).max(50).optional(),
  bio: z.string().max(300).optional(),
  coverurl: z.string().url().optional().or(z.literal('')),
  avatarurl: z.string().url().optional().or(z.literal('')),
  sociallinks: z.record(z.string(), z.string()).optional(),
  isprivate: z.boolean().optional(),
})

function normalize(data: Record<string, unknown>) {
  return {
    ...data,
    sociallinks: (data.sociallinks as Record<string, string> | null) ?? {},
    isprivate: data.isprivate ?? false,
    coverurl: data.coverurl ?? null,
    bio: data.bio ?? null,
  }
}

async function enrichWithStats(userId: string, baseData: Record<string, unknown>) {
  // Level data
  const { data: levelData } = await adminDb()
    .from('userlevels')
    .select('level, xpcurrent, xprequired, reputationscore')
    .eq('userid', userId)
    .maybeSingle()

  // Gallery count
  const { count: galleryCount } = await adminDb()
    .from('gallery')
    .select('*', { count: 'exact', head: true })
    .eq('uploadedby', userId)
    .eq('status', 'approved')

  // Support total
  const { data: donations } = await adminDb().from('donatur').select('amount').eq('userid', userId)

  const supportTotal = donations?.reduce((sum, d) => sum + (d.amount ?? 0), 0) ?? 0

  // Badges
  const { data: badges } = await adminDb()
    .from('userbadges')
    .select('id, badgename, badgeicon, badgecls')
    .eq('userid', userId)
    .order('createdat', { ascending: true })
    .limit(12)

  return {
    ...baseData,
    level: levelData ?? { level: 1, xpcurrent: 0, xprequired: 100, reputationscore: 0 },
    galleryCount: galleryCount ?? 0,
    supportTotal,
    badges: badges ?? [],
  }
}

// GET /api/profile
export async function GET() {
  try {
    const session = await getSession()
    if (!session) return UNAUTHORIZED()

    const { data, error } = await adminDb()
      .from('users')
      .select(SELECT)
      .eq('id', session.id)
      .maybeSingle()

    if (error) {
      console.error('[api/profile GET] DB error:', error.message, '| code:', error.code)
      return ok({
        id: session.id,
        username: session.username,
        displayname: session.displayname,
        avatarurl: session.avatarurl,
        coverurl: null,
        bio: null,
        role: session.role,
        supporterrole: session.supporterrole ?? null,
        sociallinks: {},
        isprivate: false,
        createdat: new Date().toISOString(),
        _fallback: true,
        level: { level: 1, xpcurrent: 0, xprequired: 100, reputationscore: 0 },
        galleryCount: 0,
        supportTotal: 0,
        badges: [],
      })
    }

    if (!data) {
      const newRow = {
        id: session.id,
        username: session.username?.slice(0, 30) ?? null,
        displayname: session.displayname?.slice(0, 50) ?? null,
        avatarurl: session.avatarurl ?? null,
        coverurl: null as string | null,
        bio: null as string | null,
        role: session.role,
        supporterrole: session.supporterrole ?? null,
        sociallinks: {} as Record<string, string>,
        isprivate: false,
        isbanned: false,
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString(),
      }
      const { data: created, error: upsertErr } = await adminDb()
        .from('users')
        .upsert(newRow, { onConflict: 'id' })
        .select(SELECT)
        .maybeSingle()

      if (upsertErr) {
        console.error('[api/profile GET] upsert error:', upsertErr.message)
        return ok({
          id: session.id,
          username: session.username,
          displayname: session.displayname,
          avatarurl: session.avatarurl,
          coverurl: null,
          bio: null,
          role: session.role,
          supporterrole: session.supporterrole ?? null,
          sociallinks: {},
          isprivate: false,
          createdat: new Date().toISOString(),
          level: { level: 1, xpcurrent: 0, xprequired: 100, reputationscore: 0 },
          galleryCount: 0,
          supportTotal: 0,
          badges: [],
        })
      }

      const base = normalize(created as Record<string, unknown>)
      return ok(await enrichWithStats(session.id, base))
    }

    const base = normalize(data as Record<string, unknown>)
    return ok(await enrichWithStats(session.id, base))
  } catch (e) {
    console.error('[api/profile GET] unexpected:', e)
    return SERVER_ERROR()
  }
}

// PATCH /api/profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return UNAUTHORIZED()

    const body = await req.json()
    const parsed = UpdateSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    // Cek username unique jika diubah
    if (parsed.data.username && parsed.data.username !== session.username) {
      const { data: existing } = await adminDb()
        .from('users')
        .select('id')
        .eq('username', parsed.data.username)
        .maybeSingle()
      if (existing) return err('Username sudah dipakai', 409)
    }

    const updates = Object.fromEntries(
      Object.entries(parsed.data).map(([k, v]) => [k, v === '' ? null : v])
    )

    const { data, error } = await adminDb()
      .from('users')
      .update({ ...updates, updatedat: new Date().toISOString() })
      .eq('id', session.id)
      .select(SELECT)
      .maybeSingle()

    if (error) {
      console.error('[api/profile PATCH] DB error:', error.message)
      return SERVER_ERROR()
    }
    if (!data) return err('Profil tidak ditemukan', 404)

    return ok(normalize(data as Record<string, unknown>))
  } catch (e) {
    console.error('[api/profile PATCH] unexpected:', e)
    return SERVER_ERROR()
  }
}
