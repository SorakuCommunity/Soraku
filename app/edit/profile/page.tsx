'use client'
// app/edit/profile/page.tsx — SORAKU v1.0.a3.4
// Full profile edit page with Social Links Editor integration
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileFormData } from '@/lib/schemas'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Save, User, Link as LinkIcon, ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SocialLinksEditor } from '@/components/profile/SocialLinksEditor'
import type { UserRole } from '@/types'

const inputClass = 'w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)20] min-h-[44px] backdrop-blur-sm'

const glassCardClass = 'p-5 rounded-2xl border backdrop-blur-xl'
const glassCardStyle = {
  backgroundColor: 'rgba(255,255,255,0.04)',
  borderColor:     'rgba(255,255,255,0.10)',
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>{label}</label>
      {children}
      {error && <p className="text-xs mt-1 text-red-400">{error}</p>}
    </div>
  )
}

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0 },
}

export default function EditProfilePage() {
  const router   = useRouter()
  const supabase = createClient()
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [userId,    setUserId]    = useState<string>('')
  const [userRole,  setUserRole]  = useState<UserRole>('USER')
  const [socials,   setSocials]   = useState<Record<string, string>>({})
  const [username,  setUsername]  = useState('')

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      setUserId(user.id)

      const { data } = await supabase
        .from('users')
        .select('username, display_name, bio, avatar_url, cover_url, theme_mode, website, location, role')
        .eq('id', user.id)
        .single()

      if (data) {
        setUsername(data.username ?? '')
        setUserRole((data.role ?? 'USER') as UserRole)
        setValue('display_name', data.display_name ?? '')
        setValue('username',     data.username ?? '')
        setValue('bio',          data.bio ?? '')
        setValue('avatar_url',   data.avatar_url ?? '')
        setValue('cover_url',    data.cover_url ?? '')
        setValue('website',      data.website ?? '')
        setValue('location',     data.location ?? '')
      }

      // Load existing socials
      const { data: socialsData } = await supabase
        .from('user_socials')
        .select('platform, url')
        .eq('user_id', user.id)

      const map: Record<string, string> = {}
      for (const s of socialsData ?? []) map[s.platform] = s.url
      setSocials(map)

      setLoading(false)
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase
      .from('users')
      .update({
        display_name: data.display_name || null,
        username:     data.username,
        bio:          data.bio || null,
        avatar_url:   data.avatar_url || null,
        cover_url:    data.cover_url || null,
        website:      data.website || null,
        location:     data.location || null,
        updated_at:   new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      toast.error('Gagal menyimpan. ' + error.message)
    } else {
      toast.success('Profil disimpan!')
      router.push(`/u/${data.username ?? username}`)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: 'var(--color-primary) transparent transparent transparent' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href={`/u/${username}`}
            className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:scale-105"
            style={{ borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)', color: 'var(--text-sub)' }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-bold text-lg" style={{ color: 'var(--text)' }}>Edit Profil</h1>
            <p className="text-xs" style={{ color: 'var(--text-sub)' }}>@{username}</p>
          </div>
        </div>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* ── Section 1: Basic Info ── */}
          <motion.section variants={sectionVariants} className={glassCardClass} style={glassCardStyle}>
            <h2 className="flex items-center gap-2 font-semibold mb-5 text-sm" style={{ color: 'var(--text)' }}>
              <User size={15} style={{ color: 'var(--color-primary)' }} />
              Informasi Dasar
            </h2>
            <div className="space-y-4">
              <Field label="Display Name" error={errors.display_name?.message}>
                <input {...register('display_name')} placeholder="Nama tampilan kamu"
                  className={inputClass} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
              </Field>
              <Field label="Username" error={errors.username?.message}>
                <input {...register('username')} placeholder="username_kamu"
                  className={inputClass} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
              </Field>
              <Field label="Bio" error={errors.bio?.message}>
                <textarea {...register('bio')} placeholder="Ceritakan sedikit tentang dirimu..." rows={3}
                  className={inputClass + ' resize-none'} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)', minHeight: 'auto' }} />
              </Field>
              <Field label="Lokasi" error={errors.location?.message}>
                <input {...register('location')} placeholder="Jakarta, Indonesia"
                  className={inputClass} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
              </Field>
            </div>
          </motion.section>

          {/* ── Section 2: Avatar & Cover ── */}
          <motion.section variants={sectionVariants} className={glassCardClass} style={glassCardStyle}>
            <h2 className="flex items-center gap-2 font-semibold mb-5 text-sm" style={{ color: 'var(--text)' }}>
              <LinkIcon size={15} style={{ color: 'var(--color-primary)' }} />
              Avatar & Cover
            </h2>
            <div className="space-y-4">
              <Field label="URL Avatar" error={errors.avatar_url?.message}>
                <input {...register('avatar_url')} placeholder="https://..." type="url"
                  className={inputClass} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
              </Field>
              <Field label="URL Cover (PREMIUM+)" error={errors.cover_url?.message}>
                <input {...register('cover_url')} placeholder="https://..." type="url"
                  className={inputClass} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
              </Field>
              <Field label="Website" error={errors.website?.message}>
                <input {...register('website')} placeholder="https://yoursite.com" type="url"
                  className={inputClass} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
              </Field>
            </div>
          </motion.section>

          {/* ── Section 3: Social Links Editor ── */}
          <motion.section variants={sectionVariants}>
            <div className="flex items-center gap-2 mb-3 px-1">
              <Share2 size={14} style={{ color: 'var(--color-primary)' }} />
              <h2 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Social Links</h2>
            </div>
            {userId && (
              <SocialLinksEditor
                userId={userId}
                role={userRole}
                initialLinks={socials}
              />
            )}
          </motion.section>

          {/* ── Save button ── */}
          <motion.div variants={sectionVariants}>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary, #6E8FA6))',
                boxShadow: '0 4px 24px var(--color-primary)40',
              }}
            >
              {saving ? (
                <div className="w-4 h-4 border-2 rounded-full animate-spin border-white border-t-transparent" />
              ) : (
                <Save size={15} />
              )}
              {saving ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
