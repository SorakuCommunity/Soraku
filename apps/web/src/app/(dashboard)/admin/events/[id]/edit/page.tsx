"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, Eye, Loader2, Plus, X, Wifi, MapPin,
  AlertCircle, CreditCard, Upload, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUrlInput } from "@/components/ui/image-url-input";
import {
  BCAIcon, BRIIcon, BTNIcon, SeabankIcon, DanaIcon, QRISIcon, GopayIcon,
} from "@/components/icons/custom-icons";

// ─── Types ─────────────────────────────────────────────────────────────────

type PaymentMethod =
  | { type: "bank";    bank: string;     account: string; name: string; }
  | { type: "ewallet"; provider: string; account: string; name: string; }
  | { type: "qris";    provider: string; qrisImageUrl: string;           };

const BANK_OPTIONS    = ["BCA", "BRI", "BTN", "Seabank"];
const EWALLET_OPTIONS = ["Dana"];
const QRIS_OPTIONS    = ["GoPay", "QRIS Umum"];

const PAYMENT_ICONS: Record<string, React.FC<{ className?: string }>> = {
  BCA: BCAIcon, BRI: BRIIcon, BTN: BTNIcon, Seabank: SeabankIcon,
  Dana: DanaIcon, GoPay: GopayIcon, "QRIS Umum": QRISIcon,
};

// ─── Payment Method Card ───────────────────────────────────────────────────

