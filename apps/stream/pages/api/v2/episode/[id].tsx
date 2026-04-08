// @ts-nocheck

import axios from "axios";
import { redis, safeRedisGet, safeRedisSet } from "@/lib/redis";
import appendMetaToEpisodes from "@/utils/appendMetaToEpisodes";
import { NextApiRequest, NextApiResponse } from "next";
import { AnifyEpisode, ConsumetInfo, EpisodeData } from "types";
import { Episode } from "@/types/api/Episode";
import { getProviderWithMostEpisodesAndImage } from "@/utils/parseMetaData";
import { getAnimeEpisode } from "@/lib/consumet/anime/episodes";

const isAscending = (data: Episode[]) => {
  for (let i = 1; i < data.length; i++) {
    if (data[i].number < data[i - 1].number) {
      return false;
    }
  }
  return true;
};

export interface RawEpisodeData {
  map?: boolean;
  providerId: string;
  episodes: {
    sub: Episode[];
    dub: Episode[];
  };
}

function filterData(data: RawEpisodeData[], type: "sub" | "dub") {
  // Filter the data based on the type (sub or dub) and providerId
  const filteredData = data.map((item) => {
    if (item?.map === true) {
      if (item.episodes[type].length === 0) {
        return null;
      } else {
        return {
          ...item,
          episodes: Object?.entries(item.episodes[type]).map(
            ([id, episode]) => ({
              ...episode
            })
          )
        };
      }
    }
    return item;
  });

  const noEmpty = filteredData.filter((i) => i !== null);
  return noEmpty;
}

async function fetchConsumet(id?: string | string[] | undefined) {
  try {
    const fetchData = async (dub?: any) => {
      const data = await getAnimeEpisode(id, dub);

      if (data?.message === "Anime not found" && data?.length < 1) {
        return [];
      }

      if (dub) {
        if (!data?.some((i) => i.id.includes("dub"))) return [];
      }

      const reformatted = data?.map((item) => ({
        id: item.id,
        title: item?.title || null,
        img: item?.image || null,
        number: item?.number || null,
        createdAt: item?.airDate || null,
        description: item?.description || null
      }));

      return reformatted;
    };

    const [subData, dubData] = await Promise.all([
      fetchData(),
      fetchData(true)
    ]);

    if (subData.every((i) => i.id?.includes("dub"))) {
      subData.forEach((item) => {
        item.id = item.id?.replace("dub", "anime");
      });
    }

    const array = [
      {
        map: true,
        providerId: "gogoanime",
        episodes: {
          sub: isAscending(subData) ? subData : subData.reverse(),
          dub: isAscending(dubData) ? dubData : dubData.reverse()
        }
      }
    ];

    return array;
  } catch (error: any) {
    console.error("Error fetching and processing data:", error.message);
    return [];
  }
}

async function fetchAnify(id?: string) {
  try {
    const { data } = await axios.get<AnifyEpisode[]>(
      `https://anify.eltik.cc/episodes/${id}`
    );

    if (!data) {
      return [];
    }

    const filtered = data.filter(
      (item) => item.providerId !== "9anime" && item.providerId !== "kass"
    );

    return filtered;
  } catch (error: any) {
    console.error("Error fetching and processing data:", error.message);
    return [];
  }
}

async function fetchCoverImage(id: string, available = false) {
  try {
    if (available) {
      return null;
    }

    const { data } = await axios.get(
      `https://anify.eltik.cc/content-metadata/${id}`
    );

    if (!data) {
      return [];
    }

    const getData = getProviderWithMostEpisodesAndImage(data);
    // const getData = data?.[0]?.data;

    return getData.data;
  } catch (error: any) {
    console.error("Error fetching and processing data:", error.message);
    return [];
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, releasing = "false", dub = false, refresh = null } = req.query;

  // if releasing is true then cache for 3 hour, if it false cache for 1 month;
  let cacheTime = null;
  if (releasing === "true") {
    cacheTime = 60 * 60 * 3; // 3 hours
  } else if (releasing === "false") {
    cacheTime = 60 * 60 * 24 * 30; // 1 month
  }

  let cached;
  let meta;

  if (redis) {
    meta = await redis.get(`meta:${id}`);
    const parsedMeta = JSON.parse(meta);
    if (parsedMeta?.length === 0) {
      await redis.del(`meta:${id}`);
      console.log("deleted meta cache");
      meta = null;
    }

    if (refresh !== null) {
      await redis.del(`episode:${id}`);
    } else {
      cached = await redis.get(`episode:${id}`);
      if (cached?.length === 0) {
        await redis.del(`episode:${id}`);
        cached = null;
      }
    }
  }

  if (cached && !refresh) {
    if (dub) {
      const filteredData: EpisodeData[] = filterData(JSON.parse(cached), "dub");

      let filtered = filteredData.filter((item) =>
        item?.episodes?.some((epi) => epi.hasDub !== false)
      );

      if (meta) {
        filtered = await appendMetaToEpisodes(filtered, JSON.parse(meta));
      }

      return res
        .status(200)
        .json(filtered?.filter((i) => i?.providerId !== "9anime"));
    } else {
      const filteredData = filterData(JSON.parse(cached), "sub");

      let filtered = filteredData;

      if (meta) {
        filtered = await appendMetaToEpisodes(filteredData, JSON.parse(meta));
      }

      return res
        .status(200)
        .send(filtered?.filter((i) => i?.providerId !== "9anime"));
    }
  } else {
    const [consumet, anify, cover] = await Promise.all([
      fetchConsumet(id),
      fetchAnify(id),
      fetchCoverImage(id, meta)
    ]);

    let subDub = "sub";
    if (dub) {
      subDub = "dub";
    }

    const rawData = [...consumet, ...anify];

    const filteredData = filterData(rawData, subDub);

    let data = filteredData;

    if (meta) {
      data = await appendMetaToEpisodes(filteredData, JSON.parse(meta));
    } else if (
      cover &&
      // !cover?.some((item: { img: null }) => item.img === null) &&
      cover?.length > 0
    ) {
      if (redis)
        await redis.set(`meta:${id}`, JSON.stringify(cover), "EX", cacheTime);
      data = await appendMetaToEpisodes(filteredData, cover);
    }

    if (redis && cacheTime !== null && rawData?.length > 0) {
      await redis.set(
        `episode:${id}`,
        JSON.stringify(rawData),
        "EX",
        cacheTime
      );
    }

    if (dub) {
      const filtered = data.filter(
        (item) => !item.episodes.some((epi) => epi.hasDub === false)
      );
      return res
        .status(200)
        .json(filtered.filter((i) => i.episodes.length > 0));
    }

    return res.status(200).json(data.filter((i) => i.episodes.length > 0));
  }
}
