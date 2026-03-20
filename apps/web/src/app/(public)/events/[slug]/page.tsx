import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft, Calendar, MapPin, Wifi, ExternalLink, Swords,
  DollarSign, Tag, Download, QrCode, Clock, Users, Zap, Home,
} from "lucide-react";
import { db } from "@/lib/supabase/server";
import { BCAIcon, BRIIcon, BTNIcon, SeabankIcon, DanaIcon, QRISIcon, GopayIcon } from "@/components/icons/custom-icons";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

type PaymentMethod = {
  type: "bank" | "ewallet" | "qris";
  bank?: string; provider?: string; account?: string; name?: string;
  qrisImageUrl?: string; qrisUrl?: string;
};

const PAYMENT_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  bca: BCAIcon, bri: BRIIcon, btn: BTNIcon, seabank: SeabankIcon,
  dana: DanaIcon, qris: QRISIcon, gopay: GopayIcon,
};

function getPaymentKey(m: PaymentMethod): string {
  if (m.type === "qris")   return m.provider?.toLowerCase() ?? "qris";
  if (m.type === "bank")   return (m.bank ?? "").toLowerCase();
  return (m.provider ?? "").toLowerCase();
}

// ── Format tanggal WIB — TIDAK double-convert ──────────────
// Date disimpan dengan +07:00, jadi JS sudah tahu itu WIB
// Tampilkan langsung tanpa konversi timezone lagi
function formatWIB(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
    // Tidak set timeZone agar pakai timezone yang sudah ada di date string
    // Jika date tersimpan dengan +07:00, JS akan konversi ke local yg benar
  }) + " WIB";
}

