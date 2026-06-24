'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, Users, MapPin, Wifi, ChevronRight } from 'lucide-react'
import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, type Variants } from 'framer-motion'

interface EventItem {
  id: string; slug: string; title: string; coverurl: string | null
  startdate: string; enddate: string | null; isonline: boolean; tags: string[]; status: string
}

const CATEGORY_EVENTS = ['Workshop', 'Webinar', 'Hackathon', 'Competition', 'Meetup', 'Community Event']
const getCategory = (tags?: string[]) => {
  if (!tags?.length) return 'Community Event'
  const match = CATEGORY_EVENTS.find((c) => tags.some((t) => t.toLowerCase().includes(c.toLowerCase())))
  return match ?? tags[0]
}
const getStatus = (start: string, end: string | null): 'registration' | 'soon' | 'live' | 'ended' => {
  const now = Date.now()
  const s = new Date(start).getTime()
  const e = end ? new Date(end).getTime() : null
  if (e && now > e) return 'ended'
  if (now >= s) return 'live'
  const days = (s - now) / (1000 * 60 * 60 * 24)
  if (days <= 7) return 'soon'
  return 'registration'
}
const STATUS_META = {
  registration: { label: 'Registration Open', color: '#22C55E', bg: 'bg-green-500/15', border: 'border-green-500/30' },
  soon: { label: 'Starting Soon', color: '#F59E0B', bg: 'bg-amber-500/15', border: 'border-amber-500/30' },
  live: { label: 'Live Now', color: '#EF4444', bg: 'bg-red-500/15', border: 'border-red-500/30' },
  ended: { label: 'Ended', color: '#64748B', bg: 'bg-white/5', border: 'border-white/[0.06]' },
}
const SEED = (id: string) => {
  let h = 0; for (let i = 0; i < id.length; i++) h = ((h << 5) - h) + id.charCodeAt(i)
  return Math.abs(h)
}

