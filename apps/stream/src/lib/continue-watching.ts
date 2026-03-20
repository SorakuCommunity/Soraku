"use client"
// lib/continue-watching.ts — localStorage based (like Miruro)

export interface WatchProgress {
  animeId:     string
  animeTitle:  string
  animeCover:  string | null
  episodeId:   string
  episodeNum:  number
  episodeTitle:string | null
  source:      string
  progress:    number   // seconds watched
  duration:    number   // total duration
  updatedAt:   number   // timestamp
}

const KEY = "soraku_continue_watching"
const MAX = 20

function load(): WatchProgress[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function save(items: WatchProgress[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items)) } catch {}
}

export function getContinueWatching(): WatchProgress[] {
  return load().sort((a, b) => b.updatedAt - a.updatedAt)
}

export function updateProgress(p: Omit<WatchProgress, "updatedAt">) {
  const items = load().filter(i => i.episodeId !== p.episodeId)
  items.unshift({ ...p, updatedAt: Date.now() })
  save(items.slice(0, MAX))
}

export function removeFromHistory(episodeId: string) {
  save(load().filter(i => i.episodeId !== episodeId))
}

export function clearHistory() {
  save([])
}

export function getProgress(episodeId: string): number {
  return load().find(i => i.episodeId === episodeId)?.progress ?? 0
}
