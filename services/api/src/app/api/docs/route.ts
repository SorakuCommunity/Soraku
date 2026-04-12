import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const docsInfo = {
    title: "Soraku API Docs",
    description: "API Documentation powered by Wotaku",
    version: "1.0.0",
    source: "https://github.com/wotakumoe/wotaku",

    structure: {
      docs: "Wotaku Wiki - VitePress based documentation",
      api: "Nitro-based API routes for feedback and interactions",
    },

    features: [
      "Website listings for anime, manga, music, games",
      "Software recommendations for Android, PC, iOS",
      "Database and tracker resources",
      "Japanese language and culture learning resources",
      "Scanlation and merch resources",
      "VTuber information",
    ],

    endpoints: {
      feedback: {
        path: "/api/feedback",
        method: "POST",
        description: "Submit feedback via Discord webhook",
      },
      op: {
        path: "/api/op",
        method: "POST",
        description: "Submit online presence updates",
      },
    },

    deployment: {
      recommended: "Deploy docs folder separately using VitePress",
      commands: {
        dev: "pnpm docs:dev",
        build: "pnpm docs:build",
        preview: "pnpm docs:preview",
      },
    },

    links: {
      streamDocs: "https://stream.soraku.id/api-docs",
      mainSite: "https://soraku.id",
      discord: "https://discord.gg/qm3XJvRa6B",
      github: "https://github.com/SorakuCommunity",
    },
  };

  return NextResponse.json({
    data: docsInfo,
    error: null,
  });
}
