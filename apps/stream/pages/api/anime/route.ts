// pages/api/anime/route.ts - Main anime API entry point
import { NextRequest, NextResponse } from "next/server";

const API_BASE = "/api/anime";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");
  const source = searchParams.get("source") || "samehadaku";
  const query = searchParams.get("q") || searchParams.get("query");
  const page = parseInt(searchParams.get("page") || "1");
  const id = searchParams.get("id");

  if (action === "search" && query) {
    const res = await fetch(
      `${API_BASE}/search/${source}?q=${encodeURIComponent(query)}&page=${page}`
    );
    const data = await res.json();
    return NextResponse.json(data);
  }

  if (action === "info" && id) {
    const res = await fetch(
      `${API_BASE}/info/${source}/${encodeURIComponent(id)}`
    );
    const data = await res.json();
    return NextResponse.json(data);
  }

  if (action === "episode" && id) {
    const res = await fetch(
      `${API_BASE}/episode/${source}/${encodeURIComponent(id)}`
    );
    const data = await res.json();
    return NextResponse.json(data);
  }

  if (action === "recent") {
    const res = await fetch(`${API_BASE}/recent/${source}?page=${page}`);
    const data = await res.json();
    return NextResponse.json(data);
  }

  if (action === "sources") {
    return NextResponse.json({
      sources: [
        {
          source: "samehadaku",
          name: "Samehadaku",
          lang: "ID",
          status: "online",
          url: "https://samehadaku.email"
        },
        {
          source: "otakudesu",
          name: "Otakudesu",
          lang: "ID",
          status: "online",
          url: "https://otakudesu.animeupdates.me"
        },
        {
          source: "anibaru",
          name: "AniBaru",
          lang: "ID",
          status: "online",
          url: "https://anibaru.me"
        },
        {
          source: "anify",
          name: "Anify",
          lang: "EN",
          status: "online",
          url: "https://api.anify.eltik.cc"
        },
        {
          source: "gogoanime",
          name: "Gogoanime",
          lang: "EN",
          status: "online",
          url: "https://api.consumet.org"
        },
        {
          source: "hianime",
          name: "HiAnime",
          lang: "EN",
          status: "degraded",
          url: "https://api.hianime.to"
        }
      ]
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
