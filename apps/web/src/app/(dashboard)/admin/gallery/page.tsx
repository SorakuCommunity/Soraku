"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { CheckCircle, XCircle, Loader2, RefreshCw, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface GalleryItem { id: string; title: string | null; imageurl: string; tags: string[]; createdat: string; }

export default function AdminGalleryPage() {
  const [items,      setItems]      = useState<GalleryItem[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState<string | null>(null);
  const [realtimeOk, setRealtimeOk] = useState(false);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/gallery?status=pending&limit=50");
      const json = await res.json();
      setItems(json?.data ?? []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    load();

    // Supabase Realtime — notif saat ada upload baru masuk
    const supabase = createClient();
    const ch = supabase
      .channel("admin-gallery-pending")
      .on("postgres_changes", {
        event:  "INSERT",
        schema: "soraku",
        table:  "gallery",
      }, () => {
        // Ada upload baru — refresh list
        load();
      })
      .on("postgres_changes", {
        event:  "UPDATE",
        schema: "soraku",
        table:  "gallery",
      }, () => load())
      .subscribe((status) => {
        setRealtimeOk(status === "SUBSCRIBED");
      });

    channelRef.current = ch;
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  const moderate = async (id: string, status: "approved" | "rejected") => {
    setSaving(id);
    try {
      await fetch(`/api/admin/gallery/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setItems(prev => prev.filter(i => i.id !== id));
    } finally { setSaving(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary/60 mb-1">Admin Panel</p>
          <h1 className="text-2xl font-black">Moderasi Galeri</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Realtime indicator */}
          <div className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold border",
            realtimeOk
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-border bg-muted/20 text-muted-foreground/50"
          )}>
            <Zap className="h-2.5 w-2.5" />
            {realtimeOk ? "Live" : "Static"}
          </div>
          <button onClick={load} disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin" /> Memuat...
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center py-16 gap-3">
          <CheckCircle className="h-10 w-10 text-green-400/50" />
          <p className="text-sm font-medium">Semua sudah bersih</p>
          <p className="text-xs text-muted-foreground">Tidak ada kiriman yang menunggu moderasi</p>
          {realtimeOk && <p className="text-[11px] text-green-400/70 flex items-center gap-1"><Zap className="h-2.5 w-2.5" /> Live — kiriman baru akan muncul otomatis</p>}
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{items.length}</span> kiriman menunggu review
            {realtimeOk && <span className="ml-2 text-green-400/70 text-xs"><Zap className="inline h-2.5 w-2.5 mr-0.5" />Live</span>}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(item => {
              const busy = saving === item.id;
              return (
                <div key={item.id} className="glass-card overflow-hidden group">
                  <div className="relative aspect-square overflow-hidden bg-muted/30">
                    <Image src={item.imageurl} alt={item.title ?? "Karya"} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white/70" />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm truncate">{item.title ?? "Tanpa judul"}</p>
                    <p className="text-xs text-muted-foreground/50 mt-0.5">
                      {new Date(item.createdat).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                    {item.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 3).map(t => (
                          <span key={t} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => moderate(item.id, "approved")} disabled={busy}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-500/10 py-2 text-xs font-bold text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-40">
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                        Approve
                      </button>
                      <button onClick={() => moderate(item.id, "rejected")} disabled={busy}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-destructive/10 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-40">
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
