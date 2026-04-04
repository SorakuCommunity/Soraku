import { aniListData } from "@/lib/anilist/AniList";

export async function generateSitemap() {
  // Fetch media data from AniList
  let props;
  try {
    const response = await aniListData({ type: "ANIME", sort: "POPULARITY", season: "FALL", page: 15 });
    props = response.props; // Ensure props is assigned correctly
  } catch (error) {
    console.error("Error fetching AniList data:", error);
    return ""; // Return empty sitemap on error
  }

  const mediaItems = props.data;

  // Log the fetched media items
  console.log("Fetched media items:", mediaItems);

  // Check if mediaItems is empty
  if (!mediaItems || mediaItems.length === 0) {
    console.warn("No media items found. Sitemap will be empty.");
    return ""; // Return an empty sitemap if no items are found
  }

  // Get the current base URL
  const baseUrl = process.env.BASE_URL || 'https://yourwebsite.com'; // Set your base URL here

  // Create sitemap entries for each media item
  const sitemapEntries = mediaItems.map((media: any) => {
    return `
      <url>
        <loc>${baseUrl}/anime/${media.id}</loc> <!-- Current URL with path -->
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
    `;
  }).join("");

  // Construct the full sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap-image/1.1">
    ${sitemapEntries}
  </urlset>`;

  return sitemap;
}

// Optional: Function to save the sitemap to a file (if needed)
import fs from 'fs';
import path from 'path';

export async function saveSitemap() {
  const sitemap = await generateSitemap();
  const filePath = path.join(process.cwd(), 'public', 'sitemap.xml'); // Save to public directory
  fs.writeFileSync(filePath, sitemap);
  console.log("Sitemap saved to:", filePath);
}
