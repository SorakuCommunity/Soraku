'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Eye,
  Loader2,
  Plus,
  X,
  Wifi,
  MapPin,
  Gamepad2,
  Swords,
  CreditCard,
  Upload,
  Trash2,
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

type PaymentMethod =
  | { type: 'bank'; bank: string; account: string; name: string }
  | { type: 'ewallet'; provider: string; account: string; name: string }
  | { type: 'qris'; provider: string; qrisImageUrl: string; qrisUrl: string }

// ─── Constants ─────────────────────────────────────────────────────────────

const GAME_OPTIONS = [
  { value: '', label: 'Pilih game / tipe event', emoji: '🎮', desc: '' },
  {
    value: 'ml',
    label: 'Mobile Legends: Bang Bang',
    emoji: '⚔️',
    desc: 'Pendaftaran tim ML tersedia',
  },
  { value: 'valorant', label: 'Valorant', emoji: '🔫', desc: '' },
  { value: 'freefire', label: 'Free Fire', emoji: '🔥', desc: '' },
  { value: 'pubg', label: 'PUBG Mobile', emoji: '🪖', desc: '' },
  { value: 'chess', label: 'Catur / Chess', emoji: '♟️', desc: '' },
  { value: 'other', label: 'Lainnya / Umum', emoji: '🎲', desc: '' },
] as const

type GameValue = '' | 'ml' | 'valorant' | 'freefire' | 'pubg' | 'chess' | 'other'

const BANK_OPTIONS = ['BCA', 'BRI', 'BTN', 'Seabank']
const EWALLET_OPTIONS = ['Dana']
const QRIS_OPTIONS = ['GoPay', 'QRIS Umum']

const PAYMENT_ICONS: Record<string, React.FC<{ className?: string }>> = {
  BCA: BCAIcon,
  BRI: BRIIcon,
  BTN: BTNIcon,
  Seabank: SeabankIcon,
  Dana: DanaIcon,
  GoPay: GopayIcon,
  'QRIS Umum': QRISIcon,
}

// ─── Payment Method Card ────────────────────────────────────────────────────

