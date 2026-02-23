// ============================================================
// SORAKU ROLE SYSTEM — V1.0.a2
// ============================================================

import type { Role } from "@/types";

export const ROLES: Record<Role, number> = {
  SUPERADMIN: 5,
  MANAGER: 4,
  AGENSI: 3,
  ADMIN: 2,
  USER: 1,
};

export const ROLE_LABELS: Record<Role, string> = {
  SUPERADMIN: "Super Admin",
  MANAGER: "Manager",
  AGENSI: "Agensi",
  ADMIN: "Admin",
  USER: "Member",
};

export const ROLE_COLORS: Record<Role, string> = {
  SUPERADMIN: "text-red-400 bg-red-400/10 border-red-400/30",
  MANAGER: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  AGENSI: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  ADMIN: "text-primary bg-primary/10 border-primary/30",
  USER: "text-secondary bg-secondary/10 border-secondary/30",
};

// ─── Permission Checks ───────────────────────────────────────

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLES[userRole] >= ROLES[requiredRole];
}

export function canManageVtuber(role: Role): boolean {
  return hasRole(role, "AGENSI");
}

export function canFullCRUDVtuber(role: Role): boolean {
  return hasRole(role, "MANAGER");
}

export function canManageBlog(role: Role): boolean {
  return hasRole(role, "ADMIN");
}

export function canManageEvents(role: Role): boolean {
  return hasRole(role, "ADMIN");
}

export function canApproveGallery(role: Role): boolean {
  return hasRole(role, "ADMIN");
}

export function canManageRoles(role: Role): boolean {
  return hasRole(role, "MANAGER");
}

export function canAccessAdmin(role: Role): boolean {
  return hasRole(role, "ADMIN");
}

export function canToggleMaintenance(role: Role): boolean {
  return hasRole(role, "SUPERADMIN");
}

export const ALL_ROLES: Role[] = ["SUPERADMIN", "MANAGER", "AGENSI", "ADMIN", "USER"];
