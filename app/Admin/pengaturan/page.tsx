'use client'
// app/Admin/pengaturan/page.tsx — SORAKU v1.0.a3.4
// Settings: Theme color, Webhook URL, Spotify credentials
import { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Save, Palette, Webhook, Music, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useUser } from '@/hooks/useUser'
import { hasRole } from '@/lib/roles'
import type { Role } from '@/lib/roles'

const THEME_KEYS = [
  { key: 'primary_color',    label: 'Primary Color',    hint: 'Tombol, link aktif' },
  { key: 'secondary_color',  label: 'Secondary Color',  hint: 'Border, subheading' },
  { key: 'accent_color',     label: 'Accent Color',     hint: 'Badge, highlight' },
  { key: 'dark_base_color',  label: 'Dark Base',        hint: 'Background dark mode' },
  { key: 'light_base_color', label: 'Light Base',       hint: 'Background light mode' },
]

const inputClass = 'w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 min-h-[44px]'
const inputStyle = { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }

export default function AdminPengaturanPage() {
  const { user, role } = useUser()
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [webhook, setWebhook]   = useState('')
  const [spotify, setSpotify]   = useState({ client_id: '', client_secret: '', refresh_token: '' })
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('site_settings').select('key, value').then(({ data }) => {
      const map: Record<string, string> = {}
      for (const s of data ?? []) map[s.key] = s.value
      setSettings(map)
      setWebhook(map['discord_webhook_url'] ?? '')
      setSpotify({
        client_id:     map['spotify_client_id'] ?? '',
        client_secret: map['spotify_client_secret'] ?? '',
        refresh_token: map['spotify_refresh_token'] ?? '',
      })
      setLoading(false)
    })
  }, [])

  const saveSetting = async (key: string, value: string) => {
    setSaving(key)
    const { error } = await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' })
    if (error) toast.error(error.message)
    else { setSettings(p => ({ ...p, [key]: value })); toast.success('Tersimpan!') }
    setSaving(null)
  }

  const saveWebhook = () => saveSetting('discord_webhook_url', webhook)
  const saveSpotify = async () => {
    setSaving('spotify')
    await Promise.all([
      supabase.from('site_settings').upsert({ key: 'spotify_client_id',     value: spotify.client_id },     { onConflict: 'key' }),
      supabase.from('site_settings').upsert({ key: 'spotify_client_secret', value: spotify.client_secret }, { onConflict: 'key' }),
      supabase.from('site_settings').upsert({ key: 'spotify_refresh_token', value: spotify.refresh_token }, { onConflict: 'key' }),
    ])
    toast.success('Spotify tersimpan!')
    setSaving(null)
  }

  if (!role || !hasRole(role as Role, 'ADMIN')) {
    return <div className="p-8 text-center" style={{ color: 'var(--text-sub)' }}>Akses ditolak.</div>
  }

  const cardStyle = {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.10)',
  }

  return (
    <AdminShell userRole={role as Role} username={user?.email?.split('@')[0] ?? 'Admin'}>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Pengaturan</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-sub)' }}>Kelola tema, webhook, dan integrasi.</p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 py-10" style={{ color: 'var(--text-sub)' }}>
            <Loader2 size={16} className="animate-spin" /> Memuat pengaturan...
          </div>
        ) : (
          <>
            {/* Theme Colors */}
            <section className="rounded-2xl border p-5" style={cardStyle}>
              <div className="flex items-center gap-2 mb-5">
                <Palette size={16} style={{ color: 'var(--color-primary)' }} />
                <h2 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Tema Warna</h2>
              </div>
              <div className="space-y-3">
                {THEME_KEYS.map(({ key, label, hint }) => (
                  <div key={key} className="flex items-center gap-3">
                    {/* Color swatch */}
                    <div className="relative shrink-0">
                      <input type="color"
                        value={settings[key] ?? '#4FA3D1'}
                        onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
                        className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0.5"
                        style={{ backgroundColor: 'transparent' }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <label className="text-xs font-medium" style={{ color: 'var(--text)' }}>{label}</label>
                        <span className="text-xs" style={{ color: 'var(--text-sub)' }}>— {hint}</span>
                      </div>
                      <input value={settings[key] ?? ''} onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
                        placeholder="#4FA3D1" className="w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none focus:ring-1"
                        style={{ ...inputStyle, minHeight: 'auto' }} />
                    </div>
                    <button onClick={() => saveSetting(key, settings[key])} disabled={saving === key}
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all hover:scale-105 disabled:opacity-50"
                      style={{ backgroundColor: 'var(--color-primary)20', color: 'var(--color-primary)' }}>
                      {saving === key ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Discord Webhook */}
            <section className="rounded-2xl border p-5" style={cardStyle}>
              <div className="flex items-center gap-2 mb-4">
                <Webhook size={16} style={{ color: '#5865F2' }} />
                <h2 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Discord Webhook</h2>
              </div>
              <div className="flex gap-2">
                <input value={webhook} onChange={e => setWebhook(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className={inputClass + ' flex-1'} style={inputStyle} />
                <button onClick={saveWebhook} disabled={saving === 'discord_webhook_url'}
                  className="px-4 rounded-xl text-sm font-semibold text-white min-h-[44px] flex items-center gap-2 disabled:opacity-50 hover:scale-105 transition-all"
                  style={{ backgroundColor: '#5865F2' }}>
                  {saving === 'discord_webhook_url'
                    ? <Loader2 size={14} className="animate-spin" />
                    : <><Save size={14} /> Simpan</>}
                </button>
              </div>
            </section>

            {/* Spotify */}
            <section className="rounded-2xl border p-5" style={cardStyle}>
              <div className="flex items-center gap-2 mb-4">
                <Music size={16} style={{ color: '#1DB954' }} />
                <h2 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Spotify Integration</h2>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'client_id',     label: 'Client ID' },
                  { key: 'client_secret', label: 'Client Secret' },
                  { key: 'refresh_token', label: 'Refresh Token' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-sub)' }}>{label}</label>
                    <input
                      value={spotify[key as keyof typeof spotify]}
                      onChange={e => setSpotify(p => ({ ...p, [key]: e.target.value }))}
                      type={key.includes('secret') || key.includes('token') ? 'password' : 'text'}
                      placeholder={label}
                      className={inputClass} style={inputStyle}
                    />
                  </div>
                ))}
                <button onClick={saveSpotify} disabled={saving === 'spotify'}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 hover:scale-[1.01] transition-all"
                  style={{ backgroundColor: '#1DB954' }}>
                  {saving === 'spotify' ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Simpan Spotify</>}
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </AdminShell>
  )
}
