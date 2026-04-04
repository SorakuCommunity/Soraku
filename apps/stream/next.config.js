const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === "production";

const config = {
  reactStrictMode: false,
  images: {
    unoptimized: true
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
