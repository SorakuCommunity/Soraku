'use client'
// hooks/useUser.ts — SORAKU v1.0.a3.5
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { UserRole } from '@/types'

interface UserProfile {
  id:           string
  username:     string
  display_name: string | null
  avatar_url:   string | null
  role:         UserRole
  theme_mode:   string
}

export function useUser() {
  const [user,    setUser]    = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user)
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('id, username, display_name, avatar_url, role, theme_mode')
          .eq('id', user.id)
          .single()
        setProfile(data as UserProfile | null)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    profile,
    loading,
    isLoggedIn: !!user,
    role:       profile?.role     ?? null,  // shortcut
    username:   profile?.username ?? null,  // shortcut
  }
}
