"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, Eye, Loader2, Plus, X, Wifi, MapPin,
  Gamepad2, Swords,
} from "lucide-react";
import { ImageUrlInput } from "@/components/ui/image-url-input";
import { cn } from "@/lib/utils";

// ─── Game Types ────────────────────────────────────────────────────────────

const GAME_OPTIONS = [
  { value: "",           label: "Pilih game / tipe event",  emoji: "🎮", desc: "" },
  { value: "ml",         label: "Mobile Legends: Bang Bang", emoji: "⚔️",  desc: "Pendaftaran tim ML tersedia" },
  { value: "valorant",   label: "Valorant",                  emoji: "🔫",  desc: "" },
  { value: "freefire",   label: "Free Fire",                 emoji: "🔥",  desc: "" },
  { value: "pubg",       label: "PUBG Mobile",               emoji: "🪖",  desc: "" },
  { value: "chess",      label: "Catur / Chess",             emoji: "♟️",  desc: "" },
  { value: "other",      label: "Lainnya / Umum",            emoji: "🎲",  desc: "" },
] as const;

type GameValue = "" | "ml" | "valorant" | "freefire" | "pubg" | "chess" | "other";

export default function AdminEventNewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const [title,       setTitle]       = useState("");
  const [slug,        setSlug]        = useState("");
  const [description, setDescription] = useState("");
  const [coverurl,    setCoverurl]    = useState("");
  const [startdate,   setStartdate]   = useState("");
  const [enddate,     setEnddate]     = useState("");
  const [isonline,    setIsonline]    = useState(true);
  const [location,    setLocation]    = useState("");
  const [tagInput,    setTagInput]    = useState("");
  const [tags,        setTags]        = useState<string[]>([]);
  const [regUrl,      setRegUrl]      = useState("");
  const [gametype,    setGametype]    = useState<GameValue>("");

  const selectedGame = GAME_OPTIONS.find(g => g.value === gametype);

  const handleTitle = (v: string) => {
    setTitle(v);
    setSlug(
      v.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
    );
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const handleSubmit = async (publish: boolean) => {
    if (!title.trim() || !slug.trim() || !startdate) {
      setError("Judul, slug, dan tanggal mulai wajib diisi.");
      return;
    }
    setLoading(true); setError(null);

    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title:           title.trim(),
        slug:            slug.trim(),
        description:     description.trim() || undefined,
        coverurl:        coverurl.trim() || undefined,
        startdate,
        enddate:         enddate || undefined,
        isonline,
        location:        !isonline ? location.trim() || undefined : undefined,
        tags,
        registrationurl: regUrl.trim() || undefined,
        gametype:        gametype || undefined,
        ispublished:     publish,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data?.error?.message ?? "Gagal menyimpan event.");
      setLoading(false);
      return;
    }
    router.push("/admin/events");
  };

  const fieldCls = "w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/events"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Buat Event Baru</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Event · Admin Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleSubmit(false)} disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Draft
          </button>
          <button onClick={() => handleSubmit(true)} disabled={loading}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
            Publish
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)}><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      <div className="space-y-4">
        {/* ── Game Type selector ── */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Gamepad2 className="h-4 w-4 text-primary" />
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Tipe Game / Event
            </label>
          </div>

          {/* Grid pilihan game */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {GAME_OPTIONS.slice(1).map(opt => (
              <button key={opt.value} type="button"
                onClick={() => setGametype(opt.value as GameValue)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-medium text-left transition-all",
                  gametype === opt.value
                    ? "border-primary/50 bg-primary/10 text-primary shadow-sm"
                    : "border-border text-muted-foreground hover:border-border hover:bg-muted/30"
                )}>
                <span className="text-base leading-none">{opt.emoji}</span>
                <span className="truncate text-xs font-semibold">{opt.label}</span>
                {opt.desc && gametype === opt.value && (
                  <span className="ml-auto text-[10px] text-primary/60 hidden sm:block shrink-0">✓ form aktif</span>
                )}
              </button>
            ))}
          </div>

          {/* Info badge kalau ML dipilih */}
          {gametype === "ml" && (
            <div className="flex items-center gap-2.5 rounded-xl border border-primary/25 bg-primary/8 px-3.5 py-3">
              <Swords className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-primary">Form Pendaftaran Tim ML Aktif</p>
                <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                  Peserta bisa daftar lewat <code className="text-primary/70">/events/{slug || "[slug]"}/daftar</code>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Judul & Slug */}
        <div className="glass-card p-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Nama Event <span className="text-destructive">*</span>
            </label>
            <input value={title} onChange={e => handleTitle(e.target.value)}
              placeholder="Nama event..." className={fieldCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Slug <span className="text-destructive">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground/50">/events/</span>
              <input value={slug} onChange={e => setSlug(e.target.value)}
                placeholder="url-event" className={cn(fieldCls, "flex-1 font-mono")} />
            </div>
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
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Tanggal <span className="text-destructive">*</span>
            </label>
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
              <input value={location} onChange={e => setLocation(e.target.value)}
                placeholder="Nama lokasi / alamat..." className={fieldCls} />
            )}
          </div>
        </div>

        {/* Link Pendaftaran (opsional - override form ML) */}
        <div className="glass-card p-5">
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Link Pendaftaran Eksternal{" "}
            <span className="font-normal normal-case text-muted-foreground/40">(opsional)</span>
          </label>
          <input type="url" value={regUrl} onChange={e => setRegUrl(e.target.value)}
            placeholder="https://forms.gle/... atau link pendaftaran lain" className={fieldCls} />
          <p className="mt-1.5 text-[11px] text-muted-foreground/40">
            {gametype === "ml"
              ? "Kosongkan untuk menggunakan form pendaftaran tim ML bawaan Soraku."
              : "Isi jika punya form pendaftaran eksternal."}
          </p>
        </div>

        {/* Cover + Tags */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card p-5">
            <ImageUrlInput
              label="Cover / Banner"
              value={coverurl}
              onChange={setCoverurl}
              placeholder="https://... atau paste gambar langsung"
              hint="Rekomendasi: 1280×360px. Paste URL, drag & drop, atau Ctrl+V."
              previewClass="h-28"
              required={false}
            />
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
