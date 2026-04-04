import {
  BookOpenIcon,
  PlayIcon,
  PlusIcon,
  ShareIcon,
  VideoCameraIcon,
  PencilIcon, // Importing the edit icon
} from "@heroicons/react/24/solid"; // Added PencilIcon for editing
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { convertSecondsToTime } from "@/utils/getTimes";
import InfoChip from "./reused/infoChip";
import Description from "./reused/description";
import Skeleton from "react-loading-skeleton";
import { AniListInfoTypes } from "types/info/AnilistInfoTypes";
import ShareModal from "@/components/shared/share";
import TrailerModal from "@/components/home/TrailerModal";

type DetailTopProps = {
  info?: AniListInfoTypes | null;
  statuses?: any;
  handleOpen: () => void;
  watchUrl: string | undefined;
  progress?: number;
  color?: string | null;
};

export default function DetailTop({
  info,
  statuses = undefined,
  handleOpen,
  watchUrl,
  progress,
  color,
}: DetailTopProps) {
  const router = useRouter();
  const [readMore, setReadMore] = useState(false);
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const [isTrailerModalVisible, setTrailerModalVisible] = useState(false);
  const [animeLogo, setAnimeLogo] = useState<string | null>(null);

  const isAnime = info?.type === "ANIME";

  useEffect(() => {
    setReadMore(false);
  }, [info?.id]);

  useEffect(() => {
    if (info?.id) {
      fetchAnimeLogo(info.id);
    }
  }, [info?.id]);

  const fetchAnimeLogo = async (aniListId: number) => {
    try {
      const response = await fetch(`https://api.ani.zip/mappings?anilist_id=${aniListId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch logo");
      }
      const data = await response.json();
      if (data.images) {
        const clearLogo = data.images.find((image: any) => image.coverType === "Clearlogo");
        if (clearLogo) {
          setAnimeLogo(clearLogo.url);
        } else {
          console.error("Clearlogo not found in the response data, trying TVDB API");
          const tvdbId = data.mappings.thetvdb_id;
          if (tvdbId) {
            const tvdbResponse = await fetch(`https://api.thetvdb.com/v4/series/${tvdbId}/images`, {
              headers: {
                'Authorization': 'Bearer 4c83f4ff-e376-4a81-abfb-9252313a3f2a'
              }
            });
            if (!tvdbResponse.ok) {
              throw new Error("Failed to fetch logo from TVDB");
            }
            const tvdbData = await tvdbResponse.json();
            const tvdbClearLogo = tvdbData.data.find((image: any) => image.coverType === "Clearlogo");
            if (tvdbClearLogo) {
              setAnimeLogo(tvdbClearLogo.url);
            } else {
              console.error("Clearlogo not found in TVDB response");
            }
          } else {
            console.error("No TVDB ID found in the response data");
          }
        }
      } else {
        console.error("No images found in the response data");
      }
    } catch (error) {
      console.error("Error fetching anime logo:", error);
    }
  };

  const handleShareClick = () => {
    setShareModalVisible(true);
  };

  const handleTrailerClick = () => {
    setTrailerModalVisible(true);
  };

  const isHentai = info?.genres?.includes("Hentai");
  const isEcchi = info?.genres?.includes("Ecchi");

  return (
    <div className="flex flex-col items-center bg-transparent p-6 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row w-full items-center md:items-start gap-6">
        <div className="w-48 h-72 md:w-56 md:h-80 rounded-lg overflow-hidden shadow-lg">
          {info ? (
            <Image
              src={info?.coverImage?.extraLarge?.toString() ?? info?.coverImage?.toString()}
              alt="poster"
              width={220}
              height={350}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <Skeleton className="h-full" />
          )}
        </div>

        <div className="flex flex-col gap-4 w-full md:w-2/3">
          <div className="text-center md:text-left">
            <h3 className="text-sm text-gray-400 mb-1">
              {info?.season || getMonth(info?.startDate?.month)} {info?.seasonYear || info?.startDate?.year}
            </h3>
            <h1 className="text-3xl font-bold text-white mb-1">
            {(info?.isAdult || isHentai) && <span className="bg-red-600 text-white rounded-full px-2 py-1 text-xs font-medium">18+</span>}
            {animeLogo ? (
                <div className="flex justify-center md:justify-start"> {/* Centering the image only on mobile devices */}
                  <Image
                    src={animeLogo}
                    alt="TVDB Logo"
                    width={undefined} // Set width to undefined to avoid type error
                    height={150} // Keep the height for desktop
                    className="h-24 md:h-32 object-cover transition-transform duration-300 hover:scale-110" // Adjusted height only for mobile devices
                  />
                </div>
              ) : (
                info?.title?.english || info?.title?.romaji
              )}
            </h1>
            <h2 className="text-lg text-gray-300 mb-4">
              {info?.title?.native} ({info?.title.romaji})
            </h2>
          </div>
          {(isEcchi) && <span className="bg-orange-600 text-white rounded-full px-2 py-1 text-xs font-medium">Heads up! This might have some spicy scenes!</span>}
          <div className="flex flex-wrap gap-1 justify-center md:justify-start">
            <button
              type="button"
              onClick={() => router.push(watchUrl ?? "#")}
              className={`flex items-center text-base font-semibold gap-2 border border-gray-600 text-white rounded-full py-2 px-4 bg-secondary hover:bg-blue-700 transition duration-200 ${!watchUrl ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!watchUrl}
            >
              {isAnime ? <PlayIcon className="w-5 h-5" /> : <BookOpenIcon className="w-5 h-5" />}
              {progress && progress > 0 ? (
                statuses?.value === "COMPLETED" ? (isAnime ? "Rewatch" : "Reread") : !watchUrl && info?.nextAiringEpisode ? (
                  <span>{convertSecondsToTime(info.nextAiringEpisode.timeUntilAiring)}</span>
                ) : "Continue"
              ) : isAnime ? "Watch Now" : "Read Now"}
            </button>

            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full hover:bg-blue-700 transition duration-200"
              onClick={handleOpen}
            >
              {statuses?.value ? <PencilIcon className="w-5 h-5 text-white" /> : <PlusIcon className="w-5 h-5 text-white" />} {/* Conditional icon */}
            </button>

            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full hover:bg-blue-700 transition duration-200"
              onClick={handleShareClick}
            >
              <ShareIcon className="w-5 h-5 text-white" />
            </button>

            {info?.trailer?.id && (
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full hover:bg-blue-700 transition duration-200"
                onClick={handleTrailerClick}
              >
                <VideoCameraIcon className="w-5 h-5 text-white" />
              </button>
            )}
          </div>

          {info?.description && (
            <Description
              info={info}
              readMore={readMore}
              setReadMore={setReadMore}
              className="mt-4 text-gray-300"
            />
          )}
          {info && <InfoChip info={info} color={color} className="mb-4" showItems={['all']} />} {/* Moved InfoChip below Description */}
        </div>
      </div>

      {info && info.nextAiringEpisode?.timeUntilAiring && (
        <p className="mt-4 text-gray-400">
          Episode {info.nextAiringEpisode.episode} in{" "}
          <span className="font-bold">{convertSecondsToTime(info.nextAiringEpisode.timeUntilAiring)}</span>
        </p>
      )}

      <ShareModal
        visible={isShareModalVisible}
        onClose={() => setShareModalVisible(false)}
        animeId={String(info?.id)}
        isManga={!isAnime}
      />

      <TrailerModal
        visible={isTrailerModalVisible}
        onClose={() => setTrailerModalVisible(false)}
        trailerId={info?.trailer?.id}
      />
    </div>
  );
}

function getMonth(month: number | undefined) {
  if (!month) return "";
  const formattedMonth = new Date(0, month).toLocaleString("default", {
    month: "long",
  });
  return formattedMonth;
}
