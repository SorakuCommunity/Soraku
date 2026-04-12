'use client'

import { useEffect } from 'react'
import { usePersonalization } from '@/stores/personalization'

interface ApiUser {
  id: string
  username: string | null
  displayname: string | null
  avatarurl: string | null
  role: string
}

interface ApiActivity {
  likedPosts: string[]
  viewedPosts: string[]
  followedCategories: string[]
  followedVtubers: string[]
  followedCreators: string[]
  totalPosts: number
  totalLikes: number
}

interface ApiUserStateResponse {
  user: ApiUser | null
  activity: ApiActivity
  personalization: {
    userState: 'guest' | 'new_user' | 'active_user'
  }
}

export function useHomepagePersonalization() {
  const { userState, user, activity, isLoading, setUser, setActivity, setLoading } =
    usePersonalization()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      try {
        const response = await fetch('/api/user/personalization', {
          cache: 'no-store',
        })

        const data: ApiUserStateResponse = await response.json()

        if (data.user) {
          setUser(data.user)
        }

        if (data.activity) {
          setActivity(data.activity)
        }
      } catch (error) {
        console.error('Failed to load personalization data:', error)
        setUser(null)
        setActivity({
          likedPosts: [],
          viewedPosts: [],
          followedCategories: [],
          followedVtubers: [],
          followedCreators: [],
          totalPosts: 0,
          totalLikes: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [setUser, setActivity, setLoading])

  const getWelcomeMessage = () => {
    if (userState !== 'active_user' || !user) return null
    return `Welcome back, ${user.displayname || user.username || 'User'}`
  }

  const getOnboardingHints = () => {
    if (userState !== 'new_user') return null
    return [
      { text: 'Follow your favorite category', icon: '🎯' },
      { text: 'Explore VTubers', icon: '🎤' },
      { text: 'Join the community', icon: '💬' },
    ]
  }

  const getPriorityCategories = () => {
    if (userState !== 'active_user' || activity.followedCategories.length === 0) return null
    return activity.followedCategories
  }

  const shouldShowCTA = userState === 'guest'

  const shouldShowFriendsActivity =
    userState === 'active_user' && activity.followedCreators.length > 0

  const shouldShowDashboardShortcut =
    userState === 'active_user' && (activity.totalPosts > 0 || activity.likedPosts.length > 0)

  const getRecommendedContent = () => {
    if (userState !== 'active_user') return null
    return {
      basedOnLiked: activity.likedPosts.length > 0,
      basedOnViewed: activity.viewedPosts.length > 0,
      categories: activity.followedCategories,
    }
  }

  return {
    userState,
    user,
    activity,
    isLoading,
    getWelcomeMessage,
    getOnboardingHints,
    getPriorityCategories,
    shouldShowCTA,
    shouldShowFriendsActivity,
    shouldShowDashboardShortcut,
    getRecommendedContent,
  }
}
