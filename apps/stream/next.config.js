const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === "production";

const config = {
  reactStrictMode: false,
  // @ts-expect-error - Next.js 16 turbopack config
  turbopack: {
    root: process.cwd()
  },
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  // Remove deprecated eslint config - use .eslintrc instead
  async redirects() {
    return [
      {
        source: "/en",
        destination: "/",
        permanent: true,
        basePath: false
      },
      {
        source: "/about",
        destination: "https://soraku.vercel.app/about/",
        permanent: false,
        basePath: false
      },
      {
        source: "/changelogs",
        destination: "https://soraku.vercel.app/changelogs/",
        permanent: false,
        basePath: false
      },
      {
        source: "/github",
        destination: "https://github.com/SorakuCommunity",
        permanent: false,
        basePath: false
      },
      {
        source: "/discord",
        destination: "https://discord.com/invite/7x8bKaY9eP",
        permanent: false,
        basePath: false
      },
      {
        source: "/anime/info/:id",
        destination: "/anime/:id",
        permanent: true
      }
    ];
  }
};

module.exports = config;
