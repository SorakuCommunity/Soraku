import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Wifi, ArrowRight, DollarSign, Tag, Sparkles } from 'lucide-react'
import { db } from '@/lib/supabase/server'
import { formatEventDate } from '@/lib/utils'
import { CountdownTimer } from '@/components/events/countdown-timer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Events | Soraku',
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

function EventCard({ event }: { event: EventRow }) {
  const nowMs = Date.now()
  const startMs = new Date(event.startdate).getTime()
  const endMs = event.enddate ? new Date(event.enddate).getTime() : null
  const isUpcoming = startMs > nowMs
  const isLive = !isUpcoming && (!endMs || nowMs < endMs)
  const TypeIcon = event.isonline ? Wifi : MapPin
  const typeLabel = event.isonline ? 'Online' : 'Offline'
  const daysUntil = isUpcoming ? Math.ceil((startMs - nowMs) / (1000 * 60 * 60 * 24)) : null

  const statusColor = isLive ? '#22C55E' : isUpcoming ? '#3B82F6' : '#64748B'

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-md border-2 border-white/[0.07] bg-card shadow-[4px_4px_0px_rgba(37,99,235,0.12)] transition-all duration-200 hover:scale-[1.02] hover:border-primary/30 hover:shadow-[6px_6px_0px_rgba(37,99,235,0.25)]"
    >
      <div className="relative h-40 overflow-hidden border-b-2 border-white/[0.07]">
        {event.coverurl ? (
          <Image
            src={event.coverurl}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 via-card to-muted/20">
            <span className="text-[4rem] font-black opacity-[0.06] select-none">空</span>
          </div>
        )}
        <div className="from-background/60 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

        <div className="absolute top-2 left-2 flex gap-1.5">
          {event.ispaid ? (
            <span className="flex items-center gap-1 rounded-sm border-2 border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[10px] font-black text-amber-400">
              <DollarSign className="h-3 w-3" />
              {event.price ? `Rp ${event.price.toLocaleString('id-ID')}` : 'Berbayar'}
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-sm border-2 border-green-500/30 bg-green-500/15 px-2 py-0.5 text-[10px] font-black text-green-400">
              <Tag className="h-3 w-3" /> Gratis
            </span>
          )}
          <span className="flex items-center gap-1 rounded-sm border-2 border-white/[0.12] bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white/80">
            <TypeIcon className="h-3 w-3" />
            {typeLabel}
          </span>
        </div>

        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <span
            className="rounded-sm border-2 px-2 py-0.5 text-[10px] font-bold"
            style={{
              borderColor: `${statusColor}40`,
              backgroundColor: `${statusColor}20`,
              color: statusColor,
            }}
          >
            {isLive ? (
              <span className="flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                Live
              </span>
            ) : isUpcoming ? (
              'Upcoming'
            ) : (
              'Selesai'
            )}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-sm font-black leading-snug text-foreground group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-muted-foreground/70 mt-2 line-clamp-2 flex-1 text-xs leading-relaxed">
            {event.description}
          </p>
        )}

        <div className="text-muted-foreground/50 mt-4 space-y-1 border-t border-white/[0.06] pt-3 text-[11px]">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#3B82F6' }} />
            {formatEventDate(event.startdate)}
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#3B82F6' }} />
              {event.location}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {(event.tags ?? []).slice(0, 2).map((t) => (
              <span
                key={t}
                className="rounded-sm border-2 border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground/60"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {isUpcoming && <CountdownTimer targetDate={event.startdate} />}
            <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-primary/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
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
      {/* Header */}
      <div className="mb-10">
        <p className="text-primary mb-3 text-xs font-bold tracking-widest uppercase">
          — Komunitas
        </p>
        <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          Events <span className="text-primary">Soraku</span>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
          Nonton bareng, gathering, cosplay contest, dan workshop dari komunitas Soraku Indonesia.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10 flex flex-wrap gap-2">
        {FILTERS.map(({ slug, emoji }) => (
          <Link
            key={slug}
            href={slug === 'Semua' ? '/events' : `/events?filter=${slug}`}
            className={`rounded-sm border-2 px-4 py-1.5 text-xs font-bold transition-all ${
              activeFilter === slug
                ? 'border-primary bg-primary text-primary-foreground shadow-[2px_2px_0px_rgba(37,99,235,0.3)]'
                : 'border-white/[0.12] text-muted-foreground hover:border-primary/40 hover:text-foreground hover:shadow-[2px_2px_0px_rgba(37,99,235,0.1)]'
            }`}
          >
            <span className="mr-1.5">{emoji}</span>
            {slug}
          </Link>
        ))}
      </div>

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <section className="mb-14">
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-base font-black tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Upcoming
            </h2>
            <span className="rounded-sm border-2 border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
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

      {/* Past Events */}
      {past.length > 0 && (
        <section>
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-muted-foreground/60 text-base font-black tracking-tight">
              Selesai
            </h2>
            <span className="rounded-sm border-2 border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] font-bold text-muted-foreground/40">
              {past.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((e) => (
              <EventCard key={e.id} event={e as EventRow} />
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <div className="py-20 text-center">
          <p className="mb-3 text-4xl">🗓️</p>
          <p className="text-muted-foreground text-sm">Belum ada event dengan filter ini.</p>
        </div>
      )}
    </div>
  )
}
