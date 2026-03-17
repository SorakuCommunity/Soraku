export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, NOT_FOUND, SERVER_ERROR } from '@/lib/api'
import { z } from 'zod'

const PlayerSchema = z.object({
  name:     z.string().min(1).max(50),
  role:     z.string().max(30).optional(),
  nickname: z.string().max(30).optional(),
})

const RegisterSchema = z.object({
  teamname:       z.string().min(2).max(60),
  teamlogourl:    z.string().url().optional().or(z.literal('')),
  activeplayers:  z.array(PlayerSchema).min(1).max(10),
  reserveplayers: z.array(PlayerSchema).max(5).default([]),
  contactname:    z.string().max(60).optional(),
  contactdiscord: z.string().max(60).optional(),
  notes:          z.string().max(500).optional(),
})

// POST /api/events/[slug]/register — daftar tim
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Pastikan event exists + published + punya registration open
    const { data: event, error: eventErr } = await adminDb()
      .from('events')
      .select('id, title, ispublished, registrationurl')
      .eq('slug', slug)
      .eq('ispublished', true)
      .maybeSingle()

    if (eventErr || !event) return NOT_FOUND()

    const body   = await req.json()
    const parsed = RegisterSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Data tidak valid')

    const { data, error } = await adminDb()
      .from('eventregistrations')
      .insert({
        eventid:        event.id,
        teamname:       parsed.data.teamname,
        teamlogourl:    parsed.data.teamlogourl || null,
        activeplayers:  parsed.data.activeplayers,
        reserveplayers: parsed.data.reserveplayers,
        contactname:    parsed.data.contactname   || null,
        contactdiscord: parsed.data.contactdiscord || null,
        notes:          parsed.data.notes         || null,
        status: 'pending',
      })
      .select('id, teamname, createdat')
      .single()

    if (error) return err(error.message)
    return ok(data, 201)
  } catch { return SERVER_ERROR() }
}

// GET /api/events/[slug]/register — admin: list semua registrasi
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    const { slug } = await params
    const { data: event } = await adminDb()
      .from('events')
      .select('id, title')
      .eq('slug', slug)
      .maybeSingle()

    if (!event) return NOT_FOUND()

    const { data, error } = await adminDb()
      .from('eventregistrations')
      .select('*')
      .eq('eventid', event.id)
      .order('createdat', { ascending: true })

    if (error) return SERVER_ERROR()
    return ok({ event, registrations: data ?? [] })
  } catch { return SERVER_ERROR() }
}
