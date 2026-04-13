// pages/api/anime/episode/[source]/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const ANIFY_BASE = "https://api.anify.eltik.cc";
const GOGO_BASE = "https://api.consumet.org";

type AnimeSource =
  | "anify"
  | "gogoanime"
  | "hianime"
  | "samehadaku"
  | "otakudesu"
  | "anibaru";

async function getAnifyStreams(id: string) {
  try {
    const res = await fetch(`${ANIFY_BASE}/sources?id=${id}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const streams: any[] = [];
    if (data.sources) {
      for (const source of data.sources) {
        streams.push({
          url: source.url,
          quality: source.quality || "auto",
          isM3U8: source.url.includes(".m3u8"),
          server: source.server || "primary"
        });
      }
    }
    if (data.backup) {
      for (const backup of data.backup) {
        streams.push({
          url: backup.url,
          quality: "backup",
          isM3U8: backup.url.includes(".m3u8"),
          server: "backup"
        });
      }
    }
    return streams.length > 0 ? streams : null;
  } catch {
    return null;
  }
}

async function getGogoStreams(id: string) {
  try {
    const res = await fetch(`${GOGO_BASE}/anime/gogoanime/watch/${id}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const streams: any[] = [];
    if (data.sources) {
      streams.push({
        url: data.sources[0]?.url || "",
        quality: "auto",
        isM3U8: true,
        server: "gogo"
      });
    }
    if (data.sources_bk) {
      streams.push({
        url: data.sources_bk[0]?.url || "",
        quality: "backup",
        isM3U8: true,
        server: "backup"
      });
    }
    return streams.length > 0 ? streams : null;
  } catch {
    return null;
  }
}

async function getSamehadakuStreams(episodeId: string) {
  try {
    const res = await fetch(episodeId, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const html = await res.text();
    const m3u8Matches = html.match(/["']([^"']*\.m3u8[^"']*?)["']/g) || [];
    const streams: any[] = [];
    for (const match of m3u8Matches) {
      const url = match.replace(/["']/g, "");
      streams.push({
        url,
        quality: "auto",
        isM3U8: true,
        server: "samehadaku"
      });
    }
    return streams.length > 0 ? streams : null;
  } catch {
    return null;
  }
}

async function getOtakudesuStreams(episodeId: string) {
  return getSamehadakuStreams(episodeId);
}

async function getAnibaruStreams(episodeId: string) {
  return getSamehadakuStreams(episodeId);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { source: string; id: string } }
) {
  const { source, id } = params;
  const animeSource = source as AnimeSource;
  let streams: any[] = [];

  switch (animeSource) {
    case "anify":
    case "hianime":
      streams = (await getAnifyStreams(id)) || [];
      break;
    case "gogoanime":
      streams = (await getGogoStreams(id)) || [];
      break;
    case "samehadaku":
    case "otakudesu":
    case "anibaru":
      streams = (await getSamehadakuStreams(id)) || [];
      break;
    default:
      streams = (await getAnifyStreams(id)) || [];
  }

  if (streams.length === 0)
    return NextResponse.json({ error: "No streams found" }, { status: 404 });
  return NextResponse.json({ streams, source: animeSource, episodeId: id });
}
