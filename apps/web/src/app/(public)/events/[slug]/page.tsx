import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Wifi,
  ExternalLink,
  Swords,
  DollarSign,
  Tag,
  Download,
  QrCode,
  Clock,
  Users,
  Zap,
  Home,
  ChevronDown,
} from 'lucide-react'
import { EventPaymentSection } from './EventPaymentSection'
import { EventTracker } from './EventTracker'
import { db } from '@/lib/supabase/server'
import {
  BCAIcon,
  BRIIcon,
  BTNIcon,
  SeabankIcon,
  DanaIcon,
  QRISIcon,
  GopayIcon,
} from '@/components/icons/custom-icons'

export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ slug: string }> }

type PaymentMethod = {
  type: 'bank' | 'ewallet' | 'qris'
  bank?: string
  provider?: string
  account?: string
  name?: string
  qrisImageUrl?: string
  qrisUrl?: string
}

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

// ── Format tanggal WIB — TIDAK double-convert ──────────────
// Date disimpan dengan +07:00, jadi JS sudah tahu itu WIB
// Tampilkan langsung tanpa konversi timezone lagi
function formatWIB(dateStr: string): string {
  const d = new Date(dateStr)
  return (
    d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      // Tidak set timeZone agar pakai timezone yang sudah ada di date string
      // Jika date tersimpan dengan +07:00, JS akan konversi ke local yg benar
    }) + ' WIB'
  )
}

