export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, SERVER_ERROR } from '@/lib/api'
import { sendDiscordWebhook } from '@/lib/discord-webhook'
import { notifyNewBlog } from '@/lib/notify'
import { env } from '@/env'
import { NextRequest } from 'next/server'
import { z } from 'zod'

const PostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverurl: z
    .string()
    .url()
    .optional()
    .or(z.literal(''))
    .transform((v) => v || undefined),
  tags: z.array(z.string()).default([]),
  ispublished: z.boolean().default(false),
})

// ── Kirim Discord embed artikel baru ──────────────────────────────────────
async function notifyDiscordBlog(post: {
  id: string
  slug: string
  title: string
  excerpt?: string | null
  coverurl?: string | null
  tags: string[]
  authorid?: string | null
}) {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? 'https://www.soraku.id'
  const postUrl = `${siteUrl}/blog/${post.slug}`

  // Get author info
  let authorName = 'Soraku Team'
  let authorAvatar = `${siteUrl}/logo.png`
  if (post.authorid) {
    const { data: u } = await adminDb()
      .from('users')
      .select('username,displayname,avatarurl')
      .eq('id', post.authorid)
      .maybeSingle()
    if (u) {
      authorName = u.displayname ?? u.username ?? 'Soraku Team'
      authorAvatar = u.avatarurl ?? authorAvatar
    }
  }

  const tagsStr = (post.tags ?? []).length > 0 ? post.tags.map((t) => `\`#${t}\``).join(' ') : null

  const excerpt = post.excerpt
    ? post.excerpt.slice(0, 280) + (post.excerpt.length > 280 ? '...' : '')
    : null

  const dateStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })

  await sendDiscordWebhook('discord_blog_webhook_url', {
    username: 'Soraku Blog',
    avatar_url: `${siteUrl}/logo.png`,
    content: `📰 **Artikel baru telah terbit!** Langsung baca sekarang 👇`,
    embeds: [
      {
        author: { name: authorName, icon_url: authorAvatar },
        title: post.title,
        url: postUrl,
        description: [
          excerpt ?? '',
          '',
          '━━━━━━━━━━━━━━━━━━━━━━',
          `[📖 Baca Artikel Lengkap](${postUrl})`,
        ]
          .filter(Boolean)
          .join('\n'),
        color: 0x4fa3d1,
        fields: [
          { name: '📅 Tanggal Terbit', value: dateStr, inline: true },
          { name: '✍️ Penulis', value: authorName, inline: true },
          ...(tagsStr ? [{ name: '🏷️ Tags', value: tagsStr, inline: false }] : []),
        ],
        image: post.coverurl ? { url: post.coverurl } : undefined,
         footer: { text: 'Soraku · soraku.id', icon_url: `${siteUrl}/logo.png` },
        timestamp: new Date().toISOString(),
      },
    ],
  })
}

// GET /api/admin/blog — list all posts (staff only)
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()
    const { searchParams } = new URL(req.url)
    const limit = Math.min(Number(searchParams.get('limit') ?? '100'), 200)
    const { data, error } = await adminDb()
      .from('posts')
      .select(
        'id,slug,title,excerpt,coverurl,ispublished,tags,createdat,publishedat,authorid,viewcount,likecount'
      )
      .order('createdat', { ascending: false })
      .limit(limit)
    if (error) return SERVER_ERROR()
    return ok(data ?? [])
  } catch {
    return SERVER_ERROR()
  }
}

// POST /api/admin/blog — create new post + auto Discord if published
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()
    const body = await req.json()
    const parsed = PostSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    const payload = {
      ...parsed.data,
      authorid: session.id,
      publishedat: parsed.data.ispublished ? new Date().toISOString() : null,
    }
    const { data, error } = await adminDb().from('posts').insert(payload).select().single()
    if (error) return err(error.message)

    // Auto kirim ke Discord jika langsung publish
    if (parsed.data.ispublished && data) {
      notifyDiscordBlog({
        id: data.id,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        coverurl: data.coverurl,
        tags: data.tags ?? [],
        authorid: data.authorid,
      }).catch((e) => console.warn('[Discord Blog] Auto-notify failed:', e))

      // Auto in-app notification ke semua user
      notifyNewBlog({ slug: data.slug, title: data.title }).catch(() => {})
    }

    return ok(data, 201)
  } catch {
    return SERVER_ERROR()
  }
}
