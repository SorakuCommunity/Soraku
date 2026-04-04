type MediaSeason = "WINTER" | "SPRING" | "SUMMER" | "FALL";
type MediaType = "ANIME" | "MANGA";

export async function aniListData({
  type,
  sort,
  season,
  seasonYear,
  page = 1,
}: {
  type: MediaType;
  sort: any;
  season?: MediaSeason;
  seasonYear?: number;
  page?: number;
}) {
  const variables: any = {
    page: page,
    perPage: 15,
    sort: Array.isArray(sort) ? sort : [sort], // CHANGED: Ensure sort is always an array
    isAdult: false,
  };

  if (season) {
    variables.season = season;
  }
  if (type) {
    variables.type = type;
  }
  if (seasonYear) {
    variables.seasonYear = seasonYear;
  } else {
    variables.seasonYear = new Date().getFullYear();
  }

  console.log("Variables sent to AniList API:", JSON.stringify(variables)); // CHANGED: Added JSON.stringify for better readability

  try {
    const resAnilist = await fetch(`https://graphql.anilist.co`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query (
            $id: Int
            $page: Int
            $perPage: Int
            $search: String
            $sort: [MediaSort]
            $season: MediaSeason
            $seasonYear: Int
            $type: MediaType
            $isAdult: Boolean
          ) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              media(
                season: $season,
                seasonYear: $seasonYear,
                id: $id,
                search: $search,
                sort: $sort,
                type: $type,
                isAdult: $isAdult
              ) {
                id
                idMal
                status
                title {
                  romaji
                  english
                }
                bannerImage
                coverImage {
                  extraLarge
                  color
                }
                episodes
                status
                duration
                genres
                description
                format
                averageScore
                popularity
                nextAiringEpisode {
                  airingAt
                  episode
                }
                startDate {
                  year
                  month
                  day
                }
                endDate {
                  year
                  month
                  day
                }
                trailer {
                  id
                  site
                  thumbnail
                }
              }
            }
          }
        `,
        variables,
      }),
    });

    if (!resAnilist.ok) {
      // CHANGED: Added explicit check for HTTP response status
      throw new Error(`AniList API returned status ${resAnilist.status}`);
    }

    const anilistData = await resAnilist.json();

    console.log("AniList API response:", JSON.stringify(anilistData)); // CHANGED: Added JSON.stringify for better readability

    if (!anilistData.data || !anilistData.data.Page) {
      throw new Error("Invalid response from AniList API");
    }

    const data = anilistData.data.Page.media;

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    const errorMessage = (error as Error).message; // CHANGED: Assert error as Error type
    console.error("Error fetching data from AniList API:", errorMessage);
    return {
      props: {
        data: [],
      },
    };
  }
}
