'use client'

/**
 * ============================================================
 *  SORAKU ThemeProvider — v1.0.a3.1
 *  Client-side: injects CSS variables, handles dark/light/auto,
 *  listens to user preference changes.
 *  No hydration mismatch: SSR sets initial class on <html>.
 * ============================================================
 */

import { useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ThemeMode, ThemePalette } from '@/lib/theme'
import { buildCSSVariables } from '@/lib/theme'

interface Props {
  initialPalette: ThemePalette
  initialMode: 'dark' | 'light'
}

export function ThemeProvider({ initialPalette, initialMode }: Props) {
  const supabase = createClient()

  // ── Apply CSS palette variables to :root ───────────────────────────────────
  const applyPalette = useCallback((palette: ThemePalette) => {
    const vars = buildCSSVariables(palette).split(';')
    for (const v of vars) {
      const [prop, val] = v.split(':')
      if (prop && val) {
        document.documentElement.style.setProperty(prop, val)
      }
    }
  }, [])

  // ── Apply dark/light class to <html> ──────────────────────────────────────
  const applyMode = useCallback((mode: ThemeMode) => {
    const html = document.documentElement

    if (mode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      html.classList.toggle('dark',  prefersDark)
      html.classList.toggle('light', !prefersDark)
    } else {
      html.classList.toggle('dark',  mode === 'dark')
      html.classList.toggle('light', mode === 'light')
    }
  }, [])

  // ── Initial palette application (CSS vars) ────────────────────────────────
  useEffect(() => {
    applyPalette(initialPalette)
    applyMode(initialMode)
  }, [applyPalette, applyMode, initialPalette, initialMode])

  // ── Listen to system preference for auto mode ──────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')

    const handler = (e: MediaQueryListEvent) => {
      const html = document.documentElement
      const isAuto = html.getAttribute('data-theme-mode') === 'auto'
      if (!isAuto) return
      html.classList.toggle('dark',  e.matches)
      html.classList.toggle('light', !e.matches)
    }

    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // ── Sync user theme preference on auth change ─────────────────────────────
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session?.user) return
      const { data } = await supabase
        .from('users')
        .select('theme_mode')
        .eq('id', session.user.id)
        .single()

      if (data?.theme_mode) {
        document.documentElement.setAttribute('data-theme-mode', data.theme_mode)
        applyMode(data.theme_mode as ThemeMode)
      }
    })
    return () => subscription.unsubscribe()
  }, [supabase, applyMode])

  // This component renders nothing — it only manages side effects
  return null
}

// ── Standalone hook for theme toggle ──────────────────────────────────────────
export function useThemeToggle() {
  const supabase = createClient()

  const setTheme = useCallback(async (mode: ThemeMode) => {
    const html = document.documentElement
    html.setAttribute('data-theme-mode', mode)

    if (mode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      html.classList.toggle('dark',  prefersDark)
      html.classList.toggle('light', !prefersDark)
    } else {
      html.classList.toggle('dark',  mode === 'dark')
      html.classList.toggle('light', mode === 'light')
    }

    // Persist to user profile
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('users').update({ theme_mode: mode }).eq('id', user.id)
    }
  }, [supabase])

  return { setTheme }
}
