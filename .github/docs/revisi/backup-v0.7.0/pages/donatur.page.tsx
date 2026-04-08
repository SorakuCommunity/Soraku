import type { Metadata } from "next";
import Link from "next/link";
import { Trophy, Crown, Heart } from "lucide-react";
import { MOCK_DONATUR } from "@/lib/mock-data";
import { formatRupiah, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Top Donatur — Soraku Community",
  description: "Daftar donatur terbaik yang mendukung Soraku Community.",
};

const TIER_STYLES: Record<string, { badge: string; glow: string; text: string }> = {
  VVIP:    { badge: "✨ VVIP",    glow: "shadow-lg shadow-amber-500/20 border-amber-500/40", text: "text-amber-400" },
  VIP:     { badge: "💜 VIP",     glow: "shadow-md shadow-primary/15 border-primary/30",     text: "text-primary" },
  DONATUR: { badge: "💙 Donatur", glow: "",                                                   text: "text-blue-400" },
};

const PODIUM = [1, 0, 2]; // order: 2nd, 1st, 3rd
const PODIUM_HEIGHTS = ["h-24", "h-32", "h-20"];
const PODIUM_LABELS = ["🥈", "🥇", "🥉"];

export default function TopDonaturPage() {
  const sorted = [...MOCK_DONATUR].sort((a, b) => b.amount - a.amount);
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10">
          <Trophy className="h-8 w-8 text-amber-400" />
        </div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/70">Hall of Fame</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Top <span className="text-gradient">Donatur</span>
        </h1>
        <p className="mt-4 max-w-lg mx-auto text-muted-foreground">
          Terima kasih kepada para supporter setia yang membuat Soraku Community tetap hidup. 💙
        </p>
      </div>

      {/* Podium */}
      {top3.length === 3 && (
        <div className="mb-12 flex items-end justify-center gap-4">
          {PODIUM.map((idx, i) => {
            const d = top3[idx];
            const style = TIER_STYLES[d.tier];
            return (
              <div key={d.id} className="flex flex-col items-center gap-3">
                {/* Avatar */}
                <div className={`relative h-14 w-14 rounded-2xl flex items-center justify-center font-black text-xl ${
                  idx === 0 ? "bg-amber-500/20 text-amber-400" : "bg-primary/10 text-primary"
                }`}>
                  {d.display_name.charAt(0)}
                  {idx === 0 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Crown className="h-5 w-5 text-amber-400" />
                    </div>
                  )}
                </div>
                <p className="text-xs font-bold text-center max-w-[80px] truncate">{d.display_name}</p>
                <p className={`text-xs font-medium ${style.text}`}>{formatRupiah(d.amount)}</p>
                {/* Podium bar */}
                <div className={`w-20 rounded-t-xl flex items-center justify-center ${PODIUM_HEIGHTS[i]} ${
                  idx === 0 ? "bg-gradient-to-t from-amber-600/40 to-amber-400/20 border border-amber-500/30"
                  : idx === 1 ? "bg-gradient-to-t from-muted/60 to-muted/20 border border-border"
                  : "bg-gradient-to-t from-amber-700/30 to-amber-600/10 border border-amber-600/20"
                }`}>
                  <span className="text-xl">{PODIUM_LABELS[i]}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/60 mb-5">
          Semua Donatur
        </h2>
        {sorted.map((d, i) => {
          const style = TIER_STYLES[d.tier];
          return (
            <div key={d.id} className={`glass-card flex items-center gap-4 p-4 ${style.glow}`}>
              {/* Rank */}
              <div className="w-8 text-center text-sm font-black text-muted-foreground/40">
                {i < 3 ? ["🥇","🥈","🥉"][i] : `${i + 1}`}
              </div>

              {/* Avatar */}
              <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                {d.display_name.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold">{d.display_name}</p>
                  <span className={`text-xs font-medium ${style.text}`}>{style.badge}</span>
                </div>
                {d.message && (
                  <p className="text-xs text-muted-foreground/70 mt-0.5 italic">"{d.message}"</p>
                )}
                <p className="text-xs text-muted-foreground/50 mt-0.5">{formatDate(d.created_at)}</p>
              </div>

              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-black ${style.text}`}>{formatRupiah(d.amount)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-12 glass-card px-8 py-8 text-center">
        <Heart className="h-8 w-8 text-rose-400 mx-auto mb-3" />
        <h2 className="font-bold mb-2">Ingin Masuk Daftar Ini?</h2>
        <p className="text-sm text-muted-foreground mb-5">Setiap donasi membantumu masuk ke halaman Top Donatur.</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/donate"
            className="rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white hover:bg-rose-700 transition-colors">
            Donasi via Trakteer
          </Link>
          <Link href="/premium"
            className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors">
            Premium Membership
          </Link>
        </div>
      </div>
    </div>
  );
}
