// @soraku/scraper — Service untuk scraping anime
// Mengambil data dari: HiAnime, GogoAnime, Samehadaku, Otakudesu
//
// Usage:
//   import { getProvider, searchAnime } from "@/lib/scraper"

import type {
  AnimeSource,
  AnimeSearchResult,
  AnimeDetail,
  AnimeStreamResult,
} from "@soraku/types";

// ── Provider Interface ─────────────────────────────────────────────

export interface AnimeProvider {
  name: AnimeSource;
  baseUrl: string;
  search(query: string, page?: number): Promise<AnimeSearchResult[]>;
  getDetail(animeId: string): Promise<AnimeDetail>;
  getEpisodeStream(episodeId: string): Promise<AnimeStreamResult>;
}

// ── Provider Registry ───────────────────────────────────────────────

const providers = new Map<AnimeSource, AnimeProvider>();

export function registerProvider(provider: AnimeProvider) {
  providers.set(provider.name, provider);
}

export function getProvider(source: AnimeSource): AnimeProvider | undefined {
  return providers.get(source);
}

export function getAllProviders(): AnimeProvider[] {
  return Array.from(providers.values());
}

// ── Scraper Functions ─────────────────────────────────────────────

export async function searchAnime(
  source: AnimeSource,
  query: string,
  page = 1,
): Promise<AnimeSearchResult[]> {
  const provider = getProvider(source);
  if (!provider) {
    throw new Error(`Provider not found: ${source}`);
  }
  return provider.search(query, page);
}

export async function getAnimeDetail(
  source: AnimeSource,
  animeId: string,
): Promise<AnimeDetail | null> {
  const provider = getProvider(source);
  if (!provider) {
    throw new Error(`Provider not found: ${source}`);
  }
  return provider.getDetail(animeId);
}

export async function getEpisodeStream(
  source: AnimeSource,
  episodeId: string,
): Promise<AnimeStreamResult | null> {
  const provider = getProvider(source);
  if (!provider) {
    throw new Error(`Provider not found: ${source}`);
  }
  return provider.getEpisodeStream(episodeId);
}

// ── Available Sources ──────────────────────────────────────────────

export const AVAILABLE_SOURCES: AnimeSource[] = [
  "hianime",
  "gogoanime",
  "animekai",
  "anibaru",
  "samehadaku",
  "otakudesu",
];

export function getAvailableSources() {
  return AVAILABLE_SOURCES.map((source) => ({
    name: source,
    status: "online", // TODO: Check actual status
  }));
}

// Re-export types
export type {
  AnimeSource,
  AnimeSearchResult,
  AnimeDetail,
  AnimeStreamResult,
} from "@soraku/types";
