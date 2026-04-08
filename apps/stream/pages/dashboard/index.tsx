import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  Film,
  Tv,
  Image,
  RefreshCw,
  Settings,
  Server,
  Clock,
  TrendingUp,
  Eye,
  Star,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface DashboardStats {
  total_anime: number;
  total_episodes: number;
  total_images: number;
  active_sources: number;
  recent_updates: number;
  cache_size: string;
  uptime: string;
}

interface AnimeSource {
  id: string;
  name: string;
  status: "active" | "error" | "degraded";
  lastSync: string;
}

export default function StreamDashboard({
  stats,
  sources
}: {
  stats: DashboardStats;
  sources: AnimeSource[];
}) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetch("/api/v2/admin/cache/clear", { method: "POST" });
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-emerald-400 bg-emerald-500/10";
      case "error":
        return "text-red-400 bg-red-500/10";
      case "degraded":
        return "text-amber-400 bg-amber-500/10";
      default:
        return "text-muted-foreground/40 bg-muted-foreground/10";
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard | Soraku Stream</title>
      </Head>

      <div className="min-h-screen bg-[#0f1117] text-white">
        {/* Header */}
        <header className="border-b border-white/[0.06] bg-[#161920]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="h-7 w-7 overflow-hidden rounded-lg border border-white/10 bg-[#1a1c20]">
                    <img
                      src="/logo.png"
                      alt="Soraku"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-black text-[#D9DDE3] group-hover:text-[#4FA3D1] transition-colors">
                    Soraku Stream
                  </span>
                </Link>
                <div className="h-5 w-px bg-white/[0.08]" />
                <div className="flex items-center gap-1.5">
                  <LayoutDashboard className="h-3.5 w-3.5 text-[#4FA3D1]" />
                  <span className="text-xs font-bold text-[#4FA3D1]">
                    Stream Dashboard
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-1.5 text-xs text-[#6E8FA6] hover:text-[#D9DDE3] transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
                  />
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
                <Link
                  href="/settings"
                  className="text-[#6E8FA6] hover:text-[#D9DDE3] transition-colors p-2 rounded-lg hover:bg-white/5"
                >
                  <Settings className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-[#1a1d24] rounded-2xl p-4 border border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <Film className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {stats.total_anime.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#6E8FA6] font-semibold mt-1">
                Total Anime
              </div>
            </div>

            <div className="bg-[#1a1d24] rounded-2xl p-4 border border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <Tv className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {stats.total_episodes.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#6E8FA6] font-semibold mt-1">
                Episodes
              </div>
            </div>

            <div className="bg-[#1a1d24] rounded-2xl p-4 border border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <Image className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {stats.total_images.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#6E8FA6] font-semibold mt-1">
                Images
              </div>
            </div>

            <div className="bg-[#1a1d24] rounded-2xl p-4 border border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <Server className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {stats.active_sources}
              </div>
              <div className="text-[10px] text-[#6E8FA6] font-semibold mt-1">
                Active Sources
              </div>
            </div>

            <div className="bg-[#1a1d24] rounded-2xl p-4 border border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <Clock className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {stats.cache_size}
              </div>
              <div className="text-[10px] text-[#6E8FA6] font-semibold mt-1">
                Cache Size
              </div>
            </div>

            <div className="bg-[#1a1d24] rounded-2xl p-4 border border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="h-4 w-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {stats.uptime}
              </div>
              <div className="text-[10px] text-[#6E8FA6] font-semibold mt-1">
                Uptime
              </div>
            </div>
          </div>

          {/* Sources Status */}
          <div className="mb-8">
            <h2 className="text-[#D9DDE3] text-sm font-bold mb-4">
              Anime Sources
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="bg-[#1a1d24] rounded-xl p-4 border border-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {source.name}
                    </p>
                    <p className="text-[#6E8FA6] text-[10px] mt-1">
                      Last sync: {source.lastSync}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold capitalize ${getStatusColor(source.status)}`}
                  >
                    {source.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-[#D9DDE3] text-sm font-bold mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/discover"
                className="flex items-center gap-2 bg-[#1a1d24] hover:bg-[#22262e] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#D9DDE3] border border-white/[0.06] transition-colors"
              >
                <Film className="h-4 w-4 text-blue-400" /> Browse Anime
              </Link>
              <Link
                href="/schedule"
                className="flex items-center gap-2 bg-[#1a1d24] hover:bg-[#22262e] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#D9DDE3] border border-white/[0.06] transition-colors"
              >
                <Clock className="h-4 w-4 text-emerald-400" /> Schedule
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2 bg-[#1a1d24] hover:bg-[#22262e] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#D9DDE3] border border-white/[0.06] transition-colors"
              >
                <Settings className="h-4 w-4 text-amber-400" /> Settings
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Mock stats for now - in production, fetch from Redis/DB
  const stats: DashboardStats = {
    total_anime: 12500,
    total_episodes: 45000,
    total_images: 85000,
    active_sources: 8,
    recent_updates: 42,
    cache_size: "256MB",
    uptime: "14d 6h"
  };

  const sources: AnimeSource[] = [
    {
      id: "consumet",
      name: "Consumet",
      status: "active",
      lastSync: "2 min ago"
    },
    { id: "anilist", name: "AniList", status: "active", lastSync: "5 min ago" },
    {
      id: "mal",
      name: "MyAnimeList",
      status: "active",
      lastSync: "10 min ago"
    },
    { id: "anify", name: "Anify", status: "active", lastSync: "3 min ago" },
    {
      id: "samehadaku",
      name: "Samehadaku",
      status: "degraded",
      lastSync: "1 hour ago"
    },
    {
      id: "otakudesu",
      name: "Otakudesu",
      status: "active",
      lastSync: "15 min ago"
    }
  ];

  return {
    props: {
      stats,
      sources
    }
  };
};
