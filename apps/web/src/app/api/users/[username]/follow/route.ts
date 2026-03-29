import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { adminDb } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

// GET — cek follow status + counts
export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const session = await getSession()

  const { data: target } = await adminDb()
    .from('users')
    .select('id')
    .eq('username', username)
    .maybeSingle()
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const [fersRes, fingsRes] = await Promise.all([
    adminDb()
      .from('follows')
      .select('id', { count: 'exact', head: true })
      .eq('followingid', target.id),
    adminDb()
      .from('follows')
      .select('id', { count: 'exact', head: true })
      .eq('followerid', target.id),
  ])

  let isFollowing = false
  if (session?.id) {
    const { data } = await adminDb()
      .from('follows')
      .select('id')
      .eq('followerid', session.id)
      .eq('followingid', target.id)
      .maybeSingle()
    isFollowing = !!data
  }

  return NextResponse.json({
    data: {
      followers: fersRes.count ?? 0,
      following: fingsRes.count ?? 0,
      isFollowing,
    },
  })
}

// POST — toggle follow
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: target } = await adminDb()
    .from('users')
    .select('id')
    .eq('username', username)
    .maybeSingle()
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (target.id === session.id)
    return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })

  const { data: existing } = await adminDb()
    .from('follows')
    .select('id')
    .eq('followerid', session.id)
    .eq('followingid', target.id)
    .maybeSingle()

  if (existing) {
    await adminDb()
      .from('follows')
      .delete()
      .eq('followerid', session.id)
      .eq('followingid', target.id)
    return NextResponse.json({ data: { following: false } })
  } else {
    await adminDb().from('follows').insert({ followerid: session.id, followingid: target.id })
    return NextResponse.json({ data: { following: true } })
  }
}
