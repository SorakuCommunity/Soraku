"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, Users, UserPlus, Shield,
  ChevronRight, Loader2, CheckCircle2, AlertCircle,
  Swords, X, Plus, Star, Trophy, Upload,
} from "lucide-react";
import { ImageUrlInput } from "@/components/ui/image-url-input";
import { cn } from "@/lib/utils";
import {
  BCAIcon, BRIIcon, BTNIcon, SeabankIcon, DanaIcon, QRISIcon, GopayIcon,
} from "@/components/icons/custom-icons";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Player { name: string; role: string; }

type PaymentMethod = {
  type: "bank" | "ewallet" | "qris";
  bank?: string; provider?: string; account?: string; name?: string; qrisImageUrl?: string;
};

interface EventInfo {
  id: string; title: string; slug: string; coverurl: string | null;
  startdate: string; registrationurl: string | null; gametype: string | null;
  ispaid: boolean; price: number | null; priceinfo: string | null;
  paymentmethods: PaymentMethod[] | null;
}

const ROLES_ML = ["Goldlaner", "Jungler", "Midlaner", "Roamer", "EXP Laner", "Hyper"] as const;
const EMPTY_PLAYER = (): Player => ({ name: "", role: "" });

const PAYMENT_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  bca: BCAIcon, bri: BRIIcon, btn: BTNIcon, seabank: SeabankIcon,
  dana: DanaIcon, qris: QRISIcon, gopay: GopayIcon,
};

function getPaymentKey(m: PaymentMethod): string {
  if (m.type === "qris") return m.provider?.toLowerCase() ?? "qris";
  if (m.type === "bank") return (m.bank ?? "").toLowerCase();
  return (m.provider ?? "").toLowerCase();
}

// ─── Step indicator ──────────────────────────────────────────────────────────

function Steps({ current }: { current: number }) {
  const steps = [
    { n: 1, icon: Shield, label: "Info Tim" },
    { n: 2, icon: Users,  label: "Pemain" },
    { n: 3, icon: Star,   label: "Preview" },
  ];
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center gap-2">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl transition-all text-[11px] font-black",
            current === s.n ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110"
            : current > s.n ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-border/20 text-foreground/25"
          )}>
            {current > s.n ? "✓" : s.n}
          </div>
          <span className={cn("text-[11px] font-bold hidden sm:block", current === s.n ? "text-primary" : "text-foreground/25")}>
            {s.label}
          </span>
          {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-foreground/15 mx-1" />}
        </div>
      ))}
    </div>
  );
}

// ─── Player Card ─────────────────────────────────────────────────────────────

