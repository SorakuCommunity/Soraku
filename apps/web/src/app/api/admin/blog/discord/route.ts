export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, SERVER_ERROR } from '@/lib/api'
import { sendDiscordWebhook } from '@/lib/discord-webhook'
import { env } from '@/env'

// POST /api/admin/blog/discord — kirim notif blog baru ke Discord
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    const { id } = await req.json()
    if (!id) return err('ID artikel wajib ada.')

    const { data: post } = await adminDb()
      .from('posts')
      .select('id,slug,title,excerpt,coverurl,tags,publishedat,authorid')
      .eq('id', id)
      .eq('ispublished', true)
      .maybeSingle()

    if (!post) return err('Artikel tidak ditemukan atau belum dipublish.')

    // Get author info
    let authorName = 'Soraku Team'
    let authorAvatar: string | null = null
    if (post.authorid) {
      const { data: u } = await adminDb()
        .from('users')
        .select('username,displayname,avatarurl')
        .eq('id', post.authorid)
        .maybeSingle()
      if (u) {
        authorName = u.displayname ?? u.username ?? 'Soraku Team'
        authorAvatar = u.avatarurl ?? null
      }
    }

    const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? 'https://www.soraku.id'
    const postUrl = `${siteUrl}/blog/${post.slug}`
    const dateStr = new Date(post.publishedat ?? new Date()).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    })

    const tagsStr = (post.tags ?? []).map((t: string) => `\`#${t}\``).join(' ')
    const excerpt =
      (post.excerpt ?? '').slice(0, 250) + ((post.excerpt ?? '').length > 250 ? '...' : '')

    const result = await sendDiscordWebhook('discord_event_webhook_url', {
      username: 'Soraku Blog',
      avatar_url: `${siteUrl}/logo.png`,
      content: `📰 **Artikel baru telah terbit!** Yuk baca sekarang 👇`,
      embeds: [
        {
          author: {
            name: authorName,
            icon_url: authorAvatar ?? `${siteUrl}/logo.png`,
          },
          title: post.title,
          url: postUrl,
          description: excerpt
            ? `${excerpt}\n\n━━━━━━━━━━━━━━━━━━━━━━\n[📖 Baca Artikel Lengkap](${postUrl})`
            : `[📖 Baca Artikel Lengkap](${postUrl})`,
          color: 0x4fa3d1,
          fields: [
            { name: '📅 Tanggal Terbit', value: dateStr, inline: true },
            { name: '✍️ Penulis', value: authorName, inline: true },
            ...(tagsStr ? [{ name: '🏷️ Tags', value: tagsStr, inline: false }] : []),
          ],
          image: post.coverurl ? { url: post.coverurl } : undefined,
             footer: {
               text: 'Soraku · soraku.id',
               icon_url: `${siteUrl}/logo.png`,
             },
          timestamp: new Date().toISOString(),
        },
      ],
    })

    return ok({ sent: result.ok })
  } catch {
    return SERVER_ERROR()
  }
}
