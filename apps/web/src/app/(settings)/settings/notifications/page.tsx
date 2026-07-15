'use client'

import { SettingsPageGuard } from '@/components/profile/settings-page'
import { NotificationsCard } from '@/components/profile/profile-cards'

export default function SettingsNotificationsPage() {
  return (
    <SettingsPageGuard>
      {() => <NotificationsCard />}
    </SettingsPageGuard>
  )
}
