'use client'

import { SettingsPageGuard } from '@/components/profile/settings-page'
import { ConnectedAccountsCard } from '@/components/profile/profile-cards'

export default function SettingsConnectedAccountsPage() {
  return (
    <SettingsPageGuard>
      {() => <ConnectedAccountsCard />}
    </SettingsPageGuard>
  )
}
