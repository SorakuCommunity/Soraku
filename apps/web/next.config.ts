import type { NextConfig } from "next";
import createMDX from "@next/mdx";

/** @type {import('@next/mdx').NextMDXConfig} */
const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  // Support .mdx file extensions
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "cdn.discordapp.com" },
      { protocol: "https", hostname: "media.discordapp.net" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "**.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "freeimage.host" },
      { protocol: "https", hostname: "iili.io" },            // freeimage.host CDN
      { protocol: "https", hostname: "i.ibb.co" },           // imgbb
      { protocol: "https", hostname: "imgur.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      // Wildcard untuk URL cover dari hosting apapun
      { protocol: "https", hostname: "**" },
    ],
  },

  // Drizzle + postgres.js perlu dijalankan di Node.js runtime (bukan Edge)
  serverExternalPackages: ["postgres", "drizzle-orm"],

  experimental: {
    optimizePackageImports: ["lucide-react"],
    // Aktifkan instrumentation.ts (auto-migration, monitoring)
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withMDX(nextConfig as any);

