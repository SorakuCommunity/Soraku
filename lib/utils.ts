import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { UserRole } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ROLE_LEVELS: Record<UserRole, number> = {
  OWNER: 7,
  MANAGER: 6,
  ADMIN: 5,
  AGENSI: 4,
  PREMIUM: 3,
  DONATE: 2,
  USER: 1,
}

export function getRoleBadgeColor(role: UserRole): string {
  switch (role) {
    case 'OWNER':   return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
    case 'MANAGER': return 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
    case 'ADMIN':   return 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
    case 'AGENSI':  return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
    case 'PREMIUM': return 'bg-pink-500/20 text-pink-400 border border-pink-500/40'
    case 'DONATE':  return 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
    default:        return 'bg-gray-500/20 text-gray-400 border border-gray-500/40'
  }
}

export function hasAdminAccess(role: UserRole): boolean {
  return ROLE_LEVELS[role] >= ROLE_LEVELS['AGENSI']
}

export function canManageRoles(role: UserRole): boolean {
  return role === 'OWNER'
}

export function isOwnerOrManager(role: UserRole): boolean {
  return ROLE_LEVELS[role] >= ROLE_LEVELS['MANAGER']
}

export function canManageAnime(role: UserRole): boolean {
  return ROLE_LEVELS[role] >= ROLE_LEVELS['AGENSI']
}

export function isPremiumOrAbove(role: UserRole): boolean {
  return ROLE_LEVELS[role] >= ROLE_LEVELS['PREMIUM']
}

/** USER gets max 2 social links, PREMIUM+ gets unlimited */
export function maxSocialLinks(role: UserRole): number {
  if (isPremiumOrAbove(role)) return Infinity
  return 2
}

export function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric',
    })
  } catch { return dateStr }
}

export function formatDuration(ms: number): string {
  const min = Math.floor(ms / 60000)
  const sec = Math.floor((ms % 60000) / 1000)
  return `${min}:${sec.toString().padStart(2, '0')}`
}

export function isValidUrl(url: string): boolean {
  try {
    const p = new URL(url)
    return ['http:', 'https:'].includes(p.protocol)
  } catch { return false }
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function isEventActive(event: { start_date: string; end_date: string }): boolean {
  const now = new Date()
  return new Date(event.start_date) <= now && new Date(event.end_date) >= now
}

export function isEventUpcoming(event: { start_date: string }): boolean {
  return new Date(event.start_date) > new Date()
}
