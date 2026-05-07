'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import {
  Plus,
  Trash2,
  Loader2,
  RefreshCw,
  Handshake,
  Pencil,
  X,
  Upload,
  Globe,
  Eye,
  EyeOff,
  Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Partnership {
  id: string
  name: string
  logourl: string | null
  website: string | null
  category: 'partner' | 'sponsor'
  description: string | null
  isactive: boolean
  sortorder: number
  createdat: string
}

const emptyForm = {
  name: '',
  logourl: '',
  website: '',
  category: 'partner' as 'partner' | 'sponsor',
  description: '',
  isactive: true,
  sortorder: 0,
}

export default function AdminPartnershipsPage() {
  const [items, setItems] = useState<Partnership[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/partnerships')
    const json = await res.json()
    setItems(json?.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setEditId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (p: Partnership) => {
    setEditId(p.id)
    setForm({
      name: p.name,
      logourl: p.logourl ?? '',
      website: p.website ?? '',
      category: p.category,
      description: p.description ?? '',
      isactive: p.isactive,
      sortorder: p.sortorder,
    })
    setShowForm(true)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('bucket', 'partnerships')
    fd.append('folder', 'logos')
    const res = await fetch('/api/upload/image', { method: 'POST', body: fd })
    const json = await res.json()
    if (json?.data?.url) setForm((f) => ({ ...f, logourl: json.data.url }))
    setUploading(false)
  }

  const save = async () => {
    if (!form.name.trim()) return
    setSaving(editId ?? 'new')
    const method = editId ? 'PATCH' : 'POST'
    const url = editId ? `/api/admin/partnerships/${editId}` : '/api/admin/partnerships'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        logourl: form.logourl || undefined,
        website: form.website || undefined,
        description: form.description || undefined,
      }),
    })
    if (res.ok) {
      await load()
      setShowForm(false)
      setEditId(null)
    }
    setSaving(null)
  }

  const toggleActive = async (p: Partnership) => {
    setSaving(p.id)
    await fetch(`/api/admin/partnerships/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isactive: !p.isactive }),
    })
    setItems((prev) => prev.map((i) => (i.id === p.id ? { ...i, isactive: !i.isactive } : i)))
    setSaving(null)
  }

  const del = async (id: string) => {
    if (!confirm('Hapus item ini?')) return
    setSaving(id)
    await fetch(`/api/admin/partnerships/${id}`, { method: 'DELETE' })
    setItems((prev) => prev.filter((i) => i.id !== id))
    setSaving(null)
  }

  const partners = items.filter((i) => i.category === 'partner')
  const sponsors = items.filter((i) => i.category === 'sponsor')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-primary/60 mb-1 text-[11px] font-bold tracking-widest uppercase">
            Admin Panel
          </p>
          <h1 className="text-2xl font-black">Partnership & Sponsorship</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="border-border text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-xl border transition-colors disabled:opacity-40"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </button>
          <button
            onClick={openCreate}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors"
          >
            <Plus className="h-4 w-4" /> Tambah
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: items.length, color: 'text-foreground' },
          { label: 'Partner', value: partners.length, color: 'text-blue-400' },
          { label: 'Sponsor', value: sponsors.length, color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={cn('text-2xl font-black', s.color)}>{s.value}</p>
            <p className="text-muted-foreground/50 mt-0.5 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#1C1E22] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
              <h2 className="text-lg font-bold">{editId ? 'Edit' : 'Tambah'} Partnership</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-5">
              {/* Name */}
              <div>
                <label className="text-muted-foreground mb-1.5 block text-xs font-semibold">
                  Nama *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="text-foreground placeholder:text-muted-foreground/30 focus:border-primary/40 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm focus:outline-none"
                  placeholder="Nama partner/sponsor"
                />
              </div>
              {/* Logo upload */}
              <div>
                <label className="text-muted-foreground mb-1.5 block text-xs font-semibold">
                  Logo
                </label>
                <div className="flex items-center gap-3">
                  {form.logourl && (
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03]">
                      <Image
                        src={form.logourl}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-contain p-1.5"
                        unoptimized
                      />
                    </div>
                  )}
                  <label className="text-muted-foreground hover:border-primary/30 hover:text-foreground flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] px-4 py-2.5 text-xs transition-colors">
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {uploading ? 'Mengupload...' : 'Upload Logo'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUpload}
                    />
                  </label>
                </div>
              </div>
              {/* Website */}
              <div>
                <label className="text-muted-foreground mb-1.5 block text-xs font-semibold">
                  Website
                </label>
                <input
                  value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  className="text-foreground placeholder:text-muted-foreground/30 focus:border-primary/40 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>
              {/* Category */}
              <div>
                <label className="text-muted-foreground mb-1.5 block text-xs font-semibold">
                  Kategori
                </label>
                <div className="flex gap-2">
                  {(['partner', 'sponsor'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setForm((f) => ({ ...f, category: c }))}
                      className={cn(
                        'flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all',
                        form.category === c
                          ? 'border-primary/40 bg-primary/10 text-primary'
                          : 'text-muted-foreground border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                      )}
                    >
                      {c === 'partner' ? '🤝 Partner' : '⭐ Sponsor'}
                    </button>
                  ))}
                </div>
              </div>
              {/* Description */}
              <div>
                <label className="text-muted-foreground mb-1.5 block text-xs font-semibold">
                  Deskripsi
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="text-foreground placeholder:text-muted-foreground/30 focus:border-primary/40 w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm focus:outline-none"
                  placeholder="Deskripsi singkat..."
                />
              </div>
              {/* Sort order & Active */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-muted-foreground mb-1.5 block text-xs font-semibold">
                    Urutan
                  </label>
                  <input
                    type="number"
                    value={form.sortorder}
                    onChange={(e) => setForm((f) => ({ ...f, sortorder: Number(e.target.value) }))}
                    className="text-foreground focus:border-primary/40 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setForm((f) => ({ ...f, isactive: !f.isactive }))}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all',
                      form.isactive
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'text-muted-foreground border-white/[0.06] bg-white/[0.02]'
                    )}
                  >
                    {form.isactive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    {form.isactive ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] p-5">
              <button
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground rounded-xl border border-white/[0.08] px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                onClick={save}
                disabled={saving !== null || !form.name.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors disabled:opacity-40"
              >
                {saving !== null && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-muted-foreground flex items-center justify-center gap-2 py-16">
          <Loader2 className="h-5 w-5 animate-spin" /> Memuat...
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center gap-3 rounded-2xl py-16">
          <Handshake className="text-muted-foreground/20 h-10 w-10" />
          <p className="text-muted-foreground text-sm">Belum ada partnership/sponsorship</p>
          <button onClick={openCreate} className="text-primary text-xs hover:underline">
            + Tambah sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((p) => {
            const busy = saving === p.id
            return (
              <div
                key={p.id}
                className={cn(
                  'glass-card hover:border-primary/20 flex items-center gap-3 rounded-xl px-4 py-3 transition-colors',
                  !p.isactive && 'opacity-50'
                )}
              >
                {/* Logo */}
                <div className="bg-muted/30 flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl">
                  {p.logourl ? (
                    <Image
                      src={p.logourl}
                      alt={p.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-contain p-1"
                      unoptimized
                    />
                  ) : (
                    <Handshake className="text-muted-foreground/20 h-5 w-5" />
                  )}
                </div>
                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[9px] font-black',
                        p.category === 'sponsor'
                          ? 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
                          : 'border border-blue-500/20 bg-blue-500/10 text-blue-400'
                      )}
                    >
                      {p.category === 'sponsor' ? '⭐ Sponsor' : '🤝 Partner'}
                    </span>
                    {!p.isactive && (
                      <span className="text-muted-foreground/50 rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-bold">
                        Nonaktif
                      </span>
                    )}
                  </div>
                  {p.website && (
                    <p className="text-muted-foreground/40 mt-0.5 truncate text-[10px]">
                      {p.website}
                    </p>
                  )}
                </div>
                {/* Actions */}
                <div className="flex flex-shrink-0 items-center gap-1">
                  <button
                    onClick={() => toggleActive(p)}
                    disabled={busy}
                    className="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-xl transition-colors disabled:opacity-30"
                    title={p.isactive ? 'Nonaktifkan' : 'Aktifkan'}
                  >
                    {busy ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : p.isactive ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => openEdit(p)}
                    className="text-muted-foreground hover:text-primary flex h-8 w-8 items-center justify-center rounded-xl transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => del(p.id)}
                    disabled={busy}
                    className="text-muted-foreground hover:text-destructive flex h-8 w-8 items-center justify-center rounded-xl transition-colors disabled:opacity-40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