const DIRS = [{ x: -40, y: 0 }, { x: 0, y: -40 }, { x: 40, y: 0 }, { x: 0, y: 40 }, { x: -20, y: 20 }, { x: 20, y: -20 }]
const containerV: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const itemV: Variants = {
  hidden: (d: any) => ({ opacity: 0, x: d?.x ?? 0, y: d?.y ?? 0 }),
  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

function EventCountdown({ target }: { target: string }) {
  const [r, setR] = useState(target ? Math.max(0, new Date(target).getTime() - Date.now()) : 0)
  useEffect(() => {
    const t = setInterval(() => setR(Math.max(0, new Date(target).getTime() - Date.now())), 1000)
    return () => clearInterval(t)
  }, [target])
  const d = Math.floor(r / 86400000)
  const h = Math.floor((r % 86400000) / 3600000)
  const m = Math.floor((r % 3600000) / 60000)
  const s = Math.floor((r % 60000) / 1000)
  if (r <= 0) return null
  return (
    <div className="flex items-center gap-1 text-[10px] font-black tabular-nums tracking-tight">
      {d > 0 && <><span className="text-foreground/90">{d}d</span><span className="text-muted-foreground/30">:</span></>}
      <span className="text-foreground/90">{String(h).padStart(2, '0')}h</span>
      <span className="text-muted-foreground/30">:</span>
      <span className="text-primary">{String(m).padStart(2, '0')}m</span>
      <span className="text-muted-foreground/30">:</span>
      <span className="text-foreground/60">{String(s).padStart(2, '0')}s</span>
    </div>
  )
}

function fmtDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}
function fmtDateFull(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function EventsSection({ events, loading }: { events: EventItem[]; loading: boolean }) {
  const [slide, setSlide] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchX = useRef(0)
  const [paused, setPaused] = useState(false)
  const limited = events.slice(0, 6)
  const featured = limited[0]
  const secondary = limited.slice(1, 3)
  const compact = limited.slice(3, 6)

  const goTo = useCallback((i: number) => setSlide(((i % limited.length) + limited.length) % limited.length), [limited.length])

  useEffect(() => {
    if (paused || limited.length <= 1) return
    timerRef.current = setInterval(() => goTo(slide + 1), 12000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [slide, paused, limited.length, goTo])

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {[1,2,3,4].map((i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-sm border-2 border-white/[0.04] bg-white/[0.03]" />
        ))}
      </div>
    )
  }
  if (!events.length) {
    return (
      <div className="rounded-md border-2 border-white/[0.07] bg-card py-14 text-center shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
        <Calendar className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground/50">Belum ada event</p>
      </div>
    )
  }

  const renderCard = (ev: EventItem, type: 'featured' | 'secondary' | 'compact') => {
    const status = getStatus(ev.startdate, ev.enddate)
    const meta = STATUS_META[status]
    const cat = getCategory(ev.tags)
    const participants = 20 + (SEED(ev.id) % 180)
    const isBig = type === 'featured'
    const isMid = type === 'secondary'

    return (
      <Link
        href={`/events/${ev.slug}`}
        className={`group relative overflow-hidden rounded-md border-2 bg-card transition-all duration-[250ms] ease-out hover:-translate-y-0.5 ${
          isBig ? 'border-primary/20 shadow-[4px_4px_0px_rgba(37,99,235,0.2)] hover:border-primary/40 hover:shadow-[6px_6px_0px_rgba(37,99,235,0.35)]' : 'border-white/[0.07] shadow-[3px_3px_0px_rgba(37,99,235,0.1)] hover:border-primary/30 hover:shadow-[5px_5px_0px_rgba(37,99,235,0.25)]'
        }`}
      >
        {/* Banner */}
        <div className={`relative overflow-hidden ${isBig ? 'h-56 sm:h-64' : isMid ? 'h-32' : 'h-24'}`}>
          {ev.coverurl ? (
            <Image src={ev.coverurl} alt={ev.title} fill className="object-cover transition-transform duration-[250ms] group-hover:scale-105" unoptimized sizes={isBig ? '(max-width:1024px)100vw,66vw' : '33vw'} />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-card to-accent/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Status badge */}
          <span className={`absolute top-2.5 left-2.5 rounded-sm border-2 px-2 py-0.5 text-[9px] font-black ${meta.bg} ${meta.border}`} style={{ color: meta.color }}>
            {status === 'live' && <span className="mr-1 inline-block h-1.5 w-1.5 animate-ping rounded-full bg-white" />}
            {meta.label}
          </span>

          {/* Participant count */}
          <span className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-sm border-2 border-white/[0.08] bg-black/40 px-2 py-0.5 text-[9px] font-bold text-white/70">
            <Users className="h-2.5 w-2.5" />
            {participants}
          </span>

          {/* Date badge */}
          {isBig && (
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2 rounded-sm border-2 border-white/[0.1] bg-black/50 px-3 py-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-white/90">{fmtDateFull(ev.startdate)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={isBig ? 'p-5' : 'p-3'}>
          {/* Category */}
          <span className="inline-block rounded-sm border-2 border-primary/20 bg-primary/8 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-primary/80">
            {cat}
          </span>

          {/* Title */}
          <h3 className={`mt-1.5 font-black text-foreground leading-tight group-hover:text-primary transition-colors duration-[250ms] ${isBig ? 'text-base sm:text-lg line-clamp-2' : isMid ? 'text-sm line-clamp-2' : 'text-xs line-clamp-1'}`}>
            {ev.title}
          </h3>

          {/* Row: date + type */}
          <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground/50">
            {!isBig && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{fmtDateShort(ev.startdate)}</span>}
            <span className="flex items-center gap-1">{ev.isonline ? <Wifi className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}{ev.isonline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Countdown */}
          {status !== 'ended' && isBig && (
            <div className="mt-3 flex items-center gap-2 border-t-2 border-white/[0.06] pt-3">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/40" />
              <EventCountdown target={ev.startdate} />
            </div>
          )}
          {status !== 'ended' && !isBig && (
            <div className="mt-2 flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-muted-foreground/30" />
              <EventCountdown target={ev.startdate} />
            </div>
          )}
        </div>
      </Link>
    )
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        {/* Featured + Secondary row */}
        <motion.div
          variants={containerV} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-12 gap-4 mb-4"
        >
          {featured && (
            <motion.div key={featured.id} variants={itemV} custom={DIRS[0]} className="col-span-7">
              {renderCard(featured, 'featured')}
            </motion.div>
          )}
          <div className="col-span-5 grid grid-rows-2 gap-4">
            {secondary.map((ev, i) => (
              <motion.div key={ev.id} variants={itemV} custom={DIRS[i + 1]}>
                {renderCard(ev, 'secondary')}
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Compact row */}
        {compact.length > 0 && (
          <motion.div
            variants={containerV} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-3 gap-4"
          >
            {compact.map((ev, i) => (
              <motion.div key={ev.id} variants={itemV} custom={DIRS[i + 3]}>
                {renderCard(ev, 'compact')}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Mobile carousel */}
      <div className="lg:hidden">
        <div
          className="relative overflow-hidden rounded-md border-2 border-white/[0.07] bg-card shadow-[4px_4px_0px_rgba(37,99,235,0.12)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchX.current
            if (Math.abs(dx) > 50) goTo(slide + (dx < 0 ? 1 : -1))
          }}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${(slide % limited.length + limited.length) % limited.length * 100}%)` }}
          >
            {limited.map((ev) => (
              <div key={ev.id} className="min-w-0 w-full flex-shrink-0">
                {renderCard(ev, 'featured')}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex justify-center gap-1.5">
          {limited.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${((slide % limited.length) + limited.length) % limited.length === i ? 'w-5 bg-primary' : 'w-2 bg-white/[0.12]'}`}
            />
          ))}
        </div>
      </div>
    </>
  )
}
