/**
 * lib/roles.ts — Centralized Role System
 * All role validation must go through this file.
 */

export const ROLES = ['OWNER', 'MANAGER', 'ADMIN', 'AGENSI', 'PREMIUM', 'DONATE', 'USER'] as const
export type Role = (typeof ROLES)[number]

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
