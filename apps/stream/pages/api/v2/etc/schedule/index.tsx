import axios from "axios";
import { redis, safeRedisGet, safeRedisSet } from "@/lib/redis";
import { NextApiRequest, NextApiResponse } from "next";

// Function to fetch new data
async function fetchData() {
  try {
    const { data } = await axios.get(
      `https://anify.eltik.cc/schedule?fields=[id,coverImage,title,bannerImage]`
    );
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Function to refresh the cache with new data
async function refreshCache() {
  const newData = await fetchData();
  if (newData) {
    if (redis) {
      await safeRedisSet("schedule", JSON.stringify(newData), 60 * 60 * 24 * 7);
    }
    console.log("Cache refreshed successfully.");
  }
}

interface Title {
  romaji: string;
  english: string;
  native: string;
}

type CachedData = {
  id: string;
  title: Title;
  coverImage: string;
  bannerImage: string;
  airingAt: number;
  airingEpisode: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let cached: CachedData | null = null;
    if (redis) {
      const cachedData = await safeRedisGet("schedule");
      cached = cachedData ? JSON.parse(cachedData) : null;
    }

    if (cached) {
      return res.status(200).json(cached);
    } else {
      const data = await fetchData();

      if (data) {
        if (redis) {
          await safeRedisSet(
            "schedule",
            JSON.stringify(data),
            60 * 60 * 24 * 7
          );
        }
        return res.status(200).json(data);
      } else {
        return res.status(404).json({ message: "Schedule not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
