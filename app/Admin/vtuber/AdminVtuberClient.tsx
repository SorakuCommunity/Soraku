'use client'
// app/Admin/vtuber/AdminVtuberClient.tsx — SORAKU v1.0.a3.4
// CRUD VTuber: name, slug, desc, image, agency, active + 10 social media links
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save, Star, Globe, Youtube, Twitter, Instagram, Twitch } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Vtuber {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  agency: string | null
  active: boolean
}

interface SocialLink { platform: string; url: string }

const SOCIAL_PLATFORMS = [
  { key: 'youtube',   label: 'YouTube',   icon: <Youtube size={14} style={{ color: '#FF0000' }} /> },
  { key: 'twitter',   label: 'Twitter/X', icon: <Twitter size={14} style={{ color: '#1DA1F2' }} /> },
  { key: 'tiktok',    label: 'TikTok',    icon: <span className="text-xs font-bold">TT</span> },
  { key: 'twitch',    label: 'Twitch',    icon: <Twitch size={14} style={{ color: '#9146FF' }} /> },
  { key: 'instagram', label: 'Instagram', icon: <Instagram size={14} style={{ color: '#E1306C' }} /> },
  { key: 'facebook',  label: 'Facebook',  icon: <span className="text-xs font-bold" style={{ color: '#1877F2' }}>Fb</span> },
  { key: 'website',   label: 'Website',   icon: <Globe size={14} style={{ color: 'var(--color-primary)' }} /> },
  { key: 'trakteer',  label: 'Trakteer',  icon: <span className="text-xs font-bold" style={{ color: '#FF5733' }}>TR</span> },
  { key: 'kofi',      label: 'Ko-fi',     icon: <span className="text-xs font-bold" style={{ color: '#29ABE0' }}>Ko</span> },
  { key: 'other',     label: 'Other',     icon: <span className="text-xs">🔗</span> },
]

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }

const inputClass = 'w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 min-h-[44px]'
const inputStyle = { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }

