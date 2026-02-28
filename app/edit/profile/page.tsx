'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileFormData } from '@/lib/schemas'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Save, User, Link as LinkIcon, Palette, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const inputClass = 'w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all focus:border-[var(--color-primary)] min-h-[44px]'

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>{label}</label>
    {children}
    {error && <p className="text-xs mt-1 text-red-400">{error}</p>}
  </div>
)

export default function EditProfilePage() {
  const router   = useRouter()
  const supabase = createClient()
  const [loading, setLoading]   = useState(true)
  const [saving,  setSaving]    = useState(false)
  const [username, setUsername] = useState('')

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('users')
        .select('username, display_name, bio, avatar_url, cover_url, theme_mode, website, location')
        .eq('id', user.id)
        .single()

      if (data) {
        setUsername(data.username ?? '')
        setValue('display_name', data.display_name ?? '')
        setValue('username',     data.username ?? '')
        setValue('bio',          data.bio ?? '')
        setValue('avatar_url',   data.avatar_url ?? '')
        setValue('cover_url',    data.cover_url ?? '')
        setValue('website',      data.website ?? '')
        setValue('location',     data.location ?? '')
        if (data.theme_mode) setValue('theme_mode', data.theme_mode)
      }
      setLoading(false)
    }
    load()
  }, [])

  const onSubmit = async (values: ProfileFormData) => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase
      .from('users')
      .update({
        display_name: values.display_name,
        username:     values.username,
        bio:          values.bio,
        avatar_url:   values.avatar_url || null,
        cover_url:    values.cover_url  || null,
        theme_mode:   values.theme_mode,
        website:      values.website    || null,
        location:     values.location   || null,
        updated_at:   new Date().toISOString(),
      })
      .eq('id', user.id)

    setSaving(false)
    if (error) { toast.error('Gagal menyimpan: ' + error.message); return }

    // Update theme if changed
    if (values.theme_mode) {
      await fetch('/api/profile/theme', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ theme_mode: values.theme_mode }),
      })
    }

    toast.success('Profil berhasil disimpan!')
    router.push(`/u/${values.username ?? username}`)
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-primary)' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/u/${username}`} className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-all"
            style={{ color: 'var(--text-sub)' }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Edit Profil</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informasi Dasar */}
          <section className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <h2 className="flex items-center gap-2 font-semibold mb-5"><User className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />Informasi Dasar</h2>
            <div className="space-y-4">
              <Field label="Nama Tampilan *" error={errors.display_name?.message}>
                <input {...register('display_name')} placeholder="Nama publik"
                  className={inputClass} style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text)' }} />
              </Field>
              <Field label="Username *" error={errors.username?.message}>
                <input {...register('username')} placeholder="username_kamu"
                  className={inputClass} style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text)' }} />
              </Field>
              <Field label="Bio" error={errors.bio?.message}>
                <textarea {...register('bio')} placeholder="Ceritakan sedikit tentang dirimu..." rows={3}
                  className={inputClass + ' resize-none'} style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text)', minHeight: 'auto' }} />
              </Field>
              <Field label="Lokasi" error={errors.location?.message}>
                <input {...register('location')} placeholder="Jakarta, Indonesia"
                  className={inputClass} style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text)' }} />
              </Field>
            </div>
          </section>

          {/* Avatar & Cover */}
          <section className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <h2 className="flex items-center gap-2 font-semibold mb-5"><LinkIcon className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />Avatar & Cover</h2>
            <div className="space-y-4">
              <Field label="URL Avatar" error={errors.avatar_url?.message}>
                <input {...register('avatar_url')} placeholder="https://..." type="url"
                  className={inputClass} style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text)' }} />
              </Field>
              <Field label="URL Cover (Premium)" error={errors.cover_url?.message}>
                <input {...register('cover_url')} placeholder="https://..." type="url"
                  className={inputClass} style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text)' }} />
              </Field>
              <Field label="Website" error={errors.website?.message}>
                <input {...register('website')} placeholder="https://..." type="url"
                  className={inputClass} style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text)' }} />
              </Field>
            </div>
          </section>

          {/* Tema */}
          <section className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <h2 className="flex items-center gap-2 font-semibold mb-5"><Palette className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />Tema</h2>
            <Field label="Mode Tampilan" error={errors.theme_mode?.message}>
              <select {...register('theme_mode')}
                className={inputClass} style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                <option value="dark">🌙 Dark</option>
                <option value="light">☀️ Light</option>
                <option value="auto">🔄 Auto (ikuti sistem)</option>
              </select>
            </Field>
          </section>

          <button type="submit" disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60 min-h-[44px]"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
            <Save size={16} />
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  )
}
