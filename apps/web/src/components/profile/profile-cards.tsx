'use client'

import * as React from 'react'
import {
  GlobeIcon,
  GearIcon,
  LockClosedIcon,
  EnvelopeClosedIcon,
  BellIcon,
  CheckIcon,
  Pencil1Icon,
  ReloadIcon,
  PersonIcon,
} from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  GitHubIcon,
  XIcon,
  DiscordIcon,
  LinkedInIcon,
  GoogleIcon,
} from '@/components/icons/custom-icons'
import type { ProfileData } from './use-profile'

interface SectionCardProps {
  id: string
  title: string
  description?: string
  children: React.ReactNode
  headerAction?: React.ReactNode
}

function SectionCard({ id, title, description, children, headerAction }: SectionCardProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base text-foreground">{title}</CardTitle>
            {description ? (
              <CardDescription className="text-sm text-muted-foreground">
                {description}
              </CardDescription>
            ) : null}
          </div>
          {headerAction}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </section>
  )
}

function initials(name: string | null | undefined) {
  const value = (name || 'S').trim()
  const parts = value.split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || 'S'
}

function formatMemberSince(iso: string | undefined) {
  if (!iso) return '-'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
  })
}

/* -------------------------------------------------------------------------- */
/* Profile header                                                             */
/* -------------------------------------------------------------------------- */

interface ProfileHeaderProps {
  profile: ProfileData
  email: string | null
  editing: boolean
  onToggleEdit: () => void
}

