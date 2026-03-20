import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar, MapPin, Wifi, ArrowRight, Clock, DollarSign, Tag,
} from "lucide-react";
import { db } from "@/lib/supabase/server";
import { formatEventDate } from "@/lib/utils";
import {
  BCAIcon, BRIIcon, BTNIcon, SeabankIcon, DanaIcon, QRISIcon, GopayIcon,
} from "@/components/icons/custom-icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Event — Soraku Community",
  description: "Event, gathering, dan workshop komunitas Soraku Indonesia.",
};

const FILTERS = [
  { slug: "Semua", emoji: "✨" },
  { slug: "Online", emoji: "🌐" },
  { slug: "Offline", emoji: "📍" },
];

type PaymentMethod = {
  type: "bank" | "ewallet" | "qris";
  bank?: string;
  provider?: string;
  account?: string;
  name?: string;
  qrisImageUrl?: string;
};

type EventRow = {
  id: string; slug: string; title: string; description: string | null;
  coverurl: string | null; ispaid: boolean; price: number | null;
  startdate: string; enddate: string | null; location: string | null;
  isonline: boolean; tags: string[] | null; gametype: string | null;
  registrationopen: boolean; paymentmethods: PaymentMethod[] | null;
};

const PAYMENT_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  bca:     BCAIcon,
  bri:     BRIIcon,
  btn:     BTNIcon,
  seabank: SeabankIcon,
  dana:    DanaIcon,
  qris:    QRISIcon,
  gopay:   GopayIcon,
};

function getPaymentKey(m: PaymentMethod): string {
  if (m.type === "qris") return m.provider?.toLowerCase() ?? "qris";
  if (m.type === "bank") return (m.bank ?? "").toLowerCase();
  if (m.type === "ewallet") return (m.provider ?? "").toLowerCase();
  return "";
}

function PaymentIcons({ methods }: { methods: PaymentMethod[] }) {
  if (!methods.length) return null;
  const shown = methods.slice(0, 4);
  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-3">
      {shown.map((m, i) => {
        const key  = getPaymentKey(m);
        const Icon = PAYMENT_ICON_MAP[key];
        if (!Icon) return (
          <span key={i} className="rounded border border-border/40 bg-muted/20 px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground/60 uppercase">
            {m.bank ?? m.provider ?? m.type}
          </span>
        );
        return <Icon key={i} className="h-5 w-auto opacity-90" />;
      })}
      {methods.length > 4 && (
        <span className="text-[10px] text-muted-foreground/40">+{methods.length - 4}</span>
      )}
    </div>
  );
}

