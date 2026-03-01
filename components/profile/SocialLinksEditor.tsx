'use client'
// components/profile/SocialLinksEditor.tsx — SORAKU v1.0.a3.5
// Role-based platform gating + horizontal icon layout with lock icons
//
// Platform tiers:
//   USER    (rank 1): Instagram, Twitter/X                                → 2 platforms
//   DONATE  (rank 2): + TikTok, YouTube, Discord, Website, Facebook, Twitch → 8 platforms
//   PREMIUM (rank 3): + Trakteer, Ko-fi                                   → 10 platforms

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Save, Check, Globe } from 'lucide-react'
import { toast } from 'sonner'
import type { UserRole } from '@/types'

// ── Platform registry ────────────────────────────────────────────────────────
const PLATFORMS = [
  {
    key: 'instagram', label: 'Instagram',
    placeholder: 'https://instagram.com/username',
    minRole: 'USER' as UserRole, color: '#E1306C',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
  },
  {
    key: 'twitter', label: 'Twitter / X',
    placeholder: 'https://x.com/username',
    minRole: 'USER' as UserRole, color: '#1DA1F2',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.735-8.845L1.5 2.25h6.774l4.264 5.638L18.244 2.25zM17.1 20.19h1.833L6.985 4.129H5.016L17.1 20.19z"/></svg>,
  },
  {
    key: 'tiktok', label: 'TikTok',
    placeholder: 'https://tiktok.com/@username',
    minRole: 'DONATE' as UserRole, color: '#FF0050',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z"/></svg>,
  },
  {
    key: 'youtube', label: 'YouTube',
    placeholder: 'https://youtube.com/@channel',
    minRole: 'DONATE' as UserRole, color: '#FF0000',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  },
  {
    key: 'discord', label: 'Discord',
    placeholder: 'https://discord.gg/invite',
    minRole: 'DONATE' as UserRole, color: '#5865F2',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.101 18.08.113 18.1.132 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>,
  },
  {
    key: 'website', label: 'Website',
    placeholder: 'https://yoursite.com',
    minRole: 'DONATE' as UserRole, color: '#4FA3D1',
    icon: <Globe className="w-5 h-5" />,
  },
  {
    key: 'facebook', label: 'Facebook',
    placeholder: 'https://facebook.com/username',
    minRole: 'DONATE' as UserRole, color: '#1877F2',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  },
  {
    key: 'twitch', label: 'Twitch',
    placeholder: 'https://twitch.tv/username',
    minRole: 'DONATE' as UserRole, color: '#9146FF',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>,
  },
  {
    key: 'trakteer', label: 'Trakteer',
    placeholder: 'https://trakteer.id/username',
    minRole: 'PREMIUM' as UserRole, color: '#FF5733',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 7.5h-3V17h-3v-7.5H7.5V7h9v2.5z"/></svg>,
  },
  {
    key: 'kofi', label: 'Ko-fi',
    placeholder: 'https://ko-fi.com/username',
    minRole: 'PREMIUM' as UserRole, color: '#29ABE0',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/></svg>,
  },
]

const ROLE_RANK: Record<UserRole, number> = {
  USER: 1, DONATE: 2, PREMIUM: 3, AGENSI: 4, ADMIN: 5, MANAGER: 6, OWNER: 7,
}
function canAccess(userRole: UserRole, minRole: UserRole) {
  return ROLE_RANK[userRole] >= ROLE_RANK[minRole]
}
function upgradeLabel(minRole: UserRole) {
  if (minRole === 'DONATE')  return 'Upgrade ke Donatur'
  if (minRole === 'PREMIUM') return 'Upgrade ke Premium'
  return 'Terbatas'
}

interface Props { userId: string; role: UserRole; initialLinks: Record<string, string> }

