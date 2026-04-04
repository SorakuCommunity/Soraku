// lib/generateSitemap.js
export const generateSitemap = (animeList) => {
    const baseUrl = 'https://1anime.one/anime/'; // Change to your base URL
    const urls = animeList.map(anime => `
      <url>
        <loc>${anime.siteUrl}</loc>
        <lastmod>${new Date(anime.updatedAt).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `).join('');
  
    return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap-image/1.1">
    ${urls}
  </urlset>`;
  };