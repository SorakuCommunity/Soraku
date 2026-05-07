/**
 * Soraku Notification Helper
 * Dipanggil dari API routes untuk auto-trigger notifikasi
 */
import { adminDb } from '@/lib/supabase/admin'

type NotifType =
  | 'event'
  | 'blog'
  | 'gallery'
  | 'badge'
  | 'system'
  | 'info'
  | 'premium'
  | 'follow'
  | 'ban'
  | 'mention'

interface NotifPayload {
  userid: string
  type: NotifType
  title: string
  body?: string | null
  href?: string | null
}

/** Kirim satu notifikasi ke satu user */
export async function sendNotif(payload: NotifPayload) {
  try {
    await adminDb()
      .from('notifications')
      .insert({
        userid: payload.userid,
        type: payload.type,
        title: payload.title,
        body: payload.body ?? null,
        href: payload.href ?? null,
        isread: false,
      })
  } catch (e) {
    console.error('[notify] sendNotif error:', e)
  }
}

/** Broadcast ke semua user (atau filter by role) */
export async function broadcastNotif(
  payload: Omit<NotifPayload, 'userid'>,
  options?: { role?: string; limit?: number }
) {
  try {
    let query = adminDb().from('users').select('id').eq('isbanned', false)
    if (options?.role) query = query.eq('role', options.role)
    if (options?.limit) query = query.limit(options.limit)
    const { data: users } = await query

    if (!users || users.length === 0) return
    const BATCH = 500
    for (let i = 0; i < users.length; i += BATCH) {
      const rows = users.slice(i, i + BATCH).map((u: any) => ({
        userid: u.id,
        type: payload.type,
        title: payload.title,
        body: payload.body ?? null,
        href: payload.href ?? null,
        isread: false,
      }))
      await adminDb().from('notifications').insert(rows)
    }
  } catch (e) {
    console.error('[notify] broadcastNotif error:', e)
  }
}

/** Notif: Blog baru published → semua follower author atau semua user */
export async function notifyNewBlog(post: {
  slug: string
  title: string
  authorid?: string | null
}) {
  const href = `/blog/${post.slug}`
  await broadcastNotif({
    type: 'blog',
    title: `Artikel baru: ${post.title}`,
    body: 'Ada artikel baru yang baru saja dipublikasikan!',
    href,
  })
}

/** Notif: Event baru → semua user */
export async function notifyNewEvent(event: { slug: string; title: string }) {
  await broadcastNotif({
    type: 'event',
    title: `Event baru: ${event.title}`,
    body: 'Event komunitas baru telah dibuka. Yuk daftar!',
    href: `/events/${event.slug}`,
  })
}

/** Notif: Gallery approved/rejected → pemilik */
export async function notifyGalleryStatus(opts: {
  userid: string
  imageTitle: string | null
  approved: boolean
}) {
  await sendNotif({
    userid: opts.userid,
    type: 'gallery',
    title: opts.approved
      ? `Karya "${opts.imageTitle ?? 'kamu'}" disetujui! 🎉`
      : `Karya "${opts.imageTitle ?? 'kamu'}" tidak disetujui`,
    body: opts.approved
      ? 'Karya kamu sekarang tampil di galeri publik.'
      : 'Karya tidak memenuhi panduan komunitas.',
    href: '/gallery',
  })
}

/** Notif: Follow → target user */
export async function notifyFollow(opts: { targetUserId: string; followerName: string }) {
  await sendNotif({
    userid: opts.targetUserId,
    type: 'follow' as NotifType,
    title: `${opts.followerName} mulai mengikutimu`,
    body: null,
    href: null,
  })
}

/** Notif: Ban/unban → user yang kena */
export async function notifyBan(opts: { userid: string; banned: boolean; reason?: string }) {
  await sendNotif({
    userid: opts.userid,
    type: 'system',
    title: opts.banned ? 'Akunmu telah dinonaktifkan' : 'Akun kamu telah dipulihkan',
    body: opts.banned
      ? (opts.reason ?? 'Melanggar ketentuan komunitas.')
      : 'Kamu kembali bisa mengakses Soraku.',
    href: '/help',
  })
}

/** Notif: Level naik → user */
export async function notifyLevelUp(opts: { userid: string; newLevel: number }) {
  await sendNotif({
    userid: opts.userid,
    type: 'badge',
    title: `🎉 Naik ke Level ${opts.newLevel}!`,
    body: 'Kamu mendapatkan XP baru. Terus aktif di komunitas!',
    href: '/profile/me',
  })
}

/** Notif: Badge baru → user */
export async function notifyNewBadge(opts: { userid: string; badgeName: string }) {
  await sendNotif({
    userid: opts.userid,
    type: 'badge',
    title: `Badge baru: ${opts.badgeName} 🏅`,
    body: 'Kamu mendapatkan penghargaan dari komunitas!',
    href: '/profile/me',
  })
}

/** Notif: Role berubah → user */
export async function notifyRoleChange(opts: { userid: string; newRole: string }) {
  await sendNotif({
    userid: opts.userid,
    type: 'system',
    title: `Role kamu diperbarui: ${opts.newRole}`,
    body: 'Status kamu di komunitas Soraku telah diperbarui.',
    href: '/profile/me',
  })
}

/** Notif: Premium berubah → user */
export async function notifyPremiumChange(opts: { userid: string; role: string; active: boolean }) {
  await sendNotif({
    userid: opts.userid,
    type: 'premium',
    title: opts.active ? `Status ${opts.role} aktif! ⭐` : `Status ${opts.role} berakhir`,
    body: opts.active
      ? 'Terima kasih atas dukunganmu untuk Soraku!'
      : 'Status premium kamu telah berakhir.',
    href: '/premium',
  })
}
