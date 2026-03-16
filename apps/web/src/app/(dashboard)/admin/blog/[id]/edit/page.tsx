"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Loader2, Plus, X, AlertCircle } from "lucide-react";

export default function AdminBlogEditPage() {
  const router    = useRouter();
  const { id }    = useParams<{ id: string }>();

  const [fetching,    setFetching]    = useState(true);
  const [fetchError,  setFetchError]  = useState<string | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [saveError,   setSaveError]   = useState<string | null>(null);

  const [title,       setTitle]       = useState("");
  const [slug,        setSlug]        = useState("");
  const [excerpt,     setExcerpt]     = useState("");
  const [content,     setContent]     = useState("");
  const [coverurl,    setCoverurl]     = useState("");
  const [tagInput,    setTagInput]    = useState("");
  const [tags,        setTags]        = useState<string[]>([]);
  const [ispublished, setIspublished] = useState(false);

  // Fetch data existing untuk prefill
  useEffect(() => {
    if (!id) return;
    (async () => {
      const res  = await fetch(`/api/admin/blog/${id}`);
      const json = await res.json();
      if (!res.ok) { setFetchError(json?.error?.message ?? "Artikel tidak ditemukan."); setFetching(false); return; }
      const d = json.data;
      setTitle(d.title ?? "");
      setSlug(d.slug ?? "");
      setExcerpt(d.excerpt ?? "");
      setContent(d.content ?? "");
      setCoverurl(d.coverurl ?? "");
      setTags(d.tags ?? []);
      setIspublished(d.ispublished ?? false);
      setFetching(false);
    })();
  }, [id]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const handleSubmit = async (publish: boolean) => {
    if (!title.trim() || !slug.trim()) { setSaveError("Judul dan slug wajib diisi."); return; }
    setLoading(true); setSaveError(null);
    const res = await fetch(`/api/admin/blog/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(), slug: slug.trim(),
        excerpt:  excerpt.trim()  || undefined,
        content:  content.trim()  || undefined,
        coverurl: coverurl.trim() || "",
        tags, ispublished: publish,
      }),
    });
    const data = await res.json();
    if (!res.ok) { setSaveError(data?.error?.message ?? "Gagal menyimpan."); setLoading(false); return; }
    router.push("/admin/blog");
  };

  if (fetching) return (
    <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
      <Loader2 className="h-5 w-5 animate-spin" /> Memuat artikel...
    </div>
  );

  if (fetchError) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <AlertCircle className="h-8 w-8 text-destructive/60" />
      <p className="text-sm text-muted-foreground">{fetchError}</p>
      <Link href="/admin/blog" className="text-xs text-primary hover:underline">← Kembali ke Blog</Link>
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Edit Artikel</h1>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate max-w-[200px]">{slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleSubmit(false)} disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Simpan Draft
          </button>
          <button onClick={() => handleSubmit(true)} disabled={loading}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
            {ispublished ? "Update & Publish" : "Publish"}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {saveError}
        </div>
      )}

      {ispublished && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-xs text-green-400 font-medium">
          ● Artikel ini sedang dipublikasikan — perubahan langsung live setelah disimpan.
        </div>
      )}

      <div className="space-y-4">
        {/* Judul & Slug */}
        <div className="glass-card p-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Judul <span className="text-destructive">*</span>
            </label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Judul artikel..."
              className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Slug <span className="text-destructive">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground/50">/blog/</span>
              <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="url-artikel"
                className="flex-1 rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground/50">⚠ Mengubah slug akan memutus link lama yang sudah tersebar.</p>
          </div>
        </div>

        {/* Excerpt */}
        <div className="glass-card p-5">
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Excerpt / Ringkasan</label>
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2}
            placeholder="Ringkasan singkat artikel (opsional)..."
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>

        {/* Content */}
        <div className="glass-card p-5">
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Konten (Markdown)</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={14}
            placeholder="Tulis artikel di sini... (mendukung Markdown)"
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>

        {/* Cover + Tags */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card p-5">
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cover URL</label>
            <input value={coverurl} onChange={e => setCoverurl(e.target.value)} placeholder="https://..."
              className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            {coverurl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverurl} alt="preview" className="mt-3 h-24 w-full rounded-xl object-cover"
                onError={e => (e.currentTarget.style.display = "none")} />
            )}
          </div>
          <div className="glass-card p-5">
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tags</label>
            <div className="flex gap-2 mb-3">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Tambah tag..." className="flex-1 rounded-xl border border-border bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
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
