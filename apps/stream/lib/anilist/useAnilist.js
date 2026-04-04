import { toast } from "sonner";

export const useAniList = (session) => {
  const accessToken = session?.user?.token;

  const fetchGraphQL = async (query, variables) => {
    try {
      const response = await fetch("https://graphql.anilist.co/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify({ query, variables }),
      });
      return response.json();
    } catch (error) {
      toast.error("An error occurred, please try again later", {
        position: "bottom-right",
      });
    }
  };

  const quickSearch = async ({ search, type, isAdult = false }) => {
    if (!search || search === " ") return;
    const searchQuery = `
    query ($type: MediaType, $search: String, $isAdult: Boolean) {
  Page(perPage: 8) {
    pageInfo {
      total
      hasNextPage
    }
    results: media(type: $type, isAdult: $isAdult, search: $search) {
      id
      title {
          romaji
          native
          english
      }
      coverImage {
        medium
      }
      type
      format
      bannerImage
      isLicensed
      genres
      startDate {
        year
      }
    }
  }
}   
    `;
    const data = await fetchGraphQL(searchQuery, { search, type, isAdult });
    return data;
  };

  const multiSearch = async (search) => {
    if (!search || search === " ") return;
    const searchQuery = `
    query ($search: String, $isAdult: Boolean) {
  anime: Page(perPage: 8) {
    pageInfo {
      total
      hasNextPage
    }
    results: media(type: ANIME, isAdult: $isAdult, search: $search) {
      id
      title {
          romaji
          native
          english
      }
      coverImage {
        medium
      }
      type
      format
      bannerImage
      isLicensed
      genres
      startDate {
        year
      }
    }
  }
  manga: Page(perPage: 8) {
    pageInfo {
      total
      hasNextPage
    }
    results: media(type: MANGA, isAdult: $isAdult, search: $search) {
      id
      title {
                  romaji
          native
          english
      }
      coverImage {
        medium
      }
      type
      format
      bannerImage
      isLicensed
      startDate {
        year
      }
    }
  }
}
`;
    const data = await fetchGraphQL(searchQuery, { search });
    return data;
  };

  const markComplete = async (mediaId, { notes, scoreRaw }) => {
    if (!accessToken) return;
    const completeQuery = `
      mutation($mediaId: Int, $notes: String, $scoreRaw: Int) {
        SaveMediaListEntry(mediaId: $mediaId, status: COMPLETED, scoreRaw: $scoreRaw, notes: $notes) {
          id
          mediaId
          status
        }
      }
    `;
    const data = await fetchGraphQL(completeQuery, {
      mediaId,
      scoreRaw,
      notes,
    });
    // console.log({ Complete: data });
  };

  const markPlanning = async (mediaId) => {
    if (!accessToken) return;
    const planningQuery = `
      mutation($mediaId: Int ) {
        SaveMediaListEntry(mediaId: $mediaId, status: PLANNING) {
          id
          mediaId
          status
        }
      }
    `;
    const data = await fetchGraphQL(planningQuery, { mediaId });
    // console.log({ added_to_list: data });
  };

  const getUserLists = async (id) => {
    const getLists = `
      query ($id: Int) {
        Media(id: $id) {
          mediaListEntry {
            progress
            status
            customLists
            repeat
          }
          id
          type
          title {
            romaji
            english
            native
          }
          format
          episodes
          nextAiringEpisode {
              episode
          }
        }
      }
    `;
    const data = await fetchGraphQL(getLists, { id });
    return data;
  };

  const markProgress = async ({
    mediaId,
    progress,
    stats,
    volumeProgress,
    scoreRaw = 0,
    notes,
  }) => {
    if (!accessToken) return;

    // Set scoreRaw to null if it is 0
    if (scoreRaw === 0) {
      scoreRaw = null;
    }

    const progressWatched = `
      mutation($mediaId: Int, $progress: Int, $status: MediaListStatus, $progressVolumes: Int, $customLists: [String], $repeat: Int, $scoreRaw: Int, $notes: String) {
        SaveMediaListEntry(mediaId: $mediaId, progress: $progress, status: $status, progressVolumes: $progressVolumes, customLists: $customLists, repeat: $repeat, scoreRaw: $scoreRaw, notes: $notes) {
          id
          mediaId
          progress
          status
        }
      }
    `;
  
    try {
      const user = await getUserLists(mediaId);
      const media = user?.data?.Media;

      if (media) {
        let variables = {
          mediaId,
          progress: parseInt(progress, 10) || null,
          status: media.type === "MANGA" ? stats : undefined,
          progressVolumes: volumeProgress ? parseInt(volumeProgress, 10) : undefined,
          customLists: undefined,
          repeat: undefined,
          scoreRaw: scoreRaw ? parseInt(scoreRaw, 10) : undefined,
          notes,
        };

        if (media.type !== "MANGA") {
          let customList;

          if (session.user.name) {
            const res = await fetch(
              `/api/user/profile?name=${session.user.name}`
            ).then((res) => res.json());
            customList = res?.setting === null ? true : res?.setting?.CustomLists;
          }

          let lists = media.mediaListEntry?.customLists
            ? Object.entries(media.mediaListEntry?.customLists)
                .filter(([key, value]) => value === true)
                .map(([key]) => key)
            : [];

          if (customList === true && !lists?.includes("Watched via 1Anime")) {
            lists.push("Watched via 1Anime");
          }

          variables.customLists = lists.length > 0 ? lists : undefined;

          const singleEpisode =
            (!media.episodes ||
              (media.format === "MOVIE" && media.episodes === 1)) &&
            1;
          const videoEpisode = parseInt(progress, 10) || singleEpisode;
          const mediaEpisode =
            media.nextAiringEpisode?.episode || media.episodes || singleEpisode;
          
          variables.status = media.mediaListEntry?.status === "REPEATING" ? "REPEATING" : "CURRENT";

          if (videoEpisode === mediaEpisode) {
            variables.status = "COMPLETED";
            if (media.mediaListEntry?.status === "REPEATING") {
              variables.repeat = (media.mediaListEntry.repeat || 0) + 1;
            }
          }
        }

        // Remove undefined values
        Object.keys(variables).forEach(key => variables[key] === undefined && delete variables[key]);

        const data = await fetchGraphQL(progressWatched, variables);
        
        if (data.errors) {
          console.error("AniList API Error:", data.errors);
          toast.error("Failed to update progress. Please try again.", {
            position: "bottom-right",
          });
        } else {
          console.log(`Progress Updated: ${progress}`, variables.status);
          toast.success(`Progress Updated: ${progress}`, {
            position: "bottom-right",
          });
        }
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("An error occurred while updating progress. Please try again.", {
        position: "bottom-right",
      });
    }
  };

  return {
    markComplete,
    markProgress,
    markPlanning,
    getUserLists,
    multiSearch,
    quickSearch,
  };
};
