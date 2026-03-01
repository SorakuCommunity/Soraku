'use client'
// app/Admin/pengaturan/AdminPengaturanClient.tsx — SORAKU v1.0.a3.5
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Palette, Webhook, Music, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const THEME_KEYS = [
  { key: 'primary_color',    label: 'Primary Color',   hint: 'Tombol, link aktif, aksen utama' },
  { key: 'secondary_color',  label: 'Secondary Color', hint: 'Border, subheading' },
  { key: 'accent_color',     label: 'Accent Color',    hint: 'Badge, highlight kecil' },
  { key: 'dark_base_color',  label: 'Dark Base',       hint: 'Background dark mode' },
  { key: 'light_base_color', label: 'Light Base',      hint: 'Background light mode' },
]

const inp = 'w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 min-h-[44px]'
const inpS = { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }
const card = { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.10)' }

export function AdminPengaturanClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState(initialSettings)
  const [webhook,  setWebhook]  = useState(initialSettings['discord_webhook_url'] ?? '')
  const [spotify,  setSpotify]  = useState({
    client_id:     initialSettings['spotify_client_id']     ?? '',
    client_secret: initialSettings['spotify_client_secret'] ?? '',
    refresh_token: initialSettings['spotify_refresh_token'] ?? '',
  })
  const [saving, setSaving] = useState<string | null>(null)
  const supabase = createClient()

  const upsert = async (key: string, value: string) => {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value }, { onConflict: 'key' })
    if (error) throw error
  }

  const saveSetting = async (key: string, value: string) => {
    setSaving(key)
    try {
      await upsert(key, value)
      setSettings(p => ({ ...p, [key]: value }))
      toast.success('Tersimpan!')
    } catch (e: unknown) {
      toast.error((e as Error).message)
    }
    setSaving(null)
  }

  const saveWebhook = () => saveSetting('discord_webhook_url', webhook)

  const saveSpotify = async () => {
    setSaving('spotify')
    try {
      await Promise.all([
        upsert('spotify_client_id',     spotify.client_id),
        upsert('spotify_client_secret', spotify.client_secret),
        upsert('spotify_refresh_token', spotify.refresh_token),
      ])
      toast.success('Spotify tersimpan!')
    } catch (e: unknown) {
      toast.error((e as Error).message)
    }
    setSaving(null)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Pengaturan</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-sub)' }}>Tema, webhook, dan integrasi eksternal.</p>
      </div>

      {/* ── Theme Colors ───────────────────────────────────────── */}
      <section className="rounded-2xl border p-5" style={card}>
        <div className="flex items-center gap-2 mb-5">
          <Palette size={16} style={{ color: 'var(--color-primary)' }} />
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Tema Warna</h2>
        </div>

        <div className="space-y-3">
          {THEME_KEYS.map(({ key, label, hint }) => (
            <div key={key} className="flex items-center gap-3">
              {/* Color picker swatch */}
              <label className="relative w-10 h-10 rounded-xl overflow-hidden cursor-pointer shrink-0 border"
                style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                <input type="color"
                  value={settings[key] ?? '#4FA3D1'}
                  onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
                  className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                />
                <div className="w-full h-full rounded-xl" style={{ backgroundColor: settings[key] ?? '#4FA3D1' }} />
              </label>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>{label}</span>
                  <span className="text-xs opacity-60" style={{ color: 'var(--text-sub)' }}>— {hint}</span>
                </div>
                <input
                  value={settings[key] ?? ''}
                  onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
                  placeholder="#4FA3D1"
                  className="w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none"
                  style={{ ...inpS, minHeight: 'auto' }}
                />
              </div>

              <button onClick={() => saveSetting(key, settings[key] ?? '')} disabled={saving === key}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all hover:scale-105 disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-primary)20', color: 'var(--color-primary)' }}>
                {saving === key
                  ? <Loader2 size={13} className="animate-spin" />
                  : <Save size={13} />}
              </button>
            </div>
          ))}
        </div>

        {/* Live preview strip */}
        <div className="mt-4 flex gap-2">
          {THEME_KEYS.slice(0, 3).map(({ key, label }) => (
            <div key={key} title={label}
              className="flex-1 h-6 rounded-lg transition-colors duration-300"
              style={{ backgroundColor: settings[key] ?? '#4FA3D1' }} />
          ))}
        </div>
      </section>

      {/* ── Discord Webhook ────────────────────────────────────── */}
      <section className="rounded-2xl border p-5" style={card}>
        <div className="flex items-center gap-2 mb-4">
          <Webhook size={16} style={{ color: '#5865F2' }} />
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Discord Webhook</h2>
        </div>
        <div className="flex gap-2">
          <input value={webhook} onChange={e => setWebhook(e.target.value)}
            placeholder="https://discord.com/api/webhooks/..."
            className={inp + ' flex-1'} style={inpS} />
          <button onClick={saveWebhook} disabled={saving === 'discord_webhook_url'}
            className="flex items-center gap-1.5 px-4 rounded-xl text-sm font-semibold text-white min-h-[44px] disabled:opacity-50 hover:scale-105 transition-all shrink-0"
            style={{ backgroundColor: '#5865F2' }}>
            {saving === 'discord_webhook_url'
              ? <Loader2 size={14} className="animate-spin" />
              : <><Save size={14} /> Simpan</>}
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--text-sub)' }}>
          Webhook digunakan untuk notifikasi otomatis ke channel Discord.
        </p>
      </section>

      {/* ── Spotify ─────────────────────────────────────────────── */}
      <section className="rounded-2xl border p-5" style={card}>
        <div className="flex items-center gap-2 mb-4">
          <Music size={16} style={{ color: '#1DB954' }} />
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Spotify Integration</h2>
        </div>
        <div className="space-y-3">
          {[
            { field: 'client_id'     as const, label: 'Client ID',     pw: false },
            { field: 'client_secret' as const, label: 'Client Secret', pw: true },
            { field: 'refresh_token' as const, label: 'Refresh Token', pw: true },
          ].map(({ field, label, pw }) => (
            <div key={field}>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-sub)' }}>{label}</label>
              <input
                type={pw ? 'password' : 'text'}
                value={spotify[field]}
                onChange={e => setSpotify(p => ({ ...p, [field]: e.target.value }))}
                placeholder={label}
                className={inp} style={inpS}
              />
            </div>
          ))}
          <button onClick={saveSpotify} disabled={saving === 'spotify'}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 hover:scale-[1.01] transition-all"
            style={{ backgroundColor: '#1DB954' }}>
            {saving === 'spotify'
              ? <Loader2 size={14} className="animate-spin" />
              : <><Save size={14} /> Simpan Spotify</>}
          </button>
        </div>
      </section>
    </div>
  )
}
