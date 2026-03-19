"use client";
export const dynamic = "force-dynamic";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, Eye, Loader2, Plus, X, Bold, Italic,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote,
  Code, Link2, Image as ImageIcon, Minus, Upload, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import { ImageUrlInput } from "@/components/ui/image-url-input";

function ToolbarBtn({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} title={label}
      className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/60 hover:bg-muted/40 hover:text-foreground transition-colors">
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function insertMarkdown(ref: React.RefObject<HTMLTextAreaElement>, setValue: (v: string) => void, before: string, after = "", placeholder = "teks") {
  const el = ref.current;
  if (!el) return;
  const start = el.selectionStart, end = el.selectionEnd;
  const sel = el.value.slice(start, end) || placeholder;
  const newVal = el.value.slice(0, start) + before + sel + after + el.value.slice(end);
  setValue(newVal);
  setTimeout(() => { el.focus(); const ns = start + before.length; el.setSelectionRange(ns, ns + sel.length); }, 0);
}

export default function AdminBlogEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const taRef  = useRef<HTMLTextAreaElement>(null);

  const [fetching,   setFetching]   = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [activeTab,  setActiveTab]  = useState<"write" | "preview">("write");
  const [uploading,  setUploading]  = useState(false);
  const [ispublished, setIspublished] = useState(false);

  const [title,    setTitle]    = useState("");
  const [slug,     setSlug]     = useState("");
  const [excerpt,  setExcerpt]  = useState("");
  const [content,  setContent]  = useState("");
  const [coverurl, setCoverurl] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags,     setTags]     = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res  = await fetch(`/api/admin/blog/${id}`);
      const json = await res.json();
      if (!res.ok) { setFetchError(json?.error?.message ?? "Artikel tidak ditemukan."); setFetching(false); return; }
      const d = json.data;
      setTitle(d.title ?? ""); setSlug(d.slug ?? ""); setExcerpt(d.excerpt ?? "");
      setContent(d.content ?? ""); setCoverurl(d.coverurl ?? ""); setTags(d.tags ?? []);
      setIspublished(d.ispublished ?? false);
      setFetching(false);
    })();
  }, [id]);

  const addTag = () => { const t = tagInput.trim().toLowerCase(); if (t && !tags.includes(t)) setTags([...tags, t]); setTagInput(""); };

  const uploadContentImage = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("bucket", "blog"); fd.append("folder", "content");
      const res  = await fetch("/api/upload/image", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data?.data?.url) insertMarkdown(taRef, setContent, "![", `](${data.data.url})`, "deskripsi gambar");
      else setError("Gagal upload gambar.");
    } catch { setError("Gagal upload."); } finally { setUploading(false); }
  };

  const ins = useCallback((before: string, after = "", ph = "teks") => insertMarkdown(taRef, setContent, before, after, ph), []);

  const handleSubmit = async (publish: boolean) => {
    if (!title.trim() || !slug.trim()) { setError("Judul dan slug wajib diisi."); return; }
    setLoading(true); setError(null);
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), slug: slug.trim(), excerpt: excerpt.trim() || undefined, content: content.trim() || undefined, coverurl: coverurl.trim() || "", tags, ispublished: publish }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data?.error?.message ?? "Gagal menyimpan."); setLoading(false); return; }
    router.push("/admin/blog");
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readMins  = Math.max(1, Math.ceil(wordCount / 200));

  if (fetching) return <div className="flex items-center justify-center py-24 gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Memuat...</div>;
  if (fetchError) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <AlertCircle className="h-8 w-8 text-destructive/60" />
      <p className="text-sm text-muted-foreground">{fetchError}</p>
      <Link href="/admin/blog" className="text-xs text-primary hover:underline">← Kembali</Link>
    </div>
  );

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog" className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Edit Artikel</h1>
            <p className="text-xs text-muted-foreground/50">{wordCount} kata · ~{readMins} menit baca {ispublished && "· 🟢 Live"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleSubmit(false)} disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} {ispublished ? "Unpublish" : "Draft"}
          </button>
          <button onClick={() => handleSubmit(true)} disabled={loading}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />} {ispublished ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span className="flex-1">{error}</span><button onClick={() => setError(null)}><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Judul artikel..."
            className="w-full rounded-xl border-0 border-b-2 border-border/30 bg-transparent px-0 py-2 text-2xl font-black outline-none placeholder:text-muted-foreground/20 focus:border-primary/50 transition-colors" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground/40">
            <span>/blog/</span>
            <input value={slug} onChange={e => setSlug(e.target.value)}
              className="font-mono bg-transparent outline-none border-b border-dashed border-border/40 focus:border-primary/40 text-xs transition-colors flex-1" />
          </div>

          <div className="glass-card rounded-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/30 px-3 py-2 bg-card/20">
              <div className="flex gap-1">
                {(["write", "preview"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={cn("rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-all",
                      activeTab === tab ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground")}>
                    {tab === "write" ? "Tulis" : "Preview"}
                  </button>
                ))}
              </div>
              {activeTab === "write" && (
                <div className="flex items-center gap-0.5 flex-wrap">
                  <ToolbarBtn icon={Bold}        label="Bold"    onClick={() => ins("**", "**", "teks tebal")} />
                  <ToolbarBtn icon={Italic}      label="Italic"  onClick={() => ins("*", "*", "teks miring")} />
                  <div className="mx-1 h-4 w-px bg-border/40" />
                  <ToolbarBtn icon={Heading1}    label="H1"      onClick={() => ins("# ", "", "Heading 1")} />
                  <ToolbarBtn icon={Heading2}    label="H2"      onClick={() => ins("## ", "", "Heading 2")} />
                  <ToolbarBtn icon={Heading3}    label="H3"      onClick={() => ins("### ", "", "Heading 3")} />
                  <div className="mx-1 h-4 w-px bg-border/40" />
                  <ToolbarBtn icon={List}        label="List"    onClick={() => ins("- ", "", "item")} />
                  <ToolbarBtn icon={ListOrdered} label="Ordered" onClick={() => ins("1. ", "", "item")} />
                  <ToolbarBtn icon={Quote}       label="Quote"   onClick={() => ins("> ", "", "kutipan")} />
                  <div className="mx-1 h-4 w-px bg-border/40" />
                  <ToolbarBtn icon={Code}        label="Code"    onClick={() => ins("`", "`", "code")} />
                  <ToolbarBtn icon={Link2}       label="Link"    onClick={() => ins("[", "](url)", "teks")} />
                  <ToolbarBtn icon={Minus}       label="Divider" onClick={() => ins("\n---\n", "", "")} />
                  <div className="mx-1 h-4 w-px bg-border/40" />
                  <label title="Upload" className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground/60 hover:bg-muted/40 hover:text-foreground transition-colors">
                    {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadContentImage(f); }} />
                  </label>
                  <ToolbarBtn icon={ImageIcon}   label="Image URL" onClick={() => ins("![alt](", ")", "url")} />
                </div>
              )}
            </div>
            {activeTab === "write" ? (
              <textarea ref={taRef} value={content} onChange={e => setContent(e.target.value)} rows={28}
                placeholder="Tulis konten artikel..."
                className="w-full resize-none bg-transparent px-4 py-3 text-sm font-mono leading-relaxed outline-none placeholder:text-muted-foreground/15" />
            ) : (
              <div className="min-h-[400px] px-4 py-3">
                {content.trim() ? <MarkdownRenderer content={content} /> : <p className="italic text-muted-foreground/30 text-sm">Belum ada konten.</p>}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="glass-card p-4">
            <ImageUrlInput label="Cover / Thumbnail" value={coverurl} onChange={setCoverurl}
              placeholder="https://... atau paste gambar" hint="Rekomendasi 1280×720px" previewClass="h-32" required={false} />
          </div>
          <div className="glass-card p-4">
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground/60 uppercase tracking-wide">Deskripsi Singkat</label>
            <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3}
              placeholder="Deskripsi untuk SEO dan preview..."
              className="w-full resize-none rounded-xl border border-border/50 bg-background/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
          <div className="glass-card p-4 space-y-2">
            <label className="block text-xs font-semibold text-muted-foreground/60 uppercase tracking-wide">Tags / Hashtag</label>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="anime, review..." className="flex-1 rounded-xl border border-border/50 bg-background/40 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
              <button onClick={addTag} className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary hover:bg-primary/25 transition-colors">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[24px]">
              {tags.map(t => (
                <span key={t} className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                  #{t}<button onClick={() => setTags(tags.filter(x => x !== t))}><X className="h-2.5 w-2.5" /></button>
                </span>
              ))}
            </div>
          </div>
          <div className="glass-card p-4 space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-wide">Info Artikel</p>
            {[["Kata", wordCount], ["Baca", `~${readMins} menit`], ["Karakter", content.length]].map(([k, v]) => (
              <div key={String(k)} className="flex justify-between text-xs text-muted-foreground/60">
                <span>{k}</span><span className="font-mono">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
