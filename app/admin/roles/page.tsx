"use client";

import { ROLE_LABELS, ROLE_COLORS } from "@/lib/roles";
import type { Role } from "@/types";
import { Edit2 } from "lucide-react";

const MOCK_USERS = [
  { id: "1", username: "admin_soraku", email: "admin@soraku.id", role: "SUPERADMIN" as Role },
  { id: "2", username: "manager_01", email: "manager@soraku.id", role: "MANAGER" as Role },
  { id: "3", username: "agensi_talent", email: "agensi@soraku.id", role: "AGENSI" as Role },
  { id: "4", username: "regular_user", email: "user@email.com", role: "USER" as Role },
];

export default function AdminRolesPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-white mb-1">Role Management</h1>
        <p className="text-secondary">Kelola peran dan akses member komunitas.</p>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left p-4 text-secondary text-sm font-medium">User</th>
              <th className="text-left p-4 text-secondary text-sm font-medium">Email</th>
              <th className="text-left p-4 text-secondary text-sm font-medium">Role</th>
              <th className="text-left p-4 text-secondary text-sm font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((user) => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/2">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white text-sm font-medium">{user.username}</span>
                  </div>
                </td>
                <td className="p-4 text-secondary text-sm">{user.email}</td>
                <td className="p-4">
                  <span className={`badge text-xs ${ROLE_COLORS[user.role]}`}>
                    {ROLE_LABELS[user.role]}
                  </span>
                </td>
                <td className="p-4">
                  <button className="flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors glass px-3 py-1.5 rounded-lg">
                    <Edit2 size={12} />
                    Ubah Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
