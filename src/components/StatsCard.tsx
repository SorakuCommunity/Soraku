"use client";

import { useEffect, useState } from "react";
import { Users, Circle, MessageCircle, RefreshCw } from "lucide-react";

interface DiscordStats {
  totalMembers: number;
  onlineMembers: number;
  guildName: string;
  guildIcon: string | null;
  cachedAt: number;
}

export default function StatsCard() {
  const [stats, setStats] = useState<DiscordStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/discord/stats");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setStats(data);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Stats error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-light-base">Discord Server</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="glass rounded-xl p-4 animate-pulse">
              <div className="h-8 bg-white/10 rounded mb-2" />
              <div className="h-4 bg-white/5 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 hover:border-primary/20 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#5865F2]/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-[#5865F2]" />
          </div>
          <div>
            <h3 className="font-semibold text-light-base text-sm">Discord Server</h3>
            <p className="text-xs text-light-base/40">{stats?.guildName}</p>
          </div>
        </div>
        <button
          onClick={fetchStats}
          className="w-8 h-8 rounded-lg glass flex items-center justify-center text-light-base/40 hover:text-primary transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-xs text-light-base/60">Total Member</span>
          </div>
          <p className="text-2xl font-bold text-light-base">
            {stats?.totalMembers.toLocaleString() || "—"}
          </p>
        </div>

        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Circle className="w-3 h-3 text-green-400 fill-green-400" />
            <span className="text-xs text-light-base/60">Online</span>
          </div>
          <p className="text-2xl font-bold text-green-400">
            {stats?.onlineMembers.toLocaleString() || "—"}
          </p>
        </div>
      </div>

      {lastRefresh && (
        <p className="text-xs text-light-base/30 mt-3 text-right">
          Terakhir diperbarui: {lastRefresh.toLocaleTimeString("id-ID")}
        </p>
      )}
    </div>
  );
}
