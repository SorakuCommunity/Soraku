// pages/api/sitemap.js
export const config = {
  runtime: 'nodejs', // Use Node.js runtime for this route
};

import { fetchTrendingAnime } from '../../lib/fetchTrending';
import { generateSitemap } from '../../lib/generateSitemap';

export default async function handler(req, res) {
  const trendingAnime = await fetchTrendingAnime();
  const sitemap = generateSitemap(trendingAnime);

  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemap);
  res.end();
}