'use client'

import * as React from 'react'
import { SettingsPageGuard } from '@/components/profile/settings-page'
import {
  ProfileHeader,
  ProfileInfoCard,
  SocialLinksCard,
} from '@/components/profile/profile-cards'

export default function SettingsProfilePage() {
  const [editing, setEditing] = React.useState(false)
  return (
    <SettingsPageGuard>
      {({ profile, email, saving, save }) => (
        <div className="space-y-6">
          <ProfileHeader
            profile={profile}
            email={email}
            editing={editing}
            onToggleEdit={() => setEditing((v) => !v)}
          />
          <ProfileInfoCard
            profile={profile}
            email={email}
            editing={editing}
            saving={saving}
            onSave={(payload) => save(payload)}
          />
          <SocialLinksCard
            profile={profile}
            editing={editing}
            saving={saving}
            onSave={(sociallinks) => save({ sociallinks })}
          />
        </div>
      )}
    </SettingsPageGuard>
  )
}
