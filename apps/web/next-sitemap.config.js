/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://soraku.vercel.app',
  generateRobotsTxt: true,
  exclude: ['/dash/*', '/api/*', '/login', '/register'],
}
