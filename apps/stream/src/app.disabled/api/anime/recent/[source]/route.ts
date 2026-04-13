// src/app/api/anime/recent/[source]/route.ts
import { NextRequest, NextResponse } from "next/server";

const ANIFY_BASE = "https://api.anify.eltik.cc";
const GOGO_BASE = "https://api.consumet.org";
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

async function getAnifyRecent(page = 1) {
  try {
    const res = await fetch(`${ANIFY_BASE}/recent?page=${page}&perPage=20`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (
      data.results?.map((item: any) => ({
        id: item.id,
        title: item.title?.english || item.title?.romaji || "Unknown",
        cover: item.coverImage || item.image,
        episode: item.episode?.number,
        source: "anify"
      })) ?? []
    );
  } catch {
    return null;
  }
}

async function getGogoRecent(page = 1) {
  try {
    const res = await fetch(
      `${GOGO_BASE}/anime/gogoanime/recent?page=${page}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (
      data.results?.map((item: any) => ({
        id: item.id,
        title: item.title,
        cover: item.image,
        episode: item.episode,
        source: "gogoanime"
      })) ?? []
    );
  } catch {
    return null;
  }
}

async function getSamehadakuRecent(page = 1) {
  try {
    const res = await fetch(`${SAMA_BASE}/posts?per_page=20&page=${page}`, {
      next: { revalidate: 60 }
    });
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
          episode: match?.[1] || null,
          source: "samehadaku"
        };
      }) ?? []
    );
  } catch {
    return null;
  }
}

async function getOtakudesuRecent(page = 1) {
  try {
    const res = await fetch(`${OTK_BASE}/posts?per_page=20&page=${page}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (
      data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title?.rendered?.replace(/<\/[^>]+>/g, "") || item.title,
        cover:
          item.featured_media_urls?.large || item.featured_media_urls?.medium,
        episode: null,
        source: "otakudesu"
      })) ?? []
    );
  } catch {
    return null;
  }
}

async function getAnibaruRecent(page = 1) {
  try {
    const res = await fetch(`${ANIBARU_BASE}/posts?per_page=20&page=${page}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (
      data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title?.rendered?.replace(/<\/[^>]+>/g, "") || item.title,
        cover:
          item.featured_media_urls?.large || item.featured_media_urls?.medium,
        episode: null,
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
  const page = parseInt(searchParams.get("page") || "1");

  const animeSource = source as AnimeSource;

  let results: any[] = [];

  // Indonesian sources (priority)
  switch (animeSource) {
    case "samehadaku":
      results = (await getSamehadakuRecent(page)) || [];
      break;
    case "otakudesu":
      results = (await getOtakudesuRecent(page)) || [];
      break;
    case "anibaru":
      results = (await getAnibaruRecent(page)) || [];
      break;
    case "anify":
    case "gogoanime":
    case "hianime":
    default:
      // Try English sources
      const anifyResults = await getAnifyRecent(page);
      if (anifyResults && anifyResults.length > 0) {
        results = anifyResults;
      } else {
        results = (await getGogoRecent(page)) || [];
      }
      break;
  }

  // Fallback to anify if primary source fails
  if (results.length === 0) {
    results = (await getAnifyRecent(page)) || [];
  }

  return NextResponse.json({
    results,
    source: animeSource,
    page
  });
}
