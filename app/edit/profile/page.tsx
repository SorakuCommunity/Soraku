'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileFormData } from '@/lib/schemas'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Save, User, Link as LinkIcon } from 'lucide-react'
import { useState } from 'react'

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-medium text-soraku-sub mb-1.5">{label}</label>
    {children}
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
)

const inputClass = "w-full glass border border-soraku-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 bg-transparent text-soraku-text placeholder:text-soraku-sub transition-colors"

export default function EditProfilePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
      if (data) reset(data as ProfileFormData)
      setLoading(false)
    }
    load()
  }, [supabase, reset])

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: dupe } = await supabase.from('users').select('id').eq('username', data.username).neq('id', user.id).single()
      if (dupe) { toast.error('Username sudah dipakai'); return }

      const { error } = await supabase.from('users').update(data).eq('id', user.id)
      if (error) throw error
      toast.success('Profil berhasil disimpan!')
    } catch { toast.error('Gagal menyimpan.') }
    finally { setSaving(false) }
  }

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-8">Edit <span className="grad-text">Profil</span></h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <section className="glass rounded-2xl p-6">
            <h2 className="flex items-center gap-2 font-semibold mb-5"><User className="w-4 h-4 text-soraku-primary" />Informasi Dasar</h2>
            <div className="space-y-4">
              <Field label="Nama Tampilan *" error={errors.display_name?.message}>
                <input {...register('display_name')} placeholder="Nama publik" className={inputClass} />
              </Field>
              <Field label="Username *" error={errors.username?.message}>
                <input {...register('username')} placeholder="username_unik" className={inputClass} />
              </Field>
              <Field label="Bio" error={errors.bio?.message}>
                <textarea {...register('bio')} rows={3} maxLength={200} placeholder="Tentang kamu..." className={`${inputClass} resize-none`} />
              </Field>
            </div>
          </section>

          {/* Social Links */}
          <section className="glass rounded-2xl p-6">
            <h2 className="flex items-center gap-2 font-semibold mb-5"><LinkIcon className="w-4 h-4 text-soraku-primary" />Media Sosial</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {([['official_website','Website Resmi'],['twitter','Twitter / X'],['instagram','Instagram'],['tiktok','TikTok'],['youtube','YouTube'],['twitch','Twitch'],['facebook','Facebook'],['discord_invite','Discord Invite'],['threads','Threads'],['reddit','Reddit'],['spotify','Spotify']] as const).map(([f,l]) => (
                <Field key={f} label={l} error={errors[f]?.message}>
                  <input {...register(f)} type="url" placeholder="https://" className={inputClass} />
                </Field>
              ))}
            </div>
          </section>

          {/* Fan Zone */}
          <section className="glass rounded-2xl p-6">
            <h2 className="font-semibold mb-5">❤️ Fan Zone & Support</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {([['saweria','Saweria'],['trakteer','Trakteer'],['sociabuzz','Sociabuzz'],['kofi','Ko-fi'],['patreon','Patreon'],['streamlabs','Streamlabs'],['paypal','PayPal'],['fanart_gallery','Fanart Gallery'],['fan_submission','Fan Submission'],['merchandise','Merchandise']] as const).map(([f,l]) => (
                <Field key={f} label={l} error={errors[f]?.message}>
                  <input {...register(f)} type="url" placeholder="https://" className={inputClass} />
                </Field>
              ))}
            </div>
          </section>

          <button type="submit" disabled={saving}
            className="w-full bg-soraku-gradient text-white py-3.5 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
            {saving
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Menyimpan...</>
              : <><Save className="w-4 h-4" />Simpan Profil</>}
          </button>
        </form>
      </div>
    </div>
  )
}
