import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Users, Wifi, ExternalLink } from "lucide-react";
import { MOCK_EVENTS } from "@/lib/mock-data";
import { formatEventDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = MOCK_EVENTS.find((e) => e.slug === slug);
  if (!event) return { title: "Event tidak ditemukan" };
  return { title: `${event.title} — Soraku Event`, description: event.description.slice(0, 160) };
}

export async function generateStaticParams() {
  return MOCK_EVENTS.map((e) => ({ slug: e.slug }));
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = MOCK_EVENTS.find((e) => e.slug === slug);
  if (!event) notFound();

  const now = new Date();
  const start = new Date(event.starts_at);
  const isUpcoming = start > now;
  const TypeIcon = event.event_type === "online" ? Wifi : MapPin;
  const typeLabel = { online: "Online", offline: "Offline", hybrid: "Hybrid" }[event.event_type];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/events" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Event
      </Link>

      {/* Cover */}
      <div className={`mb-8 h-56 rounded-2xl flex items-center justify-center sm:h-72 ${
        isUpcoming ? "bg-gradient-to-br from-primary/20 via-accent/10 to-violet-500/15" : "bg-gradient-to-br from-border/20 to-border/5"
      }`}>
        <span className="text-8xl opacity-10">空</span>
      </div>

      {/* Status badges */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${
          isUpcoming ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
        }`}>
          {isUpcoming ? "🔥 Upcoming" : "✓ Selesai"}
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
          <TypeIcon className="h-3.5 w-3.5" />{typeLabel}
        </span>
        {event.tags?.map((t) => (
          <span key={t} className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">{t}</span>
        ))}
      </div>

      <h1 className="text-3xl font-black leading-tight sm:text-4xl">{event.title}</h1>

      {/* Info grid */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="glass-card flex items-center gap-3 p-4">
          <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Waktu Mulai</p>
            <p className="text-sm font-medium">{formatEventDate(event.starts_at)}</p>
          </div>
        </div>
        {event.ends_at && (
          <div className="glass-card flex items-center gap-3 p-4">
            <Calendar className="h-5 w-5 text-accent flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Waktu Selesai</p>
              <p className="text-sm font-medium">{formatEventDate(event.ends_at)}</p>
            </div>
          </div>
        )}
        {event.location && (
          <div className="glass-card flex items-center gap-3 p-4">
            <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Lokasi</p>
              <p className="text-sm font-medium">{event.location}</p>
            </div>
          </div>
        )}
        {event.max_participants && (
          <div className="glass-card flex items-center gap-3 p-4">
            <Users className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Kapasitas</p>
              <p className="text-sm font-medium">Maks. {event.max_participants} peserta</p>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mt-8 prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground">
        <p className="leading-relaxed">{event.description}</p>
      </div>

      {/* CTA */}
      {isUpcoming && (
        <div className="mt-10 glass-card p-6 text-center">
          <h2 className="font-bold mb-2">Tertarik Ikut?</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Daftarkan diri dan dapatkan info lengkap di Discord Soraku.
          </p>
          <div className="flex justify-center flex-wrap gap-3">
            {event.discord_link && (
              <a href={event.discord_link} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
                Gabung di Discord <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
