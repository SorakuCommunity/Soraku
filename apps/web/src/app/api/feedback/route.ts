export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { ok, err, SERVER_ERROR } from '@/lib/api'
import { getWebhookUrl } from '@/lib/discord-webhook'
import { z } from 'zod'

const FeedbackSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(100),
  email: z.string().email('Email tidak valid').max(200),
  subject: z.string().min(1, 'Subjek wajib diisi').max(200),
  message: z.string().min(10, 'Pesan minimal 10 karakter').max(2000),
  type: z.enum(['question', 'feedback', 'bug', 'content', 'other']).default('feedback'),
})

const TYPE_LABELS: Record<string, string> = {
  question: 'Pertanyaan',
  feedback: 'Masukan',
  bug: 'Laporan Bug',
  content: 'Request Konten',
  other: 'Lainnya',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = FeedbackSchema.safeParse(body)
    if (!parsed.success) {
      return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')
    }

    const { name, email, subject, message, type } = parsed.data

    const webhookUrl = await getWebhookUrl('discordFeedbackWebhookUrl')
    if (!webhookUrl) {
      return err('Webhook feedback belum dikonfigurasi', 500)
    }

    const typeLabel = TYPE_LABELS[type] ?? type

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [
          {
            title: `Feedback Baru: ${subject}`,
            color: 0x4fa3d1,
            fields: [
              { name: 'Tipe', value: typeLabel, inline: true },
              { name: 'Nama', value: name, inline: true },
              { name: 'Email', value: email, inline: true },
              { name: 'Pesan', value: message.slice(0, 1000) },
            ],
            timestamp: new Date().toISOString(),
            footer: { text: 'Soraku Feedback' },
          },
        ],
      }),
    })

    if (!res.ok) {
      console.error('[feedback POST] discord error:', res.status)
      return err('Gagal mengirim feedback', 500)
    }

    return ok({ success: true })
  } catch (e) {
    console.error('[feedback POST] catch:', e)
    return SERVER_ERROR()
  }
}
