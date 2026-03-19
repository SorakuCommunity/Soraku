"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Eye, EyeOff, Loader2, RefreshCw, BookOpen, Pencil, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogPost {
  id: string; slug: string; title: string; excerpt: string | null;
  coverurl: string | null; ispublished: boolean; tags: string[];
  createdat: string; publishedat: string | null; viewcount?: number; likecount?: number;
}

export default function AdminBlogPage() {
  const [posts,   setPosts]   = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/admin/blog");
    const json = await res.json();
    setPosts(json?.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const togglePublish = async (post: BlogPost) => {
    setSaving(post.id);
    await fetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ispublished: !post.ispublished }),
    });
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, ispublished: !p.ispublished } : p));
    setSaving(null);
  };

  const sendDiscord = async (post: BlogPost) => {
    if (!post.ispublished) return;
    setSaving(`dc_${post.id}`);
    await fetch("/api/admin/blog/discord", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: post.id }),
    });
    setSaving(null);
  };

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
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
          <Link href="/admin/blog/new"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" /> Tulis Artikel
          </Link>
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
    </div>
  );
}
