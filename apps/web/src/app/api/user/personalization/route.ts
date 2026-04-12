import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface UserActivity {
  likedPosts: string[]
  viewedPosts: string[]
  followedCategories: string[]
  followedVtubers: string[]
  followedCreators: string[]
  totalPosts: number
  totalLikes: number
}

interface UserProfile {
  id: string
  username: string | null
  displayname: string | null
  avatarurl: string | null
  role: string
}

interface ApiResponse {
  user: UserProfile | null
  activity: UserActivity
  personalization: {
    userState: 'guest' | 'new_user' | 'active_user'
  }
}

async function getUserActivity(userId: string): Promise<UserActivity> {
  const activity: UserActivity = {
    likedPosts: [],
    viewedPosts: [],
    followedCategories: [],
    followedVtubers: [],
    followedCreators: [],
    totalPosts: 0,
    totalLikes: 0,
  }

  try {
    const supabase = createAdminClient()

    const [likesRes, postsRes] = await Promise.all([
      supabase.from('post_likes').select('post_id').eq('user_id', userId).limit(100),
      supabase.from('posts').select('id, category').eq('author_id', userId).limit(100),
    ])

    if (likesRes.data) {
      activity.likedPosts = likesRes.data.map((l) => l.post_id)
      activity.totalLikes = likesRes.data.length
    }

    if (postsRes.data) {
      activity.totalPosts = postsRes.data.length
      const categories = postsRes.data.map((p) => p.category).filter((c): c is string => !!c)
      activity.followedCategories = [...new Set(categories)]
    }
  } catch (error) {
    console.error('Error fetching user activity:', error)
  }

  return activity
}

export async function GET() {
  try {
    const supabase = createAdminClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json<ApiResponse>(
        {
          user: null,
          activity: {
            likedPosts: [],
            viewedPosts: [],
            followedCategories: [],
            followedVtubers: [],
            followedCreators: [],
            totalPosts: 0,
            totalLikes: 0,
          },
          personalization: { userState: 'guest' },
        },
        { status: 200 }
      )
    }

    const { data: userData } = await supabase
      .schema('soraku')
      .from('users')
      .select('id, username, displayname, avatarurl, role')
      .eq('id', user.id)
      .single()

    const activity = await getUserActivity(user.id)

    const hasActivity =
      activity.likedPosts.length > 0 ||
      activity.followedCategories.length > 0 ||
      activity.totalPosts > 0

    const userState = hasActivity ? 'active_user' : 'new_user'

    return NextResponse.json<ApiResponse>(
      {
        user: userData
          ? {
              id: userData.id,
              username: userData.username,
              displayname: userData.displayname,
              avatarurl: userData.avatarurl,
              role: userData.role || 'USER',
            }
          : null,
        activity,
        personalization: { userState },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in /api/user/personalization:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
