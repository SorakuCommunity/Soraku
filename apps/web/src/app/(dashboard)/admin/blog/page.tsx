"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Trash2, Eye, EyeOff, Loader2, RefreshCw, BookOpen, ExternalLink, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogPost {
  id:          string;
  slug:        string;
  title:       string;
  excerpt:     string | null;
  ispublished: boolean;
  tags:        string[];
  createdat:   string;
  publishedat: string | null;
}

export default function AdminBlogPage() {
  const [posts,   setPosts]   = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    // Fetch dari /api/admin/blog — return semua post termasuk draft
    const res  = await fetch("/api/admin/blog");
    const json = await res.json();
    setPosts(json?.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const togglePublish = async (post: BlogPost) => {
    setSaving(post.id);
    await fetch(`/api/admin/blog/${post.id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ispublished: !post.ispublished }),
    });
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, ispublished: !p.ispublished } : p));
    setSaving(null);
  };

  const del = async (id: string) => {
    if (!confirm("Hapus artikel ini? Tidak bisa dibatalkan.")) return;
    setSaving(id);
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    setPosts(prev => prev.filter(p => p.id !== id));
    setSaving(null);
  };

  const published = posts.filter(p =>  p.ispublished).length;
  const drafts    = posts.filter(p => !p.ispublished).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary/60 mb-1">Admin Panel</p>
          <h1 className="text-2xl font-black">Blog</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
          <Link href="/admin/blog/new"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" /> Artikel Baru
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total",     value: posts.length,  color: "text-foreground" },
          { label: "Publik",    value: published,      color: "text-green-400"  },
          { label: "Draft",     value: drafts,         color: "text-amber-400"  },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_120px_80px_120px] gap-4 px-5 py-3 border-b border-border/40 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
          <span>Artikel</span><span>Status</span><span>Tags</span><span className="text-right">Aksi</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Memuat...
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <BookOpen className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Belum ada artikel</p>
            <Link href="/admin/blog/new" className="text-xs text-primary hover:underline">+ Buat sekarang</Link>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {posts.map(post => {
              const busy = saving === post.id;
              return (
                <div key={post.id}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_120px_80px_120px] gap-3 sm:gap-4 px-5 py-4 items-center hover:bg-primary/2 transition-colors">
                  {/* Title */}
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground/50 font-mono truncate">/blog/{post.slug}</p>
                  </div>
                  {/* Status */}
                  <div>
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                      post.ispublished
                        ? "bg-green-500/10 text-green-400"
                        : "bg-amber-500/10 text-amber-400"
                    )}>
                      {post.ispublished ? "● Publik" : "○ Draft"}
                    </span>
                  </div>
                  {/* Tags */}
                  <div className="text-xs text-muted-foreground/50 truncate">
                    {post.tags?.length ? post.tags.slice(0,2).join(", ") : "—"}
                  </div>
                  {/* Aksi */}
                  <div className="flex items-center justify-end gap-1">
                    {post.ispublished && (
                      <Link href={`/blog/${post.slug}`} target="_blank"
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                        title="Lihat artikel">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    )}
                    <Link href={`/admin/blog/${post.id}/edit`}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-primary transition-colors"
                      title="Edit">
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button onClick={() => togglePublish(post)} disabled={busy}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                      title={post.ispublished ? "Jadikan draft" : "Publish"}>
                      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                             : post.ispublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={() => del(post.id)} disabled={busy}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                      title="Hapus">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
