'use client'
import { useEffect, useState } from 'react'

type ThemeMode = 'dark' | 'light' | 'auto'

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>('dark')

  useEffect(() => {
    const saved = document.documentElement.getAttribute('data-theme-mode') as ThemeMode
    if (saved) setMode(saved)
  }, [])

  const updateTheme = async (newMode: ThemeMode) => {
    setMode(newMode)

    // Determine effective class
    let effectiveClass: 'dark' | 'light' = 'dark'
    if (newMode === 'light') {
      effectiveClass = 'light'
    } else if (newMode === 'auto') {
      effectiveClass = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(effectiveClass)
    document.documentElement.setAttribute('data-theme-mode', newMode)

    // Persist to DB
    await fetch('/api/profile/theme', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ theme_mode: newMode }),
    })
  }

  return { mode, updateTheme }
}
