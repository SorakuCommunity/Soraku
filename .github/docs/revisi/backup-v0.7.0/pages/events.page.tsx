import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin, Users, Wifi, ArrowRight, Clock } from "lucide-react";
import { MOCK_EVENTS } from "@/lib/mock-data";
import { formatEventDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Event — Soraku Community",
  description: "Event, gathering, dan workshop komunitas Soraku Indonesia.",
};

const FILTERS = [
  { slug: "Semua",   emoji: "✨" },
  { slug: "Online",  emoji: "🌐" },
  { slug: "Offline", emoji: "📍" },
  { slug: "Hybrid",  emoji: "🔀" },
];

function EventCard({ event }: { event: typeof MOCK_EVENTS[0] }) {
  const now = new Date();
  const start = new Date(event.starts_at);
  const isUpcoming = start > now;
  const TypeIcon = event.event_type === "online" ? Wifi : MapPin;
  const typeLabel = { online: "Online", offline: "Offline", hybrid: "Hybrid" }[event.event_type];

  // Simple countdown display (days)
  const daysUntil = isUpcoming
    ? Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Link href={`/events/${event.slug}`}
      className="glass-card group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:border-primary/30">
      {/* Cover */}
      <div className={`relative h-44 overflow-hidden flex items-center justify-center ${
        isUpcoming
          ? "bg-gradient-to-br from-primary/20 via-accent/10 to-violet-500/15"
          : "bg-gradient-to-br from-muted/40 to-muted/20"
      }`}>
        <span className="text-[5rem] font-black opacity-[0.06] select-none">空</span>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
            isUpcoming ? "bg-primary text-white shadow-md shadow-primary/30" : "bg-muted text-muted-foreground"
          }`}>
            {isUpcoming ? "Upcoming" : "Selesai"}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-0.5 text-[11px] font-medium text-foreground/80 backdrop-blur-sm">
            <TypeIcon className="h-3 w-3" />{typeLabel}
          </span>
        </div>

        {/* Countdown */}
        {isUpcoming && daysUntil !== null && daysUntil <= 7 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-accent/20 border border-accent/30 px-2.5 py-0.5 text-[11px] font-bold text-accent/90">
            <Clock className="h-3 w-3" />
            {daysUntil === 0 ? "Hari ini!" : `${daysUntil} hari lagi`}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
          {event.description}
        </p>

        <div className="mt-4 space-y-1.5 text-xs text-muted-foreground/60 border-t border-border/30 pt-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-primary/50" />
            {formatEventDate(event.starts_at)}
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary/50" />
              {event.location}
            </div>
          )}
          {event.max_participants && (
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 flex-shrink-0 text-primary/50" />
              Maks. {event.max_participants} peserta
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-end text-xs font-semibold text-primary/70 group-hover:text-primary transition-colors">
          Detail <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

export default function EventsPage({ searchParams }: { searchParams?: { filter?: string } }) {
  const activeFilter = searchParams?.filter ?? "Semua";
  const now = new Date();

  const filtered = activeFilter === "Semua"
    ? MOCK_EVENTS
    : MOCK_EVENTS.filter((e) =>
        e.event_type.toLowerCase() === activeFilter.toLowerCase()
      );

  const upcoming = filtered.filter((e) => new Date(e.starts_at) > now);
  const past     = filtered.filter((e) => new Date(e.starts_at) <= now);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

      {/* ── Header ── */}
      <div className="mb-10">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/70">Komunitas</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Event <span className="text-gradient">Soraku</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Nonton bareng, gathering, cosplay contest, dan workshop dari komunitas Soraku Indonesia.
        </p>
      </div>

      {/* ── Filter ── */}
      <div className="mb-10 flex flex-wrap gap-2">
        {FILTERS.map(({ slug, emoji }) => (
          <Link key={slug}
            href={slug === "Semua" ? "/events" : `/events?filter=${slug}`}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeFilter === slug
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:-translate-y-0.5"
            }`}>
            <span>{emoji}</span>
            <span>{slug}</span>
          </Link>
        ))}
      </div>

      {/* ── Upcoming ── */}
      {upcoming.length > 0 && (
        <section className="mb-14">
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-lg font-black tracking-tight">Upcoming</h2>
            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary">{upcoming.length}</span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}

      {/* ── Past ── */}
      {past.length > 0 && (
        <section>
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-lg font-black tracking-tight text-muted-foreground/70">Selesai</h2>
            <span className="rounded-full bg-muted/50 px-2.5 py-0.5 text-xs font-bold text-muted-foreground/50">{past.length}</span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 opacity-65">
            {past.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-4xl mb-3">🗓️</p>
          <p className="text-muted-foreground">Belum ada event dengan filter ini.</p>
        </div>
      )}
    </div>
  );
}
