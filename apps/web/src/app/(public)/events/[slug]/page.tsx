import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft, Calendar, MapPin, Wifi, ExternalLink, Swords,
  DollarSign, Tag, Download, QrCode, Clock, Users, Zap,
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

// ── Format tanggal dengan timezone WIB (Asia/Jakarta) ────────
function formatWIB(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta",
  }).replace("pukul", "·");
}

// ── Hitung status event (pakai WIB) ──────────────────────────
function getEventStatus(startdate: string, enddate?: string | null) {
  // Bandingkan dalam WIB timezone
  const nowWIB   = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  const startWIB = new Date(new Date(startdate).toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  const endWIB   = enddate ? new Date(new Date(enddate).toLocaleString("en-US", { timeZone: "Asia/Jakarta" })) : null;

  if (nowWIB < startWIB)                        return "upcoming" as const;
  if (endWIB && nowWIB > endWIB)                return "ended"    as const;
  if (!endWIB && nowWIB > startWIB)             return "ended"    as const;
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
    .select("id,slug,title,description,coverurl,startdate,enddate,location,isonline,tags,ispublished,registrationurl,gametype,ispaid,price,paymentmethods,registrationopen")
    .eq("slug", slug).eq("ispublished", true).single();

  if (!event) notFound();

  const status   = getEventStatus(event.startdate, event.enddate);
  const TypeIcon = event.isonline ? Wifi : MapPin;
  const methods  = (event as any).paymentmethods as PaymentMethod[] ?? [];

  // ── Paragraphs dari description (preserve newlines) ──────
  const descParagraphs = (event.description ?? "")
    .split(/\n+/)
    .map((p: string) => p.trim())
    .filter((p: string) => p.length > 0);

  const statusConfig = {
    upcoming: { label: "🔥 Upcoming",       cls: "bg-primary text-white shadow-primary/30",           badge: "border-primary/30 bg-primary/10 text-primary" },
    live:     { label: "● Sedang Live",     cls: "bg-green-500 text-white shadow-green-500/30",       badge: "border-green-500/30 bg-green-500/10 text-green-400" },
    ended:    { label: "✓ Selesai",          cls: "bg-black/50 text-white/70 shadow-none",             badge: "border-border/40 bg-muted/20 text-muted-foreground" },
  }[status];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/events" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Event
      </Link>

      {/* ── Cover ── */}
      <div className="mb-6 rounded-2xl overflow-hidden relative h-56 sm:h-80 shadow-xl">
        {event.coverurl ? (
          <Image src={event.coverurl} alt={event.title} fill className="object-cover" priority unoptimized />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${status === "upcoming" ? "bg-gradient-to-br from-primary/20 via-accent/10 to-violet-500/15" : "bg-gradient-to-br from-border/20 to-border/5"}`}>
            <span className="text-8xl opacity-10">空</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Badges kiri atas */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
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
        <div className="absolute right-3 top-3 flex items-center gap-2">
          {/* LIVE blinking dot */}
          {status === "live" && (
            <span className="flex items-center gap-1.5 rounded-full border border-green-500/50 bg-green-500/20 px-3 py-1 text-xs font-black text-green-300 backdrop-blur-sm shadow-lg shadow-green-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              LIVE
            </span>
          )}
          <span className={`rounded-full px-3 py-1 text-xs font-black backdrop-blur-sm shadow-sm ${statusConfig.cls}`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Game type badge bawah kiri */}
        {(event as any).gametype && (
          <div className="absolute bottom-3 left-3">
            <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white/80 backdrop-blur-sm uppercase tracking-widest">
              {(event as any).gametype === "ml" ? "Mobile Legends" : (event as any).gametype}
            </span>
          </div>
        )}
      </div>

      {/* ── LIVE indicator text (dibawah cover jika live) ── */}
      {status === "live" && (
        <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
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

      {/* ── Deskripsi (preserve newlines) ── */}
      {descParagraphs.length > 0 && (
        <div className="mt-5 space-y-3">
          {descParagraphs.map((p: string, i: number) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
          ))}
        </div>
      )}

      {/* ── Info cards: waktu + lokasi ── */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {/* Mulai */}
        <div className="glass-card flex items-start gap-3 p-4 rounded-2xl">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Mulai</p>
            <p className="text-sm font-bold mt-0.5 leading-snug">{formatWIB(event.startdate)}</p>
            <p className="text-[10px] text-muted-foreground/40 mt-0.5">WIB (Jakarta)</p>
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
              <p className="text-sm font-bold mt-0.5 leading-snug">{formatWIB(event.enddate)}</p>
              <p className="text-[10px] text-muted-foreground/40 mt-0.5">WIB (Jakarta)</p>
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

      {/* ── Ended state ── */}
      {status === "ended" && (
        <div className="mt-8 glass-card rounded-2xl px-5 py-4 text-center border border-border/40">
          <p className="text-2xl mb-2">🏆</p>
          <p className="font-black text-base">Event Telah Berakhir</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Terima kasih kepada semua peserta yang sudah ikut!</p>
          <Link href="/events" className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Lihat event lainnya
          </Link>
        </div>
      )}
    </div>
  );
}
