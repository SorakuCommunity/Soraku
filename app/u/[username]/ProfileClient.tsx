// app/u/[username]/ProfileClient.tsx — SORAKU v1.0.a3.5
// Profile: Cover edit (PREMIUM+), Social links editor (role-based)
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Edit2, Check, X, Calendar, Camera,
  Twitter, Youtube, Instagram, Globe,
  Twitch, Facebook, Music, Coffee, HandCoins,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { toast } from 'sonner'
import { hasRole, type Role } from '@/lib/roles'

interface Profile {
  id: string
  username: string
  bio: string | null
  avatar_url: string | null
  cover_url: string | null
  role: string | null
  created_at: string
  socials: Record<string, string> | null
}

// ── Social platform definitions ───────────────────────────────────────────────
interface Platform {
  key: string
  label: string
  icon: React.ReactNode
  placeholder: string
  minRole: Role
}

const PLATFORMS: Platform[] = [
  { key: 'instagram', label: 'Instagram',  icon: <Instagram size={15} />,  placeholder: 'https://instagram.com/username', minRole: 'USER'    },
  { key: 'twitter',   label: 'Twitter/X',  icon: <Twitter size={15} />,    placeholder: 'https://x.com/username',          minRole: 'USER'    },
  { key: 'youtube',   label: 'YouTube',    icon: <Youtube size={15} />,    placeholder: 'https://youtube.com/@channel',    minRole: 'DONATE'  },
  { key: 'tiktok',    label: 'TikTok',     icon: <Music size={15} />,      placeholder: 'https://tiktok.com/@username',    minRole: 'DONATE'  },
  { key: 'twitch',    label: 'Twitch',     icon: <Twitch size={15} />,     placeholder: 'https://twitch.tv/username',      minRole: 'DONATE'  },
  { key: 'facebook',  label: 'Facebook',   icon: <Facebook size={15} />,   placeholder: 'https://facebook.com/username',   minRole: 'DONATE'  },
  { key: 'website',   label: 'Website',    icon: <Globe size={15} />,      placeholder: 'https://yourwebsite.com',         minRole: 'DONATE'  },
  { key: 'discord',   label: 'Discord',    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028z"/></svg>, placeholder: 'https://discord.gg/invite', minRole: 'DONATE' },
  { key: 'trakteer',  label: 'Trakteer',   icon: <Coffee size={15} />,     placeholder: 'https://trakteer.id/username',    minRole: 'PREMIUM' },
  { key: 'kofi',      label: 'Ko-fi',      icon: <HandCoins size={15} />,  placeholder: 'https://ko-fi.com/username',      minRole: 'PREMIUM' },
]

const ROLE_LABELS_ID: Record<string, string> = {
  USER: 'Member', DONATE: 'Donatur', PREMIUM: 'Premium',
  AGENSI: 'Agensi', ADMIN: 'Admin', MANAGER: 'Manager', OWNER: 'Owner',
}

const ROLE_BADGE_STYLE: Record<string, { bg: string; text: string }> = {
  OWNER:   { bg: '#C9A84C22', text: '#C9A84C' },
  MANAGER: { bg: '#9B59B622', text: '#9B59B6' },
  ADMIN:   { bg: '#E74C3C22', text: '#E74C3C' },
  AGENSI:  { bg: '#1ABC9C22', text: '#1ABC9C' },
  PREMIUM: { bg: '#F39C1222', text: '#F39C12' },
  DONATE:  { bg: '#3498DB22', text: '#3498DB' },
  USER:    { bg: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.45)' },
}

// ── SaveToast ─────────────────────────────────────────────────────────────────
function SaveToast({ message, show }: { message: string; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-2xl font-medium text-sm"
          style={{ backgroundColor: '#22c55e', color: '#fff' }}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
        >
          <Check size={16} /> {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export function ProfileClient({ profile, isOwner }: { profile: Profile; isOwner: boolean }) {
  const [bio,          setBio]          = useState(profile.bio ?? '')
  const [coverUrl,     setCoverUrl]     = useState(profile.cover_url ?? '')
  const [editingBio,   setEditingBio]   = useState(false)
  const [editingSocials, setEditingSocials] = useState(false)
  const [editingCover,   setEditingCover]   = useState(false)
  const [socials,      setSocials]      = useState<Record<string, string>>(profile.socials ?? {})
  const [localSocials, setLocalSocials] = useState<Record<string, string>>(profile.socials ?? {})
  const [saving,       setSaving]       = useState(false)
  const [toast1,       setToast1]       = useState(false)
  const supabase = createClient()

  const role    = (profile.role ?? 'USER') as Role
  const isPremium = hasRole(role, 'PREMIUM')
  const isManaged = hasRole(role, 'AGENSI')

  const showToast = (msg: string) => {
    toast.success(msg)
    setToast1(true)
    setTimeout(() => setToast1(false), 2800)
  }

  const saveBio = async () => {
    setSaving(true)
    const { error } = await supabase.from('users').update({ bio }).eq('id', profile.id)
    setSaving(false)
    if (error) { toast.error('Gagal simpan bio'); return }
    showToast('Bio berhasil diperbarui!')
    setEditingBio(false)
  }

  const saveCover = async () => {
    setSaving(true)
    const { error } = await supabase.from('users').update({ cover_url: coverUrl || null }).eq('id', profile.id)
    setSaving(false)
    if (error) { toast.error('Gagal simpan cover'); return }
    showToast('Cover berhasil diperbarui!')
    setEditingCover(false)
  }

  const saveSocials = async () => {
    // Clean empty values
    const cleaned = Object.fromEntries(
      Object.entries(localSocials).filter(([, v]) => v.trim())
    )
    setSaving(true)
    const { error } = await supabase.from('users').update({ socials: cleaned }).eq('id', profile.id)
    setSaving(false)
    if (error) { toast.error('Gagal simpan social links'); return }
    setSocials(cleaned)
    showToast('Social links disimpan!')
    setEditingSocials(false)
  }

  const maxSocials = isPremium ? 10 : hasRole(role, 'DONATE') ? 8 : 2
  const filledCount = Object.values(localSocials).filter(v => v.trim()).length

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <SaveToast message="Berhasil disimpan!" show={toast1} />

      {/* ── Cover ─────────────────────────────────────────────── */}
      <div className="relative h-48 sm:h-64 overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
        {coverUrl ? (
          <img src={coverUrl} alt="cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-dark-base) 100%)',
            opacity: 0.45,
          }} />
        )}

        {/* Cover edit — PREMIUM only */}
        {isOwner && isPremium && (
          <button
            onClick={() => setEditingCover(true)}
            className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-90 min-h-[36px]"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', backdropFilter: 'blur(6px)' }}
          >
            <Camera size={13} /> Edit Cover
          </button>
        )}
        {isOwner && !isPremium && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(6px)' }}>
            🔒 Premium untuk edit cover
          </div>
        )}
      </div>

      {/* Cover URL Edit Modal */}
      <AnimatePresence>
        {editingCover && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setEditingCover(false)}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl border p-5 space-y-4"
              style={{ background: 'rgba(28,30,34,0.97)', borderColor: 'rgba(255,255,255,0.1)' }}
              initial={{ scale: 0.93, y: 12 }} animate={{ scale: 1, y: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-bold" style={{ color: 'var(--text)' }}>Edit Cover Photo</h3>
              <input
                value={coverUrl}
                onChange={e => setCoverUrl(e.target.value)}
                placeholder="https://... URL gambar cover"
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-1 min-h-[44px]"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text)' }}
              />
              {coverUrl && (
                <img src={coverUrl} alt="preview" className="w-full h-28 object-cover rounded-xl" onError={() => {}} />
              )}
              <div className="flex gap-3">
                <button onClick={() => setEditingCover(false)}
                  className="flex-1 py-2.5 rounded-xl border text-sm min-h-[44px] hover:bg-white/5"
                  style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text-sub)' }}>
                  Batal
                </button>
                <button onClick={saveCover} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold min-h-[44px] disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Profile Info ───────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="relative -mt-16 mb-4 flex items-end justify-between">
          {/* Avatar */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 overflow-hidden flex-shrink-0"
            style={{ borderColor: 'var(--bg-card)', backgroundColor: 'var(--bg-muted)' }}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold"
                style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
                {profile.username[0].toUpperCase()}
              </div>
            )}
          </div>

          {isOwner && !editingBio && (
            <button onClick={() => setEditingBio(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium min-h-[44px] transition-all hover:bg-[var(--hover-bg)]"
              style={{ borderColor: 'var(--border)', color: 'var(--text-sub)' }}>
              <Edit2 size={14} /> Edit Profil
            </button>
          )}
          {editingBio && (
            <div className="flex gap-2">
              <button onClick={saveBio} disabled={saving}
                className="p-2.5 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
                <Check size={16} />
              </button>
              <button onClick={() => setEditingBio(false)}
                className="p-2.5 rounded-xl border min-h-[44px] min-w-[44px] flex items-center justify-center"
                style={{ borderColor: 'var(--border)', color: 'var(--text-sub)' }}>
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Name + role */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>
              {profile.username}
            </h1>
            {profile.role && (
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{
                  backgroundColor: ROLE_BADGE_STYLE[profile.role ?? 'USER']?.bg ?? ROLE_BADGE_STYLE.USER.bg,
                  color:           ROLE_BADGE_STYLE[profile.role ?? 'USER']?.text ?? ROLE_BADGE_STYLE.USER.text,
                }}>
                {ROLE_LABELS_ID[profile.role] ?? profile.role}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-sub)' }}>
            <Calendar size={12} />
            Bergabung {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true, locale: idLocale })}
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          {editingBio ? (
            <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={300}
              placeholder="Tulis bio singkat kamu..." className="w-full p-3 rounded-xl border text-sm resize-none outline-none focus:ring-2" rows={3}
              style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text)' }} />
          ) : (
            bio
              ? <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>{bio}</p>
              : isOwner && <p className="text-sm italic" style={{ color: 'var(--text-sub)', opacity: 0.5 }}>Belum ada bio.</p>
          )}
        </div>

        {/* ── Social Links ───────────────────────────────────────── */}
        <div className="mb-10">
          {/* View-only social icons */}
          {!editingSocials && Object.keys(socials).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(socials).map(([platform, url]) => {
                const p = PLATFORMS.find(x => x.key === platform)
                return (
                  <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:bg-[var(--hover-bg)] min-h-[36px]"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-sub)' }}>
                    {p?.icon ?? <Globe size={12} />}
                    {p?.label ?? platform}
                  </a>
                )
              })}
            </div>
          )}

          {/* Edit Social Links — owners only */}
          {isOwner && !editingSocials && (
            <button onClick={() => { setLocalSocials({ ...socials }); setEditingSocials(true) }}
              className="flex items-center gap-2 text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-primary)' }}>
              <Edit2 size={12} />
              {Object.keys(socials).length > 0 ? 'Edit social links' : 'Tambah social links'}
            </button>
          )}

          {/* Social Editor Panel */}
          <AnimatePresence>
            {editingSocials && (
              <motion.div
                className="rounded-2xl border p-5 space-y-4"
                style={{
                  background:     'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)',
                  borderColor:    'rgba(255,255,255,0.08)',
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Social Links</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-sub)' }}>
                      Role {ROLE_LABELS_ID[role] ?? role} — maks {maxSocials} link
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingSocials(false)}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors min-h-[36px] min-w-[36px]"
                      style={{ color: 'var(--text-sub)' }}>
                      <X size={15} />
                    </button>
                  </div>
                </div>

                {/* Platform rows */}
                <div className="space-y-2.5">
                  {PLATFORMS.map((platform) => {
                    const accessible = hasRole(role, platform.minRole)
                    const val = localSocials[platform.key] ?? ''
                    return (
                      <div key={platform.key}
                        className="flex items-center gap-3"
                        title={!accessible ? `Butuh role ${ROLE_LABELS_ID[platform.minRole]}` : undefined}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-opacity"
                          style={{
                            backgroundColor: accessible ? 'rgba(79,163,209,0.12)' : 'rgba(255,255,255,0.03)',
                            color: accessible ? 'var(--color-primary)' : 'var(--text-sub)',
                            opacity: accessible ? 1 : 0.35,
                          }}>
                          {platform.icon}
                        </div>
                        <input
                          disabled={!accessible}
                          value={val}
                          onChange={e => {
                            const next = { ...localSocials, [platform.key]: e.target.value }
                            setLocalSocials(next)
                          }}
                          placeholder={accessible ? platform.placeholder : `🔒 ${ROLE_LABELS_ID[platform.minRole]}+`}
                          className="flex-1 px-3 py-2 rounded-xl border text-xs outline-none focus:ring-1 min-h-[38px] transition-opacity"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            borderColor:     accessible ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                            color:           'var(--text)',
                            opacity:         accessible ? 1 : 0.35,
                            cursor:          accessible ? 'text' : 'not-allowed',
                          }}
                        />
                      </div>
                    )
                  })}
                </div>

                {/* Limit warning */}
                {filledCount > maxSocials && (
                  <p className="text-xs px-1" style={{ color: '#fbbf24' }}>
                    ⚠ Kamu melewati batas {maxSocials} link. Upgrade role untuk lebih banyak.
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <button onClick={() => setEditingSocials(false)}
                    className="flex-1 py-2.5 rounded-xl border text-sm min-h-[44px] hover:bg-white/5"
                    style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text-sub)' }}>
                    Batal
                  </button>
                  <button onClick={saveSocials} disabled={saving || filledCount > maxSocials}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold min-h-[44px] disabled:opacity-50 transition-all hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
                    {saving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
