"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2, Settings, Power, Users } from "lucide-react";
import { useAuthRole } from "@/hooks/useAuthRole";
import { ROLES, ROLE_COLORS, type Role } from "@/lib/roles";

interface UserRecord {
  id: string;
  user_id: string;
  username: string | null;
  email: string | null;
  role: Role;
}

export default function AdminSettingsPage() {
  const { role } = useAuthRole();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const fetchMaintenance = async () => {
      const res = await fetch("/api/settings/maintenance");
      const data = await res.json();
      setMaintenanceMode(data.enabled);
      setMaintenanceLoading(false);
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch {}
      setUsersLoading(false);
    };

    fetchMaintenance();
    fetchUsers();
  }, []);

  const toggleMaintenance = async () => {
    setToggling(true);
    try {
      const res = await fetch("/api/settings/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !maintenanceMode }),
      });
      if (res.ok) {
        setMaintenanceMode(!maintenanceMode);
      }
    } finally {
      setToggling(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: Role) => {
    await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId: userId, newRole }),
    });
    setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
  };

  if (role !== "MANAGER") {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-light-base/60">Hanya MANAGER yang dapat mengakses halaman ini.</p>
          <Link href="/admin" className="text-primary hover:underline mt-4 inline-block">Kembali ke Admin</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin" className="text-light-base/60 hover:text-primary transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-light-base">Pengaturan</h1>
        </div>

        {/* Maintenance Mode */}
        <div className="glass rounded-2xl p-6 border border-white/10 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center">
              <Power className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="font-semibold text-light-base">Maintenance Mode</h2>
              <p className="text-sm text-light-base/50">Aktifkan untuk mengalihkan semua pengunjung ke halaman maintenance</p>
            </div>
          </div>

          {maintenanceLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={toggleMaintenance}
                disabled={toggling}
                className={`relative w-14 h-7 rounded-full transition-colors ${maintenanceMode ? "bg-yellow-400" : "bg-dark-3"}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform ${maintenanceMode ? "translate-x-7" : "translate-x-0"}`} />
              </button>
              <span className={`text-sm font-medium ${maintenanceMode ? "text-yellow-400" : "text-light-base/50"}`}>
                {maintenanceMode ? "AKTIF" : "NONAKTIF"}
              </span>
              {toggling && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
            </div>
          )}

          {maintenanceMode && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-400/10 border border-yellow-400/30">
              <p className="text-yellow-400 text-sm">⚠️ Maintenance mode aktif. Semua pengunjung akan diarahkan ke halaman maintenance.</p>
            </div>
          )}
        </div>

        {/* User Management */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-light-base">Manajemen User</h2>
              <p className="text-sm text-light-base/50">Kelola peran dan akses pengguna</p>
            </div>
          </div>

          {usersLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : users.length === 0 ? (
            <p className="text-light-base/40 text-sm">Belum ada user yang terdaftar.</p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-3 border border-white/5">
                  <div>
                    <p className="text-sm font-medium text-light-base">{user.username || "Unknown"}</p>
                    <p className="text-xs text-light-base/40">{user.email || user.user_id}</p>
                  </div>
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.user_id, e.target.value as Role)}
                    className="px-2 py-1 rounded-lg bg-dark-2 border border-white/10 text-light-base text-xs focus:outline-none focus:border-primary"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
