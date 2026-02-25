import { create } from 'zustand'
import type { User, SiteSetting } from '@/types'

interface AppState {
  currentUser: User | null
  siteSettings: SiteSetting[]
  setCurrentUser: (user: User | null) => void
  setSiteSettings: (settings: SiteSetting[]) => void
  getSetting: (key: string, fallback?: string) => string
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  siteSettings: [],
  setCurrentUser: (user) => set({ currentUser: user }),
  setSiteSettings: (settings) => set({ siteSettings: settings }),
  getSetting: (key, fallback = '') => {
    const found = get().siteSettings.find((s) => s.key === key)
    return found?.value ?? fallback
  },
}))
