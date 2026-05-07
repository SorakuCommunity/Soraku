import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Wifi, ArrowRight, Clock, DollarSign, Tag } from 'lucide-react'
import { db } from '@/lib/supabase/server'
import { formatEventDate } from '@/lib/utils'
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

export const metadata: Metadata = {
  title: 'Event | Soraku',
  description: 'Event, gathering, dan workshop Soraku Indonesia.',
}

const FILTERS = [
  { slug: 'Semua', emoji: '✨' },
  { slug: 'Online', emoji: '🌐' },
  { slug: 'Offline', emoji: '📍' },
]

type PaymentMethod = {
  type: 'bank' | 'ewallet' | 'qris'
  bank?: string
  provider?: string
  account?: string
  name?: string
  qrisImageUrl?: string
}

type EventRow = {
  id: string
  slug: string
  title: string
  description: string | null
  coverurl: string | null
  ispaid: boolean
  price: number | null
  startdate: string
  enddate: string | null
  location: string | null
  isonline: boolean
  tags: string[] | null
  gametype: string | null
  registrationopen: boolean
  paymentmethods: PaymentMethod[] | null
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
  if (m.type === 'ewallet') return (m.provider ?? '').toLowerCase()
  return ''
}

function PaymentIcons({ methods }: { methods: PaymentMethod[] }) {
  if (!methods.length) return null
  const shown = methods.slice(0, 4)
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {shown.map((m, i) => {
        const key = getPaymentKey(m)
        const Icon = PAYMENT_ICON_MAP[key]
        if (!Icon)
          return (
            <span
              key={i}
              className="border-border/40 bg-muted/20 text-muted-foreground/60 rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase"
            >
              {m.bank ?? m.provider ?? m.type}
            </span>
          )
        return <Icon key={i} className="h-5 w-auto opacity-90" />
      })}
      {methods.length > 4 && (
        <span className="text-muted-foreground/40 text-[10px]">+{methods.length - 4}</span>
      )}
    </div>
  )
}

