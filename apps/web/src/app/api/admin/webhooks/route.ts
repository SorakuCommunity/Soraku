export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

// GET /api/admin/webhooks — list all webhook settings
export async function GET() {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    const { data, error } = await adminDb()
      .from('sitesettings')
      .select('id,key,value,label,category,description,updatedat')
      .or('category.eq.discord,key.like.discord%')
      .order('key', { ascending: true })

    if (error) {
      console.error('[webhooks GET]', error.message)
      return err(error.message, 500)
    }

    // Bersihkan kutip ganda di value (data lama)
    const cleaned = (data ?? []).map(row => ({
      ...row,
      value: row.value ? row.value.replace(/^"+|"+$/g, '').trim() : row.value,
    }))

    return ok(cleaned)
  } catch (e) {
    console.error('[webhooks GET] catch:', e)
    return SERVER_ERROR()
  }
}

const UpdateSchema = z.object({
  key: z.string().min(1),
  value: z.string().optional().nullable(),
})

// PATCH /api/admin/webhooks — update a webhook URL
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    const rawBody = await req.text()
    let body: unknown
    try {
      body = JSON.parse(rawBody)
    } catch {
      return err('Body harus berupa JSON valid')
    }

    const parsed = UpdateSchema.safeParse(body)
    if (!parsed.success) {
      console.error('[webhooks PATCH] validation failed:', parsed.error.issues)
      return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')
    }

    const { key, value } = parsed.data

    // Validate it's a discord webhook URL if value is provided
    if (value && value.trim() !== '') {
      const trimmed = value.trim()
      if (!trimmed.includes('discord.com/api/webhooks') && !trimmed.includes('discordapp.com/api/webhooks')) {
        return err('URL harus berupa Discord webhook URL yang valid')
      }
    }

    // Mapping camelCase → snake_case (untuk data lama di DB)
    const KEY_MAP: Record<string, string> = {
      discordEventWebhookUrl: 'discord_event_webhook_url',
      discordRegistrationWebhookUrl: 'discord_registration_webhook_url',
      discordBlogWebhookUrl: 'discord_blog_webhook_url',
      discordFeedbackWebhookUrl: 'discord_feedback_webhook_url',
    }
    const oldKey = KEY_MAP[key]

    // Coba update dengan key baru (camelCase) dulu, lama fallback ke key lama (snake_case)
    let data, error
    const result1 = await adminDb()
      .from('sitesettings')
      .update({
        value: value || null,
        updatedat: new Date().toISOString(),
        updatedby: session.id,
      })
      .eq('key', key)
      .select()
      .maybeSingle()

    if (result1.data) {
      data = result1.data
      error = result1.error
    } else if (oldKey) {
      // Fallback: coba update dengan key lama (snake_case)
      const result2 = await adminDb()
        .from('sitesettings')
        .update({
          value: value || null,
          updatedat: new Date().toISOString(),
          updatedby: session.id,
        })
        .eq('key', oldKey)
        .select()
        .maybeSingle()
      data = result2.data
      error = result2.error
    } else {
      data = result1.data
      error = result1.error
    }

    if (error) {
      console.error('[webhooks PATCH] db error:', error.message)
      return err(error.message, 500)
    }
    if (!data) return err('Webhook tidak ditemukan', 404)

    return ok(data)
  } catch (e) {
    console.error('[webhooks PATCH] catch:', e)
    return SERVER_ERROR()
  }
}

// POST /api/admin/webhooks — test a webhook by sending a test message
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    const body = await req.json()
    const { key } = z.object({ key: z.string() }).parse(body)

    // Mapping camelCase → snake_case (untuk data lama di DB)
    const KEY_MAP: Record<string, string> = {
      discordEventWebhookUrl: 'discord_event_webhook_url',
      discordRegistrationWebhookUrl: 'discord_registration_webhook_url',
      discordBlogWebhookUrl: 'discord_blog_webhook_url',
      discordFeedbackWebhookUrl: 'discord_feedback_webhook_url',
    }
    const oldKey = KEY_MAP[key]

    // Cari dengan key baru (camelCase) dulu, fallback ke key lama
    let data = (await adminDb()
      .from('sitesettings')
      .select('value')
      .eq('key', key)
      .maybeSingle()).data

    if (!data && oldKey) {
      data = (await adminDb()
        .from('sitesettings')
        .select('value')
        .eq('key', oldKey)
        .maybeSingle()).data
    }

    let url: string | null = null
    if (data?.value) {
      const raw = typeof data.value === 'string' ? data.value : (data.value as any).url ?? (data.value as any).value ?? null
      url = raw ? raw.replace(/^"+|"+$/g, '').trim() : null
    }

    if (!url) return err('Webhook URL belum di-set')

    const label = key.replace('discord', '').replace('WebhookUrl', '')

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `Test webhook berhasil!\nKategori: ${label}\nOleh: ${session.displayname ?? session.username ?? 'Admin'}`,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[webhooks POST] discord error:', res.status, text)
      return err(`Webhook gagal: ${res.status}`)
    }

    return ok({ success: true })
  } catch (e) {
    console.error('[webhooks POST] catch:', e)
    return SERVER_ERROR()
  }
}
