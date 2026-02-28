/**
 * ============================================================
 *  SORAKU COMMUNITY — PROPRIETARY & CONFIDENTIAL
 * ============================================================
 *  lib/theme.ts — Centralized Theme System v1.0.a3.1
 *  Server-side: fetches palette from site_settings, validates,
 *  provides fallback defaults.
 *  Client-side: injects CSS variables at runtime.
 * ============================================================
 */

import { z } from 'zod'

// ─── Default Palette ──────────────────────────────────────────────────────────
export const DEFAULT_PALETTE = {
  primary_color:    '#4FA3D1',
  dark_base_color:  '#1C1E22',
  secondary_color:  '#6E8FA6',
  light_base_color: '#D9DDE3',
  accent_color:     '#E8C2A8',
  theme_mode:       'dark' as ThemeMode,
}

export type ThemeMode = 'dark' | 'light' | 'auto'
export type ThemePalette = typeof DEFAULT_PALETTE

// ─── Zod Validation ───────────────────────────────────────────────────────────
const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid 6-digit hex color (e.g. #4FA3D1)')

const themePaletteSchema = z.object({
  primary_color:    hexColor,
  dark_base_color:  hexColor,
  secondary_color:  hexColor.optional().default(DEFAULT_PALETTE.secondary_color),
  light_base_color: hexColor.optional().default(DEFAULT_PALETTE.light_base_color),
  accent_color:     hexColor.optional().default(DEFAULT_PALETTE.accent_color),
  theme_mode:       z.enum(['dark', 'light', 'auto']).optional().default('dark'),
})

// ─── Server: Load palette from site_settings ─────────────────────────────────
export async function loadThemePalette(
  supabase: { from: (table: string) => unknown }
): Promise<ThemePalette> {
  try {
    const { data } = await (supabase as any)
      .from('site_settings')
      .select('key, value')
      .in('key', [
        'primary_color',
        'dark_base_color',
        'secondary_color',
        'light_base_color',
        'accent_color',
        'theme_mode',
      ])

    if (!data) return DEFAULT_PALETTE

    const raw: Record<string, string> = {}
    for (const row of data as { key: string; value: string }[]) {
      raw[row.key] = row.value
    }

    const result = themePaletteSchema.safeParse(raw)

    if (!result.success) {
      // Partial fallback: merge valid fields with defaults
      const merged: ThemePalette = { ...DEFAULT_PALETTE }
      for (const key of Object.keys(DEFAULT_PALETTE) as (keyof ThemePalette)[]) {
        const val = raw[key]
        if (val) {
          if (key === 'theme_mode') {
            if (['dark', 'light', 'auto'].includes(val)) {
              merged.theme_mode = val as ThemeMode
            }
          } else {
            if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
              ;(merged as any)[key] = val
            }
          }
        }
      }
      return merged
    }

    return result.data as ThemePalette
  } catch {
    return DEFAULT_PALETTE
  }
}

// ─── Build CSS variable injection string ─────────────────────────────────────
export function buildCSSVariables(palette: ThemePalette): string {
  return [
    `--color-primary:${palette.primary_color}`,
    `--color-dark-base:${palette.dark_base_color}`,
    `--color-secondary:${palette.secondary_color}`,
    `--color-light-base:${palette.light_base_color}`,
    `--color-accent:${palette.accent_color}`,
  ].join(';')
}

// ─── Determine effective theme class ─────────────────────────────────────────
export function resolveThemeClass(
  userMode: ThemeMode | null | undefined,
  siteMode: ThemeMode,
): 'dark' | 'light' {
  const effective = userMode ?? siteMode

  if (effective === 'dark')  return 'dark'
  if (effective === 'light') return 'light'
  // 'auto' resolves on client via media query — default to dark for SSR
  return 'dark'
}

// ─── Validate a single hex color (for admin API) ─────────────────────────────
export function isValidHexColor(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value)
}