function PlayerCard({
  player, index, isReserve, onChange, onRemove, canRemove,
}: {
  player: Player; index: number; isReserve: boolean;
  onChange: (p: Player) => void; onRemove: () => void; canRemove: boolean;
}) {
  return (
    <div className={cn(
      "relative rounded-2xl border p-4 space-y-3 transition-all",
      isReserve ? "border-yellow-500/20 bg-yellow-500/5" : "border-primary/25 bg-primary/5",
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-black",
            isReserve ? "bg-yellow-500/20 text-yellow-400" : "bg-primary/20 text-primary")}>
            {index + 1}
          </div>
          <span className={cn("text-[10px] font-black uppercase tracking-widest",
            isReserve ? "text-yellow-400/60" : "text-primary/60")}>
            {isReserve ? "Cadangan" : "Pemain"}
          </span>
        </div>
        {canRemove && (
          <button type="button" onClick={onRemove}
            className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/10 text-red-400/60 hover:bg-red-500/20 hover:text-red-400 transition-colors">
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">
            Nama Lengkap / IGN *
          </label>
          <input
            value={player.name} onChange={e => onChange({ ...player, name: e.target.value })}
            placeholder="Nama asli atau IGN"
            className="w-full rounded-xl border border-border/40 bg-black/30 px-3 py-2.5 text-sm outline-none placeholder:text-foreground/15 focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">Role</label>
          <select value={player.role} onChange={e => onChange({ ...player, role: e.target.value })}
            className="w-full rounded-xl border border-border/40 bg-[#12141a] px-3 py-2.5 text-sm outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all">
            <option value="">Pilih role…</option>
            {ROLES_ML.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EventRegisterPage() {
  const params  = useParams();
  const router  = useRouter();
  const slug    = params.slug as string;

  const [event,   setEvent]   = useState<EventInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [step,    setStep]    = useState(1);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [regId,   setRegId]   = useState("");

  // Form state
  const [teamname,        setTeamname]        = useState("");
  const [teamlogourl,     setTeamlogourl]     = useState("");
  const [activeplayers,   setActiveplayers]   = useState<Player[]>([EMPTY_PLAYER(), EMPTY_PLAYER(), EMPTY_PLAYER(), EMPTY_PLAYER(), EMPTY_PLAYER()]);
  const [reserveplayers,  setReserveplayers]  = useState<Player[]>([]);
  const [contactname,     setContactname]     = useState("");
  const [contactdiscord,  setContactdiscord]  = useState("");
  const [notes,           setNotes]           = useState("");
  const [paymentproof,    setPaymentproof]    = useState("");
  const [uploading,       setUploading]       = useState(false);
  const [sessionUserId,   setSessionUserId]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.data?.id) setSessionUserId(d.data.id);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`/api/events/${slug}`)
      .then(r => r.json())
      .then(d => {
        if (!d.data) { router.push("/events"); return; }
        const ev = d.data;
        if (ev.gametype !== "ml" && ev.registrationurl) { window.location.href = ev.registrationurl; return; }
        if (ev.gametype !== "ml" && !ev.registrationurl) { router.push(`/events/${slug}`); return; }
        setEvent(ev);
      })
      .catch(() => router.push("/events"))
      .finally(() => setLoading(false));
  }, [slug, router]);

  const updateActive  = useCallback((i: number, p: Player) => setActiveplayers(prev => prev.map((v, idx) => idx === i ? p : v)), []);
  const updateReserve = useCallback((i: number, p: Player) => setReserveplayers(prev => prev.map((v, idx) => idx === i ? p : v)), []);

  const canGoStep2 = teamname.trim().length >= 2;
  const canGoStep3 = activeplayers.every(p => p.name.trim().length > 0);

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "events");
      fd.append("folder", "payment-proof");
      const res  = await fetch("/api/upload/image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) return null;
      return data?.data?.url ?? null;
    } catch { return null; }
    finally { setUploading(false); }
  };

  const handleSubmit = async () => {
    if (event?.ispaid && !paymentproof.trim()) {
      setError("Bukti pembayaran wajib diisi untuk event berbayar.");
      return;
    }
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/events/${slug}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamname:       teamname.trim(),
          teamlogourl:    teamlogourl.trim() || undefined,
          activeplayers:  activeplayers.filter(p => p.name.trim()),
          reserveplayers: reserveplayers.filter(p => p.name.trim()),
          contactname:    contactname.trim() || undefined,
          contactdiscord: contactdiscord.trim() || undefined,
          notes:          notes.trim() || undefined,
          paymentproof:   paymentproof.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data?.error?.message ?? "Gagal mendaftar."); return; }
      setRegId(data.data?.id ?? "");
      setSuccess(true);
    } catch { setError("Koneksi gagal. Coba lagi."); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
    </div>
  );

  if (!sessionUserId) return (
    <div className="mx-auto max-w-md px-4 py-20 text-center space-y-5">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mx-auto">
        <Swords className="h-8 w-8 text-primary/50" />
      </div>
      <div>
        <h1 className="text-xl font-black">Login Dulu!</h1>
        <p className="mt-2 text-sm text-foreground/50">Kamu harus login untuk mendaftar event ini.</p>
      </div>
      <div className="flex justify-center gap-3">
        <Link href={`/login?next=/events/${slug}/daftar`}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors">
          Login / Daftar
        </Link>
        <Link href={`/events/${slug}`}
          className="flex items-center gap-2 rounded-xl border border-border/50 px-5 py-2.5 text-sm font-semibold text-foreground/60 hover:text-foreground transition-colors">
          Kembali
        </Link>
      </div>
    </div>
  );

  if (success) return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-6">
      <div className="relative mx-auto h-24 w-24">
        <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-green-500/40 bg-green-500/10">
          <Trophy className="h-10 w-10 text-green-400" />
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-black text-green-400">Pendaftaran Berhasil!</h1>
        <p className="mt-2 text-sm text-foreground/50">Tim <span className="font-bold text-foreground">{teamname}</span> sudah terdaftar.</p>
        {regId && <p className="mt-2 text-[11px] font-mono text-foreground/25">ID: {regId.slice(0, 8).toUpperCase()}</p>}
      </div>
      <p className="text-sm text-foreground/40 leading-relaxed max-w-sm mx-auto">
        Tim kamu sudah tercatat. Pantau pengumuman di Discord atau halaman event untuk info selanjutnya.
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <Link href={`/events/${slug}`}
          className="flex items-center gap-2 rounded-xl border border-border/50 px-5 py-2.5 text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Event
        </Link>
        <Link href="/events"
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors">
          Lihat Event Lain
        </Link>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12 space-y-6">

      {/* Header */}
      <div className="space-y-4">
        <Link href={`/events/${slug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-foreground/40 hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali
        </Link>
        <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-r from-primary/15 via-primary/8 to-transparent">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(79,163,209,0.03)_10px,rgba(79,163,209,0.03)_11px)]" />
          <div className="relative flex items-center gap-4 px-5 py-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
              <Swords className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Pendaftaran Event</p>
              <p className="text-sm font-bold truncate">{event?.title ?? "—"}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl px-5 py-3.5">
          <Steps current={step} />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
          <button onClick={() => setError("")} className="ml-auto"><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {/* ════════ STEP 1: Info Tim + Bukti Bayar ════════ */}
      {step === 1 && (
        <div className="glass-card rounded-3xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest">Informasi Tim</h2>
              <p className="text-[11px] text-foreground/35">Identitas tim yang akan didaftarkan</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                Nama Tim <span className="text-red-400">*</span>
              </label>
              <input value={teamname} onChange={e => setTeamname(e.target.value)}
                placeholder="Contoh: Soraku Esports"
                className="w-full rounded-xl border border-border/60 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-foreground/20 focus:border-primary/60 focus:bg-black/50 focus:ring-2 focus:ring-primary/10 transition-all" />
            </div>

            <ImageUrlInput label="Logo Tim" value={teamlogourl} onChange={setTeamlogourl}
              placeholder="https://cdn.example.com/logo.png"
              hint="Paste URL, drag & drop, atau Ctrl+V gambar langsung" compact
              icon={<Shield className="h-3 w-3" />}
              className="bg-black/30 border-border/40 focus:border-primary/40" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Nama Kontak PIC</label>
                <input value={contactname} onChange={e => setContactname(e.target.value)}
                  placeholder="Nama kamu"
                  className="w-full rounded-xl border border-border/60 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-foreground/20 focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Discord PIC</label>
                <input value={contactdiscord} onChange={e => setContactdiscord(e.target.value)}
                  placeholder="username#0000"
                  className="w-full rounded-xl border border-border/60 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-foreground/20 focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Catatan Tambahan</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} maxLength={500}
                placeholder="Ada yang ingin disampaikan? (opsional)"
                className="w-full resize-none rounded-xl border border-border/40 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-foreground/15 focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all" />
            </div>

            {/* ─── Upload Bukti Bayar (step 1, jika event berbayar) ─── */}
            {event?.ispaid && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30">
                    <Trophy className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-amber-400/80">
                      Bukti Pembayaran <span className="text-red-400">*</span>
                    </p>
                    {event.price && <p className="text-[11px] text-amber-400/50">Rp {event.price.toLocaleString("id-ID")}</p>}
                  </div>
                </div>

                {/* Info metode pembayaran dari admin */}
                {event.paymentmethods && event.paymentmethods.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/50">Bayar ke:</p>
                    {event.paymentmethods.map((m, i) => {
                      const key  = getPaymentKey(m);
                      const Icon = PAYMENT_ICON_MAP[key];
                      if (m.type === "qris") {
                        return (
                          <div key={i} className="flex items-center gap-3 rounded-xl border border-amber-500/15 bg-black/20 px-4 py-3">
                            {Icon ? <Icon className="h-7 w-auto flex-shrink-0" /> : <span className="text-xs font-bold text-amber-400 uppercase flex-shrink-0">QRIS</span>}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-foreground/80">{m.provider ? m.provider.charAt(0).toUpperCase() + m.provider.slice(1) : "QRIS"}</p>
                              <p className="text-[11px] text-muted-foreground/50">Scan QRIS untuk bayar</p>
                            </div>
                            <a href={m.qrisImageUrl} download className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-colors flex-shrink-0">
                              ↓ QRIS
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
                )}

                {/* Upload file */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-amber-400/60">
                    Screenshot Bukti Transfer <span className="text-red-400">*</span>
                  </label>
                  <label className={`flex items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-all py-6 ${
                    paymentproof ? "border-green-500/30 bg-green-500/5" : "border-amber-500/25 bg-amber-500/5 hover:border-amber-500/40 hover:bg-amber-500/8"
                  }`}>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await uploadImage(file);
                        if (url) setPaymentproof(url);
                        else setError("Gagal upload gambar. Coba paste URL manual.");
                      }} />
                    {uploading ? (
                      <div className="flex items-center gap-2 text-amber-400/70 text-xs">
                        <Loader2 className="h-4 w-4 animate-spin" /> Mengupload...
                      </div>
                    ) : paymentproof ? (
                      <div className="flex flex-col items-center gap-1.5">
                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                        <p className="text-xs font-bold text-green-400">Bukti terupload!</p>
                        <p className="text-[10px] text-foreground/30">Klik untuk ganti</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5">
                        <Upload className="h-6 w-6 text-amber-400/50" />
                        <p className="text-xs font-semibold text-amber-400/70">Klik untuk upload gambar</p>
                        <p className="text-[10px] text-foreground/30">JPG, PNG, WebP — maks 5MB</p>
                      </div>
                    )}
                  </label>

                  {paymentproof && (
                    <div className="relative rounded-xl overflow-hidden border border-green-500/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={paymentproof} alt="Bukti bayar" className="w-full max-h-48 object-contain bg-black/20" />
                      <button type="button" onClick={() => setPaymentproof("")}
                        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-lg bg-background/80 text-xs text-muted-foreground hover:text-destructive transition-colors">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] text-amber-400/40">atau paste URL gambar</label>
                    <input type="text" value={paymentproof} onChange={e => setPaymentproof(e.target.value)}
                      placeholder="https://i.imgur.com/..."
                      className="w-full rounded-xl border border-amber-500/20 bg-black/20 px-3 py-2 text-xs outline-none placeholder:text-foreground/15 focus:border-amber-500/30 transition-all" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={() => { if (!canGoStep2) { setError("Nama tim wajib diisi."); return; } setError(""); setStep(2); }}
              className={cn("flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all",
                canGoStep2 ? "bg-primary text-white hover:-translate-y-0.5 shadow-lg shadow-primary/20" : "bg-border/20 text-foreground/25 cursor-not-allowed")}>
              Lanjut ke Pemain <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ════════ STEP 2: Pemain ════════ */}
      {step === 2 && (
        <div className="space-y-5">
          {/* Pemain Aktif */}
          <div className="glass-card rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest">Pemain Aktif</h2>
                  <p className="text-[11px] text-foreground/35">Minimal 1 pemain, maksimal 10</p>
                </div>
              </div>
              {activeplayers.length < 10 && (
                <button type="button" onClick={() => setActiveplayers(prev => [...prev, EMPTY_PLAYER()])}
                  className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/8 px-3 py-1.5 text-xs font-bold text-primary/80 hover:bg-primary/15 transition-colors">
                  <Plus className="h-3 w-3" /> Tambah
                </button>
              )}
            </div>
            <div className="space-y-3">
              {activeplayers.map((p, i) => (
                <PlayerCard key={i} player={p} index={i} isReserve={false}
                  onChange={np => updateActive(i, np)}
                  onRemove={() => setActiveplayers(prev => prev.filter((_, idx) => idx !== i))}
                  canRemove={activeplayers.length > 1} />
              ))}
            </div>
          </div>

          {/* Pemain Cadangan */}
          <div className="glass-card rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/15 border border-yellow-500/25">
                  <UserPlus className="h-4 w-4 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest">Pemain Cadangan</h2>
                  <p className="text-[11px] text-foreground/35">Opsional · Maksimal 5 pemain</p>
                </div>
              </div>
              {reserveplayers.length < 5 && (
                <button type="button" onClick={() => setReserveplayers(prev => [...prev, EMPTY_PLAYER()])}
                  className="flex items-center gap-1.5 rounded-xl border border-yellow-500/30 bg-yellow-500/8 px-3 py-1.5 text-xs font-bold text-yellow-400/80 hover:bg-yellow-500/15 transition-colors">
                  <Plus className="h-3 w-3" /> Tambah
                </button>
              )}
            </div>
            {reserveplayers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/30 px-4 py-6 text-center">
                <p className="text-xs text-foreground/25">Belum ada pemain cadangan</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reserveplayers.map((p, i) => (
                  <PlayerCard key={i} player={p} index={i} isReserve={true}
                    onChange={np => updateReserve(i, np)}
                    onRemove={() => setReserveplayers(prev => prev.filter((_, idx) => idx !== i))}
                    canRemove={true} />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button onClick={() => { setError(""); setStep(1); }}
              className="flex items-center gap-2 rounded-xl border border-border/50 px-4 py-2.5 text-sm font-semibold text-foreground/60 hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Kembali
            </button>
            <button onClick={() => { if (!canGoStep3) { setError("Isi nama semua pemain aktif terlebih dahulu."); return; } setError(""); setStep(3); }}
              className={cn("flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all",
                canGoStep3 ? "bg-primary text-white hover:-translate-y-0.5 shadow-lg shadow-primary/20" : "bg-border/20 text-foreground/25 cursor-not-allowed")}>
              Preview <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ════════ STEP 3: Preview / Konfirmasi ════════ */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="glass-card rounded-3xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/15 border border-green-500/25">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest">Preview Pendaftaran</h2>
                <p className="text-[11px] text-foreground/35">Cek kembali sebelum submit</p>
              </div>
            </div>

            {/* Team summary */}
            <div className="rounded-2xl border border-border/40 bg-black/20 p-4 space-y-3">
              <div className="flex items-center gap-3">
                {teamlogourl ? (
                  <div className="h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden border border-border/40">
                    <Image src={teamlogourl} alt="logo" width={48} height={48} className="h-full w-full object-cover" onError={() => setTeamlogourl("")} />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                    <Shield className="h-5 w-5 text-primary/50" />
                  </div>
                )}
                <div>
                  <p className="text-lg font-black">{teamname}</p>
                  {contactname && <p className="text-xs text-foreground/40">PIC: {contactname}{contactdiscord ? ` · ${contactdiscord}` : ""}</p>}
                </div>
              </div>
            </div>

            {/* Players */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/50">Pemain Aktif ({activeplayers.filter(p => p.name).length})</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {activeplayers.filter(p => p.name).map((p, i) => (
                  <div key={i} className="flex items-center gap-2.5 rounded-xl border border-primary/15 bg-primary/5 px-3 py-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-primary/20 text-[10px] font-black text-primary">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate">{p.name}</p>
                      {p.role && <p className="text-[10px] text-foreground/35">{p.role}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {reserveplayers.filter(p => p.name).length > 0 && (
                <>
                  <p className="text-[10px] font-black uppercase tracking-widest text-yellow-500/50">
                    Pemain Cadangan ({reserveplayers.filter(p => p.name).length})
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {reserveplayers.filter(p => p.name).map((p, i) => (
                      <div key={i} className="flex items-center gap-2.5 rounded-xl border border-yellow-500/15 bg-yellow-500/5 px-3 py-2.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-yellow-500/20 text-[10px] font-black text-yellow-400">C{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate">{p.name}</p>
                          {p.role && <p className="text-[10px] text-foreground/35">{p.role}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {notes && (
              <div className="rounded-xl border border-border/30 bg-black/20 px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">Catatan</p>
                <p className="text-xs text-foreground/60">{notes}</p>
              </div>
            )}

            {/* Bukti bayar preview */}
            {event?.ispaid && paymentproof && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-400/70">Bukti Pembayaran</p>
                <div className="relative rounded-xl overflow-hidden border border-amber-500/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={paymentproof} alt="Bukti bayar" className="w-full max-h-48 object-contain bg-black/20" />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button onClick={() => { setError(""); setStep(2); }}
              className="flex items-center gap-2 rounded-xl border border-border/50 px-4 py-2.5 text-sm font-semibold text-foreground/60 hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Kembali
            </button>
            <button onClick={handleSubmit} disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-primary px-7 py-2.5 text-sm font-black text-white hover:-translate-y-0.5 hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all disabled:opacity-50 disabled:translate-y-0">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4" />}
              {saving ? "Mendaftarkan…" : "Daftarkan Tim!"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
