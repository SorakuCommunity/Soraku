import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid"; // Play Icon for hover effect
import { useRouter } from "next/router";
import { AniListInfoTypes } from "types/info/AnilistInfoTypes";
import { Episode } from "types/api/Episode";

type EpisodeListsProps = {
  info: AniListInfoTypes;
  map: any;
  providerId: string;
  watchId: string;
  episode: Episode[];
  artStorage: any;
  track: any;
  dub: string;
};

export default function EpisodeLists({
  info,
  map,
  providerId,
  watchId,
  episode,
  artStorage,
  track,
  dub,
}: EpisodeListsProps) {
  const progress = info.mediaListEntry?.progress;
  const router = useRouter();

  return (
    <div className="w-full max-w-2xl mx-auto bg-primary rounded-lg shadow-lg p-2 mt-[-8px]">
      {/* Next Episode Section */}
      <div className="flex flex-col mb-4">
        <h2 className="text-lg font-bold text-white">Next Episode</h2>
        {track?.next ? (
          <Link
            href={`/anime/watch/${info.id}/${providerId}?id=${track.next.id}&num=${track.next.number}${dub ? `&dub=${dub}` : ""}`}
            className="bg-secondary flex w-full h-[90px] rounded-lg transition-transform duration-300 hover:scale-105 mt-2"
          >
            <div className="w-[35%] h-full relative rounded-l-lg overflow-hidden shadow-lg group">
              <Image
                src={artStorage?.[track.next.id]?.img || info.coverImage?.extraLarge}
                draggable={false}
                alt="Next Episode Cover"
                width={1000}
                height={1000}
                className="object-cover h-full w-full transition-opacity duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300">
                <PlayIcon className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="absolute bottom-2 left-2 font-bold text-white">
                Episode {track.next.number}
              </span>
            </div>

            <div className="flex flex-col justify-center p-4 w-[65%]">
              <h1 className="text-base font-bold text-white line-clamp-1">
                {map?.find((i: any) => i.number === track.next.number)?.title || info.title.romaji}
              </h1>
              <p className="text-xs text-gray-300 line-clamp-2">
                {map?.find((i: any) => i.number === track.next.number)?.description || `Episode ${track.next.number}`}
              </p>
            </div>
          </Link>
        ) : (
          <p className="text-white mt-2">Looks like there's no more episodes, UwU!</p>
        )}
      </div>

      {/* Divider between Next Episode and Episode List */}
      <div className="border-t border-gray-600 my-4" />

      {/* Scrollable Episode List */}
      <div className="overflow-y-auto h-[516px] max-h-[516px] pr-3 scrollbar-none scrollbar-thumb-rounded scrollbar-thumb-gray-700">
        <div className="flex flex-col gap-3">
          {episode && episode.length > 0 ? (
            episode.map((item) => {
              const time = artStorage?.[item.id]?.timeWatched;
              const duration = artStorage?.[item.id]?.duration;
              let prog = (time / duration) * 100;
              if (prog > 90) prog = 100;

              const mapData = map?.find((i: any) => i.number === item.number);
              const parsedImage = mapData
                ? mapData?.img?.includes("null") ||
                  mapData?.image?.includes("null")
                  ? info.coverImage?.extraLarge
                  : mapData?.img || mapData?.image
                : info.coverImage?.extraLarge || null;

              const isSelected = item.id === watchId;

              return (
                <Link
                  href={`/anime/watch/${info.id}/${providerId}?id=${encodeURIComponent(item.id)}&num=${item.number}${dub ? `&dub=${dub}` : ""}`}
                  key={item.id}
                  className={`bg-secondary flex w-full h-[90px] rounded-lg transition-transform duration-300 hover:scale-105 ${
                    isSelected ? "opacity-50" : "cursor-pointer"
                  }`}
                >
                  <div className="w-[35%] h-full relative rounded-l-lg overflow-hidden shadow-lg group">
                    <Image
                      src={parsedImage || info?.coverImage?.extraLarge}
                      draggable={false}
                      alt="Anime Cover"
                      width={1000}
                      height={1000}
                      className={`object-cover h-full w-full transition-opacity duration-300 ${
                        isSelected ? "opacity-30" : "opacity-75"
                      }`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300">
                      <PlayIcon className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-red-700`}
                      style={{
                        width:
                          progress !== undefined && progress >= item?.number
                            ? "100%"
                            : artStorage?.[item?.id] !== undefined
                            ? `${prog}%`
                            : "0%",
                      }}
                    />
                    <span className="absolute bottom-2 left-2 font-bold text-white">
                      Episode {item?.number}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center p-4 w-[65%]">
                    <h1 className="text-base font-bold text-white line-clamp-1">
                      {mapData?.title || info?.title?.romaji}
                    </h1>
                    <p className="text-xs text-gray-300 line-clamp-2">
                      {mapData?.description || `Episode ${item.number}`}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <Skeleton className="bg-secondary flex w-full h-[60px] rounded-lg" />
          )}
        </div>
      </div>

      {/* Episode Selector at the Bottom */}
      <div className="relative flex items-center mt-4">
        <select
          value={track?.playing?.number}
          onChange={(e) => {
            const selectedEpisode = episode.find(
              (ep) => ep.number === parseInt(e.target.value)
            );

            router.push(
              `/anime/watch/${info.id}/${providerId}?id=${selectedEpisode?.id}&num=${selectedEpisode?.number}${dub ? `&dub=${dub}` : ""}`
            );
          }}
          className="bg-secondary text-white text-sm rounded-md py-2 px-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {episode?.map((x) => (
            <option key={x.id} value={x.number}>
              Episode {x.number}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
