/**
 * ============================================================
 *  SORAKU COMMUNITY — PROPRIETARY & CONFIDENTIAL
 * ============================================================
 *  API: PATCH /api/gallery — Moderate gallery item (approve/reject)
 *  Server-side enforcement — requires ADMIN+ session
 * ============================================================
 */

// app/api/gallery/route.ts - Soraku 1.0.a3.1 FULL SPEC
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { UserRole, GalleryItem } from '@/types'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const ADMIN_ROLES: UserRole[] = ['OWNER', 'MANAGER', 'ADMIN']

// Zod schemas
const getSchema = z.object({
  search: z.string().optional(),
  approved: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(9) // Grid 3x3
})

const uploadSchema = z.object({
  caption: z.string().max(500),
  image_url: z.string().url()
})

const approveSchema = z.object({
  approved: z.boolean(),
  id: z.string()
})

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  
  try {
    const { search, approved, page = 1, limit = 9 } = getSchema.parse({
      search: searchParams.get('search'),
      approved: searchParams.get('approved'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit')
    })

    const query = supabase
      .from('gallery')
      .select('*', { count: 'exact' })
      .eq('approved', approved === 'true' ? true : approved === 'false' ? false : true)
      .range((page - 1) * limit, page * limit - 1)

    if (search) {
      query.ilike('caption', `%${search}%`)
    }

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      data: data as GalleryItem[],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch gallery' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  
  try {
    const { caption, image_url } = uploadSchema.parse(await request.json())
    
    // Sanitize caption
    const window = new JSDOM('').window
    const purify = DOMPurify(window)
    const cleanCaption = purify.sanitize(caption)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('gallery')
      .insert({
        caption: cleanCaption,
        image_url,
        user_id: user.id,
        approved: false // Admin approval required
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 400 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const supabase = createClient()
  
  try {
    const { id, approved } = approveSchema.parse(await request.json())
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !ADMIN_ROLES.includes(user.user_metadata?.role as UserRole)) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('gallery')
      .update({ 
        approved,
        approved_by: user.id,
        approved_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update gallery' },
      { status: 400 }
    )
  }
}
