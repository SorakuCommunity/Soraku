// src/app/api/anime/search/[source]/route.ts
import { NextRequest, NextResponse } from "next/server";

const ANIFY_BASE = "https://api.anify.eltik.cc";
const GOGO_BASE = "https://api.consumet.org";
const HIANIME_BASE = "https://api.hianime.to/api";
const SAMA_BASE = "https://samehadaku.email/wp-json/wp/v2";
const OTK_BASE = "https://otakudesu.animeupdates.me/wp-json/wp/v2";
const ANIBARU_BASE = "https://anibaru.me/wp-json/wp/v2";

type AnimeSource =
  | "anify"
  | "gogoanime"
  | "hianime"
  | "samehadaku"
  | "otakudesu"
  | "anibaru";

async function searchAnify(query: string, page = 1) {
  try {
    const res = await fetch(
      `${ANIFY_BASE}/search-advanced?query=${encodeURIComponent(query)}&page=${page}&type=anime`,
      {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 60 }
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (
      data.results?.map((item: any) => ({
        id: item.id,
        title:
          item.title?.english ||
          item.title?.romaji ||
          item.title?.native ||
          "Unknown",
        cover: item.coverImage || item.image,
        status: item.status,
        episodes: item.totalEpisodes,
        source: "anify"
      })) ?? []
    );
  } catch {
    return null;
  }
}

async function searchGogoanime(query: string, page = 1) {
  try {
    const res = await fetch(
      `${GOGO_BASE}/anime/gogoanime/${encodeURIComponent(query)}?page=${page}`,
      {
        next: { revalidate: 60 }
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (
      data.results?.map((item: any) => ({
        id: item.id,
        title: item.title,
        cover: item.image,
        status: item.status,
        episodes: item.episodes?.max || item.totalEpisodes,
        source: "gogoanime"
      })) ?? []
    );
  } catch {
    return null;
  }
}

async function searchHiAnime(query: string, page = 1) {
  try {
    const res = await fetch(
      `${HIANIME_BASE}/search?q=${encodeURIComponent(query)}&page=${page}`,
      {
        next: { revalidate: 60 }
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (
      data.data?.results?.map((item: any) => ({
        id: item.id,
        title: item.name || item.title,
        cover: item.poster,
        status: item.status,
        episodes: item.episodes,
        source: "hianime"
      })) ?? []
    );
  } catch {
    return null;
  }
}

async function searchSamehadaku(query: string, page = 1) {
  try {
    const res = await fetch(
      `${SAMA_BASE}/posts?search=${encodeURIComponent(query)}&per_page=20&page=${page}`,
      {
        next: { revalidate: 60 }
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (
      data.map((item: any) => {
        const match = item.title?.match(/\[(\d+)\] (.+)/);
        return {
          id: item.id.toString(),
          title: match?.[2] || item.title?.rendered || item.title,
          cover:
            item.featured_media_urls?.large || item.featured_media_urls?.medium,
          status: item.status === "publish" ? "Completed" : "Ongoing",
          episodes: match?.[1] || null,
          source: "samehadaku"
        };
      }) ?? []
    );
  } catch {
    return null;
  }
}

async function searchOtakudesu(query: string, page = 1) {
  try {
    const res = await fetch(
      `${OTK_BASE}/posts?search=${encodeURIComponent(query)}&per_page=20&page=${page}`,
      {
        next: { revalidate: 60 }
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (
      data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title?.rendered?.replace(/<\/[^>]+>/g, "") || item.title,
        cover:
          item.featured_media_urls?.large || item.featured_media_urls?.medium,
        status: item.status === "publish" ? "Completed" : "Ongoing",
        episodes: null,
        source: "otakudesu"
      })) ?? []
    );
  } catch {
    return null;
  }
}

async function searchAnibaru(query: string, page = 1) {
  try {
    const res = await fetch(
      `${ANIBARU_BASE}/posts?search=${encodeURIComponent(query)}&per_page=20&page=${page}`,
      {
        next: { revalidate: 60 }
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (
      data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title?.rendered?.replace(/<\/[^>]+>/g, "") || item.title,
        cover:
          item.featured_media_urls?.large || item.featured_media_urls?.medium,
        status: item.status === "publish" ? "Completed" : "Ongoing",
        episodes: null,
        source: "anibaru"
      })) ?? []
    );
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ source: string }> }
) {
  const { source } = await params;
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || searchParams.get("query") || "";
  const page = parseInt(searchParams.get("page") || "1");

  if (!query) {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  const animeSource = source as AnimeSource;

  let results: any[] = [];
  let usedSource = animeSource;

  // Indonesian sources (priority)
  const indonesianSources: AnimeSource[] = [
    "samehadaku",
    "otakudesu",
    "anibaru"
  ];

  if (indonesianSources.includes(animeSource)) {
    // Search Indonesian sources first
    switch (animeSource) {
      case "samehadaku":
        results = await searchSamehadaku(query, page);
        break;
      case "otakudesu":
        results = await searchOtakudesu(query, page);
        break;
      case "anibaru":
        results = await searchAnibaru(query, page);
        break;
    }
  } else {
    // Search English sources
    switch (animeSource) {
      case "anify":
        results = await searchAnify(query, page);
        break;
      case "gogoanime":
        results = await searchGogoanime(query, page);
        break;
      case "hianime":
        results = await searchHiAnime(query, page);
        break;
      default:
        // Fallback to anify
        results = await searchAnify(query, page);
        usedSource = "anify";
    }
  }

  // If primary source fails, try fallbacks
  if (!results || results.length === 0) {
    // Try Anify as ultimate fallback
    results = await searchAnify(query, page);
    usedSource = "anify";
  }

  return NextResponse.json({
    results: results || [],
    source: usedSource,
    page,
    query
  });
}
