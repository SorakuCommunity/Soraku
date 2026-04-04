import Link from "next/link";
import React, { useState, useRef, useEffect, Fragment } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import Image from "next/image";
import { MdChevronRight } from "react-icons/md";
import {
  ChevronRightIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import Skeleton from 'react-loading-skeleton'; // Import the skeleton loader
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { ExclamationCircleIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import HistoryOptions from "./content/historyOptions";
import { toast } from "sonner";
import { truncateImgUrl } from "@/utils/imageUtils";

type ContentProps = {
  ids: string;
  section: string;
  data?: any;
  userData?: UserDataTypes[];
  og?: any;
  userName?: string;
  setRemoved?: any;
  type?: string;
};

type UserDataTypes = {
  id: string;
  aniId?: string;
  title?: string;
  aniTitle?: string;
  image?: string;
  episode?: number;
  timeWatched?: number;
  duration?: number;
  provider?: string;
  nextId?: string;
  nextNumber?: number;
  dub?: boolean;
  createdDate: string;
  userProfileId: string;
  watchId: string;
};

interface SlicedDataTypes {
  id: string | number;
  slug?: string;
  nextAiringEpisode?: any;
  currentEpisode?: number;
  idMal: number;
  status: string;
  title: Title;
  bannerImage: string;
  coverImage: CoverImage | string;
  image?: string;
  episodeNumber?: number;
  description: string;
}

interface Title {
  romaji: string;
  english: string;
  native: string;
}

interface CoverImage {
  extraLarge: string;
  large: string;
  medium: string;
  color?: string;
}

export default function Content({
  ids,
  section,
  data,
  userData,
  og,
  userName,
  setRemoved,
  type = "anime",
}: ContentProps) {
  const ref = useRef<HTMLElement>(null!);
  const { events } = useDraggable(ref);

  const router = useRouter();

  const [clicked, setClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const click = localStorage.getItem("clicked");

    if (click) {
      setClicked(JSON.parse(click));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading to false after 3 seconds
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  const [scrollLeft, setScrollLeft] = useState(false);
  const [scrollRight, setScrollRight] = useState(true);

  const slideLeft = () => {
    if (ref.current) {
      ref.current.classList.add("scroll-smooth");
      ref.current.scrollLeft -= 500; // Adjust scroll position
      ref.current.classList.remove("scroll-smooth");
    }
  };
  const slideRight = () => {
    if (ref.current) {
      ref.current.classList.add("scroll-smooth");
      ref.current.scrollLeft += 500; // Adjust scroll position
      ref.current.classList.remove("scroll-smooth");
    }
  };

  const handleScroll = (e: any) => {
    const scrollLeft = e.target.scrollLeft > 31;
    const scrollRight =
      e.target.scrollLeft < e.target.scrollWidth - e.target.clientWidth;
    setScrollLeft(scrollLeft);
    setScrollRight(scrollRight);
  };

  function handleAlert(e: string) {
    const existingDataString = localStorage.getItem("clicked");
    const existingData = existingDataString ? JSON.parse(existingDataString) : {};
    existingData[e] = true;
    localStorage.setItem("clicked", JSON.stringify(existingData));
  }

  const array = data;
  let filteredData = array?.filter((item: any) => item !== null);
  const slicedData: SlicedDataTypes[] =
    filteredData?.length > 15 ? filteredData?.slice(0, 15) : filteredData;

  const goToPage = () => {
    const routes: { [key: string]: string } = {
      "Recently Watched": `/anime/recently-watched`,
      "New Episodes": `/anime/recent`,
      "Trending Now": `/anime/trending`,
      "Popular Anime": `/anime/popular`,
      "Your Plan": `/profile/${userName}/#planning`,
      "On-Going Anime": `/profile/${userName}/#current`,
      "Your Watch List": `/profile/${userName}/#current`,
      "Trending This Season": '/anime/seasonal',
      "Next Season": '/anime/nextseasonal',
      "Previous Season": '/anime/previousseasonal',
      "Popular Movies": '/anime/movies',
    };
    router.push(routes[section] || '/');
  };

  const removeItem = async (id: string, aniId: string) => {
    if (userName) {
      const res = await fetch(`/api/user/update/episode`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: userName, id, aniId }),
      });
      const data = await res.json();
      if (id) {
        const artplayerSettings = JSON.parse(localStorage.getItem("artplayer_settings") || "{}");
        if (artplayerSettings[id]) {
          delete artplayerSettings[id];
          localStorage.setItem("artplayer_settings", JSON.stringify(artplayerSettings));
        }
      }
      if (aniId) {
        const currentData = JSON.parse(localStorage.getItem("artplayer_settings") || "{}");
        const updatedData = Object.fromEntries(
          Object.entries(currentData).filter(([key, item]) => {
            const typedItem = item as { aniId?: string }; // Type assertion
            return typedItem.aniId !== aniId;
          })
        );
        localStorage.setItem("artplayer_settings", JSON.stringify(updatedData));      }
      setRemoved(id || aniId);
      if (data?.message === "Episode deleted") {
        toast.success("Episode removed from history");
      }
    } else {
      if (id) {
        const artplayerSettings = JSON.parse(localStorage.getItem("artplayer_settings") || "{}");
        if (artplayerSettings[id]) {
          delete artplayerSettings[id];
          localStorage.setItem("artplayer_settings", JSON.stringify(artplayerSettings));
        }
        setRemoved(id);
      }
      if (aniId) {
        const currentData = JSON.parse(localStorage.getItem("artplayer_settings") || "{}");
        const updatedData = Object.fromEntries(
          Object.entries(currentData).filter(([key, item]) => {
            const typedItem = item as { aniId?: string }; // Type assertion
            return typedItem.aniId !== aniId;
          })
        );
        localStorage.setItem("artplayer_settings", JSON.stringify(updatedData));
        setRemoved(aniId);
            }
    }
  };

  return (
    <div>
      <div
        className={`flex items-center justify-between lg:justify-normal lg:gap-1 px-5 z-40 ${
          section === "Recommendations" ? "" : "cursor-pointer"
        }`}
        onClick={goToPage}
      >
        <h1 className="font-karla text-[18px] font-bold">{section}</h1> {/* Reduced font size */}
        <ChevronRightIcon className="w-5 h-5" />
      </div>
      <div className="relative flex items-center lg:gap-1">
        <div
          onClick={slideLeft}
          className={`flex items-center mb-5 cursor-pointer hover:text-action absolute left-0 bg-gradient-to-r from-[#141519] z-40 h-full hover:opacity-100 ${
            scrollLeft ? "lg:visible" : "invisible"
          }`}
        >
          <ChevronLeftIcon className="w-6 h-6" /> {/* Reduced icon size */}
        </div>
        <div
        id={ids}
        className="flex h-full w-full select-none overflow-x-scroll overflow-y-hidden scrollbar-hide lg:gap-4 gap-1 lg:p-8 py-6 px-4 z-30"
        onScroll={handleScroll}
        {...events}
        ref={ref as React.RefObject<HTMLDivElement>}
      >
{isLoading ? ( // Conditional rendering for loading state
  Array.from({ length: 15 }).map((_, index) => ( // Create 15 skeletons
    <div key={index} className="flex flex-col gap-1 shrink-0 cursor-pointer">
      <Skeleton height={180} width={120} /> {/* Skeleton for image */}
      <Skeleton height={20} width={120} /> {/* Skeleton for title */}
    </div>
  ))
) : ids !== "recentlyWatched" ? (
  slicedData?.map((anime) => {                const progress = og?.find((i: any) => i.mediaId === anime.id);
                let image = typeof anime.coverImage === "string" ? truncateImgUrl(anime.coverImage) : anime.coverImage?.extraLarge || anime.coverImage?.large || anime.image;

                return (
                  <div
                    key={anime.id}
                    className="flex flex-col gap-1 shrink-0 cursor-pointer"
                  >
                    <Link
                      href={
                        ids === "listManga"
                          ? `/manga/${anime.id}`
                          : ids === "recentAdded"
                          ? anime?.slug
                            ? `/anime/watch/${anime.id}/gogoanime?id=${encodeURIComponent(anime?.slug?.replace('/', ''))}&num=${anime.currentEpisode}`
                            : `/${type}/${anime.id}`
                          : `/${type}/${anime.id}`
                      }
                      className="hover:scale-105 hover:shadow-lg duration-300 ease-out group relative"
                      title={anime.title.english || anime.title.romaji} // Use English title, fallback to Romaji
                    >
                      {ids === "onGoing" && (
                        <div className="h-[180px] w-[120px] bg-gradient-to-b from-transparent to-black/90 absolute z-40 rounded-md whitespace-normal font-karla group"> {/* Reduced height and width */}
                          <div className="flex flex-col items-center h-full justify-end text-center pb-4">
                            <h1 className="line-clamp-1 w-[70%] text-[10px]">
                              {anime.title.english || anime.title.romaji} {/* Use English title, fallback to Romaji */}
                            </h1>
                            {checkProgress(progress) && !clicked?.hasOwnProperty(anime.id) && (
                              <ExclamationCircleIcon className="w-6 h-6 absolute z-40 text-white -top-3 -right-3" />)}
                            {checkProgress(progress) && (
                              <div
                                onClick={() => handleAlert(String(anime.id))}
                                className="group-hover:visible invisible absolute top-0 bg-black bg-opacity-20 w-full h-full z-20 text-center"
                              >
                                <h1 className="text-[12px] pt-20 font-bold opacity-100">
                                  {checkProgress(progress)}
                                </h1>
                              </div>
                            )}
                            {anime.nextAiringEpisode && (
                              <div className="flex gap-1 text-[12px]">
                                <h1>
                                  Episode {anime.nextAiringEpisode.episode} in
                                </h1>
                                <h1 className="font-bold">
                                  {convertSecondsToTime(anime?.nextAiringEpisode?.timeUntilAiring)}
                                </h1>
                              </div>
                            )}
                            {progress && (
                              <h1 className="text-[8px]">
                                {progress ? 
                                  (() => {
                                    const missedEpisodesMatch = checkProgress(progress)?.match(/(\d+)\s+episode/);
                                    const missedEpisodes = missedEpisodesMatch ? parseInt(missedEpisodesMatch[1]) : 0;
                                    const totalEpisodes = anime.nextAiringEpisode.episode - 1; // Total episodes before the next airing
                                    const adjustedProgress = totalEpisodes - missedEpisodes;
                                    return `Watched ${adjustedProgress} of ${totalEpisodes}`;
                                  })() 
                                  : `Watched 0`} {/* Show progress */}
                              </h1>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="h-[180px] w-[120px] rounded-md z-30"> {/* Reduced height and width */}
                        {ids === "recentAdded" && (
                          <div className="absolute bg-gradient-to-b from-black/30 to-transparent from-5% to-30% top-0 z-30 w-full h-full rounded" />
                        )}
                        {image && (
                          <Image
                            draggable={false}
                            src={image}
                            alt={anime.title.english || anime.title.romaji || "coverImage"} // Use English title, fallback to Romaji
                            width={500}
                            height={300}
                            className="z-20 h-[180px] w-[120px] object-cover rounded-md brightness-90"/>
                        )}
                      </div>
                      {ids === "recentAdded" && (
                        <Fragment>
                          <Image
                            src="/svg/episode-badge.svg"
                            alt="episode-badge"
                            width={200}
                            height={100}
                            className="w-20 absolute top-1 -right-[10px] z-40"
                          />
                          <p className="absolute z-40 text-center w-[70px] top-1 -right-2 font-karla text-sm">
                            Episode{" "}
                            <span className="text-white">
                              {anime?.currentEpisode || anime?.episodeNumber}
                            </span>
                          </p>
                        </Fragment>
                      )}
                    </Link>
                    {ids !== "onGoing" && (
                      <Link
                        href={
                          ids === "listManga"
                            ? `/manga/${anime.id}`
                            : `/${type.toLowerCase()}/${anime.id}`
                        }
                        className="w-[120px] line-clamp-2"
                        title={anime.title.english || anime.title.romaji} // Use English title, fallback to Romaji
                      >
                        <h1 className="font-karla font-semibold xl:text-base text-[14px]"> {/* Reduced font size */}
                          {anime.status === "RELEASING" || ids === "recentAdded" ? (
                            <span className="dots bg-green-500" />
                          ) : anime.status === "NOT_YET_RELEASED" ? (
                            <span className="dots bg-red-500" />
                          ) : null}
                          {anime.title.english || anime.title.romaji} {/* Use English title, fallback to Romaji */}
                        </h1>
                      </Link>
                    )}
                  </div>
                );
              })
            ) : (
              userData
                ?.filter((i) => i.title && i.title !== null) // Ensure titles are valid
                ?.slice(0, 10) // Limit to 10 items
                .map((i) => {
                  const time = i.timeWatched;
                  const duration = i.duration;
                  let prog = time && duration ? (time / duration) * 100 : 0;
                  if (prog > 90) prog = 100;
            
                  return (
                    <div
                      key={i.watchId}
                      className="flex flex-col gap-1 shrink-0 cursor-pointer relative group/item"
                    >
                      <Link
                        className="relative w-[280px] aspect-video rounded-md overflow-hidden group"
                        href={`/anime/watch/${i.aniId}/${i.provider}?id=${encodeURIComponent(i.watchId)}&num=${i.episode}${i?.dub ? `&dub=${i?.dub}` : ""}`}
                      >
                        <div className="w-full h-full bg-gradient-to-t from-black/70 from-20% to-transparent group-hover:to-black/40 transition-all duration-300 ease-out absolute z-30" />
                        <div className="absolute bottom-3 left-0 mx-2 text-white flex gap-2 items-center w-[80%] z-30">
                          <PlayIcon className="w-5 h-5 shrink-0" />
                          <h1
                            className="font-semibold font-karla line-clamp-1"
                            title={i?.title || i?.aniTitle}
                          >
                            {i?.title === i.aniTitle
                              ? `Episode ${i.episode}`
                              : i?.title || i?.aniTitle}
                          </h1>
                        </div>
                        <span
                          className={`absolute bottom-0 left-0 h-[2px] bg-red-600 z-30`}
                          style={{
                            width: `${prog}%`,
                          }}
                        />
                        {i?.image && (
                          <Image
                            src={i?.image}
                            width={280} // Reduced width
                            height={160} // Reduced height
                            alt="Episode Thumbnail"
                            className="w-full object-cover group-hover:scale-[1.02] duration-300 ease-out z-10"
                          />
                        )}
                      </Link>
            
                      <Link
                        className="flex flex-col font-karla w-full"
                        href={`/anime/watch/${i.aniId}/${i.provider}?id=${encodeURIComponent(i.watchId)}&num=${i.episode}`}
                      >
                        <p className="flex items-center gap-1 text-sm text-gray-400 w-[280px]"> {/* Reduced width */}
                          <span
                            className="text-white"
                            style={{
                              display: "inline-block",
                              maxWidth: "220px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={i.aniTitle}
                          >
                            {i.aniTitle}
                          </span>{" "}
                          | Episode {i.episode}
                        </p>
                      </Link>
                    </div>
                  );
                })
            )}
          {userData &&
            userData?.filter((i) => i.aniId !== null)?.length >= 10 &&
            section !== "Recommendations" && (
              <div
                key={section}
                className="flex flex-col cursor-pointer"
                onClick={goToPage}
              >
                <div className="w-[280px] aspect-video overflow-hidden object-cover rounded-md border-secondary border-2 flex flex-col gap-1 items-center text-center justify-center text-[#6a6a6a] hover:text-[#9f9f9f] hover:border-[#757575] transition-colors duration-200">
                  <h1 className="whitespace-pre-wrap text-sm">
                    More on {section}
                  </h1>
                  <ArrowRightCircleIcon className="w-5 h-5" />
                </div>
              </div>
            )}
          {filteredData?.length >= 10 && section !== "Recommendations" && (
            <div
              key={section}
              className="flex cursor-pointer"
              onClick={goToPage}
            >
              <div className="h-[180px] w-[120px] object-cover rounded-md border-secondary border-2 flex flex-col gap-1 items-center text-center justify-center text-[#6a6a6a] hover:text-[#9f9f9f] hover:border-[#757575] transition-colors duration-200"> {/* Reduced height and width */}
                <h1 className="whitespace-pre-wrap text-sm">
                  More on {section}
                </h1>
                <ArrowRightCircleIcon className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>
        <MdChevronRight
          onClick={slideRight}
          size={30}
          className={`hidden md:block mb-5 cursor-pointer hover:text-action absolute right-0 bg-gradient-to-l from-[#141519] z-40 h-full hover:opacity-100 hover:bg-gradient-to-l ${
            scrollRight ? "visible" : "hidden"
          }`}
        />
      </div>
    </div>
  );
}

function convertSecondsToTime(sec: number) {
  let days = Math.floor(sec / (3600 * 24));
  let hours = Math.floor((sec % (3600 * 24)) / 3600);
  let minutes = Math.floor((sec % 3600) / 60);

  let time = "";

  if (days > 0) {
    time += `${days}d `;
    time += `${hours}h`;
  } else {
    time += `${hours}h `;
    time += `${minutes}m`;
  }

  return time.trim();
}

function checkProgress(entry: { progress: any; media: any }) {
  const { progress, media } = entry;
  const { episodes, nextAiringEpisode } = media;

  if (nextAiringEpisode !== null) {
    const { episode } = nextAiringEpisode;

    if (episode - progress > 1) {
      const missedEpisodes = episode - progress - 1;
      return `${missedEpisodes} episode${missedEpisodes > 1 ? "s" : ""} behind`;
    }
  }

  return;
}
