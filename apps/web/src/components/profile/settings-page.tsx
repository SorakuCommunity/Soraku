'use client'

import * as React from 'react'
import { useProfile, type ProfileData } from './use-profile'
import { ProfileSkeleton, ProfileNotFound } from './profile-cards'

interface SettingsContext {
  profile: ProfileData
  email: string | null
  saving: boolean
  save: (
    payload: Parameters<ReturnType<typeof useProfile>['save']>[0]
  ) => Promise<{ ok: boolean; error?: string }>
}

export function SettingsPageGuard({
  children,
}: {
  children: (ctx: SettingsContext) => React.ReactNode
}) {
  const { status, profile, email, saving, save } = useProfile()

  if (status === 'loading') return <ProfileSkeleton />
  if (status === 'unauthorized') return <ProfileNotFound reason="unauthorized" />
  if (!profile) return <ProfileNotFound reason="missing" />

  return <>{children({ profile, email, saving, save })}</>
}
