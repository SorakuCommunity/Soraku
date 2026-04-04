// Change the import to a type-only import
import type { MalSearchAdvanceTypes } from "types/info/MalSearchAdvanceTypes"; // Adjust this import as per your directory structure

export async function MalSearchAdvanceTypes({
  search,
  type = "ANIME",
  genres,
  page,
  sort,
  format,
  season,
  seasonYear,
  perPage,
}: MalSearchAdvanceTypes) {
  const categorizedGenres = genres?.reduce((result, item) => {
    const existingEntry = result[item.type];

    if (existingEntry) {
      existingEntry.push(item.value);
    } else {
      result[item.type] = [item.value];
    }

    return result;
  }, {});

  const queryParams = {
    ...(categorizedGenres && { genres: categorizedGenres }),
    ...(search && { search }),
    ...(page && { page }),
    ...(perPage && { perPage }),
    ...(format && { format: [format] }),
    ...(seasonYear && { year: seasonYear }),
    ...(type && { type }),
  };

  const queryString = new URLSearchParams(queryParams).toString();
  const url = `https://api.malsync.moe/mal/anime/search?${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  return {
    pageInfo: {
      hasNextPage: page ?? 0 < data.total,
      currentPage: page,
      lastPage: Math.ceil(data.total / perPage),
      perPage: perPage ?? 20,
      total: data.total,
    },
    media: data.results?.map((item) => ({
      averageScore: item.averageRating,
      bannerImage: item.bannerImage,
      chapters: item.totalChapters,
      coverImage: {
        color: item.color,
        extraLarge: item.coverImage,
        large: item.coverImage,
      },
      description: item.description,
      duration: item?.duration ?? null,
      endDate: {
        day: null,
        month: null,
        year: null,
      },
      mappings: item.mappings,
      format: item.format,
      genres: item.genres,
      id: item.id,
      isAdult: false,
      mediaListEntry: null,
      nextAiringEpisode: null,
      popularity: item.averagePopularity,
      season: null,
      seasonYear: item.year,
      startDate: {
        day: null,
        month: null,
        year: item.year,
      },
      status: item.status,
      studios: { edges: [] },
      title: {
        userPreferred:
          item.title.english ?? item.title.romaji ?? item.title.native,
      },
      type: item.type,
      volumes: item.totalVolumes ?? null,
    })),
  };
}
