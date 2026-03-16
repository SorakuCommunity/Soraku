"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Loader2, Plus, X, Wifi, MapPin } from "lucide-react";

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
        title:       title.trim(),
        slug:        slug.trim(),
        description: description.trim() || undefined,
        coverurl:    coverurl.trim() || undefined,
        startdate,
        enddate:     enddate || undefined,
        isonline,
        location:    !isonline ? location.trim() || undefined : undefined,
        tags,
        ispublished: publish,
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
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Draft
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
            Publish
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      <div className="space-y-4">
        {/* Judul & Slug */}
        <div className="glass-card p-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Nama Event <span className="text-destructive">*</span>
            </label>
            <input value={title} onChange={e => handleTitle(e.target.value)} placeholder="Nama event..." className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Slug <span className="text-destructive">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground/50">/events/</span>
              <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="url-event" className="flex-1 rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="glass-card p-5">
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Deskripsi</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Deskripsi event..." className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>

        {/* Tanggal & Tipe */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card p-5 space-y-3">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Tanggal <span className="text-destructive">*</span>
            </label>
            <div>
              <p className="text-xs text-muted-foreground/60 mb-1">Mulai</p>
              <input type="datetime-local" value={startdate} onChange={e => setStartdate(e.target.value)} className="w-full rounded-xl border border-border bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground/60 mb-1">Selesai (opsional)</p>
              <input type="datetime-local" value={enddate} onChange={e => setEnddate(e.target.value)} className="w-full rounded-xl border border-border bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          </div>

          <div className="glass-card p-5 space-y-3">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tipe Event</label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsonline(true)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors ${isonline ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-primary/5"}`}
              >
                <Wifi className="h-4 w-4" /> Online
              </button>
              <button
                onClick={() => setIsonline(false)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors ${!isonline ? "border-green-500/50 bg-green-500/10 text-green-400" : "border-border text-muted-foreground hover:bg-green-500/5"}`}
              >
                <MapPin className="h-4 w-4" /> Offline
              </button>
            </div>
            {!isonline && (
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Nama lokasi / alamat..." className="w-full rounded-xl border border-border bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            )}
          </div>
        </div>

        {/* Cover + Tags */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card p-5">
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cover URL</label>
            <input value={coverurl} onChange={e => setCoverurl(e.target.value)} placeholder="https://..." className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            {coverurl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverurl} alt="preview" className="mt-3 h-24 w-full rounded-xl object-cover" onError={e => (e.currentTarget.style.display = "none")} />
            )}
          </div>
          <div className="glass-card p-5">
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tags</label>
            <div className="flex gap-2 mb-3">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Tambah tag..." className="flex-1 rounded-xl border border-border bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              <button onClick={addTag} className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Plus className="h-3.5 w-3.5" /></button>
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
