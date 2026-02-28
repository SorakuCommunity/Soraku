/**
 * lib/maintenance.ts — Maintenance mode utilities
 */

import { cacheGet, cacheSet, cacheDel } from './redis'

const MAINTENANCE_KEY = 'site:maintenance'

export interface MaintenanceStatus {
  enabled:   boolean
  message:   string
  startedAt: string | null
}

export async function getMaintenanceStatus(): Promise<MaintenanceStatus> {
  try {
    const cached = await cacheGet<MaintenanceStatus>(MAINTENANCE_KEY)
    if (cached) return cached
  } catch {}
  return { enabled: false, message: 'Sedang dalam pemeliharaan.', startedAt: null }
}

export async function setMaintenanceMode(enabled: boolean, message = 'Sedang dalam pemeliharaan.'): Promise<void> {
  const status: MaintenanceStatus = { enabled, message, startedAt: enabled ? new Date().toISOString() : null }
  await cacheSet(MAINTENANCE_KEY, status, 86400)
}

export async function disableMaintenance(): Promise<void> {
  await cacheDel(MAINTENANCE_KEY)
}

// Aliases
export async function isMaintenanceMode(): Promise<boolean> {
  const s = await getMaintenanceStatus()
  return s.enabled
}

export const checkMaintenance    = isMaintenanceMode
export const getMaintenanceMode  = isMaintenanceMode
export const enableMaintenance   = (msg?: string) => setMaintenanceMode(true, msg)
