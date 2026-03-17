import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, Wifi, ExternalLink, Swords, DollarSign, Tag, Download } from "lucide-react";
import { db } from "@/lib/supabase/server";
import { formatEventDate } from "@/lib/utils";
import {
  BCAIcon, BRIIcon, BTNIcon, SeabankIcon, DanaIcon, QRISIcon, GopayIcon,
} from "@/components/icons/custom-icons";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

type PaymentMethod = {
  type: "bank" | "ewallet" | "qris";
  bank?: string;
  provider?: string;
  account?: string;
  name?: string;
  qrisImageUrl?: string;
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
    .eq("slug", slug)
    .eq("ispublished", true)
    .single();

  if (!event) notFound();

  const now        = new Date();
  const start      = new Date(event.startdate);
  const isUpcoming = start > now;
  const TypeIcon   = event.isonline ? Wifi : MapPin;
  const typeLabel  = event.isonline ? "Online" : "Offline";
  const methods    = (event as any).paymentmethods as PaymentMethod[] ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/events" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Event
      </Link>

      <div className="mb-8 h-56 sm:h-72 rounded-2xl overflow-hidden relative">
        {event.coverurl ? (
          <Image src={event.coverurl} alt={event.title} fill className="object-cover" priority unoptimized />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${isUpcoming ? "bg-gradient-to-br from-primary/20 via-accent/10 to-violet-500/15" : "bg-gradient-to-br from-border/20 to-border/5"}`}>
            <span className="text-8xl opacity-10">空</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      </div>

      {/* Badges row — Upcoming/Selesai + Tipe + Free/Paid */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${isUpcoming ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
          {isUpcoming ? "🔥 Upcoming" : "✓ Selesai"}
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
          <TypeIcon className="h-3.5 w-3.5" />{typeLabel}
        </span>
        {(event as any).ispaid ? (
          <span className="flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-sm font-bold text-amber-400">
            <DollarSign className="h-3.5 w-3.5" />
            {(event as any).price ? `Rp ${((event as any).price as number).toLocaleString("id-ID")}` : "Berbayar"}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-sm font-bold text-green-400">
            <Tag className="h-3.5 w-3.5" /> Gratis
          </span>
        )}
      </div>

      <h1 className="text-3xl font-black leading-tight sm:text-4xl">{event.title}</h1>

      {/* Tags — bawah judul, kanan */}
      {(event.tags ?? []).length > 0 && (
        <div className="mt-3 flex flex-wrap justify-end gap-1.5">
          {(event.tags ?? []).map((t: string) => (
            <span key={t} className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">{t}</span>
          ))}
        </div>
      )}

      {/* Waktu Mulai | Waktu Selesai — sejajar di mobile */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:gap-3" style={{ gridTemplateColumns: event.enddate ? "1fr 1fr" : "1fr" }}>
        <div className="glass-card flex items-center gap-3 p-4">
          <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Waktu Mulai</p>
            <p className="text-sm font-medium truncate">{formatEventDate(event.startdate)}</p>
          </div>
        </div>
        {event.enddate && (
          <div className="glass-card flex items-center gap-3 p-4">
            <Calendar className="h-5 w-5 text-accent flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Waktu Selesai</p>
              <p className="text-sm font-medium truncate">{formatEventDate(event.enddate)}</p>
            </div>
          </div>
        )}
      </div>

      {event.location && (
        <div className="mt-3 glass-card flex items-center gap-3 p-4">
          <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Lokasi</p>
            <p className="text-sm font-medium">{event.location}</p>
          </div>
        </div>
      )}

      {/* Payment Methods — tampil jika ada dari Admin */}
      {(event as any).ispaid && methods.length > 0 && (
        <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 space-y-3">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400/70">
            <DollarSign className="h-3.5 w-3.5" /> Metode Pembayaran
          </p>
          <div className="flex flex-col gap-2">
            {methods.map((m, i) => {
              const key  = getPaymentKey(m);
              const Icon = PAYMENT_ICON_MAP[key];
              if (m.type === "qris" && m.qrisImageUrl) {
                return (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-amber-500/15 bg-black/20 px-4 py-3">
                    {Icon ? <Icon className="h-7 w-auto flex-shrink-0" /> : <span className="text-xs font-bold text-amber-400 uppercase">QRIS</span>}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground/80">{m.provider ? m.provider.charAt(0).toUpperCase() + m.provider.slice(1) : "QRIS"}</p>
                      <p className="text-[11px] text-muted-foreground/50">Scan QRIS untuk pembayaran</p>
                    </div>
                    <a href={m.qrisImageUrl} download className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-colors flex-shrink-0">
                      <Download className="h-3 w-3" /> Download
                    </a>
                  </div>
                );
              }
              return (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-amber-500/15 bg-black/20 px-4 py-3">
                  {Icon ? <Icon className="h-7 w-auto flex-shrink-0" /> : (
                    <span className="rounded border border-border/40 bg-muted/20 px-2 py-1 text-[10px] font-bold text-muted-foreground/60 uppercase flex-shrink-0">
                      {m.bank ?? m.provider ?? m.type}
                    </span>
                  )}
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

      <div className="mt-8 prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground">
        <p className="leading-relaxed">{event.description}</p>
      </div>

      {isUpcoming && (
        <div className="mt-10 glass-card overflow-hidden rounded-2xl">
          <div className="bg-gradient-to-r from-primary/20 via-primary/8 to-transparent px-6 py-5 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
                <Swords className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-black text-base">Daftarkan Tim Kamu!</h2>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  {(event as any).registrationopen ? "Pendaftaran masih dibuka" : "Pendaftaran sedang ditutup"}
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              {(event as any).gametype === "ml"
                ? "Siapkan 5 pemain terbaikmu dan daftarkan tim sekarang. Slot terbatas!"
                : "Daftarkan diri dan dapatkan info lengkap di Discord Soraku."}
            </p>
            <div className="flex items-center gap-3 flex-shrink-0">
              {(event as any).registrationopen ? (
                <>
                  {(event as any).registrationurl ? (
                    <a href={(event as any).registrationurl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-black text-white hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20">
                      <Swords className="h-4 w-4" /> Daftar Sekarang <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (event as any).gametype === "ml" ? (
                    <Link href={`/events/${event.slug}/daftar`}
                      className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-black text-white hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20">
                      <Swords className="h-4 w-4" /> Daftar Tim ML
                    </Link>
                  ) : null}
                </>
              ) : (
                <a href="https://discord.gg/CJJ7KEJMbg" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors">
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