function EventCard({ event }: { event: EventRow }) {
  const nowMs = Date.now()
  const startMs = new Date(event.startdate).getTime()
  const endMs = event.enddate ? new Date(event.enddate).getTime() : null
  const isUpcoming = startMs > nowMs
  const isLive = !isUpcoming && (!endMs || nowMs < endMs)
  const TypeIcon = event.isonline ? Wifi : MapPin
  const typeLabel = event.isonline ? 'Online' : 'Offline'
  const methods = event.paymentmethods ?? []

  const daysUntil = isUpcoming ? Math.ceil((startMs - nowMs) / (1000 * 60 * 60 * 24)) : null

  return (
    <Link
      href={`/events/${event.slug}`}
      className="glass-card group border-border/50 hover:border-primary/30 hover:shadow-primary/5 flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-44 overflow-hidden">
        {event.coverurl ? (
          <Image
            src={event.coverurl}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div
            className={`absolute inset-0 flex items-center justify-center ${isLive ? 'bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/15' : isUpcoming ? 'from-primary/25 via-accent/10 bg-gradient-to-br to-violet-500/15' : 'from-muted/40 to-muted/20 bg-gradient-to-br'}`}
          >
            <span className="text-[5rem] font-black opacity-[0.06] select-none">空</span>
          </div>
        )}
        <div className="from-background/70 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

        <div className="absolute top-3 left-3">
          {event.ispaid ? (
            <span className="flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/20 px-2.5 py-1 text-[11px] font-black text-amber-300 backdrop-blur-sm">
              <DollarSign className="h-3 w-3" />
              {event.price ? `Rp ${event.price.toLocaleString('id-ID')}` : 'Berbayar'}
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/15 px-2.5 py-1 text-[11px] font-black text-green-300 backdrop-blur-sm">
              <Tag className="h-3 w-3" /> Gratis
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <span
            className={`flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${isLive ? 'bg-green-500/90 text-white shadow-md shadow-green-500/30' : isUpcoming ? 'bg-primary shadow-primary/30 text-white shadow-md' : 'bg-muted/80 text-muted-foreground backdrop-blur-sm'}`}
          >
            {isLive ? (
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                Live
              </span>
            ) : isUpcoming ? (
              '🔥 Upcoming'
            ) : (
              '✓ Selesai'
            )}
          </span>
          <span className="bg-background/70 text-foreground/80 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium backdrop-blur-sm">
            <TypeIcon className="h-3 w-3" />
            {typeLabel}
          </span>
        </div>

        {isUpcoming && daysUntil !== null && daysUntil <= 7 && (
          <div className="border-accent/30 bg-accent/20 text-accent/90 absolute right-3 bottom-3 flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            {daysUntil === 0 ? 'Hari ini!' : `${daysUntil} hari lagi`}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="group-hover:text-primary line-clamp-2 leading-snug font-bold transition-colors">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-muted-foreground/70 mt-2 line-clamp-2 flex-1 text-sm leading-relaxed">
            {event.description}
          </p>
        )}

        {event.ispaid && methods.length > 0 && <PaymentIcons methods={methods} />}

        <div className="border-border/30 text-muted-foreground/60 mt-4 space-y-1 border-t pt-4 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="text-primary/40 h-3.5 w-3.5 flex-shrink-0" />
            {formatEventDate(event.startdate)}
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="text-primary/40 h-3.5 w-3.5 flex-shrink-0" />
              {event.location}
            </div>
          )}
        </div>

        {/* Tags bawah kanan + arrow */}
        <div className="mt-3 flex items-center justify-end gap-1.5">
          {(event.tags ?? []).slice(0, 3).map((t) => (
            <span
              key={t}
              className="border-border/40 bg-muted/30 text-muted-foreground/60 rounded-full border px-2 py-0.5 text-[10px]"
            >
              {t}
            </span>
          ))}
          <ArrowRight className="text-primary/50 group-hover:text-primary ml-1 h-3.5 w-3.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  )
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: Promise<{ filter?: string }>
}) {
  const params = await searchParams
  const activeFilter = params?.filter ?? 'Semua'
  const now = Date.now()

  let query = (await db())
    .from('events')
    .select(
      'id,slug,title,description,coverurl,startdate,enddate,location,isonline,tags,ispaid,price,gametype,registrationopen,paymentmethods'
    )
    .eq('ispublished', true)
    .order('startdate', { ascending: true })

  if (activeFilter === 'Online') query = query.eq('isonline', true)
  if (activeFilter === 'Offline') query = query.eq('isonline', false)

  const { data: allEvents } = await query
  const events = allEvents ?? []
  const upcoming = events.filter((e) => new Date(e.startdate).getTime() > now)
  const past = events.filter((e) => new Date(e.startdate).getTime() <= now).reverse()

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-primary/70 mb-3 text-xs font-bold tracking-widest uppercase">
          Komunitas
        </p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Event <span className="text-gradient">Soraku</span>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl text-sm">
          Nonton bareng, gathering, cosplay contest, dan workshop dari komunitas Soraku Indonesia.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        {FILTERS.map(({ slug, emoji }) => (
          <Link
            key={slug}
            href={slug === 'Semua' ? '/events' : `/events?filter=${slug}`}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${activeFilter === slug ? 'bg-primary shadow-primary/20 text-white shadow-md' : 'border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground border hover:-translate-y-0.5'}`}
          >
            <span>{emoji}</span>
            <span>{slug}</span>
          </Link>
        ))}
      </div>

      {upcoming.length > 0 && (
        <section className="mb-14">
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-lg font-black tracking-tight">Upcoming</h2>
            <span className="bg-primary/15 text-primary rounded-full px-2.5 py-0.5 text-xs font-bold">
              {upcoming.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => (
              <EventCard key={e.id} event={e as EventRow} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-muted-foreground/60 text-lg font-black tracking-tight">Selesai</h2>
            <span className="bg-muted/50 text-muted-foreground/40 rounded-full px-2.5 py-0.5 text-xs font-bold">
              {past.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 opacity-60 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((e) => (
              <EventCard key={e.id} event={e as EventRow} />
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <div className="py-20 text-center">
          <p className="mb-3 text-4xl">🗓️</p>
          <p className="text-muted-foreground">Belum ada event dengan filter ini.</p>
        </div>
      )}
    </div>
  )
}
