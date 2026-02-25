/**
 * ============================================================
 *  SORAKU COMMUNITY — PROPRIETARY & CONFIDENTIAL
 * ============================================================
 *  Copyright © 2026 Soraku Community. All Rights Reserved.
 *  Lisensi: SEE LICENSE IN LICENSE | legal@soraku.id
 * ============================================================
 */

// ─── Role System — aligned with types/index.ts UserRole ──────────────────────

import type { UserRole } from "@/types";

// Hierarchy: OWNER (5) > MANAGER (4) > ADMIN (3) > AGENSI (2) > USER (1)
export const ROLES: Record<UserRole, number> = {
  OWNER:   5,
  MANAGER: 4,
  ADMIN:   3,
  AGENSI:  2,
  USER:    1,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  OWNER:   "Owner",
  MANAGER: "Manager",
  ADMIN:   "Admin",
  AGENSI:  "Agensi",
  USER:    "Member",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  OWNER:   "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  MANAGER: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  ADMIN:   "text-blue-400 bg-blue-400/10 border-blue-400/30",
  AGENSI:  "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
  USER:    "text-gray-400 bg-gray-400/10 border-gray-400/30",
};

// ─── Permission Helpers ───────────────────────────────────────────────────────

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLES[userRole] >= ROLES[requiredRole];
}

export function canManageVtuber(role: UserRole): boolean {
  return hasRole(role, "AGENSI");
}

export function canFullCRUDVtuber(role: UserRole): boolean {
  return hasRole(role, "MANAGER");
}

export function canManageBlog(role: UserRole): boolean {
  return hasRole(role, "ADMIN");
}

export function canManageEvents(role: UserRole): boolean {
  return hasRole(role, "ADMIN");
}

export function canApproveGallery(role: UserRole): boolean {
  return hasRole(role, "ADMIN");
}

export function canManageRoles(role: UserRole): boolean {
  return hasRole(role, "MANAGER");
}

export function canAccessAdmin(role: UserRole): boolean {
  return hasRole(role, "ADMIN");
}

// Only OWNER can toggle maintenance mode
export function canToggleMaintenance(role: UserRole): boolean {
  return hasRole(role, "OWNER");
}

export const ALL_ROLES: UserRole[] = ["OWNER", "MANAGER", "ADMIN", "AGENSI", "USER"];