function EventCard({ event }: { event: EventRow }) {
  const nowMs      = Date.now();
  const startMs    = new Date(event.startdate).getTime();
  const endMs      = event.enddate ? new Date(event.enddate).getTime() : null;
  const isUpcoming = startMs > nowMs;
  const isLive     = !isUpcoming && (!endMs || nowMs < endMs);
  const TypeIcon   = event.isonline ? Wifi : MapPin;
  const typeLabel  = event.isonline ? "Online" : "Offline";
  const methods    = event.paymentmethods ?? [];

  const daysUntil = isUpcoming
    ? Math.ceil((startMs - nowMs) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Link
      href={`/events/${event.slug}`}
      className="glass-card group flex flex-col overflow-hidden rounded-2xl border border-border/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="relative h-44 overflow-hidden">
        {event.coverurl ? (
          <Image src={event.coverurl} alt={event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${isLive ? "bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/15" : isUpcoming ? "bg-gradient-to-br from-primary/25 via-accent/10 to-violet-500/15" : "bg-gradient-to-br from-muted/40 to-muted/20"}`}>
            <span className="text-[5rem] font-black opacity-[0.06] select-none">空</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

        <div className="absolute left-3 top-3">
          {event.ispaid ? (
            <span className="flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/20 px-2.5 py-1 text-[11px] font-black text-amber-300 backdrop-blur-sm">
              <DollarSign className="h-3 w-3" />
              {event.price ? `Rp ${event.price.toLocaleString("id-ID")}` : "Berbayar"}
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/15 px-2.5 py-1 text-[11px] font-black text-green-300 backdrop-blur-sm">
              <Tag className="h-3 w-3" /> Gratis
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          <span className={`flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${isLive ? "bg-green-500/90 text-white shadow-md shadow-green-500/30" : isUpcoming ? "bg-primary text-white shadow-md shadow-primary/30" : "bg-muted/80 text-muted-foreground backdrop-blur-sm"}`}>
            {isLive ? (
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  Live
                </span>
              ) : isUpcoming ? "🔥 Upcoming" : "✓ Selesai"}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-0.5 text-[11px] font-medium text-foreground/80 backdrop-blur-sm">
            <TypeIcon className="h-3 w-3" />{typeLabel}
          </span>
        </div>

        {isUpcoming && daysUntil !== null && daysUntil <= 7 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-accent/30 bg-accent/20 px-2.5 py-0.5 text-[11px] font-bold text-accent/90 backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            {daysUntil === 0 ? "Hari ini!" : `${daysUntil} hari lagi`}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-bold leading-snug line-clamp-2 transition-colors group-hover:text-primary">{event.title}</h3>

        {event.description && (
          <p className="mt-2 text-sm text-muted-foreground/70 line-clamp-2 leading-relaxed flex-1">{event.description}</p>
        )}

        {event.ispaid && methods.length > 0 && <PaymentIcons methods={methods} />}

        <div className="mt-4 space-y-1 border-t border-border/30 pt-4 text-xs text-muted-foreground/60">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-primary/40" />
            {formatEventDate(event.startdate)}
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary/40" />
              {event.location}
            </div>
          )}
        </div>

        {/* Tags bawah kanan + arrow */}
        <div className="mt-3 flex items-center justify-end gap-1.5">
          {(event.tags ?? []).slice(0, 3).map((t) => (
            <span key={t} className="rounded-full border border-border/40 bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground/60">{t}</span>
          ))}
          <ArrowRight className="ml-1 h-3.5 w-3.5 flex-shrink-0 text-primary/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
      </div>
    </Link>
  );
}

export default async function EventsPage({ searchParams }: { searchParams?: Promise<{ filter?: string }> }) {
  const params       = await searchParams;
  const activeFilter = params?.filter ?? "Semua";
  const now          = Date.now();

  let query = (await db())
    .from("events")
    .select("id,slug,title,description,coverurl,startdate,enddate,location,isonline,tags,ispaid,price,gametype,registrationopen,paymentmethods")
    .eq("ispublished", true)
    .order("startdate", { ascending: true });

  if (activeFilter === "Online")  query = query.eq("isonline", true);
  if (activeFilter === "Offline") query = query.eq("isonline", false);

  const { data: allEvents } = await query;
  const events = allEvents ?? [];
  const upcoming = events.filter((e) => new Date(e.startdate).getTime() > now);
  const past     = events.filter((e) => new Date(e.startdate).getTime() <= now).reverse();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/70">Komunitas</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Event <span className="text-gradient">Soraku</span></h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">Nonton bareng, gathering, cosplay contest, dan workshop dari komunitas Soraku Indonesia.</p>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        {FILTERS.map(({ slug, emoji }) => (
          <Link key={slug} href={slug === "Semua" ? "/events" : `/events?filter=${slug}`}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${activeFilter === slug ? "bg-primary text-white shadow-md shadow-primary/20" : "border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:-translate-y-0.5"}`}>
            <span>{emoji}</span><span>{slug}</span>
          </Link>
        ))}
      </div>

      {upcoming.length > 0 && (
        <section className="mb-14">
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-lg font-black tracking-tight">Upcoming</h2>
            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary">{upcoming.length}</span>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => <EventCard key={e.id} event={e as EventRow} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-lg font-black tracking-tight text-muted-foreground/60">Selesai</h2>
            <span className="rounded-full bg-muted/50 px-2.5 py-0.5 text-xs font-bold text-muted-foreground/40">{past.length}</span>
          </div>
          <div className="grid grid-cols-1 gap-5 opacity-60 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((e) => <EventCard key={e.id} event={e as EventRow} />)}
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
  );
}
