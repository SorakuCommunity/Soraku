/**
 * lib/utils.ts — Utility functions
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export function relativeTime(date: string | Date): string {
  const diff    = Date.now() - new Date(date).getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours   = Math.floor(minutes / 60)
  const days    = Math.floor(hours / 24)
  if (seconds < 60)  return 'baru saja'
  if (minutes < 60)  return `${minutes} menit lalu`
  if (hours < 24)    return `${hours} jam lalu`
  if (days < 30)     return `${days} hari lalu`
  return formatDate(date)
}

export function isValidUrl(url: string): boolean {
  try { new URL(url); return true } catch { return false }
}

export function randomId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function safeJson<T>(value: string, fallback: T): T {
  try { return JSON.parse(value) as T } catch { return fallback }
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024)      return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`
}

// Alias untuk kompatibilitas
export const classNames = cn
export const clsxMerge  = cn

// ─── Duration formatter (ms → m:ss) ──────────────────────────────────────────
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
