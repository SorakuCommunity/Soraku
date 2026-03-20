const API_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://localhost:4000"

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<{ data: T | null; error: string | null }> {
  try {
    const res  = await fetch(`${API_URL}${path}`, { ...opts, next: { revalidate: 30 } })
    const json = await res.json()
    return json
  } catch (e: any) {
    return { data: null, error: e.message }
  }
}

// ── Stream ────────────────────────────────────────────────────

export async function searchAnime(q: string, source = "hianime", page = 1) {
  return apiFetch<any[]>(`/api/stream?anime=true&q=${encodeURIComponent(q)}&source=${source}&page=${page}`)
}

export async function getAnimeDetail(slug: string, source = "hianime") {
  return apiFetch<any>(`/api/stream/${encodeURIComponent(slug)}?anime=true&source=${source}&info=true`)
}

export async function getAnimeStream(episodeId: string, source = "hianime", quality = "auto") {
  return apiFetch<any>(`/api/stream/${encodeURIComponent(episodeId)}?anime=true&source=${source}&quality=${quality}`)
}

export async function getStreamList(params?: { type?: string; page?: number; limit?: number }) {
  const qs = new URLSearchParams(params as any).toString()
  return apiFetch<any[]>(`/api/stream${qs ? "?" + qs : ""}`)
}

export async function getStreamContent(slug: string) {
  return apiFetch<any>(`/api/stream/${slug}`)
}

// ── Bunny.net ─────────────────────────────────────────────────

export async function uploadToBunny(file: File, title: string): Promise<{ videoId: string; hlsUrl: string } | null> {
  const res = await fetch("/api/stream/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, size: file.size, type: file.type }),
  })
  if (!res.ok) return null
  const { data } = await res.json()
  if (!data?.uploadUrl || !data?.videoId) return null

  // Upload directly to Bunny
  const uploadRes = await fetch(data.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "application/octet-stream" },
    body: file,
  })
  if (!uploadRes.ok) return null
  return { videoId: data.videoId, hlsUrl: data.hlsUrl }
}
