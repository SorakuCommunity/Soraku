'use client'
import { useState, useEffect } from 'react'
import { Users, BookOpen, Image, Settings, Shield, Palette } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { adminThemeSchema } from '@/lib/validations'
import type { z } from 'zod'

type AdminTheme = z.infer<typeof adminThemeSchema>

const TABS = [
  { id: 'users',   label: 'Users',    icon: <Users size={16} /> },
  { id: 'blog',    label: 'Blog',     icon: <BookOpen size={16} /> },
  { id: 'gallery', label: 'Gallery',  icon: <Image size={16} /> },
  { id: 'vtuber',  label: 'VTuber',   icon: <Shield size={16} /> },
  { id: 'theme',   label: 'Tema',     icon: <Palette size={16} /> },
]

const ROLES = ['USER', 'DONATE', 'PREMIUM', 'AGENSI', 'ADMIN', 'MANAGER', 'OWNER'] as const

// ─── Users Tab ────────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers]     = useState<{id:string;username:string;email:string;role:string}[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = createClient()
    sb.from('users').select('id, username, email, role').order('created_at', { ascending: false })
      .then(({ data }) => { setUsers(data ?? []); setLoading(false) })
  }, [])

  const updateRole = async (id: string, role: string) => {
    const sb = createClient()
    const { error } = await sb.from('users').update({ role }).eq('id', id)
    if (error) { toast.error('Gagal update role'); return }
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
    toast.success('Role diperbarui')
  }

  if (loading) return <div className="text-center py-12" style={{ color: 'var(--text-sub)' }}>Memuat...</div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
            {['Username', 'Email', 'Role', 'Aksi'].map(h => (
              <th key={h} className="text-left py-3 px-4 font-semibold text-xs" style={{ color: 'var(--text-sub)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b transition-colors hover:bg-[var(--hover-bg)]" style={{ borderColor: 'var(--border)' }}>
              <td className="py-3 px-4" style={{ color: 'var(--text)' }}>{u.username}</td>
              <td className="py-3 px-4" style={{ color: 'var(--text-sub)' }}>{u.email}</td>
              <td className="py-3 px-4">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--badge-text)' }}>{u.role}</span>
              </td>
              <td className="py-3 px-4">
                <select value={u.role} onChange={e => updateRole(u.id, e.target.value)}
                  className="text-xs px-2 py-1.5 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Theme Tab ────────────────────────────────────────────────────────────────
function ThemeTab() {
  const [palette, setPalette] = useState({
    primary_color:    '#4FA3D1',
    dark_base_color:  '#1C1E22',
    secondary_color:  '#6E8FA6',
    light_base_color: '#D9DDE3',
    accent_color:     '#E8C2A8',
    theme_mode:       'dark',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/theme').then(r => r.json()).then(d => {
      if (d.palette) setPalette(p => ({ ...p, ...d.palette }))
    }).catch(() => {})
  }, [])

  const save = async () => {
    const parsed = adminThemeSchema.safeParse(palette)
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return }

    setSaving(true)
    const res = await fetch('/api/admin/theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(palette),
    })
    setSaving(false)
    if (!res.ok) { toast.error('Gagal menyimpan tema'); return }
    toast.success('Tema disimpan!')
    // Apply CSS variables immediately
    const root = document.documentElement
    root.style.setProperty('--color-primary', palette.primary_color)
    root.style.setProperty('--color-dark-base', palette.dark_base_color)
    root.style.setProperty('--color-secondary', palette.secondary_color)
    root.style.setProperty('--color-light-base', palette.light_base_color)
    root.style.setProperty('--color-accent', palette.accent_color)
  }

  const colorFields = [
    { key: 'primary_color',    label: 'Primary',    hint: 'Tombol, link aktif, hover' },
    { key: 'dark_base_color',  label: 'Dark Base',  hint: 'Background mode gelap' },
    { key: 'secondary_color',  label: 'Secondary',  hint: 'Border kartu, subheading' },
    { key: 'light_base_color', label: 'Light Base', hint: 'Background mode terang' },
    { key: 'accent_color',     label: 'Accent',     hint: 'Badge khusus, highlight' },
  ] as const

  return (
    <div className="max-w-lg">
      <h3 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Palet Warna Situs</h3>
      <div className="space-y-4 mb-6">
        {colorFields.map(({ key, label, hint }) => (
          <div key={key} className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-0.5" style={{ color: 'var(--text)' }}>{label}</label>
              <p className="text-xs" style={{ color: 'var(--text-sub)' }}>{hint}</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="color" value={palette[key as keyof typeof palette]}
                onChange={e => setPalette(p => ({ ...p, [key]: e.target.value }))}
                className="w-10 h-10 rounded-lg cursor-pointer border"
                style={{ borderColor: 'var(--border)' }} />
              <input type="text" value={palette[key as keyof typeof palette]}
                onChange={e => setPalette(p => ({ ...p, [key]: e.target.value }))}
                className="w-24 px-2 py-1.5 rounded-lg border text-xs outline-none"
                style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text)' }}
                maxLength={7} placeholder="#4FA3D1" />
            </div>
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Mode Default</label>
          <div className="flex gap-2">
            {(['dark', 'light', 'auto'] as const).map(m => (
              <button key={m} onClick={() => setPalette(p => ({ ...p, theme_mode: m }))}
                className="px-4 py-2 rounded-lg text-sm font-medium border transition-all capitalize"
                style={{
                  backgroundColor: palette.theme_mode === m ? 'var(--color-primary)' : 'transparent',
                  color: palette.theme_mode === m ? '#fff' : 'var(--text-sub)',
                  borderColor: palette.theme_mode === m ? 'var(--color-primary)' : 'var(--border)',
                }}>{m === 'dark' ? 'Gelap' : m === 'light' ? 'Terang' : 'Otomatis'}</button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={save} disabled={saving}
        className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60 min-h-[44px]"
        style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        {saving ? 'Menyimpan...' : 'Simpan Tema'}
      </button>
    </div>
  )
}

// ─── Simple list tabs (Blog, Gallery, VTuber) ─────────────────────────────────
function ContentTab({ table, cols }: { table: string; cols: string[] }) {
  const [rows, setRows]       = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = createClient()
    sb.from(table).select(cols.join(', ')).order('created_at', { ascending: false }).limit(50)
      .then(({ data }) => { setRows(data ?? []); setLoading(false) })
  }, [table])

  if (loading) return <div className="text-center py-12" style={{ color: 'var(--text-sub)' }}>Memuat...</div>
  if (!rows.length) return <div className="text-center py-12" style={{ color: 'var(--text-sub)' }}>Tidak ada data.</div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
            {cols.map(c => (
              <th key={c} className="text-left py-3 px-4 font-semibold text-xs capitalize" style={{ color: 'var(--text-sub)' }}>
                {c.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b hover:bg-[var(--hover-bg)] transition-colors" style={{ borderColor: 'var(--border)' }}>
              {cols.map(c => (
                <td key={c} className="py-3 px-4 text-xs max-w-[200px] truncate" style={{ color: 'var(--text)' }}>
                  {String(row[c] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main AdminClient ─────────────────────────────────────────────────────────
export function AdminClient({ userRole }: { userRole: string }) {
  const [tab, setTab] = useState('users')

  const tabContent: Record<string, React.ReactNode> = {
    users:   <UsersTab />,
    blog:    <ContentTab table="blog_posts" cols={['id', 'title', 'slug', 'published', 'created_at']} />,
    gallery: <ContentTab table="gallery"    cols={['id', 'title', 'approved', 'created_at']} />,
    vtuber:  <ContentTab table="vtubers"    cols={['id', 'name', 'slug', 'agency', 'active']} />,
    theme:   <ThemeTab />,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <Shield size={24} style={{ color: 'var(--color-primary)' }} />
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Admin Panel</h1>
          <p className="text-xs" style={{ color: 'var(--text-sub)' }}>Role: {userRole}</p>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all min-h-[44px]"
            style={{
              backgroundColor: tab === t.id ? 'var(--color-primary)' : 'var(--bg-card)',
              color: tab === t.id ? '#fff' : 'var(--text-sub)',
              border: `1px solid ${tab === t.id ? 'var(--color-primary)' : 'var(--border)'}`,
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-2xl border p-4 sm:p-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        {tabContent[tab]}
      </div>
    </div>
  )
}
