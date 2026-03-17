import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Wifi, ExternalLink, Swords } from "lucide-react";
import { db } from "@/lib/supabase/server";
import { formatEventDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await (await db())
    .from("events")
    .select("title,description")
    .eq("slug", slug)
    .eq("ispublished", true)
    .single();
  if (!data) return { title: "Event tidak ditemukan" };
  return { title: `${data.title} — Soraku Event`, description: (data.description ?? "").slice(0, 160) };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;

  const { data: event } = await (await db())
    .from("events")
    .select("id,slug,title,description,coverurl,startdate,enddate,location,isonline,tags,ispublished,registrationurl,gametype")
    .eq("slug", slug)
    .eq("ispublished", true)
    .single();

  if (!event) notFound();

  const now       = new Date();
  const start     = new Date(event.startdate);
  const isUpcoming = start > now;
  const TypeIcon   = event.isonline ? Wifi : MapPin;
  const typeLabel  = event.isonline ? "Online" : "Offline";

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/events" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Event
      </Link>

      <div className={`mb-8 h-56 rounded-2xl flex items-center justify-center sm:h-72 ${
        isUpcoming ? "bg-gradient-to-br from-primary/20 via-accent/10 to-violet-500/15"
                   : "bg-gradient-to-br from-border/20 to-border/5"
      }`}>
        <span className="text-8xl opacity-10">空</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${
          isUpcoming ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
        }`}>{isUpcoming ? "🔥 Upcoming" : "✓ Selesai"}</span>
        <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
          <TypeIcon className="h-3.5 w-3.5" />{typeLabel}
        </span>
        {(event.tags ?? []).map((t: string) => (
          <span key={t} className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">{t}</span>
        ))}
      </div>

      <h1 className="text-3xl font-black leading-tight sm:text-4xl">{event.title}</h1>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="glass-card flex items-center gap-3 p-4">
          <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Waktu Mulai</p>
            <p className="text-sm font-medium">{formatEventDate(event.startdate)}</p>
          </div>
        </div>
        {event.enddate && (
          <div className="glass-card flex items-center gap-3 p-4">
            <Calendar className="h-5 w-5 text-accent flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Waktu Selesai</p>
              <p className="text-sm font-medium">{formatEventDate(event.enddate)}</p>
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
      </div>

      <div className="mt-8 prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground">
        <p className="leading-relaxed">{event.description}</p>
      </div>

      {isUpcoming && (
        <div className="mt-10 glass-card overflow-hidden rounded-2xl">
          {/* Header strip */}
          <div className="bg-gradient-to-r from-primary/20 via-primary/8 to-transparent px-6 py-5 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
                <Swords className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-black text-base">Daftarkan Tim Kamu!</h2>
                <p className="text-xs text-muted-foreground/60 mt-0.5">Pendaftaran masih dibuka</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              {(event as any).gametype === 'ml'
              ? 'Siapkan 5 pemain terbaikmu dan daftarkan tim sekarang. Slot terbatas!'
              : 'Daftarkan diri dan dapatkan info lengkap di Discord Soraku.'}
            </p>
            <div className="flex items-center gap-3 flex-shrink-0">
              {(event as any).registrationurl ? (
                /* Link eksternal — untuk semua gametype */
                <a href={(event as any).registrationurl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-black text-white hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20">
                  <Swords className="h-4 w-4" /> Daftar Sekarang
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (event as any).gametype === 'ml' ? (
                /* Form ML bawaan — hanya untuk gametype ml */
                <Link href={`/events/${event.slug}/daftar`}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-black text-white hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20">
                  <Swords className="h-4 w-4" /> Daftar Tim ML
                </Link>
              ) : null}
              <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-indigo-400 hover:bg-indigo-500/20 transition-colors">
                Discord <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
