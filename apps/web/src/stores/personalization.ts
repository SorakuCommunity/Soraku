'use client'

import { create } from 'zustand'

export type UserState = 'guest' | 'new_user' | 'active_user'

interface UserProfile {
  id: string
  username: string | null
  displayname: string | null
  avatarurl: string | null
  role: string
}

interface UserActivity {
  likedPosts: string[]
  viewedPosts: string[]
  followedCategories: string[]
  followedVtubers: string[]
  followedCreators: string[]
  totalPosts: number
  totalLikes: number
}

interface PersonalizationState {
  userState: UserState
  user: UserProfile | null
  activity: UserActivity
  isLoading: boolean

  setUser: (user: UserProfile | null) => void
  setActivity: (activity: UserActivity) => void
  setLoading: (loading: boolean) => void
  determineUserState: () => void
}

const initialActivity: UserActivity = {
  likedPosts: [],
  viewedPosts: [],
  followedCategories: [],
  followedVtubers: [],
  followedCreators: [],
  totalPosts: 0,
  totalLikes: 0,
}

export const usePersonalization = create<PersonalizationState>((set, get) => ({
  userState: 'guest',
  user: null,
  activity: initialActivity,
  isLoading: true,

  setUser: (user) => {
    set({ user })
    get().determineUserState()
  },

  setActivity: (activity) => {
    set({ activity })
    get().determineUserState()
  },

  setLoading: (isLoading) => set({ isLoading }),

  determineUserState: () => {
    const { user, activity } = get()

    if (!user) {
      set({ userState: 'guest' })
      return
    }

    const hasActivity =
      activity.likedPosts.length > 0 ||
      activity.viewedPosts.length > 0 ||
      activity.followedCategories.length > 0 ||
      activity.followedVtubers.length > 0 ||
      activity.followedCreators.length > 0 ||
      activity.totalPosts > 0

    if (hasActivity) {
      set({ userState: 'active_user' })
    } else {
      set({ userState: 'new_user' })
    }
  },
}))
