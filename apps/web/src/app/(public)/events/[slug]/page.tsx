import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, Wifi, ExternalLink, Swords, DollarSign, Tag, Download, QrCode } from "lucide-react";
import { db } from "@/lib/supabase/server";
import { formatEventDate } from "@/lib/utils";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await (await db()).from("events").select("title,description").eq("slug", slug).eq("ispublished", true).single();
  if (!data) return { title: "Event tidak ditemukan" };
  return { title: `${data.title} — Soraku Event`, description: (data.description ?? "").slice(0, 160) };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;

  const { data: event } = await (await db())
    .from("events")
    .select("id,slug,title,description,coverurl,startdate,enddate,location,isonline,tags,ispublished,registrationurl,gametype,ispaid,price,paymentmethods,registrationopen")
    .eq("slug", slug).eq("ispublished", true).single();

  if (!event) notFound();

  const now        = new Date();
  const start      = new Date(event.startdate);
  const isUpcoming = start > now;
  const TypeIcon   = event.isonline ? Wifi : MapPin;
  const typeLabel  = event.isonline ? "Online" : "Offline";
  const methods    = (event as any).paymentmethods as PaymentMethod[] ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/events" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Event
      </Link>

      {/* ── Cover dengan badge overlay (seperti image 2) ── */}
      <div className="mb-6 rounded-2xl overflow-hidden relative h-52 sm:h-72">
        {event.coverurl ? (
          <Image src={event.coverurl} alt={event.title} fill className="object-cover" priority unoptimized />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${isUpcoming ? "bg-gradient-to-br from-primary/20 via-accent/10 to-violet-500/15" : "bg-gradient-to-br from-border/20 to-border/5"}`}>
            <span className="text-8xl opacity-10">空</span>
          </div>
        )}
        {/* Gradient overlay bawah */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Badge kiri atas: Paid/Free */}
        <div className="absolute left-3 top-3">
          {(event as any).ispaid ? (
            <span className="flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-300 backdrop-blur-sm shadow-sm">
              <DollarSign className="h-3 w-3" />
              {(event as any).price ? `Rp ${((event as any).price as number).toLocaleString("id-ID")}` : "Berbayar"}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/20 px-3 py-1 text-xs font-black text-green-300 backdrop-blur-sm shadow-sm">
              <Tag className="h-3 w-3" /> Gratis
            </span>
          )}
        </div>

        {/* Badge kanan atas: Upcoming/Selesai + Online/Offline */}
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          <span className={`rounded-full px-3 py-1 text-xs font-black backdrop-blur-sm shadow-sm ${isUpcoming ? "bg-primary text-white shadow-primary/30" : "bg-black/50 text-white/70"}`}>
            {isUpcoming ? "🔥 Upcoming" : "✓ Selesai"}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
            <TypeIcon className="h-3 w-3" /> {typeLabel}
          </span>
        </div>
      </div>

      {/* ── Judul ── */}
      <h1 className="text-3xl font-black leading-tight sm:text-4xl">{event.title}</h1>

      {/* ── Deskripsi ── */}
      {event.description && (
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{event.description}</p>
      )}

      {/* ── Tags — bawah kanan setelah deskripsi ── */}
      {(event.tags ?? []).length > 0 && (
        <div className="mt-3 flex flex-wrap justify-end gap-1.5">
          {(event.tags ?? []).map((t: string) => (
            <span key={t} className="rounded-full border border-border/50 bg-muted/20 px-2.5 py-0.5 text-xs text-muted-foreground/70">{t}</span>
          ))}
        </div>
      )}

      {/* ── Waktu Mulai | Waktu Selesai — side by side, tidak overflow ── */}
      <div className={`mt-5 grid gap-2 ${event.enddate ? "grid-cols-2" : "grid-cols-1"}`}>
        <div className="glass-card flex items-center gap-2.5 p-3 min-w-0">
          <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Mulai</p>
            <p className="text-xs font-semibold truncate leading-snug">{formatEventDate(event.startdate)}</p>
          </div>
        </div>
        {event.enddate && (
          <div className="glass-card flex items-center gap-2.5 p-3 min-w-0">
            <Calendar className="h-4 w-4 text-accent flex-shrink-0" />
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Selesai</p>
              <p className="text-xs font-semibold truncate leading-snug">{formatEventDate(event.enddate)}</p>
            </div>
          </div>
        )}
      </div>

      {event.location && (
        <div className="mt-2 glass-card flex items-center gap-2.5 p-3">
          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Lokasi</p>
            <p className="text-xs font-semibold truncate">{event.location}</p>
          </div>
        </div>
      )}

      {/* ── Payment Methods ── */}
      {(event as any).ispaid && methods.length > 0 && (
        <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-4 space-y-3">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400/80">
            <DollarSign className="h-3.5 w-3.5" /> Metode Pembayaran
          </p>
          <div className="flex flex-col gap-2">
            {methods.map((m, i) => {
              const key  = getPaymentKey(m);
              const Icon = PAYMENT_ICON_MAP[key];
              const qrisLink = m.qrisImageUrl || m.qrisUrl;

              if (m.type === "qris") {
                return (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-amber-500/15 bg-black/20 px-3 py-2.5">
                    {Icon
                      ? <Icon className="h-6 w-6 flex-shrink-0" />
                      : <QrCode className="h-5 w-5 text-amber-400 flex-shrink-0" />
                    }
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground/80">
                        {m.provider ? m.provider.charAt(0).toUpperCase() + m.provider.slice(1) : "QRIS"}
                      </p>
                      <p className="text-[11px] text-muted-foreground/50">Scan QRIS untuk pembayaran</p>
                    </div>
                    {qrisLink && (
                      <a href={qrisLink} target="_blank" rel="noopener noreferrer" download={!!m.qrisImageUrl}
                        className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-colors flex-shrink-0">
                        <Download className="h-3 w-3" /> QRIS
                      </a>
                    )}
                  </div>
                );
              }

              return (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-amber-500/15 bg-black/20 px-3 py-2.5">
                  {Icon
                    ? <Icon className="h-6 w-6 flex-shrink-0" />
                    : <span className="rounded-md border border-border/40 bg-muted/20 px-1.5 py-0.5 text-[9px] font-black text-muted-foreground/60 uppercase flex-shrink-0">{m.bank ?? m.provider ?? m.type}</span>
                  }
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
      {isUpcoming && (
        <div className="mt-8 glass-card overflow-hidden rounded-2xl">
          <div className="bg-gradient-to-r from-primary/20 via-primary/8 to-transparent px-5 py-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
                <Swords className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="font-black text-sm">Daftarkan Tim Kamu!</h2>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  {(event as any).registrationopen ? "Pendaftaran masih dibuka" : "Pendaftaran sedang ditutup"}
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
                  ) : null}
                </>
              ) : (
                <a href="https://discord.gg/CJJ7KEJMbg" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors">
                  🔒 Pantau di Discord <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
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