export function ProfileHeader({ profile, email, editing, onToggleEdit }: ProfileHeaderProps) {
  const displayName = profile.displayname || profile.username || 'Soraku User'
  return (
    <Card className="overflow-hidden border-border bg-card shadow-sm">
      <div className="relative h-32 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent sm:h-40" />
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
              <p className="text-sm text-muted-foreground">@{profile.username || 'username'}</p>
              {email ? <p className="text-xs text-muted-foreground">{email}</p> : null}
            </div>
          </div>
          <Button
            variant={editing ? 'default' : 'outline'}
            onClick={onToggleEdit}
            className="shrink-0"
          >
            {editing ? (
              <>
                <CheckIcon className="h-4 w-4" /> Selesai
              </>
            ) : (
              <>
                <Pencil1Icon className="h-4 w-4" /> Edit Profile
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* Profile information                                                        */
/* -------------------------------------------------------------------------- */

interface ProfileInfoCardProps {
  profile: ProfileData
  email: string | null
  editing: boolean
  saving: boolean
  onSave: (payload: {
    displayname?: string
    username?: string
    bio?: string
  }) => Promise<{ ok: boolean; error?: string }>
}

export function ProfileInfoCard({ profile, email, editing, saving, onSave }: ProfileInfoCardProps) {
  const [form, setForm] = React.useState({
    displayname: profile.displayname ?? '',
    username: profile.username ?? '',
    bio: profile.bio ?? '',
  })
  const [error, setError] = React.useState<string | null>(null)
  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    setForm({
      displayname: profile.displayname ?? '',
      username: profile.username ?? '',
      bio: profile.bio ?? '',
    })
  }, [profile.displayname, profile.username, profile.bio])

  async function handleSave() {
    setError(null)
    setDone(false)
    const res = await onSave({
      displayname: form.displayname.trim(),
      username: form.username.trim(),
      bio: form.bio.trim(),
    })
    if (!res.ok) {
      setError(res.error ?? 'Gagal menyimpan.')
      return
    }
    setDone(true)
  }

  if (!editing) {
    return (
      <SectionCard id="profile" title="Profile Information" description="Informasi publik profilmu">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Display Name" value={profile.displayname || '-'} />
          <Field label="Username" value={profile.username || '-'} />
          <Field label="Email" value={email || '-'} />
          <Field label="Member Since" value={formatMemberSince(profile.createdat)} />
        </dl>
        <Separator className="my-4" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Bio</p>
          <p className="text-sm whitespace-pre-wrap text-muted-foreground">
            {profile.bio || 'Belum ada bio.'}
          </p>
        </div>
      </SectionCard>
    )
  }

  return (
    <SectionCard
      id="profile"
      title="Profile Information"
      description="Perbarui nama tampilan, username, dan bio"
      headerAction={
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? <ReloadIcon className="h-4 w-4 animate-spin" /> : null}
          Simpan
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Display Name">
          <Input
            value={form.displayname}
            onChange={(e) => setForm((f) => ({ ...f, displayname: e.target.value }))}
            placeholder="Nama tampilan"
          />
        </FormField>
        <FormField label="Username">
          <Input
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            placeholder="username"
          />
        </FormField>
        <FormField label="Email" className="sm:col-span-2">
          <Input value={email ?? ''} disabled readOnly placeholder="email@example.com" />
          <p className="text-xs text-muted-foreground">Email tidak dapat diubah.</p>
        </FormField>
      </div>
      <Separator className="my-4" />
      <FormField label="Bio">
        <Textarea
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          placeholder="Ceritakan sedikit tentang dirimu"
          rows={4}
        />
      </FormField>
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      {done ? (
        <p className="mt-3 flex items-center gap-1 text-sm text-primary">
          <CheckIcon className="h-4 w-4" /> Tersimpan
        </p>
      ) : null}
    </SectionCard>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  )
}

function FormField({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ''}`}>
      <Label className="text-sm text-foreground">{label}</Label>
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Social links                                                               */
/* -------------------------------------------------------------------------- */

interface SocialLinksCardProps {
  profile: ProfileData
  editing: boolean
  saving: boolean
  onSave: (sociallinks: Record<string, string>) => Promise<{ ok: boolean; error?: string }>
}

const SOCIAL_FIELDS: {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  placeholder: string
}[] = [
  { key: 'github', label: 'GitHub', icon: GitHubIcon, placeholder: 'https://github.com/...' },
  { key: 'x', label: 'X (Twitter)', icon: XIcon, placeholder: 'https://x.com/...' },
  { key: 'discord', label: 'Discord', icon: DiscordIcon, placeholder: 'username#0000' },
  { key: 'linkedin', label: 'LinkedIn', icon: LinkedInIcon, placeholder: 'https://linkedin.com/in/...' },
  { key: 'website', label: 'Website', icon: GlobeIcon, placeholder: 'https://...' },
]

export function SocialLinksCard({ profile, editing, saving, onSave }: SocialLinksCardProps) {
  const [links, setLinks] = React.useState<Record<string, string>>(profile.sociallinks ?? {})
  const [error, setError] = React.useState<string | null>(null)
  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    setLinks(profile.sociallinks ?? {})
  }, [profile.sociallinks])

  async function handleSave() {
    setError(null)
    setDone(false)
    const res = await onSave(links)
    if (!res.ok) {
      setError(res.error ?? 'Gagal menyimpan.')
      return
    }
    setDone(true)
  }

  if (!editing) {
    const filled = SOCIAL_FIELDS.filter((f) => links[f.key])
    return (
      <SectionCard id="social" title="Social Links" description="Tautan sosial media kamu">
        {filled.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada tautan sosial media.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filled.map((f) => {
              const Icon = f.icon
              return (
                <a
                  key={f.key}
                  href={links[f.key]}
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
        )}
      </SectionCard>
    )
  }

  return (
    <SectionCard
      id="social"
      title="Social Links"
      description="Tambahkan tautan sosial media"
      headerAction={
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? <ReloadIcon className="h-4 w-4 animate-spin" /> : null}
          Simpan
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SOCIAL_FIELDS.map((f) => {
          const Icon = f.icon
          return (
            <FormField key={f.key} label={f.label}>
              <div className="relative">
                <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  value={links[f.key] ?? ''}
                  placeholder={f.placeholder}
                  onChange={(e) => setLinks((l) => ({ ...l, [f.key]: e.target.value }))}
                />
              </div>
            </FormField>
          )
        })}
      </div>
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      {done ? (
        <p className="mt-3 flex items-center gap-1 text-sm text-primary">
          <CheckIcon className="h-4 w-4" /> Tersimpan
        </p>
      ) : null}
    </SectionCard>
  )
}

/* -------------------------------------------------------------------------- */
/* Account                                                                    */
/* -------------------------------------------------------------------------- */

export function AccountCard({ profile, email }: { profile: ProfileData; email: string | null }) {
  return (
    <SectionCard id="account" title="Account" description="Detail akun dan statistik">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Display Name" value={profile.displayname || '-'} />
        <Field label="Username" value={profile.username || '-'} />
        <Field label="Email" value={email || '-'} />
        <Field label="Role" value={profile.role || 'user'} />
        <Field label="Member Since" value={formatMemberSince(profile.createdat)} />
        <Field label="Level" value={`Level ${profile.level?.level ?? 1}`} />
      </dl>
      <Separator className="my-4" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Gallery" value={profile.galleryCount} />
        <Stat label="Support" value={profile.supportTotal} />
        <Stat label="Reputation" value={profile.level?.reputationscore ?? 0} />
        <Stat label="Badges" value={profile.badges?.length ?? 0} />
      </div>
    </SectionCard>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <p className="text-lg font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Security                                                                   */
/* -------------------------------------------------------------------------- */

export function SecurityCard() {
  const [twoFactor, setTwoFactor] = React.useState(false)
  return (
    <SectionCard id="security" title="Security" description="Keamanan akun kamu">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-background p-3">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">Password</p>
            <p className="text-xs text-muted-foreground">
              Perbarui password secara berkala untuk keamanan.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/forgot-password">Ubah</a>
          </Button>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-background p-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
              <Badge variant="outline" className="text-xs">Segera</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Tambahkan lapisan keamanan ekstra (belum tersedia).
            </p>
          </div>
          <Switch checked={twoFactor} onCheckedChange={setTwoFactor} disabled aria-label="Two-factor authentication" />
        </div>
      </div>
    </SectionCard>
  )
}

/* -------------------------------------------------------------------------- */
/* Appearance                                                                 */
/* -------------------------------------------------------------------------- */

export function AppearanceCard() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const options = [
    { value: 'light', label: 'Light', icon: GlobeIcon },
    { value: 'dark', label: 'Dark', icon: LockClosedIcon },
    { value: 'system', label: 'System', icon: GearIcon },
  ]

  return (
    <SectionCard id="appearance" title="Appearance" description="Pilih tema tampilan">
      <div className="grid grid-cols-3 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon
          const active = mounted && theme === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTheme(opt.value)}
              aria-pressed={active}
              className={`flex flex-col items-center gap-2 rounded-md border p-4 text-sm transition-colors ${
                active
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-5 w-5" />
              {opt.label}
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Tema diatur secara lokal pada perangkat ini.
      </p>
    </SectionCard>
  )
}

/* -------------------------------------------------------------------------- */
/* Notifications                                                              */
/* -------------------------------------------------------------------------- */

export function NotificationsCard() {
  const [emailNotif, setEmailNotif] = React.useState(true)
  const [pushNotif, setPushNotif] = React.useState(false)
  return (
    <SectionCard id="notifications" title="Notifications" description="Preferensi notifikasi">
      <div className="space-y-3">
        <ToggleRow
          icon={EnvelopeClosedIcon}
          label="Email Notifications"
          description="Terima update melalui email."
          checked={emailNotif}
          onChange={setEmailNotif}
        />
        <ToggleRow
          icon={BellIcon}
          label="Push Notifications"
          description="Notifikasi langsung di perangkat (belum tersedia)."
          checked={pushNotif}
          onChange={setPushNotif}
          disabled
        />
      </div>
    </SectionCard>
  )
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-background p-3">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} aria-label={label} />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Connected accounts                                                         */
/* -------------------------------------------------------------------------- */

const CONNECTED_PROVIDERS = [
  { key: 'google', label: 'Google', icon: GoogleIcon },
  { key: 'github', label: 'GitHub', icon: GitHubIcon },
  { key: 'discord', label: 'Discord', icon: DiscordIcon },
]

export function ConnectedAccountsCard() {
  return (
    <SectionCard id="connected" title="Connected Accounts" description="Akun pihak ketiga">
      <div className="space-y-3">
        {CONNECTED_PROVIDERS.map((p) => {
          const Icon = p.icon
          return (
            <div
              key={p.key}
              className="flex items-center justify-between gap-4 rounded-md border border-border bg-background p-3"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">{p.label}</p>
              </div>
              <Badge variant="outline" className="text-xs">Tersambung</Badge>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

/* -------------------------------------------------------------------------- */
/* Loading + empty states                                                     */
/* -------------------------------------------------------------------------- */

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <div className="h-32 w-full animate-pulse bg-muted sm:h-40" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex items-end gap-4">
            <div className="h-24 w-24 animate-pulse rounded-full border-4 border-card bg-muted" />
            <div className="flex-1 space-y-2 pb-1">
              <div className="h-5 w-40 animate-pulse rounded bg-muted" />
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </Card>
      {[0, 1, 2].map((i) => (
        <Card key={i} className="border-border bg-card">
          <CardHeader>
            <div className="h-5 w-36 animate-pulse rounded bg-muted" />
            <div className="h-4 w-56 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-9 w-full animate-pulse rounded bg-muted" />
            <div className="h-9 w-full animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface ProfileNotFoundProps {
  reason?: 'unauthorized' | 'missing'
}

export function ProfileNotFound({ reason = 'missing' }: ProfileNotFoundProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <PersonIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold text-foreground">
            {reason === 'unauthorized' ? 'Login diperlukan' : 'Profil tidak ditemukan'}
          </p>
          <p className="text-sm text-muted-foreground">
            {reason === 'unauthorized'
              ? 'Silakan masuk untuk mengelola profil kamu.'
              : 'Profil yang kamu cari tidak tersedia.'}
          </p>
        </div>
        {reason === 'unauthorized' ? (
          <Button asChild>
            <a href="/login">Masuk</a>
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <a href="/">Kembali ke beranda</a>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
