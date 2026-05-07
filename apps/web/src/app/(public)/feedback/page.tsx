'use client'

import { useState } from 'react'
import { Send, Check, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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
      const json = await res.json()

      if (res.ok) {
        setResult({
          type: 'success',
          msg: 'Feedback berhasil dikirim! Kami akan segera merespons.',
        })
        setForm({ name: '', email: '', subject: '', message: '', type: 'feedback' })
      } else {
        setResult({ type: 'error', msg: json?.error?.message ?? 'Gagal mengirim feedback' })
      }
    } catch {
      setResult({ type: 'error', msg: 'Terjadi kesalahan jaringan' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <p className="text-primary/70 mb-3 text-xs font-bold tracking-widest uppercase">
          Hubungi Kami
        </p>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Kirim Masukan</h1>
        <p className="text-muted-foreground/70 mx-auto mt-4 max-w-md text-sm leading-relaxed">
          Kami ingin sekali mendengar kabar dari kalian! Ada pertanyaan, masukan, atau cuma mau say
          hi? Isi formulir di bawah dan kami akan merespons secepatnya.
        </p>
      </div>

      {result && (
        <div
          className={cn(
            'mb-6 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold',
            result.type === 'success'
              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border border-red-500/30 bg-red-500/10 text-red-400'
          )}
        >
          {result.type === 'success' ? (
            <Check className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {result.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-foreground/60 mb-1.5 block text-xs font-bold">Nama</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
              placeholder="Nama kamu"
              className="border-border/40 focus:border-primary/40 placeholder:text-muted-foreground/30 w-full rounded-xl border bg-white/[0.03] px-4 py-2.5 text-sm transition-colors outline-none"
            />
          </div>
          <div>
            <label className="text-foreground/60 mb-1.5 block text-xs font-bold">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              required
              placeholder="email@contoh.com"
              className="border-border/40 focus:border-primary/40 placeholder:text-muted-foreground/30 w-full rounded-xl border bg-white/[0.03] px-4 py-2.5 text-sm transition-colors outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-foreground/60 mb-1.5 block text-xs font-bold">Tipe</label>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => update('type', t.value)}
                className={cn(
                  'rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors',
                  form.type === t.value
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground border-white/[0.06] bg-white/[0.02]'
                )}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-foreground/60 mb-1.5 block text-xs font-bold">Subjek</label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => update('subject', e.target.value)}
            required
            placeholder="Ringkasan singkat"
            className="border-border/40 focus:border-primary/40 placeholder:text-muted-foreground/30 w-full rounded-xl border bg-white/[0.03] px-4 py-2.5 text-sm transition-colors outline-none"
          />
        </div>

        <div>
          <label className="text-foreground/60 mb-1.5 block text-xs font-bold">Pesan</label>
          <textarea
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            required
            rows={5}
            minLength={10}
            maxLength={2000}
            placeholder="Tulis pesan kamu di sini..."
            className="border-border/40 focus:border-primary/40 placeholder:text-muted-foreground/30 w-full resize-none rounded-xl border bg-white/[0.03] px-4 py-3 text-sm transition-colors outline-none"
          />
          <p className="text-muted-foreground/30 mt-1 text-right text-[10px]">
            {form.message.length}/2000
          </p>
        </div>

        <button
          type="submit"
          disabled={sending}
          className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-colors disabled:opacity-40"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {sending ? 'Mengirim...' : 'Kirim Masukan'}
        </button>
      </form>

      <div className="border-border/20 mt-8 rounded-xl border bg-white/[0.01] p-4">
        <p className="text-foreground/40 text-xs leading-relaxed">
          Pastikan informasi yang kamu masukkan benar dan lengkap agar kami bisa merespons dengan
          cepat. Hindari informasi sensitif yang tidak relevan.
        </p>
      </div>

      <p className="text-muted-foreground/30 mt-4 text-center text-xs">
        Jika tidak ada balasan dalam 1 hari, silakan hubungi lewat{' '}
        <a
          href="https://discord.gg/qm3XJvRa6B"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary/50 hover:text-primary transition-colors"
        >
          Discord Soraku
        </a>
      </p>
    </div>
  )
}
