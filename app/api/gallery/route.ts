// app/api/gallery/route.ts — SORAKU v1.0.a3.5
// Gallery API: GET (list approved) + POST (submit for approval) + PATCH (admin approve/reject)
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { UserRole } from '@/types'

const ADMIN_ROLES: UserRole[] = ['OWNER', 'MANAGER', 'ADMIN']

const getSchema = z.object({
  search:   z.string().optional(),
  approved: z.enum(['true', 'false']).optional(),
  page:     z.coerce.number().min(1).default(1),
  limit:    z.coerce.number().min(1).max(50).default(12),
})

const uploadSchema = z.object({
  title:     z.string().min(1).max(200),
  image_url: z.string().url(),
  tags:      z.array(z.string()).optional().default([]),
})

const approveSchema = z.object({
  id:       z.string().uuid(),
  approved: z.boolean(),
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const supabase = await createClient()

  const { search, approved, page, limit } = getSchema.parse({
    search:   searchParams.get('search')   ?? undefined,
    approved: searchParams.get('approved') ?? undefined,
    page:     searchParams.get('page')     ?? 1,
    limit:    searchParams.get('limit')    ?? 12,
  })

  try {
    let query = supabase
      .from('gallery')
      .select('id, title, image_url, tags, likes, approved, user_id, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (approved === 'false') {
      query = query.eq('approved', false)
    } else {
      query = query.eq('approved', true)
    }

    if (search) query = query.ilike('title', `%${search}%`)

    const { data, error, count } = await query
    if (error) throw error

    return NextResponse.json({
      data,
      pagination: { page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  try {
    const { title, image_url, tags } = uploadSchema.parse(await request.json())
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('gallery')
      .insert({ title, image_url, tags, user_id: user.id, approved: false, likes: 0 })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to upload' }, { status: 400 })
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('users').select('role').eq('id', user.id).single()

  if (!profile || !ADMIN_ROLES.includes(profile.role as UserRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id, approved } = approveSchema.parse(await request.json())
    const { error } = await supabase
      .from('gallery')
      .update({ approved, approved_by: approved ? user.id : null })
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 400 })
  }
}