function PaymentMethodCard({
  method,
  index,
  onRemove,
  onChange,
  uploading,
  onUploadQris,
}: {
  method: PaymentMethod
  index: number
  onRemove: () => void
  onChange: (m: PaymentMethod) => void
  uploading: boolean
  onUploadQris: (file: File, index: number) => void
}) {
  const fieldCls =
    'w-full rounded-xl border border-border/60 bg-black/30 px-3 py-2.5 text-sm outline-none placeholder:text-foreground/15 focus:border-primary/60 focus:ring-1 focus:ring-primary/10 transition-all'

  if (method.type === 'qris') {
    const Icon = PAYMENT_ICONS[method.provider] ?? QRISIcon
    return (
      <div className="border-border/40 bg-card/30 space-y-3 rounded-2xl border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-6 w-auto" />
            <span className="text-foreground/70 text-xs font-bold">{method.provider}</span>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-400/60 transition-colors hover:bg-red-500/20 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <div>
          <label className="text-foreground/30 mb-1.5 block text-[10px] font-bold tracking-widest uppercase">
            Upload QRIS Image *
          </label>
          <label
            className={cn(
              'flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed py-5 transition-all',
              method.qrisImageUrl
                ? 'border-green-500/30 bg-green-500/5'
                : 'border-primary/25 bg-primary/5 hover:border-primary/40'
            )}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) onUploadQris(f, index)
              }}
            />
            {uploading ? (
              <div className="text-primary/60 flex items-center gap-2 text-xs">
                <Loader2 className="h-4 w-4 animate-spin" /> Mengupload...
              </div>
            ) : method.qrisImageUrl ? (
              <div className="flex flex-col items-center gap-1">
                <QRISIcon className="h-10 w-auto opacity-60" />
                <p className="text-xs font-bold text-green-400">QRIS terupload! Klik ganti</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Upload className="text-primary/40 h-5 w-5" />
                <p className="text-foreground/40 text-xs">Klik untuk upload QRIS</p>
              </div>
            )}
          </label>
          {method.qrisImageUrl && (
            <div className="border-border/40 relative mt-2 overflow-hidden rounded-xl border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={method.qrisImageUrl}
                alt="QRIS"
                className="max-h-32 w-full bg-black/10 object-contain"
              />
              <button
                type="button"
                onClick={() => onChange({ ...method, qrisImageUrl: '' })}
                className="bg-background/80 hover:text-destructive absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-lg text-xs transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Bank / E-wallet
  const name = method.type === 'bank' ? method.bank : method.provider
  const Icon = PAYMENT_ICONS[name] ?? CreditCard
  const labelStr = method.type === 'bank' ? 'Bank' : 'E-Wallet'

  return (
    <div className="border-border/40 bg-card/30 space-y-3 rounded-2xl border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-6 w-auto" />
          <span className="text-foreground/70 text-xs font-bold">
            {name} — {labelStr}
          </span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-400/60 transition-colors hover:bg-red-500/20 hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-foreground/30 mb-1 block text-[10px] font-bold tracking-widest uppercase">
            Nomor Rekening / Akun
          </label>
          <input
            value={method.account}
            onChange={(e) => onChange({ ...method, account: e.target.value } as PaymentMethod)}
            placeholder={method.type === 'bank' ? '1234567890' : '081234567890'}
            className={fieldCls}
          />
        </div>
        <div>
          <label className="text-foreground/30 mb-1 block text-[10px] font-bold tracking-widest uppercase">
            Nama Pemilik
          </label>
          <input
            value={method.name}
            onChange={(e) => onChange({ ...method, name: e.target.value } as PaymentMethod)}
            placeholder="Nama a/n rekening"
            className={fieldCls}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminEventNewPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [coverurl, setCoverurl] = useState('')
  const [startdate, setStartdate] = useState('')
  const [enddate, setEnddate] = useState('')
  const [isonline, setIsonline] = useState(true)
  const [location, setLocation] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [regUrl, setRegUrl] = useState('')
  const [ispaid, setIspaid] = useState(false)
  const [price, setPrice] = useState('')
  const [gametype, setGametype] = useState<GameValue>('')
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [addingType, setAddingType] = useState<'bank' | 'ewallet' | 'qris' | null>(null)

  const selectedGame = GAME_OPTIONS.find((g) => g.value === gametype)

  const handleTitle = (v: string) => {
    setTitle(v)
    setSlug(
      v
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    )
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput('')
  }

  const uploadQris = async (file: File, index: number) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('bucket', 'events')
      fd.append('folder', 'qris')
      const res = await fetch('/api/upload/image', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok || !data?.data?.url) {
        setError('Gagal upload QRIS image.')
        return
      }
      const url = data.data.url
      setPaymentMethods((prev) =>
        prev.map((m, i) => (i === index && m.type === 'qris' ? { ...m, qrisImageUrl: url } : m))
      )
    } catch {
      setError('Gagal upload QRIS.')
    } finally {
      setUploading(false)
    }
  }

  const addPaymentMethod = (option: string, type: 'bank' | 'ewallet' | 'qris') => {
    if (type === 'qris') {
      setPaymentMethods((prev) => [
        ...prev,
        { type: 'qris', provider: option, qrisImageUrl: '', qrisUrl: '' },
      ])
    } else if (type === 'bank') {
      setPaymentMethods((prev) => [...prev, { type: 'bank', bank: option, account: '', name: '' }])
    } else {
      setPaymentMethods((prev) => [
        ...prev,
        { type: 'ewallet', provider: option, account: '', name: '' },
      ])
    }
    setAddingType(null)
  }

  const handleSubmit = async (publish: boolean) => {
    if (!title.trim() || !slug.trim() || !startdate) {
      setError('Judul, slug, dan tanggal mulai wajib diisi.')
      return
    }
    setLoading(true)
    setError(null)

    const res = await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        coverurl: coverurl.trim() || undefined,
        startdate: startdate ? startdate + ':00+07:00' : startdate,
        enddate: enddate ? enddate + ':00+07:00' : undefined,
        isonline,
        location: !isonline ? location.trim() || undefined : undefined,
        tags,
        registrationurl: regUrl.trim() || undefined,
        ispaid,
        price: ispaid && price ? parseInt(price) : 0,
        paymentmethods: ispaid ? paymentMethods : [],
        gametype: gametype || undefined,
        ispublished: publish,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data?.error?.message ?? 'Gagal menyimpan event.')
      setLoading(false)
      return
    }
    router.push('/admin/events')
  }

  const fieldCls =
    'w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40'

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/events"
            className="border-border text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-xl border transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Buat Event Baru</h1>
            <p className="text-muted-foreground mt-0.5 text-xs">Event · Admin Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="border-border text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}{' '}
            Draft
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-colors disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}{' '}
            Publish
          </button>
        </div>
      </div>

      {error && (
        <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-xl border px-4 py-3 text-sm">
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)}>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="space-y-4">
        {/* Game Type */}
        <div className="glass-card space-y-3 p-5">
          <div className="mb-1 flex items-center gap-2">
            <Gamepad2 className="text-primary h-4 w-4" />
            <label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              Tipe Game / Event
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {GAME_OPTIONS.slice(1).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setGametype(opt.value as GameValue)}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all',
                  gametype === opt.value
                    ? 'border-primary/50 bg-primary/10 text-primary shadow-sm'
                    : 'border-border text-muted-foreground hover:border-border hover:bg-muted/30'
                )}
              >
                <span className="text-base leading-none">{opt.emoji}</span>
                <span className="truncate text-xs font-semibold">{opt.label}</span>
              </button>
            ))}
          </div>
          {gametype === 'ml' && (
            <div className="border-primary/25 bg-primary/8 flex items-center gap-2.5 rounded-xl border px-3.5 py-3">
              <Swords className="text-primary h-4 w-4 flex-shrink-0" />
              <div>
                <p className="text-primary text-xs font-bold">Form Pendaftaran Tim ML Aktif</p>
                <p className="text-muted-foreground/60 mt-0.5 text-[11px]">
                  Peserta bisa daftar lewat{' '}
                  <code className="text-primary/70">/events/{slug || '[slug]'}/daftar</code>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Judul & Slug */}
        <div className="glass-card space-y-4 p-5">
          <div>
            <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wide uppercase">
              Nama Event <span className="text-destructive">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => handleTitle(e.target.value)}
              placeholder="Nama event..."
              className={fieldCls}
            />
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wide uppercase">
              Slug <span className="text-destructive">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground/50 text-xs">/events/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-event"
                className={cn(fieldCls, 'flex-1 font-mono')}
              />
            </div>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="glass-card p-5">
          <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wide uppercase">
            Deskripsi
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Deskripsi event..."
            className={cn(fieldCls, 'resize-none')}
          />
        </div>

        {/* Tanggal & Tipe */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card space-y-3 p-5">
            <label className="text-muted-foreground block text-xs font-semibold tracking-wide uppercase">
              Tanggal <span className="text-destructive">*</span>
            </label>
            <div>
              <p className="text-muted-foreground/60 mb-1 text-xs">Mulai</p>
              <input
                type="datetime-local"
                value={startdate}
                onChange={(e) => setStartdate(e.target.value)}
                className={fieldCls}
              />
            </div>
            <div>
              <p className="text-muted-foreground/60 mb-1 text-xs">Selesai (opsional)</p>
              <input
                type="datetime-local"
                value={enddate}
                onChange={(e) => setEnddate(e.target.value)}
                className={fieldCls}
              />
            </div>
          </div>
          <div className="glass-card space-y-3 p-5">
            <label className="text-muted-foreground block text-xs font-semibold tracking-wide uppercase">
              Tipe Event
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsonline(true)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors',
                  isonline
                    ? 'border-primary/50 bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:bg-primary/5'
                )}
              >
                <Wifi className="h-4 w-4" /> Online
              </button>
              <button
                onClick={() => setIsonline(false)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors',
                  !isonline
                    ? 'border-green-500/50 bg-green-500/10 text-green-400'
                    : 'border-border text-muted-foreground hover:bg-green-500/5'
                )}
              >
                <MapPin className="h-4 w-4" /> Offline
              </button>
            </div>
            {!isonline && (
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Nama lokasi / alamat..."
                className={fieldCls}
              />
            )}
          </div>
        </div>

        {/* Link Pendaftaran */}
        <div className="glass-card p-5">
          <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wide uppercase">
            Link Pendaftaran Eksternal{' '}
            <span className="text-muted-foreground/40 font-normal normal-case">(opsional)</span>
          </label>
          <input
            type="url"
            value={regUrl}
            onChange={(e) => setRegUrl(e.target.value)}
            placeholder="https://forms.gle/... atau link pendaftaran lain"
            className={fieldCls}
          />
          <p className="text-muted-foreground/40 mt-1.5 text-[11px]">
            {gametype === 'ml'
              ? 'Kosongkan untuk menggunakan form pendaftaran tim ML bawaan Soraku.'
              : 'Isi jika punya form pendaftaran eksternal.'}
          </p>
        </div>

        {/* Free / Berbayar + Payment Methods */}
        <div className="glass-card space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              Biaya Pendaftaran
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIspaid(false)
                  setPaymentMethods([])
                }}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${!ispaid ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-border text-muted-foreground hover:bg-muted/30'}`}
              >
                🎟️ Gratis
              </button>
              <button
                type="button"
                onClick={() => setIspaid(true)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${ispaid ? 'border-amber-500/50 bg-amber-500/10 text-amber-400' : 'border-border text-muted-foreground hover:bg-muted/30'}`}
              >
                💰 Berbayar
              </button>
            </div>
          </div>

          {ispaid && (
            <div className="space-y-4 pt-1">
              <div>
                <label className="text-muted-foreground/60 mb-1 block text-xs">
                  Harga (Rupiah)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="50000"
                  min="0"
                  className={fieldCls}
                />
              </div>

              {/* Payment Methods Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                    <CreditCard className="h-3.5 w-3.5" /> Metode Pembayaran
                  </label>
                  {!addingType && (
                    <button
                      type="button"
                      onClick={() => setAddingType('bank')}
                      className="border-primary/30 bg-primary/8 text-primary/80 hover:bg-primary/15 flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors"
                    >
                      <Plus className="h-3 w-3" /> Tambah
                    </button>
                  )}
                </div>

                {/* Existing methods */}
                {paymentMethods.length > 0 && (
                  <div className="space-y-2">
                    {paymentMethods.map((m, i) => (
                      <PaymentMethodCard
                        key={i}
                        method={m}
                        index={i}
                        onRemove={() =>
                          setPaymentMethods((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        onChange={(updated) =>
                          setPaymentMethods((prev) =>
                            prev.map((pm, idx) => (idx === i ? updated : pm))
                          )
                        }
                        uploading={uploading}
                        onUploadQris={uploadQris}
                      />
                    ))}
                  </div>
                )}

                {/* Add method selector */}
                {addingType && (
                  <div className="border-primary/20 bg-primary/5 space-y-3 rounded-2xl border p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-primary/70 text-xs font-bold tracking-widest uppercase">
                        Tambah Metode Pembayaran
                      </p>
                      <button
                        type="button"
                        onClick={() => setAddingType(null)}
                        className="text-muted-foreground/40 hover:text-foreground flex h-6 w-6 items-center justify-center rounded-lg transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Bank */}
                    <div>
                      <p className="text-muted-foreground/40 mb-2 text-[10px] font-black tracking-widest uppercase">
                        Bank Transfer
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {BANK_OPTIONS.map((bank) => {
                          const Icon = PAYMENT_ICONS[bank] ?? CreditCard
                          return (
                            <button
                              key={bank}
                              type="button"
                              onClick={() => addPaymentMethod(bank, 'bank')}
                              className="border-border/60 bg-card/40 hover:border-primary/40 hover:bg-primary/5 flex items-center gap-2 rounded-xl border px-3 py-2 transition-all"
                            >
                              <Icon className="h-6 w-auto" />
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* E-Wallet */}
                    <div>
                      <p className="text-muted-foreground/40 mb-2 text-[10px] font-black tracking-widest uppercase">
                        E-Wallet
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {EWALLET_OPTIONS.map((ew) => {
                          const Icon = PAYMENT_ICONS[ew] ?? CreditCard
                          return (
                            <button
                              key={ew}
                              type="button"
                              onClick={() => addPaymentMethod(ew, 'ewallet')}
                              className="border-border/60 bg-card/40 hover:border-primary/40 hover:bg-primary/5 flex items-center gap-2 rounded-xl border px-3 py-2 transition-all"
                            >
                              <Icon className="h-6 w-auto" />
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* QRIS */}
                    <div>
                      <p className="text-muted-foreground/40 mb-2 text-[10px] font-black tracking-widest uppercase">
                        QRIS
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {QRIS_OPTIONS.map((q) => {
                          const Icon = PAYMENT_ICONS[q] ?? QRISIcon
                          return (
                            <button
                              key={q}
                              type="button"
                              onClick={() => addPaymentMethod(q, 'qris')}
                              className="border-border/60 bg-card/40 hover:border-primary/40 hover:bg-primary/5 flex items-center gap-2 rounded-xl border px-3 py-2 transition-all"
                            >
                              <Icon className="h-7 w-auto" />
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethods.length === 0 && !addingType && (
                  <div className="border-border/30 rounded-xl border border-dashed px-4 py-5 text-center">
                    <p className="text-foreground/25 text-xs">Belum ada metode pembayaran</p>
                    <p className="text-foreground/15 mt-1 text-[11px]">
                      Klik "Tambah" untuk menambahkan Bank, E-Wallet, atau QRIS
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cover + Tags */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card p-5">
            <ImageUrlInput
              label="Cover / Banner"
              value={coverurl}
              onChange={setCoverurl}
              placeholder="https://... atau paste gambar langsung"
              hint="Rekomendasi: 1280×360px. Paste URL, drag & drop, atau Ctrl+V."
              previewClass="h-28"
              required={false}
            />
          </div>
          <div className="glass-card p-5">
            <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wide uppercase">
              Tags
            </label>
            <div className="mb-3 flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Tambah tag..."
                className={cn(fieldCls, 'flex-1')}
              />
              <button
                onClick={addTag}
                className="bg-primary/10 text-primary hover:bg-primary/20 flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t: string) => (
                <span
                  key={t}
                  className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs"
                >
                  {t}
                  <button onClick={() => setTags(tags.filter((x) => x !== t))}>
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
