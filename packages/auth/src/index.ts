// @soraku/auth — Shared authentication logic
// Dipakai oleh: apps/web, apps/stream, apps/mobile, services/api, services/bot

import type { UserSession, UserRole, SupporterTier } from "@soraku/types"

// ── Role Helpers ───────────────────────────────────────────────

export const STAFF_ROLES: UserRole[] = ["OWNER", "MANAGER", "ADMIN"]

export function isStaff(role: string): boolean {
  return STAFF_ROLES.includes(role as UserRole)
}

export function isManager(role: string): boolean {
  return ["OWNER", "MANAGER"].includes(role)
}

export function isOwner(role: string): boolean {
  return role === "OWNER"
}

export function isSupporter(tier: SupporterTier): boolean {
  return tier != null
}

// ── Permission System ──────────────────────────────────────────

export type Permission =
  | "users:read"
  | "users:write"
  | "users:ban"
  | "posts:read"
  | "posts:write"
  | "posts:delete"
  | "events:read"
  | "events:write"
  | "events:delete"
  | "gallery:read"
  | "gallery:write"
  | "gallery:moderate"
  | "premium:manage"
  | "analytics:read"
  | "settings:write"
  | "bot:manage"

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  OWNER: [
    "users:read", "users:write", "users:ban",
    "posts:read", "posts:write", "posts:delete",
    "events:read", "events:write", "events:delete",
    "gallery:read", "gallery:write", "gallery:moderate",
    "premium:manage", "analytics:read", "settings:write", "bot:manage",
  ],
  MANAGER: [
    "users:read", "users:write", "users:ban",
    "posts:read", "posts:write", "posts:delete",
    "events:read", "events:write", "events:delete",
    "gallery:read", "gallery:write", "gallery:moderate",
    "premium:manage", "analytics:read",
  ],
  ADMIN: [
    "users:read", "users:write",
    "posts:read", "posts:write", "posts:delete",
    "events:read", "events:write", "events:delete",
    "gallery:read", "gallery:write", "gallery:moderate",
    "analytics:read",
  ],
  AGENSI: [
    "posts:read", "events:read", "gallery:read",
  ],
  KREATOR: [
    "posts:read", "posts:write",
    "events:read",
    "gallery:read", "gallery:write",
  ],
  USER: [
    "posts:read", "events:read", "gallery:read",
  ],
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p))
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p))
}

// ── Session Helpers ────────────────────────────────────────────

export function createSessionPayload(session: UserSession) {
  return {
    id: session.id,
    username: session.username,
    displayname: session.displayname,
    avatarurl: session.avatarurl,
    email: session.email,
    role: session.role,
    supporterrole: session.supporterrole,
    issupporter: session.issupporter,
  }
}

export function requireStaff(session: UserSession | null): UserSession {
  if (!session) throw new Error("UNAUTHORIZED: No session")
  if (!isStaff(session.role)) throw new Error("FORBIDDEN: Staff access required")
  return session
}

export function requireOwner(session: UserSession | null): UserSession {
  if (!session) throw new Error("UNAUTHORIZED: No session")
  if (!isOwner(session.role)) throw new Error("FORBIDDEN: Owner access required")
  return session
}
