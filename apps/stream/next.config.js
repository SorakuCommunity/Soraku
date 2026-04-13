const path = require("path");
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === "production";

const projectRoot = path.resolve(__dirname);

const config = {
  reactStrictMode: false,
  outputFileTracingRoot: process.env.VERCEL ? "/vercel/path0" : projectRoot,
  typescript: {
    ignoreBuildErrors: true
  },
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
        destination: "https://soraku.live/about/",
        permanent: true,
        basePath: false
      },
      {
        source: "/changelogs",
        destination: "https://soraku.live/changelogs/",
        permanent: true,
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