function formatShortWIB(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ── Status event: bandingkan UTC timestamps langsung ────────
function getEventStatus(startdate: string, enddate?: string | null) {
  const now = Date.now()
  const start = new Date(startdate).getTime()
  const end = enddate ? new Date(enddate).getTime() : null

  if (now < start) return 'upcoming' as const
  if (end && now > end) return 'ended' as const
  if (!end && now > start) return 'live' as const // No enddate = live forever
  return 'live' as const
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data } = await (await db())
    .from('events')
    .select('title,description,coverurl')
    .eq('slug', slug)
    .eq('ispublished', true)
    .single()
  if (!data) return { title: 'Event tidak ditemukan' }
  return {
    title: `${data.title} | Soraku Event`,
    description: (data.description ?? '').replace(/\n/g, ' ').slice(0, 160),
    openGraph: { images: data.coverurl ? [data.coverurl] : undefined },
  }
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params

  const { data: event } = await (await db())
    .from('events')
    .select(
      'id,slug,title,description,coverurl,startdate,enddate,location,isonline,tags,ispublished,registrationurl,gametype,ispaid,price,paymentmethods,registrationopen,priceinfo'
    )
    .eq('slug', slug)
    .eq('ispublished', true)
    .single()

  if (!event) notFound()

  const status = getEventStatus(event.startdate, event.enddate)
  const TypeIcon = event.isonline ? Wifi : MapPin
  const methods = ((event as any).paymentmethods as PaymentMethod[]) ?? []

  // Preserve newlines — split by single newline, empty line = <br>
  const descLines = (event.description ?? '').split(/\r?\n/).map((l: string) => l.trimEnd())

  const statusConfig = {
    upcoming: { label: 'Upcoming', cls: 'bg-primary/90 text-white', dot: 'bg-primary' },
    live: { label: 'Live', cls: 'bg-green-500/90 text-white', dot: 'bg-green-400' },
    ended: {
      label: 'Selesai',
      cls: 'bg-muted/60 text-muted-foreground',
      dot: 'bg-muted-foreground/40',
    },
  }[status]

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <EventTracker id={event.id} title={event.title} />

      {/* Breadcrumb */}
      <nav className="text-muted-foreground/50 mb-6 flex items-center gap-2 text-sm">
        <Link
          href="/"
          className="hover:text-muted-foreground flex items-center gap-1 transition-colors"
        >
          <Home className="h-3.5 w-3.5" /> Beranda
        </Link>
        <span>/</span>
        <Link href="/events" className="hover:text-muted-foreground transition-colors">
          Event
        </Link>
        <span>/</span>
        <span className="text-foreground/70 max-w-[180px] truncate">{event.title}</span>
      </nav>

      {/* ── Cover ── */}
      <div className="relative mb-6 h-56 overflow-hidden rounded-2xl shadow-xl sm:h-80">
        {event.coverurl ? (
          <Image
            src={event.coverurl}
            alt={event.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div
            className={`absolute inset-0 flex items-center justify-center ${
              status === 'upcoming'
                ? 'from-primary/25 via-accent/10 bg-gradient-to-br to-violet-500/15'
                : status === 'live'
                  ? 'bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/15'
                  : 'from-border/20 to-border/5 bg-gradient-to-br'
            }`}
          >
            <span className="text-8xl opacity-10">空</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        {/* Badges kiri atas */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {(event as any).ispaid ? (
            <span className="flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-300 backdrop-blur-sm">
              <DollarSign className="h-3 w-3" />
              {(event as any).price
                ? `Rp ${((event as any).price as number).toLocaleString('id-ID')}`
                : 'Berbayar'}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/20 px-3 py-1 text-xs font-black text-green-300 backdrop-blur-sm">
              ✦ Gratis
            </span>
          )}
          <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-bold text-white/80 backdrop-blur-sm">
            <TypeIcon className="h-3 w-3" />
            {event.isonline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Status badge kanan atas */}
        <div className="absolute top-3 right-3">
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black backdrop-blur-sm ${statusConfig.cls}`}
          >
            {status === 'live' ? (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
            ) : (
              <span className={`h-2 w-2 rounded-full ${statusConfig.dot}`} />
            )}
            {statusConfig.label}
          </span>
        </div>

        {/* Game type */}
        {(event as any).gametype && (
          <div className="absolute bottom-3 left-3">
            <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-bold tracking-widest text-white/80 uppercase backdrop-blur-sm">
              {(event as any).gametype === 'ml' ? 'Mobile Legends' : (event as any).gametype}
            </span>
          </div>
        )}
      </div>

      {/* ── LIVE bar ── */}
      {status === 'live' && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-500/25 bg-green-500/8 px-4 py-3">
          <span className="relative flex h-3 w-3 flex-shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
          </span>
          <div>
            <p className="text-sm font-black text-green-400">Event Sedang Berlangsung!</p>
            <p className="text-xs text-green-400/60">Pantau Discord Soraku untuk update terbaru</p>
          </div>
        </div>
      )}

      {/* ── Judul ── */}
      <h1 className="text-3xl leading-tight font-black sm:text-4xl">{event.title}</h1>

      {/* ── Tags ── */}
      {(event.tags ?? []).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(event.tags ?? []).map((t: string) => (
            <span
              key={t}
              className="border-border/50 bg-muted/20 text-muted-foreground/70 flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs"
            >
              <Tag className="h-2.5 w-2.5" />
              {t}
            </span>
          ))}
        </div>
      )}

      {/* ── Deskripsi — preserve newlines & paragraphs ── */}
      {descLines.length > 0 && (
        <div className="text-muted-foreground mt-5 text-sm leading-relaxed">
          {descLines.map((line: string, i: number) =>
            line === '' ? <div key={i} className="h-3" /> : <p key={i}>{line}</p>
          )}
        </div>
      )}

      {/* ── Info cards: waktu + lokasi ── */}
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {/* Mulai */}
        <div className="glass-card flex items-start gap-3 rounded-2xl p-4">
          <div className="bg-primary/15 border-primary/25 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border">
            <Calendar className="text-primary h-4 w-4" />
          </div>
          <div>
            <p className="text-muted-foreground/50 text-[10px] font-bold tracking-widest uppercase">
              Mulai
            </p>
            <p className="mt-0.5 text-sm leading-snug font-bold">
              {formatShortWIB(event.startdate)}
            </p>
            <p className="text-muted-foreground/40 mt-0.5 text-[10px]">WIB</p>
          </div>
        </div>

        {/* Selesai */}
        {event.enddate && (
          <div className="glass-card flex items-start gap-3 rounded-2xl p-4">
            <div className="bg-accent/15 border-accent/25 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border">
              <Clock className="text-accent h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground/50 text-[10px] font-bold tracking-widest uppercase">
                Selesai
              </p>
              <p className="mt-0.5 text-sm leading-snug font-bold">
                {formatShortWIB(event.enddate)}
              </p>
              <p className="text-muted-foreground/40 mt-0.5 text-[10px]">WIB</p>
            </div>
          </div>
        )}

        {/* Lokasi */}
        {event.location && (
          <div className="glass-card flex items-start gap-3 rounded-2xl p-4 sm:col-span-2">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-violet-500/25 bg-violet-500/15">
              <MapPin className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <p className="text-muted-foreground/50 text-[10px] font-bold tracking-widest uppercase">
                Lokasi
              </p>
              <p className="mt-0.5 text-sm font-bold">{event.location}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Payment Methods ── */}
      {(event as any).ispaid && methods.length > 0 && <EventPaymentSection methods={methods} />}

      {/* ── CTA Daftar ── */}
      {(status === 'upcoming' || status === 'live') && (
        <div className="glass-card mt-8 overflow-hidden rounded-2xl">
          <div className="from-primary/20 via-primary/8 border-border/40 border-b bg-gradient-to-r to-transparent px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/15 border-primary/25 flex h-9 w-9 items-center justify-center rounded-xl border">
                <Swords className="text-primary h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-black">
                  {status === 'live' ? 'Event Sedang Berlangsung' : 'Daftarkan Tim Kamu!'}
                </h2>
                <p className="text-muted-foreground/60 mt-0.5 text-xs">
                  {(event as any).registrationopen
                    ? 'Pendaftaran masih dibuka'
                    : 'Pendaftaran sudah ditutup'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
              {(event as any).gametype === 'ml'
                ? 'Siapkan 5 pemain terbaikmu dan daftarkan tim sekarang. Slot terbatas!'
                : 'Daftarkan diri dan dapatkan info lengkap di Discord Soraku.'}
            </p>
            <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
              {(event as any).registrationopen ? (
                <>
                  {(event as any).registrationurl ? (
                    <a
                      href={(event as any).registrationurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary hover:bg-primary/90 shadow-primary/20 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5"
                    >
                      <Swords className="h-4 w-4" /> Daftar Sekarang{' '}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (event as any).gametype === 'ml' ? (
                    <Link
                      href={`/events/${event.slug}/daftar`}
                      className="bg-primary hover:bg-primary/90 shadow-primary/20 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5"
                    >
                      <Swords className="h-4 w-4" /> Daftar Tim ML
                    </Link>
                  ) : (
                    <Link
                      href={`/events/${event.slug}/daftar`}
                      className="bg-primary hover:bg-primary/90 shadow-primary/20 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5"
                    >
                      <Swords className="h-4 w-4" /> Daftar Sekarang
                    </Link>
                  )}
                </>
              ) : (
                <span className="border-border/50 text-muted-foreground/60 flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold">
                  Pendaftaran Ditutup
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Ended ── */}
      {status === 'ended' && (
        <div className="glass-card border-border/40 mt-8 rounded-2xl border px-5 py-6 text-center">
          <p className="mb-3 text-3xl">🏆</p>
          <p className="text-base font-black">Event Telah Berakhir</p>
          <p className="text-muted-foreground/60 mt-1 mb-4 text-sm">
            Terima kasih kepada semua peserta yang sudah ikut!
          </p>
          <Link
            href="/events"
            className="border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Lihat event lainnya
          </Link>
        </div>
      )}
    </div>
  )
}
