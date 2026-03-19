"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
<<<<<<< HEAD
<<<<<<< HEAD
import Image from "next/image";
import { Plus, Trash2, Eye, EyeOff, Loader2, RefreshCw, BookOpen, Pencil, Send } from "lucide-react";
=======
import {
  ArrowLeft, Save, Eye, Loader2, Plus, X, Bold, Italic,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote,
  Code, Link2, Image as ImageIcon, Minus, Upload, AlertCircle,
} from "lucide-react";
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
=======
import Image from "next/image";
import { Plus, Trash2, Eye, EyeOff, Loader2, RefreshCw, BookOpen, Pencil, Send } from "lucide-react";
>>>>>>> fde5c0a (fix(blog): correct path apps/web/src + blog overhaul + events fixes)
import { cn } from "@/lib/utils";

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fde5c0a (fix(blog): correct path apps/web/src + blog overhaul + events fixes)
interface BlogPost {
  id: string; slug: string; title: string; excerpt: string | null;
  coverurl: string | null; ispublished: boolean; tags: string[];
  createdat: string; publishedat: string | null; viewcount?: number; likecount?: number;
<<<<<<< HEAD
=======
function ToolbarBtn({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} title={label}
      className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/60 hover:bg-muted/40 hover:text-foreground transition-colors">
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
=======
>>>>>>> fde5c0a (fix(blog): correct path apps/web/src + blog overhaul + events fixes)
}

export default function AdminBlogPage() {
  const [posts,   setPosts]   = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState<string | null>(null);

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fde5c0a (fix(blog): correct path apps/web/src + blog overhaul + events fixes)
  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/admin/blog");
    const json = await res.json();
    setPosts(json?.data ?? []);
    setLoading(false);
  }, []);
<<<<<<< HEAD
=======
export default function AdminBlogEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const taRef  = useRef<HTMLTextAreaElement>(null);
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
=======
>>>>>>> fde5c0a (fix(blog): correct path apps/web/src + blog overhaul + events fixes)

  useEffect(() => { load(); }, [load]);

<<<<<<< HEAD
<<<<<<< HEAD
  const togglePublish = async (post: BlogPost) => {
    setSaving(post.id);
    await fetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ispublished: !post.ispublished }),
=======
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
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
=======
  const togglePublish = async (post: BlogPost) => {
    setSaving(post.id);
    await fetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ispublished: !post.ispublished }),
>>>>>>> fde5c0a (fix(blog): correct path apps/web/src + blog overhaul + events fixes)
    });
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, ispublished: !p.ispublished } : p));
    setSaving(null);
  };

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fde5c0a (fix(blog): correct path apps/web/src + blog overhaul + events fixes)
  const sendDiscord = async (post: BlogPost) => {
    if (!post.ispublished) return;
    setSaving(`dc_${post.id}`);
    await fetch("/api/admin/blog/discord", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: post.id }),
    });
    setSaving(null);
  };
<<<<<<< HEAD

  const del = async (id: string) => {
    if (!confirm("Hapus artikel ini?")) return;
    setSaving(id);
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    setPosts(prev => prev.filter(p => p.id !== id));
    setSaving(null);
  };

  const published = posts.filter(p => p.ispublished);
  const drafts    = posts.filter(p => !p.ispublished);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary/60 mb-1">Admin Panel</p>
          <h1 className="text-2xl font-black">Blog</h1>
