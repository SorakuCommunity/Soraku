'use client'
// app/edit/profile/page.tsx — SORAKU v1.0.a3.5
// Cover URL locked to PREMIUM / AGENSI / ADMIN / MANAGER / OWNER
// Social Links Editor with role-based platform access
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileFormData } from '@/lib/schemas'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Save, User, Link as LinkIcon, Palette, ArrowLeft, Lock, Share2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SocialLinksEditor } from '@/components/profile/SocialLinksEditor'
import type { UserRole } from '@/types'

const COVER_ROLES: UserRole[] = ['PREMIUM', 'AGENSI', 'ADMIN', 'MANAGER', 'OWNER']

const inputClass = 'w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)20] min-h-[44px] backdrop-blur-sm'
const glassCard  = { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.10)' }

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>{label}</label>
      {children}
      {error && <p className="text-xs mt-1 text-red-400">{error}</p>}
    </div>
  )
}

const sectionVariants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }

export default function EditProfilePage() {
  const router   = useRouter()
  const supabase = createClient()

  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [userId,   setUserId]   = useState('')
  const [username, setUsername] = useState('')
  const [userRole, setUserRole] = useState<UserRole>('USER')
  const [socials,  setSocials]  = useState<Record<string, string>>({})

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
        if (data.theme_mode) setValue('theme_mode', data.theme_mode)
      }

      // Load social links
      const { data: socialsData } = await supabase
        .from('user_socials').select('platform, url').eq('user_id', user.id)
      const map: Record<string, string> = {}
      for (const s of socialsData ?? []) map[s.platform] = s.url ?? ''
      setSocials(map)

      setLoading(false)
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (values: ProfileFormData) => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const canEditCover = COVER_ROLES.includes(userRole)

    const { error } = await supabase.from('users').update({
      display_name: values.display_name,
      username:     values.username,
      bio:          values.bio,
      avatar_url:   values.avatar_url || null,
      cover_url:    canEditCover ? (values.cover_url || null) : undefined,
      theme_mode:   values.theme_mode,
      website:      values.website   || null,
      location:     values.location  || null,
      updated_at:   new Date().toISOString(),
    }).eq('id', user.id)

    setSaving(false)
    if (error) { toast.error('Gagal menyimpan: ' + error.message); return }

    if (values.theme_mode) {
      await fetch('/api/profile/theme', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme_mode: values.theme_mode }),
      })
    }

    toast.success('Profil berhasil disimpan!')
    router.push(`/u/${values.username ?? username}`)
    router.refresh()
  }

  const canEditCover = COVER_ROLES.includes(userRole)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--color-primary)' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href={`/u/${username}`}
            className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-all"
            style={{ color: 'var(--text-sub)' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Edit Profil</h1>
            <p className="text-xs" style={{ color: 'var(--text-sub)' }}>@{username}</p>
          </div>
        </div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden" animate="show"
        >

          {/* ── Informasi Dasar ── */}
          <motion.section variants={sectionVariants}
            className="p-5 rounded-2xl border" style={glassCard}>
            <h2 className="flex items-center gap-2 font-semibold mb-5 text-sm">
              <User size={15} style={{ color: 'var(--color-primary)' }} />
              <span style={{ color: 'var(--text)' }}>Informasi Dasar</span>
            </h2>
            <div className="space-y-4">
              <Field label="Nama Tampilan *" error={errors.display_name?.message}>
                <input {...register('display_name')} placeholder="Nama publik"
                  className={inputClass}
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
              </Field>
              <Field label="Username *" error={errors.username?.message}>
                <input {...register('username')} placeholder="username_kamu"
                  className={inputClass}
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
              </Field>
              <Field label="Bio" error={errors.bio?.message}>
                <textarea {...register('bio')} placeholder="Ceritakan sedikit tentang dirimu..." rows={3}
                  className={inputClass + ' resize-none'}
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)', minHeight: 'auto' }} />
              </Field>
              <Field label="Lokasi" error={errors.location?.message}>
                <input {...register('location')} placeholder="Jakarta, Indonesia"
                  className={inputClass}
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
              </Field>
            </div>
          </motion.section>

          {/* ── Avatar & Cover ── */}
          <motion.section variants={sectionVariants}
            className="p-5 rounded-2xl border" style={glassCard}>
            <h2 className="flex items-center gap-2 font-semibold mb-5 text-sm">
              <LinkIcon size={15} style={{ color: 'var(--color-primary)' }} />
              <span style={{ color: 'var(--text)' }}>Avatar & Cover</span>
            </h2>
            <div className="space-y-4">
              <Field label="URL Avatar" error={errors.avatar_url?.message}>
                <input {...register('avatar_url')} placeholder="https://..." type="url"
                  className={inputClass}
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
              </Field>

              {/* Cover URL — PREMIUM / AGENSI / ADMIN / MANAGER / OWNER only */}
              <div>
                <label className="block text-xs font-medium mb-1.5 flex items-center gap-2"
                  style={{ color: 'var(--text-sub)' }}>
                  URL Cover
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                    style={{
                      backgroundColor: canEditCover ? '#C9A84C22' : '#ef444422',
                      color:           canEditCover ? '#C9A84C'   : '#ef4444',
                    }}>
                    {canEditCover
                      ? (userRole === 'PREMIUM' ? 'PREMIUM ✓' : `${userRole} ✓`)
                      : 'PREMIUM+'}
                  </span>
                </label>
                <div className="relative">
                  <input {...register('cover_url')} type="url"
                    disabled={!canEditCover}
                    placeholder={canEditCover
                      ? 'https://cdn.example.com/cover.jpg'
                      : 'Upgrade ke PREMIUM untuk mengubah cover'}
                    className={inputClass}
                    style={{
                      backgroundColor: canEditCover ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                      borderColor:     canEditCover ? 'rgba(255,255,255,0.12)' : 'rgba(239,68,68,0.20)',
                      color:           'var(--text)',
                      cursor:          canEditCover ? 'text' : 'not-allowed',
                      opacity:         canEditCover ? 1 : 0.5,
                    }} />
                  {!canEditCover && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Lock size={13} color="#ef4444" />
                    </div>
                  )}
                </div>
                {!canEditCover && (
                  <p className="text-xs mt-1.5" style={{ color: '#ef4444' }}>
                    Cover kustom tersedia untuk PREMIUM, AGENSI, ADMIN, MANAGER, dan OWNER.
                    <Link href="/pricing" className="ml-1 underline hover:opacity-80">Upgrade sekarang</Link>
                  </p>
                )}
                {errors.cover_url && <p className="text-xs mt-1 text-red-400">{errors.cover_url.message}</p>}
              </div>

              <Field label="Website" error={errors.website?.message}>
                <input {...register('website')} placeholder="https://yoursite.com" type="url"
                  className={inputClass}
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
              </Field>
            </div>
          </motion.section>

          {/* ── Social Links ── */}
          <motion.section variants={sectionVariants}>
            <div className="flex items-center gap-2 mb-3 px-1">
              <Share2 size={14} style={{ color: 'var(--color-primary)' }} />
              <h2 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Social Links</h2>
            </div>
            {userId && (
              <SocialLinksEditor userId={userId} role={userRole} initialLinks={socials} />
            )}
          </motion.section>

          {/* ── Tema ── */}
          <motion.section variants={sectionVariants}
            className="p-5 rounded-2xl border" style={glassCard}>
            <h2 className="flex items-center gap-2 font-semibold mb-5 text-sm">
              <Palette size={15} style={{ color: 'var(--color-primary)' }} />
              <span style={{ color: 'var(--text)' }}>Tema</span>
            </h2>
            <Field label="Mode Tampilan" error={errors.theme_mode?.message}>
              <select {...register('theme_mode')} className={inputClass}
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }}>
                <option value="dark">🌙 Dark</option>
                <option value="light">☀️ Light</option>
                <option value="auto">🔄 Auto (ikuti sistem)</option>
              </select>
            </Field>
          </motion.section>

          {/* Save */}
          <motion.div variants={sectionVariants}>
            <button
              type="submit" disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
              style={{
                background:  'linear-gradient(135deg, var(--color-primary), var(--color-secondary, #6E8FA6))',
                boxShadow:   '0 4px 24px var(--color-primary)40',
              }}>
              {saving
                ? <><div className="w-4 h-4 border-2 rounded-full animate-spin border-white border-t-transparent" /> Menyimpan...</>
                : <><Save size={15} /> Simpan Profil</>}
            </button>
          </motion.div>

        </motion.form>
      </div>
    </div>
  )
}
