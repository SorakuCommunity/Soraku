"use client";

import { useDiscord } from "@/hooks/useDiscord";
import { Users, BookOpen, Calendar, Image, TrendingUp, Circle, Settings } from "lucide-react";
import Link from "next/link";

const MOCK_STATS = [
  { label: "Total User", value: "10,482", icon: Users, change: "+12%", color: "text-primary" },
  { label: "Total Post", value: "5,234", icon: BookOpen, change: "+8%", color: "text-purple-400" },
  { label: "Total Event", value: "48", icon: Calendar, change: "+3", color: "text-accent" },
  { label: "Gallery Pending", value: "24", icon: Image, change: "-5", color: "text-pink-400" },
];

const QUICK_ACTIONS = [
  { href: "/admin/blog", label: "Tambah Post Blog", color: "from-primary/20 to-secondary/10" },
  { href: "/admin/events", label: "Buat Event Baru", color: "from-accent/20 to-yellow-500/10" },
  { href: "/admin/vtuber", label: "Tambah Vtuber", color: "from-purple-500/20 to-pink-500/10" },
  { href: "/admin/gallery", label: "Moderasi Gallery", color: "from-pink-500/20 to-red-500/10" },
];

export default function AdminDashboard() {
  const { stats, loading } = useDiscord();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-white mb-1">Dashboard</h1>
        <p className="text-secondary">Selamat datang di admin panel Soraku.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {MOCK_STATS.map(({ label, value, icon: Icon, change, color }) => (
          <div key={label} className="glass-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-white/5`}>
                <Icon size={18} className={color} />
              </div>
              <span className={`text-xs font-semibold ${change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                {change}
              </span>
            </div>
            <div className="font-display text-2xl text-white mb-1">{value}</div>
            <div className="text-secondary text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* Discord Stats */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <svg className="w-6 h-6 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.101 18.08.113 18.1.132 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
          </svg>
          <h3 className="text-white font-semibold">Discord Live Stats</h3>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-secondary">
            <Circle size={8} className="text-green-400 fill-green-400" />
            Auto-refresh 60s
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="glass p-4 rounded-xl">
            <div className="text-secondary text-xs mb-1">Total Member</div>
            <div className="font-display text-2xl text-white">
              {loading ? "..." : stats?.memberCount.toLocaleString("id-ID") ?? "—"}
            </div>
          </div>
          <div className="glass p-4 rounded-xl">
            <div className="text-secondary text-xs mb-1">Online Sekarang</div>
            <div className="font-display text-2xl text-green-400">
              {loading ? "..." : stats?.onlineCount.toLocaleString("id-ID") ?? "—"}
            </div>
          </div>
          <div className="glass p-4 rounded-xl sm:col-span-1 col-span-2">
            <div className="text-secondary text-xs mb-1">Server</div>
            <div className="text-white font-medium text-sm">
              {loading ? "..." : stats?.serverName ?? "Soraku Community"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h3 className="text-white font-semibold mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(({ href, label, color }) => (
              <Link key={href} href={href}>
                <div
                  className={`p-4 rounded-xl bg-gradient-to-br ${color} border border-white/10 hover:border-primary/30 transition-all cursor-pointer`}
                >
                  <p className="text-white text-sm font-medium">{label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Maintenance Toggle */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings size={18} className="text-secondary" />
            <h3 className="text-white font-semibold">Mode Maintenance</h3>
          </div>
          <p className="text-secondary text-sm mb-5">
            Aktifkan maintenance mode untuk menutup akses publik ke website sementara.
          </p>

          <div className="glass p-4 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-white text-sm font-medium">Status Sekarang</div>
              <div className="text-green-400 text-xs mt-0.5">● Website Aktif</div>
            </div>
            <div className="relative">
              <input type="checkbox" className="sr-only peer" id="maintenance-toggle" />
              <label
                htmlFor="maintenance-toggle"
                className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-white/10 transition-colors peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30"
              >
                <span className="absolute left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
              </label>
            </div>
          </div>

          <p className="text-secondary text-xs mt-3">
            Note: Toggle ini memerlukan konfigurasi env variable MAINTENANCE_MODE. 
            Edit di Vercel dashboard untuk production.
          </p>
        </div>
      </div>
    </div>
  );
}
