/**
 * ============================================================
 *  SORAKU COMMUNITY — PROPRIETARY & CONFIDENTIAL
 * ============================================================
 *  API: PATCH /api/gallery — Moderate gallery item (approve/reject)
 *  Server-side enforcement — requires ADMIN+ session
 * ============================================================
 */

// app/api/gallery/route.ts - Soraku 1.0.a3.1 FINAL BUILD SUCCESS
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { UserRole, GalleryItem } from '@/types'
import DOMPurify from 'dompurify'

const ADMIN_ROLES: UserRole[] = ['OWNER', 'MANAGER', 'ADMIN']

const sanitizeCaption = (caption: string): string => {
  return DOMPurify.sanitize(caption, { 
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'], 
    ALLOWED_ATTR: [] 
  })
}

const getSchema = z.object({
  search: z.string().optional(),
  approved: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(9)
})

const uploadSchema = z.object({
  caption: z.string().max(500),
  image_url: z.string().url()
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const supabase = await createClient() // ✅ FIXED: await client
  
  const { search, approved, page = 1, limit = 9 } = getSchema.parse({
    search: searchParams.get('search'),
    approved: searchParams.get('approved'),
    page: searchParams.get('page'),
    limit: searchParams.get('limit')
  })

  try {
    let query = supabase
      .from('gallery')
      .select('*', { count: 'exact' })
      .eq('approved', true) // Default: approved only
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    // Filter logic
    if (approved === 'false') query = query.eq('approved', false)
    if (search) query = query.ilike('caption', `%${search}%`)

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
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient() // ✅ FIXED: await client
  
  try {
    const { caption, image_url } = uploadSchema.parse(await request.json())
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cleanCaption = sanitizeCaption(caption)

    const { data, error } = await supabase
      .from('gallery')
      .insert({ 
        caption: cleanCaption, 
        image_url, 
        user_id: user.id, 
        approved: false 
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload' }, { status: 400 })
  }
}
