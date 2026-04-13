// pages/api/anime/info/[source]/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const ANIFY_BASE = "https://api.anify.eltik.cc";
const GOGO_BASE = "https://api.consumet.org";
const SAMA_BASE = "https://samehadaku.email";
const OTK_BASE = "https://otakudesu.animeupdates.me";
const ANIBARU_BASE = "https://anibaru.me";

type AnimeSource =
  | "anify"
  | "gogoanime"
  | "hianime"
  | "samehadaku"
  | "otakudesu"
  | "anibaru";

async function getAnifyInfo(id: string) {
  try {
    const res = await fetch(`${ANIFY_BASE}/info/${id}`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      id: data.id,
      title: data.title?.english || data.title?.romaji || "Unknown",
      cover: data.coverImage || data.image,
      banner: data.bannerImage,
      description: data.description,
      status: data.status,
      genres: data.genres || [],
      episodes:
        data.episodes?.map((ep: any) => ({
          id: ep.id,
          number: ep.number,
          title: ep.title
        })) || [],
      totalEpisodes: data.totalEpisodes,
      source: "anify"
    };
  } catch {
    return null;
  }
}

async function getGogoanimeInfo(id: string) {
  try {
    const res = await fetch(`${GOGO_BASE}/anime/gogoanime/info/${id}`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      id: data.id,
      title: data.title,
      cover: data.image,
      banner: data.image,
      description: data.description,
      status: data.status,
      genres: data.genres || [],
      episodes:
        data.episodes?.map((ep: any) => ({
          id: ep.id,
          number: ep.number,
          title: ep.title
        })) || [],
      totalEpisodes: data.episodes?.length,
      source: "gogoanime"
    };
  } catch {
    return null;
  }
}

async function getSamehadakuInfo(id: string) {
  try {
    const res = await fetch(`${SAMA_BASE}/?p=${id}`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) return null;
    const html = await res.text();
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const coverMatch = html.match(/class="thumb"[^\s]*[\s\S]*?src="([^"]+)"/);
    const descMatch = html.match(/<div class="desc">([\s\S]*?)<\/div>/);
    const epsMatch = html.match(
      /<a[^>]+href="([^"]+)"[^>]*class="eps[^"]*"[^>]*>(\d+)<\/a>/g
    );
    const episodes: any[] = [];
    if (epsMatch) {
      let match;
      const epsRegex = /href="([^"]+)"[^>]*>(\d+)</g;
      while ((match = epsRegex.exec(epsMatch[0])) !== null) {
        episodes.push({ id: match[1], number: parseInt(match[2]) });
      }
    }
    return {
      id,
      title: titleMatch?.[1] || "Unknown",
      cover: coverMatch?.[1] || null,
      banner: null,
      description: descMatch?.[1]?.replace(/<[^>]+>/g, "") || "",
      status: "Ongoing",
      genres: [],
      episodes: episodes.reverse(),
      totalEpisodes: episodes.length,
      source: "samehadaku"
    };
  } catch {
    return null;
  }
}

async function getOtakudesuInfo(id: string) {
  try {
    const res = await fetch(`${OTK_BASE}/?p=${id}`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) return null;
    const html = await res.text();
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const coverMatch = html.match(/class="thumb"[^\s]*[\s\S]*?src="([^"]+)"/);
    const descMatch = html.match(/<div class="desc">([\s\S]*?)<\/div>/);
    const epsMatch = html.match(/<a[^>]+href="([^"]+)"[^>]*>(\d+)<\/a>/g);
    const episodes: any[] = [];
    if (epsMatch) {
      let match;
      const epsRegex = /href="([^"]+)"[^>]*>(\d+)</g;
      while ((match = epsRegex.exec(epsMatch[0])) !== null) {
        episodes.push({ id: match[1], number: parseInt(match[2]) });
      }
    }
    return {
      id,
      title: titleMatch?.[1] || "Unknown",
      cover: coverMatch?.[1] || null,
      banner: null,
      description: descMatch?.[1]?.replace(/<[^>]+>/g, "") || "",
      status: "Ongoing",
      genres: [],
      episodes: episodes.reverse(),
      totalEpisodes: episodes.length,
      source: "otakudesu"
    };
  } catch {
    return null;
  }
}

async function getAnibaruInfo(id: string) {
  try {
    const res = await fetch(`${ANIBARU_BASE}/?p=${id}`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) return null;
    const html = await res.text();
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const coverMatch = html.match(/class="thumb"[^\s]*[\s\S]*?src="([^"]+)"/);
    const descMatch = html.match(/<div class="desc">([\s\S]*?)<\/div>/);
    const epsMatch = html.match(/<a[^>]+href="([^"]+)"[^>]*>(\d+)<\/a>/g);
    const episodes: any[] = [];
    if (epsMatch) {
      let match;
      const epsRegex = /href="([^"]+)"[^>]*>(\d+)</g;
      while ((match = epsRegex.exec(epsMatch[0])) !== null) {
        episodes.push({ id: match[1], number: parseInt(match[2]) });
      }
    }
    return {
      id,
      title: titleMatch?.[1] || "Unknown",
      cover: coverMatch?.[1] || null,
      banner: null,
      description: descMatch?.[1]?.replace(/<[^>]+>/g, "") || "",
      status: "Ongoing",
      genres: [],
      episodes: episodes.reverse(),
      totalEpisodes: episodes.length,
      source: "anibaru"
    };
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { source: string; id: string } }
) {
  const { source, id } = params;
  const animeSource = source as AnimeSource;
  let info: any = null;

  switch (animeSource) {
    case "anify":
      info = await getAnifyInfo(id);
      break;
    case "gogoanime":
      info = await getGogoanimeInfo(id);
      break;
    case "samehadaku":
      info = await getSamehadakuInfo(id);
      break;
    case "otakudesu":
      info = await getOtakudesuInfo(id);
      break;
    case "anibaru":
      info = await getAnibaruInfo(id);
      break;
    case "hianime":
      info = await getAnifyInfo(id);
      break;
    default:
      info = await getAnifyInfo(id);
  }

  if (!info)
    return NextResponse.json({ error: "Anime not found" }, { status: 404 });
  return NextResponse.json(info);
}