export function AdminVtuberClient({ vtubers: initial }: { vtubers: Vtuber[] }) {
  const [vtubers, setVtubers] = useState(initial)
  const [editing, setEditing] = useState<Partial<Vtuber> | null>(null)
  const [socials, setSocials] = useState<SocialLink[]>([])
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const openNew = () => {
    setEditing({ name: '', slug: '', description: '', image_url: '', agency: '', active: true })
    setSocials(SOCIAL_PLATFORMS.map(p => ({ platform: p.key, url: '' })))
  }

  const openEdit = async (v: Vtuber) => {
    setEditing({ ...v })
    const { data } = await supabase.from('vtuber_socials').select('platform, url').eq('vtuber_id', v.id)
    const map: Record<string, string> = {}
    for (const s of data ?? []) map[s.platform] = s.url
    setSocials(SOCIAL_PLATFORMS.map(p => ({ platform: p.key, url: map[p.key] ?? '' })))
  }

  const handleSave = async () => {
    if (!editing?.name?.trim() || !editing?.slug?.trim()) { toast.error('Nama dan slug wajib'); return }
    setSaving(true)
    const payload = {
      name: editing.name, slug: editing.slug,
      description: editing.description || null,
      image_url: editing.image_url || null,
      agency: editing.agency || null,
      active: editing.active ?? true,
    }

    let vtuberId = editing.id
    if (!vtuberId) {
      const { data, error } = await supabase.from('vtubers').insert(payload).select().single()
      if (error) { toast.error(error.message); setSaving(false); return }
      vtuberId = (data as Vtuber).id
      setVtubers(prev => [...prev, data as Vtuber])
    } else {
      const { data, error } = await supabase.from('vtubers').update(payload).eq('id', vtuberId).select().single()
      if (error) { toast.error(error.message); setSaving(false); return }
      setVtubers(prev => prev.map(v => v.id === vtuberId ? data as Vtuber : v))
    }

    // Upsert socials
    const socialRows = socials
      .filter(s => s.url.trim())
      .map(s => ({ vtuber_id: vtuberId, platform: s.platform, url: s.url.trim() }))

    // Delete existing then insert
    await supabase.from('vtuber_socials').delete().eq('vtuber_id', vtuberId)
    if (socialRows.length > 0) await supabase.from('vtuber_socials').insert(socialRows)

    toast.success('VTuber disimpan!')
    setEditing(null)
    setSaving(false)
  }

  const deleteVtuber = async (id: string) => {
    if (!confirm('Hapus VTuber ini?')) return
    const { error } = await supabase.from('vtubers').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    setVtubers(prev => prev.filter(v => v.id !== id))
    toast.success('VTuber dihapus.')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>VTuber</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-sub)' }}>{vtubers.length} VTuber terdaftar</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:scale-105 transition-all"
          style={{ backgroundColor: 'var(--color-primary)' }}>
          <Plus size={15} /> Tambah VTuber
        </button>
      </div>

      {vtubers.length === 0 ? (
        <div className="text-center py-20">
          <Star size={36} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-sub)' }} />
          <p style={{ color: 'var(--text-sub)' }}>Belum ada VTuber.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {vtubers.map(v => (
            <div key={v.id}
              className="flex items-center gap-3 p-4 rounded-xl border"
              style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/10"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                {v.image_url && <img src={v.image_url} alt={v.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{v.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-sub)' }}>{v.agency ?? '—'}</p>
                <span className={`text-xs font-medium ${v.active ? 'text-green-400' : 'text-red-400'}`}>
                  {v.active ? 'Aktif' : 'Non-aktif'}
                </span>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(v)} className="p-1.5 rounded-lg hover:bg-white/10 transition-all"
                  style={{ color: 'var(--text-sub)' }}><Edit2 size={14} /></button>
                <button onClick={() => deleteVtuber(v.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-all"
                  style={{ color: '#ef4444' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {editing !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
            style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border my-8"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'rgba(255,255,255,0.12)' }}
              onClick={e => e.stopPropagation()}>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold" style={{ color: 'var(--text)' }}>
                    {editing.id ? 'Edit VTuber' : 'Tambah VTuber'}
                  </h2>
                  <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-white/10"
                    style={{ color: 'var(--text-sub)' }}><X size={16} /></button>
                </div>

                {/* Basic fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-sub)' }}>Nama *</label>
                    <input value={editing.name ?? ''} className={inputClass} style={inputStyle}
                      onChange={e => setEditing(p => ({ ...p!, name: e.target.value, slug: p?.id ? p.slug : slugify(e.target.value) }))} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-sub)' }}>Slug *</label>
                    <input value={editing.slug ?? ''} className={inputClass} style={inputStyle}
                      onChange={e => setEditing(p => ({ ...p!, slug: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-sub)' }}>Agensi</label>
                    <input value={editing.agency ?? ''} placeholder="Holo, Niji, dll" className={inputClass} style={inputStyle}
                      onChange={e => setEditing(p => ({ ...p!, agency: e.target.value }))} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-sub)' }}>Image URL</label>
                    <input value={editing.image_url ?? ''} placeholder="https://..." className={inputClass} style={inputStyle}
                      onChange={e => setEditing(p => ({ ...p!, image_url: e.target.value }))} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-sub)' }}>Deskripsi</label>
                    <textarea value={editing.description ?? ''} rows={2} className={inputClass + ' resize-none'} style={{ ...inputStyle, minHeight: 'auto' }}
                      onChange={e => setEditing(p => ({ ...p!, description: e.target.value }))} />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editing.active ?? true}
                        onChange={e => setEditing(p => ({ ...p!, active: e.target.checked }))}
                        className="w-4 h-4 accent-[var(--color-primary)]" />
                      <span className="text-sm" style={{ color: 'var(--text)' }}>Aktif</span>
                    </label>
                  </div>
                </div>

                {/* Social links */}
                <div>
                  <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-sub)' }}>
                    Social Media
                  </p>
                  <div className="space-y-2">
                    {SOCIAL_PLATFORMS.map((p, i) => (
                      <div key={p.key} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0"
                          style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.10)' }}>
                          {p.icon}
                        </div>
                        <input
                          value={socials[i]?.url ?? ''}
                          onChange={e => setSocials(prev => prev.map((s, idx) => idx === i ? { ...s, url: e.target.value } : s))}
                          placeholder={`${p.label} URL`}
                          className="flex-1 px-3 py-2 rounded-xl border text-xs outline-none focus:ring-1"
                          style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.10)', color: 'var(--text)', minHeight: '36px' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button onClick={() => setEditing(null)} disabled={saving}
                    className="flex-1 py-2.5 rounded-xl border text-sm font-medium"
                    style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text-sub)' }}>Batal</button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                    style={{ backgroundColor: 'var(--color-primary)' }}>
                    {saving ? <div className="w-4 h-4 border-2 rounded-full animate-spin border-white border-t-transparent" />
                      : <><Save size={14} /> Simpan</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
