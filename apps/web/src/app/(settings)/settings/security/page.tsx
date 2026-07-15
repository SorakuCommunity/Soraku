'use client'

import { SettingsPageGuard } from '@/components/profile/settings-page'
import { SecurityCard } from '@/components/profile/profile-cards'

export default function SettingsSecurityPage() {
  return (
    <SettingsPageGuard>
      {() => <SecurityCard />}
    </SettingsPageGuard>
  )
}