function PaymentMethodCard({
  method, index, onRemove, onChange, uploading, onUploadQris,
}: {
  method: PaymentMethod; index: number; onRemove: () => void;
  onChange: (m: PaymentMethod) => void; uploading: boolean;
  onUploadQris: (file: File, index: number) => void;
}) {
  const fieldCls = "w-full rounded-xl border border-border bg-background/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  if (method.type === "qris") {
    const Icon = PAYMENT_ICONS[method.provider] ?? QRISIcon;
    return (
      <div className="rounded-2xl border border-border/40 bg-card/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-6 w-auto" />
            <span className="text-xs font-bold text-foreground/70">{method.provider}</span>
          </div>
          <button type="button" onClick={onRemove}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-400/60 hover:bg-red-500/20 hover:text-red-400 transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <label className={cn("flex items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-all py-5",
          method.qrisImageUrl ? "border-green-500/30 bg-green-500/5" : "border-primary/25 bg-primary/5 hover:border-primary/40")}>
          <input type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) onUploadQris(f, index); }} />
          {uploading ? (
            <div className="flex items-center gap-2 text-primary/60 text-xs"><Loader2 className="h-4 w-4 animate-spin" /> Mengupload...</div>
          ) : method.qrisImageUrl ? (
            <div className="flex flex-col items-center gap-1">
              <QRISIcon className="h-10 w-auto opacity-60" />
              <p className="text-xs font-bold text-green-400">QRIS terupload! Klik ganti</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Upload className="h-5 w-5 text-primary/40" />
              <p className="text-xs text-foreground/40">Klik untuk upload QRIS</p>
            </div>
          )}
        </label>
        {method.qrisImageUrl && (
          <div className="relative rounded-xl overflow-hidden border border-border/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={method.qrisImageUrl} alt="QRIS" className="w-full max-h-32 object-contain bg-black/10" />
            <button type="button" onClick={() => onChange({ ...method, qrisImageUrl: "" })}
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-lg bg-background/80 hover:text-destructive transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  const name = method.type === "bank" ? method.bank : method.provider;
  const Icon = PAYMENT_ICONS[name] ?? CreditCard;
  return (
    <div className="rounded-2xl border border-border/40 bg-card/30 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-6 w-auto" />
          <span className="text-xs font-bold text-foreground/70">{name} — {method.type === "bank" ? "Bank" : "E-Wallet"}</span>
        </div>
        <button type="button" onClick={onRemove}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-400/60 hover:bg-red-500/20 hover:text-red-400 transition-colors">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-1 block">Nomor Rekening / Akun</label>
          <input value={method.account} onChange={e => onChange({ ...method, account: e.target.value } as PaymentMethod)}
            placeholder={method.type === "bank" ? "1234567890" : "081234567890"} className={fieldCls} />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-1 block">Nama Pemilik</label>
          <input value={method.name} onChange={e => onChange({ ...method, name: e.target.value } as PaymentMethod)}
            placeholder="Nama a/n rekening" className={fieldCls} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminEventEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [fetching,   setFetching]   = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [saveError,  setSaveError]  = useState<string | null>(null);
  const [uploading,  setUploading]  = useState(false);

  const [title,          setTitle]          = useState("");
  const [slug,           setSlug]           = useState("");
  const [description,    setDescription]    = useState("");
  const [coverurl,       setCoverurl]       = useState("");
  const [startdate,      setStartdate]      = useState("");
  const [enddate,        setEnddate]        = useState("");
  const [isonline,       setIsonline]       = useState(true);
  const [location,       setLocation]       = useState("");
  const [tagInput,       setTagInput]       = useState("");
  const [tags,           setTags]           = useState<string[]>([]);
  const [ispublished,    setIspublished]    = useState(false);
  const [ispaid,         setIspaid]         = useState(false);
  const [price,          setPrice]          = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [addingType,     setAddingType]     = useState<"bank" | "ewallet" | "qris" | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res  = await fetch(`/api/admin/events/${id}`);
      const json = await res.json();
      if (!res.ok) { setFetchError(json?.error?.message ?? "Event tidak ditemukan."); setFetching(false); return; }
      const d = json.data;
      setTitle(d.title ?? "");
      setSlug(d.slug ?? "");
      setDescription(d.description ?? "");
      setCoverurl(d.coverurl ?? "");
      setStartdate(d.startdate ? d.startdate.slice(0, 16) : "");
      setEnddate(d.enddate ? d.enddate.slice(0, 16) : "");
      setIsonline(d.isonline ?? true);
      setLocation(d.location ?? "");
      setTags(d.tags ?? []);
      setIspublished(d.ispublished ?? false);
      setIspaid(d.ispaid ?? false);
      setPrice(d.price ? String(d.price) : "");
      setPaymentMethods(d.paymentmethods ?? []);
      setFetching(false);
    })();
  }, [id]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const uploadQris = async (file: File, index: number) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "events");
      fd.append("folder", "qris");
      const res  = await fetch("/api/upload/image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data?.data?.url) { setSaveError("Gagal upload QRIS image."); return; }
      const url = data.data.url;
      setPaymentMethods(prev => prev.map((m, i) => i === index && m.type === "qris" ? { ...m, qrisImageUrl: url } : m));
    } catch { setSaveError("Gagal upload QRIS."); }
    finally { setUploading(false); }
  };

  const addPaymentMethod = (option: string, type: "bank" | "ewallet" | "qris") => {
    if (type === "qris") setPaymentMethods(prev => [...prev, { type: "qris", provider: option, qrisImageUrl: "" }]);
    else if (type === "bank") setPaymentMethods(prev => [...prev, { type: "bank", bank: option, account: "", name: "" }]);
    else setPaymentMethods(prev => [...prev, { type: "ewallet", provider: option, account: "", name: "" }]);
    setAddingType(null);
  };

  const handleSubmit = async (publish: boolean) => {
    if (!title.trim() || !slug.trim() || !startdate) {
      setSaveError("Judul, slug, dan tanggal mulai wajib diisi."); return;
    }
    setLoading(true); setSaveError(null);
    const res = await fetch(`/api/admin/events/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(), slug: slug.trim(),
        description: description.trim() || undefined,
        coverurl: coverurl.trim() || "",
        startdate, enddate: enddate || undefined,
        isonline, location: !isonline ? location.trim() || undefined : undefined,
        tags, ispublished: publish,
        ispaid, price: ispaid && price ? parseInt(price) : 0,
        paymentmethods: ispaid ? paymentMethods : [],
      }),
    });
    const data = await res.json();
    if (!res.ok) { setSaveError(data?.error?.message ?? "Gagal menyimpan."); setLoading(false); return; }
    router.push("/admin/events");
  };

  const fieldCls = "w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  if (fetching) return (
    <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
      <Loader2 className="h-5 w-5 animate-spin" /> Memuat event...
    </div>
  );

  if (fetchError) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <AlertCircle className="h-8 w-8 text-destructive/60" />
      <p className="text-sm text-muted-foreground">{fetchError}</p>
      <Link href="/admin/events" className="text-xs text-primary hover:underline">← Kembali ke Events</Link>
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/events"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Edit Event</h1>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate max-w-[200px]">{slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleSubmit(false)} disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Draft
          </button>
          <button onClick={() => handleSubmit(true)} disabled={loading}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
            {ispublished ? "Update & Publish" : "Publish"}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span className="flex-1">{saveError}</span>
          <button onClick={() => setSaveError(null)}><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {ispublished && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-xs text-green-400 font-medium">
          ● Event ini sedang dipublikasikan — perubahan langsung live setelah disimpan.
        </div>
      )}

      <div className="space-y-4">
        {/* Judul & Slug */}
        <div className="glass-card p-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nama Event <span className="text-destructive">*</span></label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nama event..." className={fieldCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Slug <span className="text-destructive">*</span></label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground/50">/events/</span>
              <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="url-event" className={cn(fieldCls, "flex-1 font-mono")} />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground/50">⚠ Mengubah slug akan memutus link lama.</p>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="glass-card p-5">
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Deskripsi</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
            placeholder="Deskripsi event..." className={cn(fieldCls, "resize-none")} />
        </div>

        {/* Tanggal & Tipe */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card p-5 space-y-3">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tanggal <span className="text-destructive">*</span></label>
            <div>
              <p className="text-xs text-muted-foreground/60 mb-1">Mulai</p>
              <input type="datetime-local" value={startdate} onChange={e => setStartdate(e.target.value)} className={fieldCls} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground/60 mb-1">Selesai (opsional)</p>
              <input type="datetime-local" value={enddate} onChange={e => setEnddate(e.target.value)} className={fieldCls} />
            </div>
          </div>
          <div className="glass-card p-5 space-y-3">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tipe Event</label>
            <div className="flex gap-2">
              <button onClick={() => setIsonline(true)}
                className={cn("flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors",
                  isonline ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-primary/5")}>
                <Wifi className="h-4 w-4" /> Online
              </button>
              <button onClick={() => setIsonline(false)}
                className={cn("flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors",
                  !isonline ? "border-green-500/50 bg-green-500/10 text-green-400" : "border-border text-muted-foreground hover:bg-green-500/5")}>
                <MapPin className="h-4 w-4" /> Offline
              </button>
            </div>
            {!isonline && (
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Nama lokasi / alamat..." className={fieldCls} />
            )}
          </div>
        </div>

        {/* Free / Berbayar + Payment Methods */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Biaya Pendaftaran</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setIspaid(false); setPaymentMethods([]); }}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${!ispaid ? "border-green-500/50 bg-green-500/10 text-green-400" : "border-border text-muted-foreground hover:bg-muted/30"}`}>
                🎟️ Gratis
              </button>
              <button type="button" onClick={() => setIspaid(true)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${ispaid ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : "border-border text-muted-foreground hover:bg-muted/30"}`}>
                💰 Berbayar
              </button>
            </div>
          </div>

          {ispaid && (
            <div className="space-y-4 pt-1">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground/60">Harga (Rupiah)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="50000" min="0" className={fieldCls} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5" /> Metode Pembayaran
                  </label>
                  {!addingType && (
                    <button type="button" onClick={() => setAddingType("bank")}
                      className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/8 px-3 py-1.5 text-xs font-bold text-primary/80 hover:bg-primary/15 transition-colors">
                      <Plus className="h-3 w-3" /> Tambah
                    </button>
                  )}
                </div>

                {paymentMethods.length > 0 && (
                  <div className="space-y-2">
                    {paymentMethods.map((m, i) => (
                      <PaymentMethodCard key={i} method={m} index={i}
                        onRemove={() => setPaymentMethods(prev => prev.filter((_, idx) => idx !== i))}
                        onChange={updated => setPaymentMethods(prev => prev.map((pm, idx) => idx === i ? updated : pm))}
                        uploading={uploading} onUploadQris={uploadQris} />
                    ))}
                  </div>
                )}

                {addingType && (
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-primary/70 uppercase tracking-widest">Tambah Metode Pembayaran</p>
                      <button type="button" onClick={() => setAddingType(null)}
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground/40 hover:text-foreground transition-colors">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2">Bank Transfer</p>
                      <div className="flex flex-wrap gap-2">
                        {BANK_OPTIONS.map(bank => {
                          const Icon = PAYMENT_ICONS[bank] ?? CreditCard;
                          return (
                            <button key={bank} type="button" onClick={() => addPaymentMethod(bank, "bank")}
                              className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/40 px-3 py-2 hover:border-primary/40 hover:bg-primary/5 transition-all">
                              <Icon className="h-6 w-auto" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2">E-Wallet</p>
                      <div className="flex flex-wrap gap-2">
                        {EWALLET_OPTIONS.map(ew => {
                          const Icon = PAYMENT_ICONS[ew] ?? CreditCard;
                          return (
                            <button key={ew} type="button" onClick={() => addPaymentMethod(ew, "ewallet")}
                              className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/40 px-3 py-2 hover:border-primary/40 hover:bg-primary/5 transition-all">
                              <Icon className="h-6 w-auto" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2">QRIS</p>
                      <div className="flex flex-wrap gap-2">
                        {QRIS_OPTIONS.map(q => {
                          const Icon = PAYMENT_ICONS[q] ?? QRISIcon;
                          return (
                            <button key={q} type="button" onClick={() => addPaymentMethod(q, "qris")}
                              className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/40 px-3 py-2 hover:border-primary/40 hover:bg-primary/5 transition-all">
                              <Icon className="h-7 w-auto" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethods.length === 0 && !addingType && (
                  <div className="rounded-xl border border-dashed border-border/30 px-4 py-5 text-center">
                    <p className="text-xs text-foreground/25">Belum ada metode pembayaran</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cover + Tags */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card p-5">
            <ImageUrlInput label="Cover / Banner" value={coverurl} onChange={setCoverurl}
              placeholder="https://... atau paste gambar langsung"
              hint="Rekomendasi: 1280×360px." previewClass="h-24" required={false} />
          </div>
          <div className="glass-card p-5">
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tags</label>
            <div className="flex gap-2 mb-3">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Tambah tag..." className={cn(fieldCls, "flex-1")} />
              <button onClick={addTag}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map(t => (
                <span key={t} className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                  {t}<button onClick={() => setTags(tags.filter(x => x !== t))}><X className="h-2.5 w-2.5" /></button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
