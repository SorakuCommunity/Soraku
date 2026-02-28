/**
 * lib/roles.ts — Centralized Role System
 */

export const ROLES = ['OWNER', 'MANAGER', 'ADMIN', 'AGENSI', 'PREMIUM', 'DONATE', 'USER'] as const
export type Role = (typeof ROLES)[number]

// Aliases
export const ALL_ROLES    = ROLES
export const ROLE_LIST    = ROLES
export const roleOptions  = ROLES

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

export const ROLE_BADGE_COLORS: Record<Role, { bg: string; text: string }> = {
  OWNER:   { bg: '#E8C2A8', text: '#1C1E22' },
  MANAGER: { bg: '#4FA3D1', text: '#fff' },
  ADMIN:   { bg: '#6E8FA6', text: '#fff' },
  AGENSI:  { bg: '#7C9E87', text: '#fff' },
  PREMIUM: { bg: '#C9A84C', text: '#1C1E22' },
  DONATE:  { bg: '#9B7FD4', text: '#fff' },
  USER:    { bg: '#2A2F37', text: '#6E8FA6' },
}

const ROLE_RANK: Record<Role, number> = {
  OWNER: 7, MANAGER: 6, ADMIN: 5, AGENSI: 4, PREMIUM: 3, DONATE: 2, USER: 1,
}

export function hasRole(userRole: Role | null | undefined, required: Role): boolean {
  if (!userRole) return false
  return ROLE_RANK[userRole] >= ROLE_RANK[required]
}

export function getRoleRank(role: Role | null | undefined): number {
  if (!role) return 0
  return ROLE_RANK[role] ?? 0
}

export function isAdmin(role: Role | null | undefined)   { return hasRole(role, 'ADMIN') }
export function isAgensi(role: Role | null | undefined)  { return hasRole(role, 'AGENSI') }
export function isPremium(role: Role | null | undefined) { return hasRole(role, 'PREMIUM') }
export function isOwner(role: Role | null | undefined)   { return hasRole(role, 'OWNER') }
export function isManager(role: Role | null | undefined) { return hasRole(role, 'MANAGER') }

export async function checkUserRole(
  supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: boolean | null }> },
  role: Role
): Promise<boolean> {
  const { data } = await supabase.rpc('has_role', { role_name: role })
  return data === true
}