export function SocialLinksEditor({ role, initialLinks }: Props) {
  const [links,    setLinks]   = useState<Record<string, string>>(initialLinks)
  const [selected, setSelected]= useState<string | null>(null)
  const [saving,   setSaving]  = useState<string | null>(null)
  const [saved,    setSaved]   = useState<string | null>(null)

  const selPlatform = PLATFORMS.find(p => p.key === selected)

  const doSave = async (key: string, url: string) => {
    setSaving(key)
    try {
      const res = await fetch('/api/profile/socials', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ platform: key, url: url.trim() }),
      })
      if (res.ok) {
        setSaved(key); setTimeout(() => setSaved(null), 2200)
        toast.custom(() => (
          <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl"
            style={{ background: 'rgba(34,197,94,0.12)', borderColor: 'rgba(34,197,94,0.35)', backdropFilter: 'blur(16px)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.25)' }}>
              <Check size={13} style={{ color: '#22c55e' }} />
            </div>
            <span className="text-sm font-medium text-white">{PLATFORMS.find(p => p.key === key)?.label} tersimpan!</span>
          </motion.div>
        ))
      } else {
        const d = await res.json()
        toast.error(d.error ?? 'Gagal menyimpan')
      }
    } catch { toast.error('Network error') }
    setSaving(null)
  }

  return (
    <div className="rounded-2xl border p-5 space-y-4 backdrop-blur-xl"
      style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.10)' }}>

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Social Links</p>
        <span className="text-xs px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'var(--text-sub)' }}>
          {Object.values(links).filter(Boolean).length} terhubung
        </span>
      </div>

      {/* Horizontal icon row */}
      <div className="flex flex-wrap gap-2.5">
        {PLATFORMS.map(p => {
          const accessible = canAccess(role, p.minRole)
          const hasLink    = !!links[p.key]
          const isSelected = selected === p.key
          const isSaved    = saved === p.key

          return (
            <div key={p.key} className="relative group/icon">
              <motion.button
                whileHover={accessible ? { scale: 1.12, y: -2 } : {}}
                whileTap={accessible   ? { scale: 0.92 } : {}}
                onClick={() => accessible && setSelected(isSelected ? null : p.key)}
                disabled={!accessible}
                className="relative w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-200"
                style={{
                  backgroundColor: isSelected ? p.color + '28' : hasLink ? p.color + '18' : 'rgba(255,255,255,0.04)',
                  borderColor:     isSelected ? p.color + '90' : hasLink ? p.color + '50' : 'rgba(255,255,255,0.09)',
                  color:           accessible ? p.color : 'rgba(255,255,255,0.25)',
                  cursor:          accessible ? 'pointer' : 'not-allowed',
                  boxShadow:       isSelected ? `0 0 18px ${p.color}50` : 'none',
                  opacity:         accessible ? 1 : 0.4,
                }}>
                {p.icon}
                {/* Saved badge */}
                {isSaved && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#22c55e' }}>
                    <Check size={9} color="#fff" />
                  </motion.span>
                )}
                {/* Has-link dot */}
                {hasLink && !isSaved && !isSelected && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2"
                    style={{ backgroundColor: p.color, borderColor: 'var(--bg)' }} />
                )}
                {/* Lock */}
                {!accessible && (
                  <span className="absolute inset-0 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <Lock size={11} style={{ color: 'rgba(255,255,255,0.5)' }} />
                  </span>
                )}
              </motion.button>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover/icon:opacity-100 transition-opacity z-50 whitespace-nowrap">
                <span className="text-xs px-2 py-1 rounded-lg"
                  style={{ backgroundColor: 'rgba(0,0,0,0.85)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}>
                  {accessible ? p.label : upgradeLabel(p.minRole)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Expanded editor for selected platform */}
      <AnimatePresence>
        {selected && selPlatform && canAccess(role, selPlatform.minRole) && (
          <motion.div key={selected}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
            <div className="overflow-hidden pt-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center" style={{ color: selPlatform.color }}>
                  {selPlatform.icon}
                </div>
                <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{selPlatform.label}</span>
                {links[selected] && (
                  <button onClick={() => { setLinks(p => ({ ...p, [selected]: '' })); doSave(selected, '') }}
                    className="ml-auto text-xs px-2 py-0.5 rounded-lg transition-all hover:bg-red-500/10"
                    style={{ color: '#ef4444' }}>Hapus</button>
                )}
              </div>
              <div className="flex gap-2">
                <input type="url"
                  value={links[selected] ?? ''}
                  onChange={e => setLinks(p => ({ ...p, [selected]: e.target.value }))}
                  placeholder={selPlatform.placeholder}
                  onKeyDown={e => { if (e.key === 'Enter') doSave(selected, links[selected] ?? '') }}
                  className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 min-h-[40px]"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }}
                />
                <button onClick={() => doSave(selected, links[selected] ?? '')} disabled={saving === selected}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-1.5 min-h-[40px]"
                  style={{ backgroundColor: selPlatform.color }}>
                  {saving === selected
                    ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Save size={13} />}
                  Simpan
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade hint */}
      {(role === 'USER' || role === 'DONATE') && (
        <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
          {role === 'USER'
            ? '🔒 Upgrade ke Donatur (8 platform) atau Premium (10 platform + Trakteer & Ko-fi)'
            : '✨ Upgrade ke Premium untuk unlock Trakteer & Ko-fi'}
        </p>
      )}
    </div>
  )
}
