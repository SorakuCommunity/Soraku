'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileFormData } from '@/lib/schemas'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Save, User, Link as LinkIcon, Crown, Info } from 'lucide-react'
import { isPremiumOrAbove } from '@/lib/utils'
import type { UserRole } from '@/types'

const cls = 'w-full glass border border-soraku-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 bg-transparent text-soraku-text placeholder:text-soraku-sub transition-colors'

function Field({ label, error, locked, children }: { label: string; error?: string; locked?: boolean; children: React.ReactNode }) {
  return (
    <div className="relative">
      <label className="block text-xs font-medium text-soraku-sub mb-1.5">
        {label}
        {locked && <span className="ml-2 text-xs text-yellow-400">👑 Premium</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

// All social link fields  
const BASIC_SOCIALS: [keyof ProfileFormData, string][] = [
  ['twitter', 'Twitter / X'],
  ['instagram', 'Instagram'],
]
const PREMIUM_SOCIALS: [keyof ProfileFormData, string][] = [
  ['tiktok', 'TikTok'],
  ['youtube', 'YouTube'],
  ['twitch', 'Twitch'],
  ['facebook', 'Facebook'],
  ['discord_invite', 'Discord Invite'],
  ['threads', 'Threads'],
  ['reddit', 'Reddit'],
  ['spotify', 'Spotify'],
  ['official_website', 'Website Resmi'],
]
const SUPPORT_LINKS: [keyof ProfileFormData, string][] = [
  ['saweria', 'Saweria'],
  ['trakteer', 'Trakteer'],
  ['sociabuzz', 'Sociabuzz'],
  ['kofi', 'Ko-fi'],
  ['patreon', 'Patreon'],
  ['streamlabs', 'Streamlabs'],
  ['paypal', 'PayPal'],
  ['fanart_gallery', 'Fanart Gallery'],
  ['fan_submission', 'Fan Submission'],
  ['merchandise', 'Merchandise'],
]

export default function EditProfilePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>('USER')
  const isPremium = isPremiumOrAbove(userRole)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
      if (data) {
        setUserRole((data.role ?? 'USER') as UserRole)
        reset(data as ProfileFormData)
      }
      setLoading(false)
    }
    load()
  }, [supabase, reset])

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Enforce: USER max 2 social links server-side check
      if (!isPremium) {
        const allSocials = [...BASIC_SOCIALS, ...PREMIUM_SOCIALS, ...SUPPORT_LINKS]
        const filled = allSocials.filter(([field]) => {
          const val = data[field]
          return val && String(val).trim() !== ''
        })
        if (filled.length > 2) {
          toast.error('Akun FREE hanya bisa 2 link sosial. Upgrade ke Premium untuk lebih banyak!')
          setSaving(false)
          return
        }
      }

      // Check username uniqueness
      const { data: dupe } = await supabase.from('users').select('id').eq('username', data.username).neq('id', user.id).single()
      if (dupe) { toast.error('Username sudah dipakai.'); return }

      const { error } = await supabase.from('users').update(data).eq('id', user.id)
      if (error) throw error
      toast.success('Profil berhasil disimpan! ✨')
    } catch {
      toast.error('Gagal menyimpan profil.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-2">Edit <span className="grad-text">Profil</span></h1>
        <p className="text-soraku-sub text-sm mb-8">Kelola informasi dan link sosial mediamu.</p>

        {!isPremium && (
          <div className="glass rounded-xl p-4 mb-6 border border-yellow-500/30 flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-400">Akun Gratis — Maks 2 Link Sosial</p>
              <p className="text-xs text-soraku-sub mt-1">
                Upgrade ke <span className="text-yellow-400 font-semibold">Premium</span> untuk unlock semua link sosial tanpa batas.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <section className="glass rounded-2xl p-6">
            <h2 className="flex items-center gap-2 font-semibold mb-5 text-sm uppercase tracking-wide text-soraku-sub">
              <User className="w-4 h-4 text-soraku-primary" />Informasi Dasar
            </h2>
            <div className="space-y-4">
              <Field label="Nama Tampilan *" error={errors.display_name?.message}>
                <input {...register('display_name')} placeholder="Nama publik" className={cls} />
              </Field>
              <Field label="Username *" error={errors.username?.message}>
                <input {...register('username')} placeholder="username_unik" className={cls} />
              </Field>
              <Field label="Bio">
                <textarea {...register('bio')} rows={3} maxLength={200}
                  placeholder="Ceritakan tentang dirimu (maks 200 karakter)..."
                  className={`${cls} resize-none`} />
              </Field>
            </div>
          </section>

          {/* Social Links */}
          <section className="glass rounded-2xl p-6">
            <h2 className="flex items-center gap-2 font-semibold mb-2 text-sm uppercase tracking-wide text-soraku-sub">
              <LinkIcon className="w-4 h-4 text-soraku-primary" />Media Sosial
            </h2>
            {!isPremium && (
              <p className="text-xs text-soraku-sub mb-4">Pilih maksimal <strong>2 link</strong> saja.</p>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              {BASIC_SOCIALS.map(([field, label]) => (
                <Field key={field} label={label} error={errors[field]?.message}>
                  <input {...register(field)} type="url" placeholder="https://" className={cls} />
                </Field>
              ))}
              {PREMIUM_SOCIALS.map(([field, label]) => (
                <Field key={field} label={label} error={errors[field]?.message} locked={!isPremium}>
                  <input {...register(field)} type="url" placeholder="https://"
                    className={`${cls} ${!isPremium ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!isPremium} />
                </Field>
              ))}
            </div>
            {!isPremium && (
              <div className="mt-4 glass rounded-xl p-4 border border-yellow-500/20 text-center">
                <Crown className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm font-semibold mb-1">Upgrade ke Premium</p>
                <p className="text-xs text-soraku-sub">Buka semua link sosial + fitur eksklusif lainnya!</p>
              </div>
            )}
          </section>

          {/* Support Links (Premium only) */}
          {isPremium && (
            <section className="glass rounded-2xl p-6">
              <h2 className="font-semibold mb-5 text-sm uppercase tracking-wide text-soraku-sub">
                ❤️ Fan Zone & Support
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {SUPPORT_LINKS.map(([field, label]) => (
                  <Field key={field} label={label} error={errors[field]?.message}>
                    <input {...register(field)} type="url" placeholder="https://" className={cls} />
                  </Field>
                ))}
              </div>
            </section>
          )}

          <button type="submit" disabled={saving}
            className="w-full bg-soraku-gradient text-white py-3.5 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity">
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Menyimpan...</>
            ) : (
              <><Save className="w-4 h-4" />Simpan Profil</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
