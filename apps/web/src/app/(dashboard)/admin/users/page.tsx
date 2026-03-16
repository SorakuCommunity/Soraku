"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Search, Loader2, RefreshCw, UserX, UserCheck, ChevronDown, Crown, Shield, User, Star, Megaphone, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserRow { id: string; username: string | null; displayname: string | null; avatarurl: string | null; role: string; supporterrole: string | null; isbanned: boolean; createdat: string; }

const ROLES = ["USER","KREATOR","AGENSI","ADMIN","MANAGER","OWNER"] as const;

const ROLE_META: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  OWNER:   { label: "Owner",   cls: "text-yellow-300 bg-yellow-400/10 border-yellow-400/20", icon: Crown       },
  MANAGER: { label: "Manager", cls: "text-violet-300 bg-violet-500/10 border-violet-500/20", icon: ShieldAlert },
  ADMIN:   { label: "Admin",   cls: "text-primary   bg-primary/10     border-primary/20",    icon: Shield      },
  AGENSI:  { label: "Agensi",  cls: "text-green-300 bg-green-500/10   border-green-500/20",  icon: Megaphone   },
  KREATOR: { label: "Kreator", cls: "text-accent    bg-accent/10      border-accent/20",     icon: Star        },
  USER:    { label: "Member",  cls: "text-muted-foreground bg-muted/50 border-border/40",    icon: User        },
};

export default function AdminUsersPage() {
  const [users,   setUsers]   = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState<string | null>(null);
  const [query,   setQuery]   = useState("");
  const [total,   setTotal]   = useState(0);

  const load = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/users?limit=50${q ? `&q=${encodeURIComponent(q)}` : ""}`);
      const d = await r.json();
      setUsers(d.data ?? []);
      setTotal(d.meta?.total ?? d.data?.length ?? 0);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const patch = async (id: string, body: object) => {
    setSaving(id);
    await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...body }) });
    await load(query);
    setSaving(null);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary/60 mb-1">Admin Panel</p>
          <h1 className="text-xl font-bold tracking-tight">Manajemen Users</h1>
          <p className="text-xs text-muted-foreground/50 mt-0.5">
            {loading ? "Memuat…" : `${total.toLocaleString("id-ID")} pengguna terdaftar`}
          </p>
        </div>
        <button onClick={() => load(query)} disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-border/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-all disabled:opacity-40">
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
        <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && load(query)}
          placeholder="Cari username… tekan Enter"
          className="w-full rounded-xl border border-border/60 bg-card/40 py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all" />
        {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground/30" />}
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_160px_100px] gap-4 px-5 py-3 border-b border-border/40 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
          <span>Pengguna</span><span>Role</span><span className="text-right">Aksi</span>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-9 w-9 rounded-xl bg-muted/20 flex-shrink-0" />
                <div className="flex-1 space-y-1.5"><div className="h-3.5 w-32 rounded bg-muted/20" /><div className="h-3 w-20 rounded bg-muted/15" /></div>
                <div className="h-7 w-20 rounded-xl bg-muted/20" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-xs text-muted-foreground/40">
            {query ? `Tidak ada user "${query}"` : "Belum ada pengguna"}
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {users.map(u => {
              const rm = ROLE_META[u.role] ?? ROLE_META.USER;
              const busy = saving === u.id;
              return (
                <div key={u.id} className={cn("grid grid-cols-1 sm:grid-cols-[1fr_160px_100px] gap-3 sm:gap-4 px-5 py-3.5 items-center hover:bg-primary/2 transition-colors", u.isbanned && "opacity-50")}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 flex-shrink-0 rounded-xl bg-primary/10 overflow-hidden flex items-center justify-center text-sm font-bold text-primary">
                      {u.avatarurl
                        ? <Image src={u.avatarurl} alt="" width={36} height={36} className="h-full w-full object-cover" />
                        : (u.displayname ?? u.username ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{u.displayname ?? u.username ?? "—"}</p>
                      <p className="text-xs text-muted-foreground/50">@{u.username ?? "—"}</p>
                    </div>
                    {u.isbanned && <span className="ml-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive border border-destructive/20">Banned</span>}
                  </div>
                  <div className="relative">
                    <select value={u.role} disabled={busy || u.role === "OWNER"} onChange={e => patch(u.id, { role: e.target.value })}
                      className={cn("w-full appearance-none rounded-xl border px-3 py-1.5 text-xs font-semibold pr-7 outline-none transition-all bg-transparent cursor-pointer hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60", rm.cls)}>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none opacity-50" />
                  </div>
                  <div className="flex items-center justify-end">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/40" />
                      : u.role !== "OWNER" && (
                        <button onClick={() => patch(u.id, { isbanned: !u.isbanned })}
                          className={cn("flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-[11px] font-semibold transition-all hover:-translate-y-0.5",
                            u.isbanned
                              ? "border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/15"
                              : "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15")}>
                          {u.isbanned ? <><UserCheck className="h-3 w-3" /> Unban</> : <><UserX className="h-3 w-3" /> Ban</>}
                        </button>
                      )}
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
