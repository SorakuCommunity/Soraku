'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Webhook, RefreshCw, Loader2, Check, AlertCircle, Send, Eye, EyeOff,
  BookOpen, Calendar, UserPlus, Copy, MessageCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WebhookSetting {
  id: string
  key: string
  value: string | null
  label: string | null
  category: string
  description: string | null
  updatedat: string
}

const WEBHOOK_TYPES: Record<string, { icon: React.ElementType; color: string; title: string; desc: string }> = {
  discordBlogWebhookUrl: {
    icon: BookOpen,
    color: '#4FA3D1',
    title: 'Webhook Blog',
    desc: 'Notifikasi otomatis ketika artikel baru dipublikasikan',
  },
  discordEventWebhookUrl: {
    icon: Calendar,
    color: '#6EE7B7',
    title: 'Webhook Event',
    desc: 'Pengumuman otomatis ketika event baru dibuat',
  },
  discordRegistrationWebhookUrl: {
    icon: UserPlus,
    color: '#A78BFA',
    title: 'Webhook Pendaftaran',
    desc: 'Notifikasi ketika ada pendaftaran event baru',
  },
  discordFeedbackWebhookUrl: {
    icon: MessageCircle,
    color: '#FBBF24',
    title: 'Webhook Feedback',
    desc: 'Notifikasi ketika ada masukan dari pengguna',
  },
}

export default function AdminWebhooksPage() {
  const [items, setItems] = useState<WebhookSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [testing, setTesting] = useState<string | null>(null)
  const [editKey, setEditKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [showUrl, setShowUrl] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/webhooks')
    const json = await res.json()
    setItems(json?.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3000)
  }

  const startEdit = (key: string, currentValue: string | null) => {
    setEditKey(key)
    setEditValue(currentValue ?? '')
  }

  const saveWebhook = async (key: string) => {
    setSaving(key)
    const res = await fetch('/api/admin/webhooks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: editValue || null }),
    })
    const json = await res.json()
    if (res.ok) {
      setItems(prev => prev.map(i => i.key === key ? { ...i, value: editValue || null, updatedat: new Date().toISOString() } : i))
      setEditKey(null)
      showToast('success', 'Webhook URL berhasil disimpan')
    } else {
      showToast('error', json?.error?.message ?? 'Gagal menyimpan')
    }
    setSaving(null)
  }

  const testWebhook = async (key: string) => {
    setTesting(key)
    const res = await fetch('/api/admin/webhooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    })
    const json = await res.json()
    if (res.ok) {
      showToast('success', 'Test webhook berhasil! Cek channel Discord.')
    } else {
      showToast('error', json?.error?.message ?? 'Test gagal')
    }
    setTesting(null)
  }

  const toggleShow = (key: string) => {
    setShowUrl(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(
      () => showToast('success', 'URL disalin'),
      () => showToast('error', 'Gagal menyalin URL')
    )
  }

  const maskUrl = (url: string) => {
    if (!url) return '—'
    const parts = url.split('/webhooks/')
    if (parts.length < 2) return url.slice(0, 30) + '...'
    return `.../webhooks/${parts[1].slice(0, 8)}...`
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={cn(
          'fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-2xl animate-in slide-in-from-top-2',
          toast.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/15 border border-red-500/30 text-red-400'
        )}>
          {toast.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-primary/60 mb-1 text-[11px] font-bold tracking-widest uppercase">Admin Panel</p>
          <h1 className="text-2xl font-black">Discord Webhooks</h1>
          <p className="text-muted-foreground/50 text-xs mt-1">Kelola webhook Discord untuk notifikasi otomatis</p>
        </div>
        <button onClick={load} disabled={loading}
          className="border-border text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-xl border transition-colors disabled:opacity-40">
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
        </button>
      </div>

      {/* Info banner */}
      <div className="rounded-xl border border-[#5865F2]/20 bg-[#5865F2]/5 p-4">
        <div className="flex items-start gap-3">
          <Webhook className="h-5 w-5 text-[#5865F2] flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#D9DDE3] mb-1">Cara Menggunakan</p>
            <ol className="text-xs text-[#6E8FA6] space-y-1 list-decimal list-inside">
              <li>Buka <span className="text-[#D9DDE3] font-medium">Server Settings → Integrations → Webhooks</span> di Discord</li>
              <li>Buat webhook baru dan pilih channel tujuan</li>
              <li>Salin URL webhook dan tempel di bawah</li>
              <li>Klik <span className="text-[#D9DDE3] font-medium">Test</span> untuk memastikan webhook bekerja</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Webhook Cards */}
      {loading ? (
        <div className="text-muted-foreground flex items-center justify-center gap-2 py-16">
          <Loader2 className="h-5 w-5 animate-spin" /> Memuat...
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(WEBHOOK_TYPES).map(([key, config]) => {
            const item = items.find(i => i.key === key)
            const Icon = config.icon
            const isEditing = editKey === key
            const hasValue = !!item?.value
            const isSaving = saving === key
            const isTesting = testing === key
            const isVisible = showUrl[key]

            return (
              <div key={key} className="glass-card rounded-2xl border border-white/[0.06] overflow-hidden">
                <div className="p-5 sm:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border" style={{ borderColor: config.color + '25', backgroundColor: config.color + '10' }}>
                        <Icon className="h-5 w-5" style={{ color: config.color }} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#D9DDE3]">{config.title}</h3>
                        <p className="text-xs text-[#6E8FA6]/60 mt-0.5">{config.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        'rounded-full px-2.5 py-1 text-[10px] font-bold',
                        hasValue
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-white/5 text-muted-foreground/40 border border-white/[0.06]'
                      )}>
                        {hasValue ? '✓ Aktif' : 'Belum di-set'}
                      </span>
                    </div>
                  </div>

                  {/* URL Display / Edit */}
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          placeholder="https://discord.com/api/webhooks/..."
                          className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-[#4FA3D1]/40 font-mono"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => saveWebhook(key)} disabled={isSaving}
                          className="bg-[#4FA3D1] text-[#1C1E22] hover:bg-[#4FA3D1]/90 flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-colors disabled:opacity-40">
                          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                          Simpan
                        </button>
                        <button onClick={() => setEditKey(null)}
                          className="rounded-xl border border-white/[0.06] px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 min-w-0">
                        <Webhook className="h-3.5 w-3.5 text-muted-foreground/30 flex-shrink-0" />
                        <span className={cn(
                          'text-sm font-mono truncate flex-1 min-w-0',
                          hasValue ? 'text-[#D9DDE3]/70' : 'text-muted-foreground/30'
                        )}>
                          {hasValue ? (isVisible ? item.value : maskUrl(item.value!)) : 'Belum dikonfigurasi'}
                        </span>
                      </div>
                      {hasValue && (
                        <>
                          <button onClick={() => toggleShow(key)} title={isVisible ? 'Sembunyikan' : 'Tampilkan'}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <button onClick={() => copyUrl(item.value!)} title="Salin URL"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                            <Copy className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button onClick={() => startEdit(key, item?.value ?? null)}
                        className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-white/[0.06] px-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-white/[0.12] transition-colors flex-shrink-0">
                        {hasValue ? 'Edit' : 'Set URL'}
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  {hasValue && !isEditing && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.04]">
                      <button onClick={() => testWebhook(key)} disabled={isTesting}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-[#5865F2] bg-[#5865F2]/10 hover:bg-[#5865F2]/20 transition-colors disabled:opacity-40">
                        {isTesting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                        Test Webhook
                      </button>
                      <span className="text-[10px] text-muted-foreground/30">
                        Terakhir diupdate: {new Date(item!.updatedat).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
