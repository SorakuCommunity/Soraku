"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Calendar, ImageIcon, Users, Loader2, ArrowRight, Plus, Clock, CheckCircle, RefreshCw, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminStats {
  blog_count:      number;
  event_count:     number;
  gallery_pending: number;
  member_count:    number;
  recent_posts:    { id: string; title: string; slug: string; ispublished: boolean }[];
  pending_gallery: { id: string; title: string | null; imageurl: string; tags: string[] }[];
}

const STAT_CARDS = [
  { key: "blog_count",      label: "Total Blog",     icon: BookOpen,  href: "/admin/blog",    cls: "text-blue-400  bg-blue-500/10"  },
  { key: "event_count",     label: "Total Event",    icon: Calendar,  href: "/admin/events",  cls: "text-green-400 bg-green-500/10" },
  { key: "gallery_pending", label: "Pending Galeri", icon: ImageIcon, href: "/admin/gallery", cls: "text-amber-400 bg-amber-500/10" },
  { key: "member_count",    label: "Total Member",   icon: Users,     href: "/admin/users",   cls: "text-primary   bg-primary/10"   },
] as const;

const QUICK_ACTIONS = [
  { label: "Buat Artikel",  href: "/admin/blog/new",   icon: BookOpen,  cls: "text-blue-400  bg-blue-500/10  border-blue-500/20  hover:bg-blue-500/15"  },
  { label: "Buat Event",    href: "/admin/events/new", icon: Calendar,  cls: "text-green-400 bg-green-500/10 border-green-500/20 hover:bg-green-500/15" },
  { label: "Review Galeri", href: "/admin/gallery",    icon: ImageIcon, cls: "text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15" },
  { label: "Kelola Users",  href: "/admin/users",      icon: Users,     cls: "text-primary   bg-primary/10   border-primary/20   hover:bg-primary/15"   },
] as const;

export default function AdminDashboardPage() {
  const [stats,   setStats]   = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(d => setStats(d.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-7 pb-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary/60 mb-1">Admin Panel</p>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground/60 mt-1">Ringkasan aktivitas platform Soraku</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-border/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-40">
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, href, cls }) => (
          <Link key={key} href={href}
            className="glass-card group flex flex-col gap-3 p-5 hover:-translate-y-0.5 hover:border-primary/20 transition-all">
            <div className={cn("inline-flex h-9 w-9 items-center justify-center rounded-xl", cls)}>
              <Icon className="h-4 w-4" />
            </div>
            {loading
              ? <div className="h-7 w-12 animate-pulse rounded-lg bg-muted/30" />
              : <p className="text-2xl font-black tabular-nums">{(stats?.[key] ?? 0).toLocaleString("id-ID")}</p>
            }
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground/60">{label}</p>
              <ArrowRight className="h-3 w-3 text-muted-foreground/20 group-hover:text-primary/50 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-3">Aksi Cepat</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {QUICK_ACTIONS.map(({ label, href, icon: Icon, cls }) => (
            <Link key={href} href={href}
              className={cn("flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5", cls)}>
              <Plus className="h-3.5 w-3.5 flex-shrink-0" /> {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Content Row */}
      <div className="grid gap-5 lg:grid-cols-2">

        {/* Recent Posts */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <p className="text-sm font-bold">Artikel Terbaru</p>
            </div>
            <Link href="/admin/blog" className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors">
              Semua <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="h-2 w-2 rounded-full bg-muted/30" />
                  <div className="flex-1 h-4 rounded bg-muted/20" />
                  <div className="h-5 w-12 rounded-full bg-muted/20" />
                </div>
              ))}
            </div>
          ) : !stats?.recent_posts?.length ? (
            <div className="py-10 text-center text-xs text-muted-foreground/40">Belum ada artikel</div>
          ) : (
            <div className="divide-y divide-border/30">
              {stats.recent_posts.map(p => (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-primary/3 transition-colors">
                  <div className={cn("h-2 w-2 flex-shrink-0 rounded-full", p.ispublished ? "bg-green-400" : "bg-amber-400/50")} />
                  <p className="flex-1 min-w-0 text-sm truncate">{p.title}</p>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      p.ispublished ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400")}>
                      {p.ispublished ? "Publik" : "Draft"}
                    </span>
                    <Link href={`/blog/${p.slug}`} target="_blank" className="text-muted-foreground/30 hover:text-primary transition-colors">
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="px-5 py-3 border-t border-border/30">
            <Link href="/admin/blog/new"
              className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-dashed border-border/50 py-2 text-xs text-muted-foreground/50 hover:border-primary/30 hover:text-primary transition-all">
              <Plus className="h-3 w-3" /> Buat Artikel Baru
            </Link>
          </div>
        </div>

        {/* Pending Gallery */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-amber-400" />
              <p className="text-sm font-bold">Galeri Pending</p>
              {(stats?.gallery_pending ?? 0) > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500/20 px-1 text-[10px] font-black text-amber-400">
                  {stats!.gallery_pending}
                </span>
              )}
            </div>
            <Link href="/admin/gallery" className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors">
              Moderasi <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-3 gap-2 p-4">
              {[...Array(6)].map((_, i) => <div key={i} className="aspect-square rounded-xl bg-muted/20 animate-pulse" />)}
            </div>
          ) : !stats?.pending_gallery?.length ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <CheckCircle className="h-8 w-8 text-green-400/30" />
              <p className="text-xs text-muted-foreground/40">Semua galeri sudah dimoderasi</p>
            </div>
          ) : (
            <div className="p-4 grid grid-cols-3 gap-2">
              {stats.pending_gallery.slice(0, 6).map(img => (
                <Link key={img.id} href="/admin/gallery"
                  className="relative aspect-square overflow-hidden rounded-xl bg-muted/20 group">
                  <Image src={img.imageurl} alt={img.title ?? ""} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-1.5 right-1.5">
                    <Clock className="h-3 w-3 text-amber-400 drop-shadow" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {(stats?.gallery_pending ?? 0) > 0 && (
            <div className="px-5 py-3 border-t border-border/30">
              <Link href="/admin/gallery"
                className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-amber-500/10 border border-amber-500/20 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-500/15 transition-all">
                <Clock className="h-3 w-3" /> Review {stats!.gallery_pending} upload pending
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
