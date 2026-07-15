'use client'

import { SettingsPageGuard } from '@/components/profile/settings-page'
import { AccountCard } from '@/components/profile/profile-cards'

export default function SettingsAccountPage() {
  return (
    <SettingsPageGuard>
      {({ profile, email }) => <AccountCard profile={profile} email={email} />}
    </SettingsPageGuard>
  )
}
