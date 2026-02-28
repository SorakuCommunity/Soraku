// components/profile/SocialLinksEditor.tsx — SORAKU v1.0.a3.4
// Editable social links card with role-based limits (USER=2, PREMIUM=unlimited)
// Toast animation on save, glass card style
'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertCircle, Save, Globe, Youtube, Twitter } from 'lucide-react'
import type { UserRole } from '@/types'

interface SocialLink {
  platform: string
  url: string
}

interface Props {
  userId: string
  role: UserRole
  initialLinks: Record<string, string>
}

const PLATFORMS = [
  {
    key: 'discord',
    label: 'Discord',
    placeholder: 'https://discord.gg/invite',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" style={{ color: '#5865F2' }}>
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.101 18.08.113 18.1.132 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
      </svg>
    ),
  },
  {
    key: 'instagram',
    label: 'Instagram',
    placeholder: 'https://instagram.com/username',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" style={{ color: '#E1306C' }}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    placeholder: 'https://tiktok.com/@username',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z" />
      </svg>
    ),
  },
  {
    key: 'twitter',
    label: 'Twitter / X',
    placeholder: 'https://x.com/username',
    icon: <Twitter size={16} style={{ color: '#1DA1F2' }} />,
  },
  {
    key: 'youtube',
    label: 'YouTube',
    placeholder: 'https://youtube.com/@channel',
    icon: <Youtube size={16} style={{ color: '#FF0000' }} />,
  },
  {
    key: 'website',
    label: 'Website',
    placeholder: 'https://yoursite.com',
    icon: <Globe size={16} style={{ color: 'var(--color-primary)' }} />,
  },
]

const USER_LIMIT = 2
const PREMIUM_ROLES: UserRole[] = ['PREMIUM', 'DONATE', 'AGENSI', 'MANAGER', 'ADMIN', 'OWNER']

function getMaxLinks(role: UserRole): number {
  return PREMIUM_ROLES.includes(role) ? Infinity : USER_LIMIT
}

export function SocialLinksEditor({ userId, role, initialLinks }: Props) {
  const [links, setLinks] = useState<Record<string, string>>(initialLinks)
  const [toast, setToast] = useState<{ platform: string } | null>(null)
  const [savingPlatform, setSavingPlatform] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const maxLinks = getMaxLinks(role)
  const filledCount = Object.values(links).filter(v => v.trim()).length
  const isAtLimit = filledCount >= maxLinks

  function showToast(platform: string) {
    setToast({ platform })
    setTimeout(() => setToast(null), 2500)
  }

  async function handleSave(platform: string) {
    setSavingPlatform(platform)
    try {
      const res = await fetch('/api/profile/socials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, url: links[platform] ?? '' }),
      })
      if (res.ok) showToast(platform)
    } catch {}
    setSavingPlatform(null)
  }

  return (
    <div className="relative">
      {/* Glass save toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white backdrop-blur-xl shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary)cc, #4ade8066)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px var(--color-primary)40',
            }}
          >
            <Check size={14} />
            {toast.platform} tersimpan!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card */}
      <div
        className="rounded-2xl border p-5 backdrop-blur-xl"
        style={{
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderColor: 'rgba(255,255,255,0.10)',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Globe size={15} style={{ color: 'var(--color-primary)' }} />
            Social Links
          </h3>
          {maxLinks < Infinity && (
            <span className="text-xs px-2 py-0.5 rounded-full border"
              style={{
                color: 'var(--text-sub)',
                borderColor: 'rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(255,255,255,0.04)',
              }}>
              {filledCount}/{maxLinks} tersisi
            </span>
          )}
        </div>

        <div className="space-y-3">
          {PLATFORMS.map(p => {
            const value = links[p.key] ?? ''
            const isFilled = value.trim().length > 0
            const isDisabled = !isFilled && isAtLimit
            const isSaving = savingPlatform === p.key

            return (
              <div key={p.key} className="flex items-center gap-3">
                {/* Icon */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderColor: 'rgba(255,255,255,0.10)',
                    opacity: isDisabled ? 0.4 : 1,
                  }}>
                  {p.icon}
                </div>

                {/* Input */}
                <input
                  type="url"
                  value={value}
                  onChange={e => setLinks(prev => ({ ...prev, [p.key]: e.target.value }))}
                  placeholder={p.placeholder}
                  disabled={isDisabled}
                  className="flex-1 px-3 py-2 rounded-xl text-sm border outline-none transition-all duration-200 focus:ring-2"
                  style={{
                    backgroundColor: isDisabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                    borderColor: 'rgba(255,255,255,0.10)',
                    color: isDisabled ? 'var(--text-sub)' : 'var(--text)',
                    cursor: isDisabled ? 'not-allowed' : 'text',
                  } as React.CSSProperties}
                />

                {/* Save button */}
                <button
                  onClick={() => handleSave(p.key)}
                  disabled={isDisabled || isSaving || !value.trim()}
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
                  style={{
                    backgroundColor: isSaving ? 'var(--color-primary)30' : 'var(--color-primary)20',
                    color: 'var(--color-primary)',
                  }}
                >
                  {isSaving ? (
                    <div className="w-3.5 h-3.5 border-2 rounded-full animate-spin"
                      style={{ borderColor: 'var(--color-primary) transparent transparent transparent' }} />
                  ) : (
                    <Save size={13} />
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* Limit warning */}
        {isAtLimit && maxLinks < Infinity && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 flex items-start gap-2 p-3 rounded-xl text-xs"
            style={{
              backgroundColor: 'rgba(251,191,36,0.08)',
              borderLeft: '3px solid #fbbf24',
              color: 'var(--text-sub)',
            }}
          >
            <AlertCircle size={13} className="text-yellow-400 mt-0.5 shrink-0" />
            <div>
              <strong style={{ color: '#fbbf24' }}>Batas tercapai.</strong> Akun USER dapat mengisi maksimal {USER_LIMIT} social link.{' '}
              <span>Upgrade ke PREMIUM untuk unlimited.</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
