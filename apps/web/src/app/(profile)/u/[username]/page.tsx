'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'
import { ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { usePublicProfile } from '@/components/profile/use-public-profile'
import { PublicProfileView, PublicProfileSkeleton } from '@/components/profile/public-profile-view'

export default function PublicProfilePage() {
  const params = useParams()
  const username = decodeURIComponent(String(params.username ?? ''))
  const { status, profile } = usePublicProfile(username)
  const [ownerUsername, setOwnerUsername] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setOwnerUsername(d?.data?.username ?? null))
      .catch(() => {})
  }, [])

  const isOwner = !!profile && ownerUsername === profile.username

  if (status === 'loading') return <PublicProfileSkeleton />
  if (status === 'notfound') return <ProfileNotFound />
  if (status === 'error' || !profile)
    return (
      <Card className="mx-auto w-full max-w-3xl border-border bg-card">
        <CardContent className="flex flex-col items-center gap-4 px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <ExclamationTriangleIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-foreground">Gagal memuat profil</p>
            <p className="text-sm text-muted-foreground">
              Terjadi kesalahan saat mengambil data profil.
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <ReloadIcon className="h-4 w-4" /> Coba lagi
          </Button>
        </CardContent>
      </Card>
    )

  return <PublicProfileView profile={profile} isOwner={isOwner} />
}

function ProfileNotFound() {
  return (
    <Card className="mx-auto w-full max-w-3xl border-border bg-card">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <ExclamationTriangleIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold text-foreground">Pengguna tidak ditemukan</p>
          <p className="text-sm text-muted-foreground">
            Profil dengan username tersebut tidak tersedia.
          </p>
        </div>
        <Button variant="outline" asChild>
          <a href="/">Kembali ke beranda</a>
        </Button>
      </CardContent>
    </Card>
  )
}
