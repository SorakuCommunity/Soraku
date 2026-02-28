// hooks/useUser.ts - SORAKU 1.0.a3.4 FINAL BUILD SUCCESS
'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { UserWithRole } from '@/types'

interface UseUserReturn {
  user: User | null
  profile: UserWithRole | null
  loading: boolean
  isLoggedIn: boolean
  role: string | null
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserWithRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [role, setRole] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    getInitialUser()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setIsLoggedIn(!!session)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setRole(null)
      }
    })
    
    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  async function getInitialUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user || null)
    setIsLoggedIn(!!user)
    if (user) {
      await fetchProfile(user.id)
    }
    setLoading(false)
  }

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        users!profiles_user_id_fkey(role)
      `)
      .eq('id', userId)
      .single()

    if (data && !error) {
      setProfile(data as UserWithRole)
      setRole(data.role || null)
    }
  }

  return {
    user,
    profile,
    loading,
    isLoggedIn,
    role
  }
}
