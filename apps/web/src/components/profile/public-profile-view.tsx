'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  GlobeIcon,
  Pencil1Icon,
  CalendarIcon,
  PersonIcon,
} from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  GitHubIcon as GH,
  XIcon as X,
  DiscordIcon as DC,
  LinkedInIcon as LI,
} from '@/components/icons/custom-icons'
import type { PublicProfile } from './use-public-profile'

function initials(name: string | null | undefined) {
  const value = (name || 'S').trim()
  const parts = value.split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || 'S'
}

function formatMemberSince(iso: string | undefined) {
  if (!iso) return '-'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
}

const SOCIAL_FIELDS: {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { key: 'github', label: 'GitHub', icon: GH },
  { key: 'x', label: 'X (Twitter)', icon: X },
  { key: 'discord', label: 'Discord', icon: DC },
  { key: 'linkedin', label: 'LinkedIn', icon: LI },
  { key: 'website', label: 'Website', icon: GlobeIcon },
]

interface PublicProfileViewProps {
  profile: PublicProfile
  isOwner: boolean
}

export function PublicProfileView({ profile, isOwner }: PublicProfileViewProps) {
  const displayName = profile.displayname || profile.username || 'Soraku User'
  const socials = SOCIAL_FIELDS.filter((f) => profile.sociallinks?.[f.key])

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* Cover + identity */}
      <Card className="overflow-hidden border-border bg-card shadow-sm">
        <div className="relative h-36 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent sm:h-48">
          {profile.coverurl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.coverurl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="px-4 pb-5 sm:px-6">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Avatar className="h-24 w-24 border-4 border-card shadow-md">
                <AvatarImage src={profile.avatarurl ?? undefined} alt={displayName} />
                <AvatarFallback className="text-2xl">{initials(displayName)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold text-foreground">{displayName}</h1>
                  {profile.supporterrole ? (
                    <Badge variant="secondary" className="text-xs">
                      {profile.supporterrole}
                    </Badge>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              </div>
            </div>
            {isOwner ? (
              <Button asChild variant="outline" className="shrink-0">
                <Link href="/settings/profile">
                  <Pencil1Icon className="h-4 w-4" /> Edit Profile
                </Link>
              </Button>
            ) : null}
          </div>
          {profile.bio ? (
            <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">{profile.bio}</p>
          ) : null}
        </div>
      </Card>

      {/* Social links */}
      {socials.length > 0 ? (
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Social Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {socials.map((f) => {
                const Icon = f.icon
                return (
                  <a
                    key={f.key}
                    href={profile.sociallinks[f.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    <Icon className="h-4 w-4" />
                    {f.label}
                  </a>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Public information */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Public Information</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Informasi publik dari pengguna ini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Level" value={profile.level?.level ?? 1} />
            <Stat label="Followers" value={profile.followers ?? 0} />
            <Stat label="Following" value={profile.following ?? 0} />
            <Stat label="Supports" value={profile.supportTotal ?? 0} />
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Role" value={profile.role || 'user'} />
            <Field
              label="Member Since"
              value={formatMemberSince(profile.createdat)}
              icon={<CalendarIcon className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          {profile.badges && profile.badges.length > 0 ? (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Badges
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.badges.map((b) => (
                    <Badge key={b.id} variant="outline" className="gap-1.5 text-xs">
                      <PersonIcon className="h-3.5 w-3.5" />
                      {b.badgename}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-border bg-background p-3 text-center">
      <p className="text-lg font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function Field({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  )
}

export function PublicProfileSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <Card className="overflow-hidden border-border bg-card">
        <div className="h-36 w-full animate-pulse bg-muted sm:h-48" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex items-end gap-4 sm:-mt-14">
            <div className="h-24 w-24 animate-pulse rounded-full border-4 border-card bg-muted" />
            <div className="flex-1 space-y-2 pb-1">
              <div className="h-5 w-40 animate-pulse rounded bg-muted" />
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </Card>
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-md border border-border bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
