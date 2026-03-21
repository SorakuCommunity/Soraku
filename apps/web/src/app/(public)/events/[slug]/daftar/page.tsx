'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Users,
  UserPlus,
  Shield,
  Home,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Swords,
  X,
  Plus,
  Star,
  Trophy,
  Upload,
  Camera,
} from 'lucide-react'
import { ImageUrlInput } from '@/components/ui/image-url-input'
import { cn } from '@/lib/utils'
import {
  BCAIcon,
  BRIIcon,
  BTNIcon,
  SeabankIcon,
  DanaIcon,
  QRISIcon,
  GopayIcon,
} from '@/components/icons/custom-icons'

// ─── Types ─────────────────────────────────────────────────────────────────
interface Player {
  name: string
  role: string
}

type PaymentMethod = {
  type: 'bank' | 'ewallet' | 'qris'
  bank?: string
  provider?: string
  account?: string
  name?: string
  qrisImageUrl?: string
}

interface EventInfo {
  id: string
  title: string
  slug: string
  coverurl: string | null
  startdate: string
  registrationurl: string | null
  gametype: string | null
  ispaid: boolean
  price: number | null
  priceinfo: string | null
  paymentmethods: PaymentMethod[] | null
}

const ROLES_ML = [
  'Goldlaner',
  'Jungler',
  'Midlaner',
  'Roamer',
  'EXP Laner',
  'Hyper',
  'Support',
  'Assassin',
  'Marksman',
  'Tank',
  'Mage',
] as const

const EMPTY_PLAYER = (): Player => ({ name: '', role: '' })

const DEFAULT_ACTIVE = () => [
  EMPTY_PLAYER(),
  EMPTY_PLAYER(),
  EMPTY_PLAYER(),
  EMPTY_PLAYER(),
  EMPTY_PLAYER(),
]

const PAYMENT_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  bca: BCAIcon,
  bri: BRIIcon,
  btn: BTNIcon,
  seabank: SeabankIcon,
  dana: DanaIcon,
  qris: QRISIcon,
  gopay: GopayIcon,
}

function getPaymentKey(m: PaymentMethod): string {
  if (m.type === 'qris') return m.provider?.toLowerCase() ?? 'qris'
  if (m.type === 'bank') return (m.bank ?? '').toLowerCase()
  return (m.provider ?? '').toLowerCase()
}

// ─── Steps ─────────────────────────────────────────────────────────────────
function Steps({ current }: { current: number }) {
  const steps = [
    { n: 1, label: 'Info Tim' },
    { n: 2, label: 'Pemain' },
    { n: 3, label: 'Preview' },
  ]
  return (
    <div className="flex items-center gap-1">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center gap-1">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-black transition-all',
              current === s.n
                ? 'bg-primary shadow-primary/30 scale-105 text-white shadow-md'
                : current > s.n
                  ? 'border border-green-500/30 bg-green-500/20 text-green-400'
                  : 'bg-muted/20 text-foreground/25 border-border/30 border'
            )}
          >
            {current > s.n ? '✓' : s.n}
          </div>
          <span
            className={cn(
              'hidden pr-1 text-[11px] font-bold sm:block',
              current === s.n
                ? 'text-primary'
                : current > s.n
                  ? 'text-green-400/60'
                  : 'text-foreground/25'
            )}
          >
            {s.label}
          </span>
          {i < steps.length - 1 && <ChevronRight className="text-foreground/15 mx-0.5 h-3 w-3" />}
        </div>
      ))}
    </div>
  )
}

// ─── Field Label ────────────────────────────────────────────────────────────
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-foreground/40 flex items-center gap-1 text-[10px] font-black tracking-widest uppercase">
      {children}
      {required && <span className="text-xs tracking-normal text-red-400 normal-case">*</span>}
    </label>
  )
}

const inputCls =
  'w-full rounded-xl border border-border/60 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-foreground/20 focus:border-primary/60 focus:bg-black/40 focus:ring-2 focus:ring-primary/10 transition-all'

