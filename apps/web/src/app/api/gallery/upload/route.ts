import { env } from '@/env'
import { adminDb, createAdminClient } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { ok, err, UNAUTHORIZED, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

// Tingkatkan body size limit untuk upload file
export const maxDuration = 30 // seconds (Vercel)

// POST /api/gallery/upload — FormData: { file, title?, description?, tags? }
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return UNAUTHORIZED()

    // Parse FormData — Next.js App Router handles multipart natively
    let form: FormData
    try {
      form = await req.formData()
    } catch (e) {
      console.error('[gallery/upload] formData parse error:', e)
      return err('Gagal membaca file. Pastikan file valid dan coba lagi.', 400)
    }

    const file = form.get('file') as File | null
    const title = (form.get('title') as string)?.trim() || null
    const description = (form.get('description') as string)?.trim() || null
    const tagsRaw = (form.get('tags') as string) || ''
    const tags = tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    if (!file || file.size === 0) return err('File wajib ada')

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) return err('Format tidak didukung (jpg/png/webp/gif)')
    if (file.size > 8 * 1024 * 1024) return err('Ukuran maksimal 8MB')

    // Upload ke Supabase Storage
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const filename = `${session.id}/${Date.now()}.${ext}`

    let buffer: ArrayBuffer
    try {
      buffer = await file.arrayBuffer()
    } catch (e) {
      console.error('[gallery/upload] arrayBuffer error:', e)
      return err('Gagal membaca konten file.', 500)
    }

    const supabaseAdmin = createAdminClient()

    const { error: storageErr } = await supabaseAdmin.storage
      .from('gallery')
      .upload(filename, buffer, { contentType: file.type, upsert: false })

    if (storageErr) {
      console.error('[gallery/upload] storage error:', storageErr.message)
      // Bucket belum dibuat → pesan yang jelas
      if (
        storageErr.message.includes('Bucket not found') ||
        storageErr.message.includes('bucket')
      ) {
        return err('Storage bucket "gallery" belum dibuat di Supabase. Hubungi admin.', 500)
      }
      return err(`Upload gagal: ${storageErr.message}`, 500)
    }

    const imageurl = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${filename}`

    const { data, error: dbErr } = await adminDb()
      .from('gallery')
      .insert({
        uploadedby: session.id,
        imageurl,
        title,
        description,
        tags,
        status: 'pending',
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString(),
      })
      .select()
      .maybeSingle()

    if (dbErr) {
      console.error('[gallery/upload] db insert error:', dbErr.message, dbErr.code)
      // Rollback: hapus file yang sudah diupload
      await supabaseAdmin.storage
        .from('gallery')
        .remove([filename])
        .catch(() => {})
      return err(`DB error: ${dbErr.message}`, 500)
    }

    return ok(data, 201)
  } catch (e) {
    console.error('[gallery/upload] unhandled error:', e)
    return SERVER_ERROR()
  }
}
