export const dynamic = 'force-dynamic'
export const maxDuration = 30

import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { env } from '@/env'
import { ok, err, SERVER_ERROR } from '@/lib/api'

// POST /api/upload/image
// FormData: { file: File, bucket?: string, folder?: string }
// Public — dipakai untuk upload bukti bayar & QRIS dari client
export async function POST(req: NextRequest) {
  try {
    let form: FormData
    try {
      form = await req.formData()
    } catch {
      return err('Gagal membaca file.', 400)
    }

    const file = form.get('file') as File | null
    const bucket = (form.get('bucket') as string) || 'events'
    const folder = (form.get('folder') as string) || 'uploads'

    if (!file || file.size === 0) return err('File wajib ada.', 400)

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) return err('Format tidak didukung (jpg/png/webp/gif).', 400)
    if (file.size > 8 * 1024 * 1024) return err('Ukuran maksimal 8MB.', 400)

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const buffer = await file.arrayBuffer()
    const supabase = createAdminClient()

    const { error: storageErr } = await supabase.storage
      .from(bucket)
      .upload(filename, buffer, { contentType: file.type, upsert: false })

    if (storageErr) {
      console.error('[upload/image] storage error:', storageErr.message)
      // Jika bucket belum ada, coba buat dulu
      if (storageErr.message.toLowerCase().includes('bucket')) {
        // Coba buat bucket public
        await supabase.storage.createBucket(bucket, { public: true }).catch(() => {})
        // Retry upload
        const { error: retryErr } = await supabase.storage
          .from(bucket)
          .upload(filename, buffer, { contentType: file.type, upsert: false })
        if (retryErr) return err(`Upload gagal: ${retryErr.message}`, 500)
      } else {
        return err(`Upload gagal: ${storageErr.message}`, 500)
      }
    }

    const url = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${filename}`
    return ok({ url }, 201)
  } catch (e) {
    console.error('[upload/image] error:', e)
    return SERVER_ERROR()
  }
}
