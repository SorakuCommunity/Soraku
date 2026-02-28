/**
 * lib/roles.ts — Centralized Role System
 * All role validation must go through this file.
 */

export const ROLES = ['OWNER', 'MANAGER', 'ADMIN', 'AGENSI', 'PREMIUM', 'DONATE', 'USER'] as const
export type Role = (typeof ROLES)[number]

// Alias — beberapa file mengimport sebagai ALL_ROLES
export const ALL_ROLES = ROLES

export const ROLE_LABELS: Record<Role, string> = {
  OWNER:   'Owner',
  MANAGER: 'Manager',
  ADMIN:   'Admin',
  AGENSI:  'Agensi',
  PREMIUM: 'Premium',
  DONATE:  'Donatur',
  USER:    'User',
}

export const ROLE_COLORS: Record<Role, string> = {
  OWNER:   '#E8C2A8',
  MANAGER: '#4FA3D1',
  ADMIN:   '#6E8FA6',
  AGENSI:  '#7C9E87',
  PREMIUM: '#C9A84C',
  DONATE:  '#9B7FD4',
  USER:    '#6E8FA6',
}

const ROLE_RANK: Record<Role, number> = {
  OWNER:   7,
  MANAGER: 6,
  ADMIN:   5,
  AGENSI:  4,
  PREMIUM: 3,
  DONATE:  2,
  USER:    1,
}

export function hasRole(userRole: Role | null | undefined, required: Role): boolean {
  if (!userRole) return false
  return ROLE_RANK[userRole] >= ROLE_RANK[required]
}

export function getRoleRank(role: Role | null | undefined): number {
  if (!role) return 0
  return ROLE_RANK[role] ?? 0
}

export function isAdmin(role: Role | null | undefined): boolean {
  return hasRole(role, 'ADMIN')
}

export function isAgensi(role: Role | null | undefined): boolean {
  return hasRole(role, 'AGENSI')
}

export function isPremium(role: Role | null | undefined): boolean {
  return hasRole(role, 'PREMIUM')
}

/**
 * Server-side role check — calls DB function public.has_role(role_name)
 */
export async function checkUserRole(
  supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: boolean | null }> },
  role: Role
): Promise<boolean> {
  const { data } = await supabase.rpc('has_role', { role_name: role })
  return data === true
}