// ─── PlayerCard ─────────────────────────────────────────────────────────────
function PlayerCard({
  player,
  index,
  isReserve,
  onChange,
  onRemove,
  canRemove,
  isML,
}: {
  player: Player
  index: number
  isReserve: boolean
  onChange: (p: Player) => void
  onRemove: () => void
  canRemove: boolean
  isML: boolean
}) {
  const filled = player.name.trim().length > 0
  return (
    <div
      className={cn(
        'relative space-y-3 rounded-2xl border p-4 transition-all',
        !filled && !isReserve
          ? 'border-red-500/20 bg-red-500/3'
          : isReserve
            ? 'border-yellow-500/20 bg-yellow-500/5'
            : 'border-primary/20 bg-primary/4'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-black',
              isReserve ? 'bg-yellow-500/20 text-yellow-400' : 'bg-primary/20 text-primary'
            )}
          >
            {isReserve ? `C${index + 1}` : index + 1}
          </div>
          <span
            className={cn(
              'text-[10px] font-black tracking-widest uppercase',
              isReserve ? 'text-yellow-400/60' : 'text-primary/60'
            )}
          >
            {isReserve ? 'Cadangan' : 'Pemain'}
          </span>
          {!isReserve && !filled && (
            <span className="text-[9px] font-bold text-red-400/70">— Wajib diisi</span>
          )}
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/10 text-red-400/60 transition-colors hover:bg-red-500/20 hover:text-red-400"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className={cn('grid gap-3', isML ? 'sm:grid-cols-2' : '')}>
        <div className="space-y-1">
          <Label required={!isReserve}>{isML ? 'IGN Mobile Legends' : 'Nama / IGN'}</Label>
          <input
            value={player.name}
            onChange={(e) => onChange({ ...player, name: e.target.value })}
            placeholder={isML ? 'In-game name (sesuai ML)' : 'Nama lengkap / IGN'}
            className={cn(
              'placeholder:text-foreground/15 focus:ring-primary/10 w-full rounded-xl border bg-black/30 px-3 py-2.5 text-sm transition-all outline-none focus:ring-1',
              !filled && !isReserve
                ? 'border-red-500/30 focus:border-red-400/50'
                : 'border-border/40 focus:border-primary/40'
            )}
          />
          {isML && (
            <p className="text-foreground/25 text-[9px]">
              Gunakan IGN persis seperti di Mobile Legends
            </p>
          )}
        </div>
        {isML && (
          <div className="space-y-1">
            <Label>Role</Label>
            <select
              value={player.role}
              onChange={(e) => onChange({ ...player, role: e.target.value })}
              className="border-border/40 focus:border-primary/40 focus:ring-primary/10 w-full rounded-xl border bg-[#12141a] px-3 py-2.5 text-sm transition-all outline-none focus:ring-1"
            >
              <option value="">Pilih role…</option>
              {ROLES_ML.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main ───────────────────────────────────────────────────────────────────
export default function EventRegisterPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [event, setEvent] = useState<EventInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [regId, setRegId] = useState('')

  // Form
  const [teamname, setTeamname] = useState('')
  const [teamlogourl, setTeamlogourl] = useState('')
  const [contactname, setContactname] = useState('')
  const [contactdiscord, setContactdiscord] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentproof, setPaymentproof] = useState('')
  const [uploading, setUploading] = useState(false)
  const [activeplayers, setActiveplayers] = useState<Player[]>(DEFAULT_ACTIVE())
  const [reserveplayers, setReserveplayers] = useState<Player[]>([])
  const [sessionUserId, setSessionUserId] = useState<string | null>(null)

  const isML = event?.gametype === 'ml'

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.data?.id) setSessionUserId(d.data.id)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch(`/api/events/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.data) {
          router.push('/events')
          return
        }
        const ev = d.data
        if (ev.gametype !== 'ml' && ev.registrationurl) {
          window.location.href = ev.registrationurl
          return
        }
        if (ev.gametype !== 'ml' && !ev.registrationurl) {
          router.push(`/events/${slug}`)
          return
        }
        setEvent(ev)
      })
      .catch(() => router.push('/events'))
      .finally(() => setLoading(false))
  }, [slug, router])

  const updateActive = useCallback(
    (i: number, p: Player) => setActiveplayers((prev) => prev.map((v, idx) => (idx === i ? p : v))),
    []
  )
  const updateReserve = useCallback(
    (i: number, p: Player) =>
      setReserveplayers((prev) => prev.map((v, idx) => (idx === i ? p : v))),
    []
  )

  // ── Validasi per step ────────────────────────────────────────────────────
  const step1Errors: string[] = []
  if (!teamname.trim() || teamname.trim().length < 2)
    step1Errors.push('Nama tim wajib diisi (min 2 karakter).')
  if (!contactname.trim()) step1Errors.push('Nama Kontak PIC wajib diisi.')
  if (!contactdiscord.trim()) step1Errors.push('Discord PIC wajib diisi.')
  if (event?.ispaid && !paymentproof.trim())
    step1Errors.push('Screenshot bukti pembayaran wajib diupload.')
  const canGoStep2 = step1Errors.length === 0

  const unfilledPlayers = activeplayers.filter((p) => !p.name.trim()).length
  const canGoStep3 = unfilledPlayers === 0

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('bucket', 'events')
      fd.append('folder', 'payment-proof')
      const res = await fetch('/api/upload/image', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) return null
      return data?.data?.url ?? null
    } catch {
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/events/${slug}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamname: teamname.trim(),
          teamlogourl: teamlogourl.trim() || undefined,
          activeplayers: activeplayers.filter((p) => p.name.trim()),
          reserveplayers: reserveplayers.filter((p) => p.name.trim()),
          contactname: contactname.trim(),
          contactdiscord: contactdiscord.trim(),
          notes: notes.trim() || undefined,
          paymentproof: paymentproof.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error?.message ?? 'Gagal mendaftar.')
        return
      }
      setRegId(data.data?.id ?? '')
      setSuccess(true)
    } catch {
      setError('Koneksi gagal. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="text-primary/40 h-8 w-8 animate-spin" />
      </div>
    )

  // ── Auth gate ────────────────────────────────────────────────────────────
  if (!sessionUserId)
    return (
      <div className="mx-auto max-w-md space-y-5 px-4 py-20 text-center">
        <div className="bg-primary/10 border-primary/20 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border">
          <Swords className="text-primary/50 h-8 w-8" />
        </div>
        <div>
          <h1 className="text-xl font-black">Login Dulu!</h1>
          <p className="text-foreground/50 mt-2 text-sm">
            Kamu harus login untuk mendaftar event ini.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link
            href={`/login?next=/events/${slug}/daftar`}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-colors"
          >
            Login / Daftar
          </Link>
          <Link
            href={`/events/${slug}`}
            className="border-border/50 text-foreground/60 hover:text-foreground flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            Kembali
          </Link>
        </div>
      </div>
    )

  // ── Success ──────────────────────────────────────────────────────────────
  if (success)
    return (
      <div className="mx-auto max-w-xl space-y-6 px-4 py-16 text-center">
        <div className="relative mx-auto h-24 w-24">
          <div className="absolute inset-0 animate-ping rounded-full bg-green-500/20" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-green-500/40 bg-green-500/10">
            <Trophy className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-black text-green-400">Pendaftaran Terkirim!</h1>
          <p className="text-foreground/50 mt-2 text-sm">
            Tim <span className="text-foreground font-bold">{teamname}</span> sudah terdaftar.
          </p>
          {regId && (
            <p className="text-foreground/25 mt-1.5 font-mono text-[11px]">
              ID: {regId.slice(0, 8).toUpperCase()}
            </p>
          )}
        </div>
        <div className="mx-auto max-w-sm space-y-1.5 rounded-2xl border border-yellow-500/25 bg-yellow-500/5 px-5 py-4 text-left">
          <p className="text-xs font-black tracking-widest text-yellow-400/80 uppercase">
            Langkah Selanjutnya
          </p>
          <p className="text-foreground/60 text-sm leading-relaxed">
            Pendaftaranmu berstatus <span className="font-bold text-yellow-400">Pending</span> dan
            sedang ditinjau panitia. Kamu akan mendapat notifikasi via Discord setelah dikonfirmasi.
          </p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href={`/events/${slug}`}
            className="border-border/50 text-foreground/70 hover:text-foreground flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Event
          </Link>
          <Link
            href="/events"
            className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-colors"
          >
            Lihat Event Lain
          </Link>
        </div>
      </div>
    )

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="space-y-4">
        <nav className="text-muted-foreground/50 flex items-center gap-2 text-xs">
          <Link
            href="/"
            className="hover:text-muted-foreground flex items-center gap-1 transition-colors"
          >
            <Home className="h-3 w-3" /> Beranda
          </Link>
          <span>/</span>
          <Link href="/events" className="hover:text-muted-foreground transition-colors">
            Event
          </Link>
          <span>/</span>
          <Link
            href={`/events/${slug}`}
            className="hover:text-muted-foreground max-w-[120px] truncate transition-colors"
          >
            {event?.title ?? slug}
          </Link>
          <span>/</span>
          <span className="text-foreground/60">Daftar</span>
        </nav>

        <div className="border-primary/20 from-primary/12 via-primary/6 relative overflow-hidden rounded-2xl border bg-gradient-to-r to-transparent">
          <div className="relative flex items-center gap-4 px-5 py-4">
            <div className="bg-primary/20 border-primary/30 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border">
              <Swords className="text-primary h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-primary/60 text-[10px] font-black tracking-widest uppercase">
                Pendaftaran
              </p>
              <p className="truncate text-sm font-bold">{event?.title ?? '—'}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl px-5 py-3.5">
          <Steps current={step} />
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')}>
            <X className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════
          STEP 1: Info Tim
          ══════════════════════════════════════ */}
      {step === 1 && (
        <div className="glass-card space-y-5 rounded-3xl p-6">
          <div className="border-border/30 flex items-center gap-3 border-b pb-2">
            <div className="bg-primary/15 border-primary/25 flex h-9 w-9 items-center justify-center rounded-xl border">
              <Shield className="text-primary h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-black">Informasi Tim</h2>
              <p className="text-foreground/35 text-[11px]">Isi lengkap semua field yang wajib</p>
            </div>
          </div>

          {/* Nama Tim */}
          <div className="space-y-1.5">
            <Label required>Nama Tim</Label>
            <input
              value={teamname}
              onChange={(e) => setTeamname(e.target.value)}
              placeholder="Contoh: Soraku Esports"
              className={cn(
                inputCls,
                teamname.trim().length > 0 && teamname.trim().length < 2 && 'border-red-500/40'
              )}
            />
            {teamname.trim().length > 0 && teamname.trim().length < 2 && (
              <p className="text-[10px] text-red-400/70">Nama tim minimal 2 karakter</p>
            )}
          </div>

          {/* Logo Tim */}
          <ImageUrlInput
            label="Logo Tim"
            value={teamlogourl}
            onChange={setTeamlogourl}
            placeholder="https://cdn.example.com/logo.png"
            hint="Opsional · Paste URL atau upload gambar"
            compact
            icon={<Camera className="h-3 w-3" />}
            className="border-border/40 focus:border-primary/40 bg-black/30"
          />

          {/* Kontak PIC */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label required>Nama Kontak PIC</Label>
              <input
                value={contactname}
                onChange={(e) => setContactname(e.target.value)}
                placeholder="Nama kamu"
                className={cn(
                  inputCls,
                  !contactname.trim() && contactname !== '' && 'border-red-500/40'
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label required>Discord PIC</Label>
              <input
                value={contactdiscord}
                onChange={(e) => setContactdiscord(e.target.value)}
                placeholder="username (misal: soraku123)"
                className={cn(
                  inputCls,
                  !contactdiscord.trim() && contactdiscord !== '' && 'border-red-500/40'
                )}
              />
            </div>
          </div>

          {/* Catatan */}
          <div className="space-y-1.5">
            <Label>Catatan Tambahan</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="Opsional — ada yang ingin disampaikan ke panitia?"
              className="border-border/40 placeholder:text-foreground/15 focus:border-primary/40 focus:ring-primary/10 w-full resize-none rounded-xl border bg-black/30 px-4 py-3 text-sm transition-all outline-none focus:ring-1"
            />
          </div>

          {/* ── Bukti Pembayaran (hanya jika event berbayar) ── */}
          {event?.ispaid && (
            <div className="space-y-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/20">
                    <Upload className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-amber-400/90">
                      Screenshot Bukti Pembayaran <span className="text-red-400">*</span>
                    </p>
                    {event.price && (
                      <p className="text-[11px] text-amber-400/50">
                        Total: Rp {event.price.toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Metode pembayaran */}
              {event.paymentmethods && event.paymentmethods.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold tracking-widest text-amber-400/50 uppercase">
                    Bayar ke salah satu:
                  </p>
                  {event.paymentmethods.map((m, i) => {
                    const key = getPaymentKey(m)
                    const Icon = PAYMENT_ICON_MAP[key] as
                      | React.FC<{ className?: string }>
                      | undefined
                    if (m.type === 'qris')
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-xl border border-amber-500/15 bg-black/20 px-4 py-3"
                        >
                          {Icon ? (
                            <Icon className="h-7 w-auto flex-shrink-0" />
                          ) : (
                            <span className="flex-shrink-0 text-xs font-bold text-amber-400">
                              QRIS
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-foreground/80 text-sm font-bold">
                              {m.provider ?? 'QRIS'}
                            </p>
                            <p className="text-muted-foreground/50 text-[11px]">
                              Scan QRIS untuk bayar
                            </p>
                          </div>
                          {m.qrisImageUrl && (
                            <a
                              href={m.qrisImageUrl}
                              download
                              className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400 transition-colors hover:bg-amber-500/20"
                            >
                              ↓ QRIS
                            </a>
                          )}
                        </div>
                      )
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl border border-amber-500/15 bg-black/20 px-4 py-3"
                      >
                        {Icon ? (
                          <Icon className="h-7 w-auto flex-shrink-0" />
                        ) : (
                          <span className="border-border/40 bg-muted/20 text-muted-foreground/60 flex-shrink-0 rounded border px-2 py-1 text-[10px] font-bold uppercase">
                            {m.bank ?? m.provider ?? m.type}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground/80 truncate text-sm font-bold">
                            {m.account}
                          </p>
                          {m.name && (
                            <p className="text-muted-foreground/50 truncate text-[11px]">
                              a/n {m.name}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Upload area */}
              <div className="space-y-2">
                <label
                  className={cn(
                    'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition-all',
                    paymentproof
                      ? 'border-green-500/40 bg-green-500/5'
                      : 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50 hover:bg-amber-500/8'
                  )}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      if (file.size > 5 * 1024 * 1024) {
                        setError('Ukuran file maksimal 5MB.')
                        return
                      }
                      const url = await uploadImage(file)
                      if (url) {
                        setPaymentproof(url)
                        setError('')
                      } else setError('Gagal upload. Coba paste URL langsung di bawah.')
                    }}
                  />
                  {uploading ? (
                    <div className="flex items-center gap-2 text-sm text-amber-400/70">
                      <Loader2 className="h-5 w-5 animate-spin" /> Mengupload...
                    </div>
                  ) : paymentproof ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <CheckCircle2 className="h-7 w-7 text-green-400" />
                      <p className="text-sm font-bold text-green-400">Bukti terupload!</p>
                      <p className="text-foreground/30 text-[10px]">Klik untuk ganti</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      <Upload className="h-7 w-7 text-amber-400/50" />
                      <p className="text-sm font-semibold text-amber-400/80">
                        Klik untuk upload screenshot
                      </p>
                      <p className="text-foreground/30 text-[10px]">JPG, PNG, WebP — maks 5MB</p>
                    </div>
                  )}
                </label>

                {/* Preview gambar */}
                {paymentproof && (
                  <div className="relative overflow-hidden rounded-xl border border-green-500/25">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={paymentproof}
                      alt="Bukti bayar"
                      className="max-h-52 w-full bg-black/30 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setPaymentproof('')}
                      className="bg-background/90 text-muted-foreground hover:text-destructive absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg shadow-md transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {/* URL fallback */}
                <div className="flex items-center gap-2">
                  <div className="bg-border/30 h-px flex-1" />
                  <span className="text-foreground/25 text-[10px]">atau paste URL gambar</span>
                  <div className="bg-border/30 h-px flex-1" />
                </div>
                <input
                  type="text"
                  value={paymentproof}
                  onChange={(e) => setPaymentproof(e.target.value)}
                  placeholder="https://i.imgur.com/..."
                  className="placeholder:text-foreground/15 w-full rounded-xl border border-amber-500/20 bg-black/20 px-3 py-2 text-xs transition-all outline-none focus:border-amber-500/30"
                />
              </div>
            </div>
          )}

          {/* Validasi errors summary */}
          {!canGoStep2 && (teamname || contactname || contactdiscord || paymentproof) && (
            <div className="space-y-1 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
              {step1Errors.map((e, i) => (
                <p key={i} className="flex items-center gap-1.5 text-[11px] text-red-400/80">
                  <span className="h-1 w-1 flex-shrink-0 rounded-full bg-red-400/60" /> {e}
                </p>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                if (!canGoStep2) {
                  setError(step1Errors[0] ?? 'Lengkapi semua field yang wajib.')
                  return
                }
                setError('')
                setStep(2)
              }}
              className={cn(
                'flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all',
                canGoStep2
                  ? 'bg-primary shadow-primary/20 hover:bg-primary/90 text-white shadow-lg hover:-translate-y-0.5'
                  : 'bg-muted/20 text-foreground/30 cursor-not-allowed'
              )}
            >
              Lanjut ke Pemain <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          STEP 2: Pemain
          ══════════════════════════════════════ */}
      {step === 2 && (
        <div className="space-y-5">
          {/* Info ML */}
          {isML && (
            <div className="border-primary/20 bg-primary/5 flex items-start gap-3 rounded-xl border px-4 py-3">
              <Swords className="text-primary/60 mt-0.5 h-4 w-4 flex-shrink-0" />
              <div className="text-foreground/50 text-xs leading-relaxed">
                <span className="text-foreground/70 font-bold">Mobile Legends Tournament: </span>
                Wajib 5 pemain aktif. Gunakan IGN persis seperti yang tertera di akun Mobile
                Legends. Pemain cadangan bersifat opsional.
              </div>
            </div>
          )}

          {/* Pemain Aktif */}
          <div className="glass-card space-y-4 rounded-3xl p-6">
            <div className="border-border/30 flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-3">
                <div className="bg-primary/15 border-primary/25 flex h-9 w-9 items-center justify-center rounded-xl border">
                  <Users className="text-primary h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black">
                    Pemain Aktif
                    <span className="text-foreground/30 ml-2 text-[10px] font-normal">
                      {activeplayers.length}/10
                    </span>
                  </h2>
                  <p className="text-foreground/35 text-[11px]">
                    {isML ? 'Wajib 5 pemain · maks 10' : 'Min 1 pemain · maks 10'}
                  </p>
                </div>
              </div>
              {activeplayers.length < 10 && (
                <button
                  type="button"
                  onClick={() => setActiveplayers((prev) => [...prev, EMPTY_PLAYER()])}
                  className="border-primary/30 bg-primary/8 text-primary/80 hover:bg-primary/15 flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors"
                >
                  <Plus className="h-3 w-3" /> Tambah
                </button>
              )}
            </div>

            <div className="space-y-3">
              {activeplayers.map((p, i) => (
                <PlayerCard
                  key={i}
                  player={p}
                  index={i}
                  isReserve={false}
                  isML={isML}
                  onChange={(np) => updateActive(i, np)}
                  onRemove={() => setActiveplayers((prev) => prev.filter((_, idx) => idx !== i))}
                  canRemove={isML ? activeplayers.length > 5 : activeplayers.length > 1}
                />
              ))}
            </div>

            {unfilledPlayers > 0 && (
              <p className="text-center text-[11px] text-red-400/70">
                {unfilledPlayers} pemain belum diisi nama IGN-nya
              </p>
            )}
          </div>

          {/* Pemain Cadangan */}
          <div className="glass-card space-y-4 rounded-3xl p-6">
            <div className="border-border/30 flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-yellow-500/25 bg-yellow-500/15">
                  <UserPlus className="h-4 w-4 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-sm font-black">
                    Pemain Cadangan
                    <span className="text-foreground/30 ml-2 text-[10px] font-normal">
                      {reserveplayers.length}/5
                    </span>
                  </h2>
                  <p className="text-foreground/35 text-[11px]">Opsional · Maks 5</p>
                </div>
              </div>
              {reserveplayers.length < 5 && (
                <button
                  type="button"
                  onClick={() => setReserveplayers((prev) => [...prev, EMPTY_PLAYER()])}
                  className="flex items-center gap-1.5 rounded-xl border border-yellow-500/30 bg-yellow-500/8 px-3 py-1.5 text-xs font-bold text-yellow-400/80 transition-colors hover:bg-yellow-500/15"
                >
                  <Plus className="h-3 w-3" /> Tambah
                </button>
              )}
            </div>

            {reserveplayers.length === 0 ? (
              <div className="border-border/25 rounded-xl border border-dashed px-4 py-6 text-center">
                <p className="text-foreground/25 text-xs">Belum ada pemain cadangan</p>
                <p className="text-foreground/15 mt-0.5 text-[10px]">
                  Klik "Tambah" jika diperlukan
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reserveplayers.map((p, i) => (
                  <PlayerCard
                    key={i}
                    player={p}
                    index={i}
                    isReserve={true}
                    isML={isML}
                    onChange={(np) => updateReserve(i, np)}
                    onRemove={() => setReserveplayers((prev) => prev.filter((_, idx) => idx !== i))}
                    canRemove={true}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setError('')
                setStep(1)
              }}
              className="border-border/50 text-foreground/60 hover:text-foreground flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Kembali
            </button>
            <button
              onClick={() => {
                if (!canGoStep3) {
                  setError('Isi nama IGN semua pemain aktif terlebih dahulu.')
                  return
                }
                setError('')
                setStep(3)
              }}
              className={cn(
                'flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all',
                canGoStep3
                  ? 'bg-primary shadow-primary/20 text-white shadow-lg hover:-translate-y-0.5'
                  : 'bg-muted/20 text-foreground/30 cursor-not-allowed'
              )}
            >
              Preview <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          STEP 3: Preview
          ══════════════════════════════════════ */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="glass-card space-y-5 rounded-3xl p-6">
            <div className="border-border/30 flex items-center gap-3 border-b pb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-green-500/25 bg-green-500/15">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <h2 className="text-sm font-black">Review Pendaftaran</h2>
                <p className="text-foreground/35 text-[11px]">Cek kembali sebelum submit</p>
              </div>
            </div>

            {/* Tim */}
            <div className="border-border/40 rounded-2xl border bg-black/20 p-4">
              <div className="mb-3 flex items-center gap-3">
                {teamlogourl ? (
                  <div className="border-border/40 h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border">
                    <Image
                      src={teamlogourl}
                      alt="logo"
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                      onError={() => setTeamlogourl('')}
                    />
                  </div>
                ) : (
                  <div className="bg-primary/10 border-primary/20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border">
                    <Shield className="text-primary/50 h-5 w-5" />
                  </div>
                )}
                <div>
                  <p className="text-base font-black">{teamname}</p>
                  <p className="text-foreground/40 text-xs">
                    PIC: {contactname} · Discord: {contactdiscord}
                  </p>
                </div>
              </div>
            </div>

            {/* Pemain Aktif */}
            <div>
              <p className="text-primary/50 mb-2.5 text-[10px] font-black tracking-widest uppercase">
                Pemain Aktif ({activeplayers.filter((p) => p.name).length})
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {activeplayers
                  .filter((p) => p.name)
                  .map((p, i) => (
                    <div
                      key={i}
                      className="border-primary/15 bg-primary/5 flex items-center gap-2.5 rounded-xl border px-3 py-2.5"
                    >
                      <span className="bg-primary/20 text-primary flex h-5 w-5 items-center justify-center rounded-lg text-[10px] font-black">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold">{p.name}</p>
                        {p.role && <p className="text-foreground/35 text-[10px]">{p.role}</p>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Pemain Cadangan */}
            {reserveplayers.filter((p) => p.name).length > 0 && (
              <div>
                <p className="mb-2.5 text-[10px] font-black tracking-widest text-yellow-500/50 uppercase">
                  Pemain Cadangan ({reserveplayers.filter((p) => p.name).length})
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {reserveplayers
                    .filter((p) => p.name)
                    .map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 rounded-xl border border-yellow-500/15 bg-yellow-500/5 px-3 py-2.5"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-yellow-500/20 text-[10px] font-black text-yellow-400">
                          C{i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold">{p.name}</p>
                          {p.role && <p className="text-foreground/35 text-[10px]">{p.role}</p>}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Catatan */}
            {notes && (
              <div className="border-border/30 rounded-xl border bg-black/20 px-4 py-3">
                <p className="text-foreground/30 mb-1 text-[10px] font-black tracking-widest uppercase">
                  Catatan
                </p>
                <p className="text-foreground/60 text-xs whitespace-pre-wrap">{notes}</p>
              </div>
            )}

            {/* Bukti bayar */}
            {event?.ispaid && paymentproof && (
              <div className="space-y-2 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
                <p className="text-[10px] font-black tracking-widest text-amber-400/70 uppercase">
                  Bukti Pembayaran
                </p>
                <div className="relative overflow-hidden rounded-xl border border-amber-500/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={paymentproof}
                    alt="Bukti"
                    className="max-h-48 w-full bg-black/20 object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setError('')
                setStep(2)
              }}
              className="border-border/50 text-foreground/60 hover:text-foreground flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Kembali
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-primary hover:bg-primary/90 shadow-primary/25 flex items-center gap-2 rounded-xl px-7 py-2.5 text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trophy className="h-4 w-4" />
              )}
              {saving ? 'Mendaftarkan…' : 'Daftarkan Tim!'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
