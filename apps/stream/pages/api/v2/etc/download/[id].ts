import { NextApiRequest, NextApiResponse } from "next";
import { redis, safeRedisGet, safeRedisSet } from "@/lib/redis";
import { ANIME } from "@consumet/extensions";

type DownloadLink = {
  source: string;
  link: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Add types
  const id = req.query.id?.toString().replace("/", ""); // Change epId to id and remove "/"

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      error: "Invalid episode ID",
      details: "The episode ID must be a non-empty string."
    });
  }

  try {
    // Check Redis cache first
    const cachedLinks = redis
      ? await safeRedisGet(`downloadLinks:${id}`)
      : null;
    if (cachedLinks) {
      return res.status(200).json(JSON.parse(cachedLinks)); // Return cached links if available
    }

    // @ts-expect-error - Gogoanime may not be in current version
    const gogoanime = new ANIME.Gogoanime();

    // Attempt to fetch episode data using the first method
    let episodeData;
    try {
      episodeData = await gogoanime.fetchEpisodeSources(id); // Use current method
    } catch (error) {
      console.error("First method failed:", error);
    }

    // Attempt to fetch episode data using the second method if the first fails
    let downloadUrl;
    if (!episodeData) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SORAKU_URL}/api/stream?anime=true&source=gogoanime`
      );
      const serverData = await response.json();
      downloadUrl = serverData.data?.[0]?.url;
    }

    // If downloadUrl is found, fetch direct download links
    const directDownloadLinks = downloadUrl
      ? await gogoanime.fetchDirectDownloadLink(downloadUrl)
      : [];

    if (!episodeData && !downloadUrl) {
      return res.status(404).json({
        error: "Download URL not found",
        details: `No download URL found for episode ID: ${id}`
      }); // Enhanced error details
    }

    // Create download links array
    const downloadLinks: DownloadLink[] = directDownloadLinks.map(
      (link: { source: string | undefined; link: string | undefined }) => ({
        source: link.source || "", // Provide a default value to avoid undefined
        link: process.env.PROXY_URI
          ? `https://hindianimeworld.com/?download_links=${encodeURIComponent(link.link || "")}`
          : encodeURIComponent(link.link || "") // Add proxy to the link using env's PROXY_URI and provide a default value
      })
    );

    // Save download links to Redis
    if (redis) {
      await safeRedisSet(
        `downloadLinks:${id}`,
        JSON.stringify(downloadLinks),
        60 * 60 * 24 * 30
      );
    }

    res.status(200).json(downloadLinks);
  } catch (error) {
    console.error(
      "Error occurred:",
      error instanceof Error ? error : new Error("Unknown error")
    ); // Enhanced error logging
    res.status(500).json({
      error: "Internal Server Error",
      details:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while processing your request."
    }); // Updated error details
  }
}
