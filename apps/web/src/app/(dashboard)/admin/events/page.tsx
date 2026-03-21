'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  Calendar,
  Wifi,
  MapPin,
  Pencil,
  Users,
  Lock,
  Unlock,
  DollarSign,
  Tag,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminEvent {
  id: string
  slug: string
  title: string
  startdate: string
  enddate: string | null
  isonline: boolean
  ispublished: boolean
  tags: string[]
  gametype: string | null
  ispaid: boolean
  registrationopen: boolean
  registrationurl: string | null
}

interface Player {
  name: string
  role?: string
  nickname?: string
}

interface Registration {
  id: string
  teamname: string
  teamlogourl: string | null
  activeplayers: Player[]
  reserveplayers: Player[]
  contactname: string | null
  contactdiscord: string | null
  status: 'pending' | 'approved' | 'rejected'
  paymentproof: string | null
  rejectreason: string | null
  createdat: string
}

type Tab = 'events' | 'pendaftaran'

export default function AdminEventsPage() {
  const [tab, setTab] = useState<Tab>('events')
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const [selEvent, setSelEvent] = useState<AdminEvent | null>(null)
  const [regs, setRegs] = useState<Registration[]>([])
  const [regsLoad, setRegsLoad] = useState(false)
  const [reviewing, setReviewing] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<{ id: string; teamname: string } | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [expandedReg, setExpandedReg] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/events')
    const json = await res.json()
    setEvents(json?.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const loadRegs = useCallback(async (ev: AdminEvent) => {
    setSelEvent(ev)
    setRegsLoad(true)
    setRegs([])
    const res = await fetch(`/api/events/${ev.slug}/register`)
    const json = await res.json()
    setRegs(json?.data?.registrations ?? [])
    setRegsLoad(false)
  }, [])

  const togglePublish = async (ev: AdminEvent) => {
    setSaving(ev.id)
    await fetch(`/api/admin/events/${ev.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ispublished: !ev.ispublished }),
    })
    setEvents((prev) =>
      prev.map((e) => (e.id === ev.id ? { ...e, ispublished: !e.ispublished } : e))
    )
    setSaving(null)
  }

  const toggleRegOpen = async (ev: AdminEvent) => {
    setSaving(`reg_${ev.id}`)
    await fetch(`/api/admin/events/${ev.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationopen: !ev.registrationopen }),
    })
    const updated = { ...ev, registrationopen: !ev.registrationopen }
    setEvents((prev) => prev.map((e) => (e.id === ev.id ? updated : e)))
    if (selEvent?.id === ev.id) setSelEvent(updated)
    setSaving(null)
  }

  const del = async (id: string) => {
    if (!confirm('Hapus event ini? Tidak bisa dibatalkan.')) return
    setSaving(id)
    await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
    setEvents((prev) => prev.filter((e) => e.id !== id))
    setSaving(null)
  }

  const review = async (regId: string, status: 'approved' | 'rejected', reason?: string) => {
    if (!selEvent) return
    setReviewing(regId)
    await fetch(`/api/events/${selEvent.slug}/register/${regId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, rejectreason: reason }),
    })
    setRegs((prev) => prev.map((r) => (r.id === regId ? { ...r, status } : r)))
    setReviewing(null)
    setRejectModal(null)
    setRejectReason('')
  }

  const now = new Date()
  const mlEvents = events.filter((e) => e.gametype === 'ml')
  const counts = {
    total: events.length,
    upcoming: events.filter((e) => new Date(e.startdate) >= now).length,
    past: events.filter((e) => new Date(e.startdate) < now).length,
  }
  const regCounts = {
    total: regs.length,
    pending: regs.filter((r) => r.status === 'pending').length,
    approved: regs.filter((r) => r.status === 'approved').length,
    rejected: regs.filter((r) => r.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <p className="text-primary/60 mb-1 text-[11px] font-bold tracking-widest uppercase">
              Admin Panel
            </p>
            <h1 className="text-2xl font-black">Event</h1>
          </div>
          <div className="border-border/50 bg-card/30 flex gap-1 rounded-2xl border p-1 backdrop-blur-sm">
            <button
              onClick={() => setTab('events')}
              className={cn(
                'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200',
                tab === 'events'
                  ? 'bg-primary shadow-primary/20 text-white shadow-md'
                  : 'text-muted-foreground/60 hover:text-foreground hover:bg-muted/30'
              )}
            >
              <Calendar className="h-3.5 w-3.5" /> Event
            </button>
            <button
              onClick={() => setTab('pendaftaran')}
              className={cn(
                'relative flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200',
                tab === 'pendaftaran'
                  ? 'bg-primary shadow-primary/20 text-white shadow-md'
                  : 'text-muted-foreground/60 hover:text-foreground hover:bg-muted/30'
              )}
            >
              <Users className="h-3.5 w-3.5" /> Pendaftaran
              {mlEvents.length > 0 && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[9px] font-black',
                    tab === 'pendaftaran' ? 'bg-white/20' : 'bg-primary/20 text-primary'
                  )}
                >
                  {mlEvents.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="border-border text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-xl border transition-colors disabled:opacity-40"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </button>
          <Link
            href="/admin/events/new"
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors"
          >
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Event Baru</span>
          </Link>
        </div>
      </div>

      {/* ════════ TAB: EVENTS ════════ */}
      {tab === 'events' && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total', value: counts.total, color: 'text-foreground' },
              { label: 'Upcoming', value: counts.upcoming, color: 'text-primary' },
              { label: 'Selesai', value: counts.past, color: 'text-muted-foreground' },
            ].map((s) => (
              <div key={s.label} className="glass-card p-4 text-center">
                <p className={cn('text-2xl font-black', s.color)}>{s.value}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="glass-card overflow-hidden rounded-2xl">
            {/* Desktop header */}
            <div className="border-border/40 text-muted-foreground/40 hidden grid-cols-[1fr_120px_70px_80px_80px_140px] gap-3 border-b px-5 py-3 text-[10px] font-bold tracking-widest uppercase sm:grid">
              <span>Event</span>
              <span>Tanggal</span>
              <span>Tipe</span>
              <span>Status</span>
              <span>Daftar</span>
              <span className="text-right">Aksi</span>
            </div>

            {loading ? (
              <div className="text-muted-foreground flex items-center justify-center gap-2 py-16">
                <Loader2 className="h-5 w-5 animate-spin" /> Memuat...
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <Calendar className="text-muted-foreground/30 h-10 w-10" />
                <p className="text-muted-foreground text-sm">Belum ada event</p>
                <Link href="/admin/events/new" className="text-primary text-xs hover:underline">
                  + Buat sekarang
                </Link>
              </div>
            ) : (
              <div className="divide-border/30 divide-y">
                {events.map((ev) => {
                  const busy = saving === ev.id || saving === `reg_${ev.id}`
                  const isPast = new Date(ev.startdate) < now
                  const dateStr = new Date(ev.startdate).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                  return (
                    <div key={ev.id} className="hover:bg-primary/2 px-4 py-4 transition-colors">
                      {/* Mobile layout */}
                      <div className="flex items-start justify-between gap-3 sm:hidden">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-semibold">{ev.title}</p>
                            {ev.ispaid ? (
                              <span className="flex items-center gap-0.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-400/80">
                                <DollarSign className="h-2 w-2" /> Bayar
                              </span>
                            ) : (
                              <span className="flex items-center gap-0.5 rounded-full border border-green-500/20 bg-green-500/10 px-1.5 py-0.5 text-[9px] font-bold text-green-400/70">
                                <Tag className="h-2 w-2" /> Gratis
                              </span>
                            )}
                          </div>
                          <div className="text-muted-foreground/50 flex flex-wrap gap-2 text-[10px]">
                            <span>{dateStr}</span>
                            <span className={cn(ev.isonline ? 'text-blue-400' : 'text-green-400')}>
                              {ev.isonline ? 'Online' : 'Offline'}
                            </span>
                            <span
                              className={cn(ev.ispublished ? 'text-green-400' : 'text-amber-400')}
                            >
                              {ev.ispublished ? '● Publik' : '○ Draft'}
                            </span>
                          </div>
                          {/* Open/Close button mobile */}
                          <div className="mt-2">
                            <button
                              onClick={() => toggleRegOpen(ev)}
                              disabled={busy || isPast}
                              className={cn(
                                'flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-black transition-all',
                                ev.registrationopen
                                  ? 'border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                  : 'border-border/50 bg-muted/20 text-muted-foreground/50 hover:border-primary/30 hover:text-foreground'
                              )}
                            >
                              {busy && saving === `reg_${ev.id}` ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : ev.registrationopen ? (
                                <Unlock className="h-3 w-3" />
                              ) : (
                                <Lock className="h-3 w-3" />
                              )}
                              {ev.registrationopen ? 'Pendaftaran Buka' : 'Pendaftaran Tutup'}
                            </button>
                          </div>
                        </div>
                        {/* Actions mobile */}
                        <div className="flex flex-shrink-0 items-center gap-1">
                          {ev.gametype === 'ml' && (
                            <button
                              onClick={() => {
                                setTab('pendaftaran')
                                loadRegs(ev)
                              }}
                              className="text-muted-foreground hover:text-primary flex h-8 w-8 items-center justify-center rounded-xl transition-colors"
                              title="Pendaftaran"
                            >
                              <Users className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <Link
                            href={`/admin/events/${ev.id}/edit`}
                            className="text-muted-foreground hover:text-primary flex h-8 w-8 items-center justify-center rounded-xl transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => togglePublish(ev)}
                            disabled={busy || isPast}
                            className="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-xl transition-colors disabled:opacity-30"
                          >
                            {busy && saving === ev.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : ev.ispublished ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => del(ev.id)}
                            disabled={busy}
                            className="text-muted-foreground hover:text-destructive flex h-8 w-8 items-center justify-center rounded-xl transition-colors disabled:opacity-40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Desktop layout */}
                      <div className="hidden grid-cols-[1fr_120px_70px_80px_80px_140px] items-center gap-3 sm:grid">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-medium">{ev.title}</p>
                            {ev.ispaid ? (
                              <span className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400/80">
                                <DollarSign className="h-2.5 w-2.5" /> Bayar
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-400/70">
                                <Tag className="h-2.5 w-2.5" /> Gratis
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground/40 font-mono text-xs">
                            /events/{ev.slug}
                          </p>
                        </div>
                        <p
                          className={cn(
                            'text-xs',
                            isPast ? 'text-muted-foreground/50' : 'text-foreground'
                          )}
                        >
                          {dateStr}
                        </p>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 text-[10px] font-bold',
                            ev.isonline ? 'text-blue-400' : 'text-green-400'
                          )}
                        >
                          {ev.isonline ? (
                            <Wifi className="h-3 w-3" />
                          ) : (
                            <MapPin className="h-3 w-3" />
                          )}
                          {ev.isonline ? 'Online' : 'Offline'}
                        </span>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold',
                            ev.ispublished
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-amber-500/10 text-amber-400'
                          )}
                        >
                          {ev.ispublished ? '● Publik' : '○ Draft'}
                        </span>
                        <button
                          onClick={() => toggleRegOpen(ev)}
                          disabled={busy || isPast}
                          title={ev.registrationopen ? 'Tutup Pendaftaran' : 'Buka Pendaftaran'}
                          className={cn(
                            'flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-black transition-all',
                            ev.registrationopen
                              ? 'border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20'
                              : 'border-border/50 bg-muted/20 text-muted-foreground/50 hover:border-primary/30 hover:text-foreground'
                          )}
                        >
                          {busy && saving === `reg_${ev.id}` ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : ev.registrationopen ? (
                            <Unlock className="h-3 w-3" />
                          ) : (
                            <Lock className="h-3 w-3" />
                          )}
                          {ev.registrationopen ? 'Buka' : 'Tutup'}
                        </button>
                        <div className="flex items-center justify-end gap-1">
                          {ev.gametype === 'ml' && (
                            <button
                              onClick={() => {
                                setTab('pendaftaran')
                                loadRegs(ev)
                              }}
                              className="text-muted-foreground hover:text-primary flex h-8 w-8 items-center justify-center rounded-xl transition-colors"
                              title="Lihat Pendaftar"
                            >
                              <Users className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <Link
                            href={`/admin/events/${ev.id}/edit`}
                            className="text-muted-foreground hover:text-primary flex h-8 w-8 items-center justify-center rounded-xl transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => togglePublish(ev)}
                            disabled={busy || isPast}
                            className="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-xl transition-colors disabled:opacity-30"
                            title={ev.ispublished ? 'Jadikan draft' : 'Publish'}
                          >
                            {busy && saving === ev.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : ev.ispublished ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => del(ev.id)}
                            disabled={busy}
                            className="text-muted-foreground hover:text-destructive flex h-8 w-8 items-center justify-center rounded-xl transition-colors disabled:opacity-40"
                            title="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ════════ TAB: PENDAFTARAN ════════ */}
      {tab === 'pendaftaran' && (
        <div className="space-y-5">
          <div className="glass-card rounded-2xl p-5">
            <p className="text-muted-foreground/50 mb-3 text-xs font-bold tracking-widest uppercase">
              Pilih Event
            </p>
            {mlEvents.length === 0 ? (
              <p className="text-muted-foreground/50 text-sm">
                Belum ada event dengan game type ML.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {mlEvents.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => loadRegs(ev)}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all',
                      selEvent?.id === ev.id
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                    )}
                  >
                    ⚔️ {ev.title}
                    {ev.registrationopen && (
                      <span className="rounded-full bg-green-500/20 px-1.5 py-0.5 text-[9px] font-black text-green-400">
                        BUKA
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selEvent && (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: 'Total', value: regCounts.total, cls: 'text-foreground' },
                    { label: 'Tunggu', value: regCounts.pending, cls: 'text-yellow-400' },
                    { label: 'Diterima', value: regCounts.approved, cls: 'text-green-400' },
                    { label: 'Ditolak', value: regCounts.rejected, cls: 'text-red-400' },
                  ].map((s) => (
                    <div key={s.label} className="glass-card rounded-xl px-4 py-3 text-center">
                      <p className={cn('text-xl font-black', s.cls)}>{s.value}</p>
                      <p className="text-muted-foreground/40 text-[11px]">{s.label}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => toggleRegOpen(selEvent)}
                  disabled={!!saving}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all sm:w-auto',
                    selEvent.registrationopen
                      ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      : 'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20'
                  )}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : selEvent.registrationopen ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Unlock className="h-4 w-4" />
                  )}
                  {selEvent.registrationopen ? 'Tutup Pendaftaran' : 'Buka Pendaftaran'}
                </button>
              </div>

              {/* Reject modal */}
              {rejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                  <div className="glass-card border-border/60 w-full max-w-sm space-y-4 rounded-2xl border p-6">
                    <h2 className="font-bold">Tolak Pendaftaran</h2>
                    <p className="text-muted-foreground/70 text-sm">
                      Tim:{' '}
                      <span className="text-foreground font-semibold">{rejectModal.teamname}</span>
                    </p>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Alasan penolakan (opsional)..."
                      rows={3}
                      maxLength={300}
                      className="border-border/60 bg-card/40 focus:border-primary/40 w-full resize-none rounded-xl border px-4 py-2.5 text-sm transition-all outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setRejectModal(null)}
                        className="border-border text-muted-foreground hover:text-foreground rounded-xl border px-4 py-2 text-xs font-medium transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => review(rejectModal.id, 'rejected', rejectReason)}
                        disabled={!!reviewing}
                        className="flex items-center gap-1.5 rounded-xl bg-red-500/80 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-red-500 disabled:opacity-50"
                      >
                        Tolak
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {regsLoad ? (
                <div className="text-muted-foreground flex items-center justify-center gap-2 py-12">
                  <Loader2 className="h-5 w-5 animate-spin" /> Memuat pendaftaran...
                </div>
              ) : regs.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <p className="mb-3 text-3xl">📋</p>
                  <p className="text-muted-foreground/50 text-sm">Belum ada yang mendaftar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {regs.map((reg, idx) => {
                    const statusCfg = {
                      pending: {
                        cls: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
                        label: 'Menunggu',
                      },
                      approved: {
                        cls: 'text-green-400 bg-green-400/10 border-green-400/30',
                        label: 'Diterima',
                      },
                      rejected: {
                        cls: 'text-red-400 bg-red-400/10 border-red-400/30',
                        label: 'Ditolak',
                      },
                    }[reg.status]
                    const isExpanded = expandedReg === reg.id
                    return (
                      <div key={reg.id} className="glass-card overflow-hidden rounded-2xl">
                        {/* Header row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="bg-primary/10 text-primary flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-black">
                              {idx + 1}
                            </span>
                            {reg.teamlogourl && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={reg.teamlogourl}
                                alt=""
                                className="h-8 w-8 flex-shrink-0 rounded-lg object-cover"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="truncate font-bold">{reg.teamname}</p>
                              {(reg.contactname || reg.contactdiscord) && (
                                <p className="text-muted-foreground/50 truncate text-xs">
                                  {[reg.contactname, reg.contactdiscord]
                                    .filter(Boolean)
                                    .join(' · ')}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                'flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold',
                                statusCfg.cls
                              )}
                            >
                              {statusCfg.label}
                            </span>
                            {reg.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => review(reg.id, 'approved')}
                                  disabled={!!reviewing}
                                  className="flex items-center gap-1 rounded-xl border border-green-500/30 bg-green-500/15 px-3 py-1.5 text-xs font-bold text-green-400 transition-colors hover:bg-green-500/25 disabled:opacity-50"
                                >
                                  {reviewing === reg.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    '✓'
                                  )}{' '}
                                  Terima
                                </button>
                                <button
                                  onClick={() =>
                                    setRejectModal({ id: reg.id, teamname: reg.teamname })
                                  }
                                  disabled={!!reviewing}
                                  className="flex items-center gap-1 rounded-xl border border-red-500/30 bg-red-500/15 px-3 py-1.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/25 disabled:opacity-50"
                                >
                                  ✕ Tolak
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setExpandedReg(isExpanded ? null : reg.id)}
                              className="border-border/40 text-muted-foreground hover:text-foreground flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors"
                            >
                              {isExpanded ? 'Tutup' : 'Detail'}
                            </button>
                          </div>
                        </div>

                        {/* Expanded detail: pemain + bukti */}
                        {isExpanded && (
                          <div className="border-border/30 space-y-4 border-t px-5 pt-4 pb-5">
                            {/* Pemain Aktif */}
                            {(reg.activeplayers ?? []).length > 0 && (
                              <div>
                                <p className="text-primary/50 mb-2 text-[10px] font-black tracking-widest uppercase">
                                  Pemain Aktif ({reg.activeplayers.length})
                                </p>
                                <div className="grid gap-1.5 sm:grid-cols-2">
                                  {reg.activeplayers.map((p, i) => (
                                    <div
                                      key={i}
                                      className="border-primary/15 bg-primary/5 flex items-center gap-2 rounded-xl border px-3 py-2"
                                    >
                                      <span className="bg-primary/20 text-primary flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-black">
                                        {i + 1}
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-bold">
                                          {p.name}
                                          {p.nickname ? ` "${p.nickname}"` : ''}
                                        </p>
                                        {p.role && (
                                          <p className="text-foreground/35 text-[10px]">{p.role}</p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Pemain Cadangan */}
                            {(reg.reserveplayers ?? []).length > 0 && (
                              <div>
                                <p className="mb-2 text-[10px] font-black tracking-widest text-yellow-500/50 uppercase">
                                  Cadangan ({reg.reserveplayers.length})
                                </p>
                                <div className="grid gap-1.5 sm:grid-cols-2">
                                  {reg.reserveplayers.map((p, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center gap-2 rounded-xl border border-yellow-500/15 bg-yellow-500/5 px-3 py-2"
                                    >
                                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-500/20 text-[10px] font-black text-yellow-400">
                                        C{i + 1}
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-bold">{p.name}</p>
                                        {p.role && (
                                          <p className="text-foreground/35 text-[10px]">{p.role}</p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Bukti Bayar */}
                            {reg.paymentproof && (
                              <div className="flex flex-col gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                                <p className="text-[10px] font-bold tracking-widest text-amber-400/60 uppercase">
                                  Bukti Pembayaran
                                </p>
                                <div className="relative overflow-hidden rounded-lg border border-amber-500/15">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={reg.paymentproof}
                                    alt="Bukti bayar"
                                    className="max-h-48 w-full bg-black/20 object-contain"
                                  />
                                </div>
                                <a
                                  href={reg.paymentproof}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 self-start text-xs text-amber-400 transition-colors hover:text-amber-300"
                                >
                                  Buka di tab baru ↗
                                </a>
                              </div>
                            )}

                            {reg.rejectreason && (
                              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5">
                                <p className="mb-0.5 text-[10px] text-red-400/60">Alasan Tolak</p>
                                <p className="text-xs text-red-400/80">{reg.rejectreason}</p>
                              </div>
                            )}

                            <p className="text-muted-foreground/25 text-right font-mono text-[10px]">
                              {reg.id.slice(0, 8).toUpperCase()} ·{' '}
                              {new Date(reg.createdat).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