=======
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readMins  = Math.max(1, Math.ceil(wordCount / 200));
=======
>>>>>>> fde5c0a (fix(blog): correct path apps/web/src + blog overhaul + events fixes)

  const del = async (id: string) => {
    if (!confirm("Hapus artikel ini?")) return;
    setSaving(id);
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    setPosts(prev => prev.filter(p => p.id !== id));
    setSaving(null);
  };

  const published = posts.filter(p => p.ispublished);
  const drafts    = posts.filter(p => !p.ispublished);

  return (
<<<<<<< HEAD
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
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
=======
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary/60 mb-1">Admin Panel</p>
          <h1 className="text-2xl font-black">Blog</h1>
>>>>>>> fde5c0a (fix(blog): correct path apps/web/src + blog overhaul + events fixes)
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fde5c0a (fix(blog): correct path apps/web/src + blog overhaul + events fixes)
          <Link href="/admin/blog/new"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" /> Tulis Artikel
          </Link>
<<<<<<< HEAD
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total",      value: posts.length,     color: "text-foreground" },
          { label: "Published",  value: published.length, color: "text-green-400" },
          { label: "Draft",      value: drafts.length,    color: "text-amber-400" },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
            <p className="text-xs text-muted-foreground/50 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Memuat...
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 glass-card rounded-2xl">
          <BookOpen className="h-10 w-10 text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground">Belum ada artikel</p>
          <Link href="/admin/blog/new" className="text-xs text-primary hover:underline">+ Tulis sekarang</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => {
            const busy = saving === post.id || saving === `dc_${post.id}`;
            const date = new Date(post.publishedat ?? post.createdat).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
            return (
              <div key={post.id} className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 hover:border-primary/20 transition-colors">
                {/* Cover thumbnail */}
                <div className="h-12 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted/30">
                  {post.coverurl ? (
                    <Image src={post.coverurl} alt={post.title} width={64} height={48} className="h-full w-full object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full items-center justify-center"><BookOpen className="h-5 w-5 text-muted-foreground/20" /></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", post.ispublished ? "bg-green-400" : "bg-amber-400")} />
                    <p className="text-sm font-semibold truncate">{post.title}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap text-[10px] text-muted-foreground/40">
                    <span>{date}</span>
                    <span>·</span>
                    <span>{post.ispublished ? "Published" : "Draft"}</span>
                    {post.tags.slice(0, 2).map((t: string) => <span key={t} className="hidden sm:inline">#{t}</span>)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {post.ispublished && (
                    <button onClick={() => sendDiscord(post)} disabled={busy} title="Kirim ke Discord"
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-indigo-400 transition-colors disabled:opacity-30">
                      {busy && saving === `dc_${post.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    </button>
                  )}
                  <Link href={`/admin/blog/${post.id}/edit`}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-primary transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                  <button onClick={() => togglePublish(post)} disabled={busy}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                    title={post.ispublished ? "Jadikan Draft" : "Publish"}>
                    {busy && saving === post.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : post.ispublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => del(post.id)} disabled={busy}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
=======
=======
>>>>>>> fde5c0a (fix(blog): correct path apps/web/src + blog overhaul + events fixes)
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total",      value: posts.length,     color: "text-foreground" },
          { label: "Published",  value: published.length, color: "text-green-400" },
          { label: "Draft",      value: drafts.length,    color: "text-amber-400" },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
            <p className="text-xs text-muted-foreground/50 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Memuat...
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 glass-card rounded-2xl">
          <BookOpen className="h-10 w-10 text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground">Belum ada artikel</p>
          <Link href="/admin/blog/new" className="text-xs text-primary hover:underline">+ Tulis sekarang</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => {
            const busy = saving === post.id || saving === `dc_${post.id}`;
            const date = new Date(post.publishedat ?? post.createdat).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
            return (
              <div key={post.id} className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 hover:border-primary/20 transition-colors">
                {/* Cover thumbnail */}
                <div className="h-12 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted/30">
                  {post.coverurl ? (
                    <Image src={post.coverurl} alt={post.title} width={64} height={48} className="h-full w-full object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full items-center justify-center"><BookOpen className="h-5 w-5 text-muted-foreground/20" /></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", post.ispublished ? "bg-green-400" : "bg-amber-400")} />
                    <p className="text-sm font-semibold truncate">{post.title}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap text-[10px] text-muted-foreground/40">
                    <span>{date}</span>
                    <span>·</span>
                    <span>{post.ispublished ? "Published" : "Draft"}</span>
                    {post.tags.slice(0, 2).map(t => <span key={t} className="hidden sm:inline">#{t}</span>)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {post.ispublished && (
                    <button onClick={() => sendDiscord(post)} disabled={busy} title="Kirim ke Discord"
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-indigo-400 transition-colors disabled:opacity-30">
                      {busy && saving === `dc_${post.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    </button>
                  )}
                  <Link href={`/admin/blog/${post.id}/edit`}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-primary transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                  <button onClick={() => togglePublish(post)} disabled={busy}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                    title={post.ispublished ? "Jadikan Draft" : "Publish"}>
                    {busy && saving === post.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : post.ispublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => del(post.id)} disabled={busy}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
<<<<<<< HEAD

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
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
=======
>>>>>>> fde5c0a (fix(blog): correct path apps/web/src + blog overhaul + events fixes)
    </div>
  );
}
