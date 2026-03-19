export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, NOT_FOUND, SERVER_ERROR } from '@/lib/api'
import { sendDiscordWebhook } from '@/lib/discord-webhook'
import { env } from '@/env'
import { NextRequest } from 'next/server'
import { z } from 'zod'

type Params = { params: Promise<{ id: string }> }

const PatchSchema = z.object({
  title:       z.string().min(1).optional(),
  slug:        z.string().min(1).optional(),
  excerpt:     z.string().optional(),
  content:     z.string().optional(),
  coverurl:    z.string().url().optional().or(z.literal('')),
  tags:        z.array(z.string()).optional(),
  ispublished: z.boolean().optional(),
})

// ── Discord notify helper (shared with route.ts) ─────────────────────────
async function notifyDiscordBlog(post: {
  slug: string; title: string; excerpt?: string | null;
  coverurl?: string | null; tags: string[]; authorid?: string | null;
}) {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? 'https://www.soraku.id'
  const postUrl = `${siteUrl}/blog/${post.slug}`
  let authorName = 'Soraku Team', authorAvatar = `${siteUrl}/logo.png`
  if (post.authorid) {
    const { data: u } = await adminDb()
      .from('users').select('username,displayname,avatarurl').eq('id', post.authorid).maybeSingle()
    if (u) { authorName = u.displayname ?? u.username ?? authorName; authorAvatar = u.avatarurl ?? authorAvatar }
  }
  const tagsStr = post.tags?.length ? post.tags.map(t => `\`#${t}\``).join(' ') : null
  const excerpt = post.excerpt ? post.excerpt.slice(0, 280) + (post.excerpt.length > 280 ? '...' : '') : null
  const dateStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })

  await sendDiscordWebhook('discord_blog_webhook_url', {
    username: 'Soraku Blog', avatar_url: `${siteUrl}/logo.png`,
    content:  `📰 **Artikel baru telah terbit!** Langsung baca sekarang 👇`,
    embeds: [{
      author: { name: authorName, icon_url: authorAvatar },
      title: post.title, url: postUrl,
      description: [excerpt ?? '', '', '━━━━━━━━━━━━━━━━━━━━━━', `[📖 Baca Artikel Lengkap](${postUrl})`].filter(Boolean).join('\n'),
      color: 0x4FA3D1,
      fields: [
        { name: '📅 Terbit', value: dateStr,    inline: true },
        { name: '✍️ Penulis', value: authorName, inline: true },
        ...(tagsStr ? [{ name: '🏷️ Tags', value: tagsStr, inline: false }] : []),
      ],
      image: post.coverurl ? { url: post.coverurl } : undefined,
      footer: { text: 'Soraku Community · soraku.id', icon_url: `${siteUrl}/logo.png` },
      timestamp: new Date().toISOString(),
    }],
  })
}

// GET /api/admin/blog/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()
    const { id } = await params
    const { data, error } = await adminDb().from('posts').select('*').eq('id', id).maybeSingle()
    if (error) return SERVER_ERROR()
    if (!data) return NOT_FOUND()
    return ok(data)
  } catch { return SERVER_ERROR() }
}

// PATCH /api/admin/blog/[id] — update + auto Discord if publishing for first time
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()
    const { id }  = await params
    const body    = await req.json()
    const parsed  = PatchSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    // Check if was previously draft and now being published
    let wasUnpublished = false
    if (parsed.data.ispublished === true) {
      const { data: existing } = await adminDb().from('posts').select('ispublished').eq('id', id).maybeSingle()
      wasUnpublished = existing?.ispublished === false
    }

    const updates: Record<string, unknown> = { ...parsed.data, updatedat: new Date().toISOString() }
    if (parsed.data.ispublished === true)  updates.publishedat = new Date().toISOString()
    if (parsed.data.ispublished === false) updates.publishedat = null
    if (updates.coverurl === '') updates.coverurl = null

    const { data, error } = await adminDb().from('posts').update(updates).eq('id', id).select().maybeSingle()
    if (error) return err(error.message)
    if (!data) return NOT_FOUND()

    // Auto Discord jika baru saja dipublish dari draft
    if (wasUnpublished && data) {
      notifyDiscordBlog({
        slug:     data.slug,
        title:    data.title,
        excerpt:  data.excerpt,
        coverurl: data.coverurl,
        tags:     data.tags ?? [],
        authorid: data.authorid,
      }).catch(e => console.warn('[Discord Blog] Notify on publish failed:', e))
    }

    return ok(data)
  } catch { return SERVER_ERROR() }
}

// DELETE /api/admin/blog/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()
    const { id } = await params
    const { error } = await adminDb().from('posts').delete().eq('id', id)
    if (error) return err(error.message)
    return ok({ deleted: true })
  } catch { return SERVER_ERROR() }
}
