'use client'

import { SettingsPageGuard } from '@/components/profile/settings-page'
import { AppearanceCard } from '@/components/profile/profile-cards'

export default function SettingsAppearancePage() {
  return (
    <SettingsPageGuard>
      {() => <AppearanceCard />}
    </SettingsPageGuard>
  )
}