function formatShortWIB(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Status event: bandingkan UTC timestamps langsung ────────
function getEventStatus(startdate: string, enddate?: string | null) {
  const now   = Date.now();
  const start = new Date(startdate).getTime();
  const end   = enddate ? new Date(enddate).getTime() : null;

  if (now < start)                return "upcoming" as const;
  if (end && now > end)           return "ended"    as const;
  if (!end && now > start)        return "live"     as const; // No enddate = live forever
  return "live" as const;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await (await db()).from("events").select("title,description,coverurl").eq("slug", slug).eq("ispublished", true).single();
  if (!data) return { title: "Event tidak ditemukan" };
  return {
    title: `${data.title} — Soraku Event`,
    description: (data.description ?? "").replace(/\n/g, " ").slice(0, 160),
    openGraph: { images: data.coverurl ? [data.coverurl] : undefined },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;

  const { data: event } = await (await db())
    .from("events")
    .select("id,slug,title,description,coverurl,startdate,enddate,location,isonline,tags,ispublished,registrationurl,gametype,ispaid,price,paymentmethods,registrationopen,priceinfo")
    .eq("slug", slug).eq("ispublished", true).single();

  if (!event) notFound();

  const status   = getEventStatus(event.startdate, event.enddate);
  const TypeIcon = event.isonline ? Wifi : MapPin;
  const methods  = (event as any).paymentmethods as PaymentMethod[] ?? [];

  // Preserve newlines — split by single newline, empty line = <br>
  const descLines = (event.description ?? "")
    .split(/\r?\n/)
    .map((l: string) => l.trimEnd());

  const statusConfig = {
    upcoming: { label: "Upcoming",            cls: "bg-primary/90 text-white",                    dot: "bg-primary" },
    live:     { label: "Live",                cls: "bg-green-500/90 text-white",                   dot: "bg-green-400" },
    ended:    { label: "Selesai",             cls: "bg-muted/60 text-muted-foreground",             dot: "bg-muted-foreground/40" },
  }[status];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground/50">
        <Link href="/" className="flex items-center gap-1 hover:text-muted-foreground transition-colors">
          <Home className="h-3.5 w-3.5" /> Beranda
        </Link>
        <span>/</span>
        <Link href="/events" className="hover:text-muted-foreground transition-colors">Event</Link>
        <span>/</span>
        <span className="truncate max-w-[180px] text-foreground/70">{event.title}</span>
      </nav>

      {/* ── Cover ── */}
      <div className="mb-6 rounded-2xl overflow-hidden relative h-56 sm:h-80 shadow-xl">
        {event.coverurl ? (
          <Image src={event.coverurl} alt={event.title} fill className="object-cover" priority unoptimized />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${
            status === "upcoming" ? "bg-gradient-to-br from-primary/25 via-accent/10 to-violet-500/15"
            : status === "live"  ? "bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/15"
            : "bg-gradient-to-br from-border/20 to-border/5"
          }`}>
            <span className="text-8xl opacity-10">空</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        {/* Badges kiri atas */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {(event as any).ispaid ? (
            <span className="flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-300 backdrop-blur-sm">
              <DollarSign className="h-3 w-3" />
              {(event as any).price ? `Rp ${((event as any).price as number).toLocaleString("id-ID")}` : "Berbayar"}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/20 px-3 py-1 text-xs font-black text-green-300 backdrop-blur-sm">
              ✦ Gratis
            </span>
          )}
          <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-bold text-white/80 backdrop-blur-sm">
            <TypeIcon className="h-3 w-3" />{event.isonline ? "Online" : "Offline"}
          </span>
        </div>

        {/* Status badge kanan atas */}
        <div className="absolute right-3 top-3">
          <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black backdrop-blur-sm ${statusConfig.cls}`}>
            {status === "live" ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
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
            <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white/80 backdrop-blur-sm uppercase tracking-widest">
              {(event as any).gametype === "ml" ? "Mobile Legends" : (event as any).gametype}
            </span>
          </div>
        )}
      </div>

      {/* ── LIVE bar ── */}
      {status === "live" && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-500/25 bg-green-500/8 px-4 py-3">
          <span className="relative flex h-3 w-3 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400" />
          </span>
          <div>
            <p className="text-sm font-black text-green-400">Event Sedang Berlangsung!</p>
            <p className="text-xs text-green-400/60">Pantau Discord Soraku untuk update terbaru</p>
          </div>
        </div>
      )}

      {/* ── Judul ── */}
      <h1 className="text-3xl font-black leading-tight sm:text-4xl">{event.title}</h1>

      {/* ── Tags ── */}
      {(event.tags ?? []).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(event.tags ?? []).map((t: string) => (
            <span key={t} className="flex items-center gap-1 rounded-full border border-border/50 bg-muted/20 px-2.5 py-0.5 text-xs text-muted-foreground/70">
              <Tag className="h-2.5 w-2.5" />{t}
            </span>
          ))}
        </div>
      )}

      {/* ── Deskripsi — preserve newlines & paragraphs ── */}
      {descLines.length > 0 && (
        <div className="mt-5 text-sm text-muted-foreground leading-relaxed">
          {descLines.map((line: string, i: number) =>
            line === "" ? (
              <div key={i} className="h-3" />
            ) : (
              <p key={i}>{line}</p>
            )
          )}
        </div>
      )}

      {/* ── Info cards: waktu + lokasi ── */}
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {/* Mulai */}
        <div className="glass-card flex items-start gap-3 p-4 rounded-2xl">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Mulai</p>
            <p className="text-sm font-bold mt-0.5 leading-snug">{formatShortWIB(event.startdate)}</p>
            <p className="text-[10px] text-muted-foreground/40 mt-0.5">WIB</p>
          </div>
        </div>

        {/* Selesai */}
        {event.enddate && (
          <div className="glass-card flex items-start gap-3 p-4 rounded-2xl">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent/15 border border-accent/25">
              <Clock className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Selesai</p>
              <p className="text-sm font-bold mt-0.5 leading-snug">{formatShortWIB(event.enddate)}</p>
              <p className="text-[10px] text-muted-foreground/40 mt-0.5">WIB</p>
            </div>
          </div>
        )}

        {/* Lokasi */}
        {event.location && (
          <div className="glass-card flex items-start gap-3 p-4 rounded-2xl sm:col-span-2">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-500/25">
              <MapPin className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Lokasi</p>
              <p className="text-sm font-bold mt-0.5">{event.location}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Payment Methods ── */}
      {(event as any).ispaid && methods.length > 0 && (
        <div className="mt-6 glass-card rounded-2xl overflow-hidden">
          <div className="border-b border-border/40 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Metode Pembayaran</p>
          </div>
          <div className="p-4 space-y-3">
            {methods.map((m, i) => {
              const key     = getPaymentKey(m);
              const PayIcon = PAYMENT_ICON_MAP[key];
              if (m.type === "qris") return (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border/40 bg-card/50 p-3">
                  {PayIcon ? <PayIcon className="h-8 w-8 flex-shrink-0" /> : <QrCode className="h-8 w-8 flex-shrink-0 text-primary" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{m.provider ?? "QRIS"}</p>
                    {m.qrisUrl && (
                      <a href={m.qrisUrl} target="_blank" rel="noopener" className="flex items-center gap-1 text-xs text-primary hover:underline mt-0.5">
                        <ExternalLink className="h-3 w-3" /> Buka QRIS
                      </a>
                    )}
                  </div>
                  {m.qrisImageUrl && (
                    <a href={m.qrisImageUrl} download className="flex-shrink-0 rounded-lg border border-border/50 p-1.5 text-muted-foreground hover:text-primary transition-colors">
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                </div>
              );
              return (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/50 p-3">
                  {PayIcon ? <PayIcon className="h-8 w-8 flex-shrink-0" /> : <DollarSign className="h-6 w-6 flex-shrink-0 text-primary" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground/80 truncate">{m.account}</p>
                    {m.name && <p className="text-[11px] text-muted-foreground/50 truncate">a/n {m.name}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CTA Daftar ── */}
      {(status === "upcoming" || status === "live") && (
        <div className="mt-8 glass-card overflow-hidden rounded-2xl">
          <div className="bg-gradient-to-r from-primary/20 via-primary/8 to-transparent px-5 py-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
                <Swords className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="font-black text-sm">
                  {status === "live" ? "Event Sedang Berlangsung" : "Daftarkan Tim Kamu!"}
                </h2>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  {(event as any).registrationopen ? "Pendaftaran masih dibuka" : "Pendaftaran sudah ditutup"}
                </p>
              </div>
            </div>
          </div>
          <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              {(event as any).gametype === "ml"
                ? "Siapkan 5 pemain terbaikmu dan daftarkan tim sekarang. Slot terbatas!"
                : "Daftarkan diri dan dapatkan info lengkap di Discord Soraku."}
            </p>
            <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
              {(event as any).registrationopen ? (
                <>
                  {(event as any).registrationurl ? (
                    <a href={(event as any).registrationurl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-white hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20">
                      <Swords className="h-4 w-4" /> Daftar Sekarang <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (event as any).gametype === "ml" ? (
                    <Link href={`/events/${event.slug}/daftar`}
                      className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-white hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20">
                      <Swords className="h-4 w-4" /> Daftar Tim ML
                    </Link>
                  ) : (
                    <Link href={`/events/${event.slug}/daftar`}
                      className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-white hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20">
                      <Swords className="h-4 w-4" /> Daftar Sekarang
                    </Link>
                  )}
                </>
              ) : (
                <span className="flex items-center gap-2 rounded-xl border border-border/50 px-5 py-2.5 text-sm font-bold text-muted-foreground/60">
                  Pendaftaran Ditutup
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Ended ── */}
      {status === "ended" && (
        <div className="mt-8 glass-card rounded-2xl px-5 py-6 text-center border border-border/40">
          <p className="text-3xl mb-3">🏆</p>
          <p className="font-black text-base">Event Telah Berakhir</p>
          <p className="text-sm text-muted-foreground/60 mt-1 mb-4">Terima kasih kepada semua peserta yang sudah ikut!</p>
          <Link href="/events" className="inline-flex items-center gap-2 rounded-xl border border-border/50 px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Lihat event lainnya
          </Link>
        </div>
      )}
    </div>
  );
}
