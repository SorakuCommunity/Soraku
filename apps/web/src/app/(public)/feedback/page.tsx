'use client'

import { useState } from 'react'
import { Send, Check, AlertCircle, Loader2, Sparkles } from 'lucide-react'

const TYPES = [
  { value: 'question', label: 'Pertanyaan', emoji: '❓' },
  { value: 'feedback', label: 'Masukan', emoji: '💡' },
  { value: 'bug', label: 'Laporan Bug', emoji: '🐛' },
  { value: 'content', label: 'Request Konten', emoji: '📝' },
  { value: 'other', label: 'Lainnya', emoji: '💬' },
]

export default function FeedbackPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'feedback',
  })
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setResult(null)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error ?? 'Gagal mengirim')
      }
      setResult({ type: 'success', msg: 'Masukan berhasil dikirim! Terima kasih 🎉' })
      setForm({ name: '', email: '', subject: '', message: '', type: 'feedback' })
    } catch (err) {
      setResult({ type: 'error', msg: err instanceof Error ? err.message : 'Gagal mengirim' })
    } finally {
      setSending(false)
    }
  }

  const inputClass = 'w-full rounded-md border-2 border-black bg-surface px-4 py-2.5 text-sm font-bold text-foreground placeholder:text-muted focus:border-primary focus:outline-none'
  const labelClass = 'mb-1.5 block text-[10px] font-bold text-muted uppercase tracking-wider'

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-md border-2 border-black bg-primary px-3 py-1.5 text-[10px] font-bold text-white shadow-[2px_2px_0px_#000]">
          <Sparkles className="h-3 w-3" />
          Feedback
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tighter text-foreground sm:text-5xl">
          Kirim <span className="text-primary">Masukan</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted">
          Sampaikan saran, laporan bug, atau request konten.
        </p>
      </div>

      {result && (
        <div className={`mb-6 flex items-center gap-2 rounded-md border-2 border-black p-4 text-sm font-bold shadow-[3px_3px_0px_#000] ${
          result.type === 'success'
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {result.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {result.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Nama</label>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} required placeholder="Nama kamu" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required placeholder="email@contoh.com" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Tipe</label>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => update('type', t.value)}
                className={`rounded-md border-2 border-black px-3 py-1.5 text-[10px] font-bold transition-all ${
                  form.type === t.value
                    ? 'bg-primary text-white shadow-[2px_2px_0px_#000]'
                    : 'bg-surface text-foreground hover:bg-muted/20 shadow-[2px_2px_0px_#000]'
                }`}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Subjek</label>
          <input type="text" value={form.subject} onChange={(e) => update('subject', e.target.value)} required placeholder="Ringkasan singkat" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Pesan</label>
          <textarea value={form.message} onChange={(e) => update('message', e.target.value)} required rows={5} minLength={10} maxLength={2000} placeholder="Tulis pesan kamu di sini..." className={`${inputClass} resize-none`} />
          <p className="mt-1 text-right text-[10px] text-muted">{form.message.length}/2000</p>
        </div>

        <button type="submit" disabled={sending} className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-black bg-primary px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#000]">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {sending ? 'Mengirim...' : 'Kirim Masukan'}
        </button>
      </form>

      <div className="mt-8 rounded-md border-2 border-black bg-surface p-4 shadow-[3px_3px_0px_#000]">
        <p className="text-xs leading-relaxed text-muted">
          Pastikan informasi yang kamu masukkan benar dan lengkap agar kami bisa merespons dengan
          cepat. Hindari informasi sensitif yang tidak relevan.
        </p>
      </div>

      <p className="mt-4 text-center text-xs text-muted">
        Jika tidak ada balasan dalam 1 hari, silakan hubungi lewat{' '}
        <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">
          Discord Soraku
        </a>
      </p>
    </div>
  )
}
