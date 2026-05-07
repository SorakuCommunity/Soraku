export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { ok, NOT_FOUND, SERVER_ERROR } from '@/lib/api'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    // Fetch user
    const { data: user, error } = await adminDb()
      .from('users')
      .select(
        'id,username,displayname,avatarurl,coverurl,bio,role,supporterrole,sociallinks,isprivate,createdat'
      )
      .eq('username', username)
      .maybeSingle()

    if (error || !user) return NOT_FOUND()

    // Level
    const { data: lvl } = await adminDb()
      .from('userlevels')
      .select('level,xpcurrent,xprequired,reputationscore')
      .eq('userid', user.id)
      .maybeSingle()

    // Badges
    const { data: badges } = await adminDb()
      .from('userbadges')
      .select('id,badgename,badgeicon,badgecls')
      .eq('userid', user.id)
      .order('createdat', { ascending: true })

    // Gallery count + preview
    const { data: gallery } = await adminDb()
      .from('gallery')
      .select('id,imageurl,title')
      .eq('uploadedby', user.id)
      .eq('status', 'approved')
      .order('createdat', { ascending: false })
      .limit(6)

    const { count: galleryCount } = await adminDb()
      .from('gallery')
      .select('id', { count: 'exact', head: true })
      .eq('uploadedby', user.id)
      .eq('status', 'approved')

    // Followers / following count
    const { count: followersCount } = await adminDb()
      .from('follows')
      .select('follower_id', { count: 'exact', head: true })
      .eq('following_id', user.id)

    const { count: followingCount } = await adminDb()
      .from('follows')
      .select('following_id', { count: 'exact', head: true })
      .eq('follower_id', user.id)

    // Check if current user is following
    const session = await getSession()
    let isFollowing = false
    if (session?.id && session.id !== user.id) {
      const { data: fRow } = await adminDb()
        .from('follows')
        .select('follower_id')
        .eq('follower_id', session.id)
        .eq('following_id', user.id)
        .maybeSingle()
      isFollowing = !!fRow
    }

    const isOwner = session?.id === user.id;
    const isPrivate = user.isprivate ?? false;
    const shouldMask = isPrivate && !isOwner;

    return ok({
      id: user.id,
      username: user.username,
      displayname: user.displayname,
      avatarurl: user.avatarurl,
      coverurl: user.coverurl,
      bio: shouldMask ? null : user.bio,
      role: user.role ?? 'USER',
      supporterrole: user.supporterrole ?? null,
      sociallinks: shouldMask ? {} : ((user.sociallinks as Record<string, string>) ?? {}),
      isprivate: isPrivate,
      createdat: user.createdat,
      level: lvl ?? { level: 1, xpcurrent: 0, xprequired: 100, reputationscore: 0 },
      badges: shouldMask ? [] : (badges ?? []),
      galleryCount: shouldMask ? 0 : (galleryCount ?? 0),
      galleryPosts: shouldMask ? [] : (gallery ?? []),
      followers: shouldMask ? 0 : (followersCount ?? 0),
      following: shouldMask ? 0 : (followingCount ?? 0),
      isFollowing: shouldMask ? false : isFollowing,
      supportTotal: 0,
    })
  } catch {
    return SERVER_ERROR()
  }
}
