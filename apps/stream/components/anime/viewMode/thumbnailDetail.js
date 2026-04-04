import { parseImageProxy } from "@/utils/imageUtils";
import Image from "next/image";
import Link from "next/link";
import DownloadModal from "@/components/shared/download"; 
import { useState } from "react";
import { FaDownload } from "react-icons/fa"; // Importing the download icon from react-icons

export default function ThumbnailDetail({
  index,
  epi,
  info,
  title,
  description,
  provider,
  artStorage,
  progress,
  dub,
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const time = artStorage?.[epi?.id]?.timeWatched;
  const duration = artStorage?.[epi?.id]?.duration;
  let prog = (time / duration) * 100;
  if (prog > 90) prog = 100;

  const parsedImage = epi?.img
    ? epi?.img?.includes("null")
      ? info.coverImage?.extraLarge
      : epi?.img
    : info.coverImage?.extraLarge || null;

  const isWatched = progress ? epi.number <= progress : prog === 100;

  return (
    <div
      key={index}
      className="flex group h-[110px] lg:h-[150px] w-full rounded-lg transition-all duration-300 ease-out bg-secondary cursor-pointer hover:scale-[1.02] ring-0 hover:ring-2 hover:shadow-xl ring-primary"
    >
      <Link
        href={`/anime/watch/${info.id}/${provider}?id=${encodeURIComponent(
          epi.id
        )}&num=${epi.number}${dub ? `&dub=${dub}` : ""}`}
        className="w-[35%] lg:w-[30%] relative shrink-0 z-40 rounded-l-lg overflow-hidden"
      >
        <div className="relative h-full">
          <span className="absolute top-1 left-1 bg-primary text-white px-1 py-0.5 rounded-full text-xs font-semibold">
            EP {epi?.number || 0}
          </span>
          {parsedImage && (
            <Image
              src={parseImageProxy(
                parsedImage,
                provider === "animepahe" ? "https://animepahe.ru" : undefined
              ) || ""}
              alt={`Episode ${epi?.number} Thumbnail`}
              layout="fill"
              objectFit="cover"
              className="z-30 brightness-75 group-hover:brightness-100 transition-all duration-300"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-300 ease-out" style={{ width: `${prog}%` }} />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 text-white"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </Link>

      <div className="w-[65%] lg:w-[70%] h-full select-none p-3 flex flex-col justify-between cursor-pointer" onClick={() => {
        window.location.href = `/anime/watch/${info.id}/${provider}?id=${encodeURIComponent(epi.id)}&num=${epi.number}${dub ? `&dub=${dub}` : ""}`;
      }}>
        <div>
          <h1 className={`font-Archivo font-bold text-md lg:text-lg xl:text-xl line-clamp-1 group-hover:text-primary transition-colors duration-300 ${isWatched ? "text-gray-500" : "text-white"}`}>
            {epi?.title || `Episode ${epi?.number || 0}`}
          </h1>
          {epi?.description && (
            <p className="line-clamp-2 text-xs lg:text-sm xl:text-base font-Archivo font-light mt-1 text-gray-300">
              {epi?.description}
            </p>
          )}
        </div>
        <div className="flex items-center text-xs text-gray-400 mt-1">
          {time ? (
            <span>{`Watched ${Math.floor(time / 60)}m ${time % 60}s`}</span>
          ) : !isWatched && (
            <span>Not started</span>
          )}
          {isWatched && (
            <span className="ml-1 text-xs bg-green-500 text-white px-1 py-0.5 rounded-full">
              Watched
            </span>
          )}
        </div>
      </div>
      {provider === "gogoanime" && (
        <div className="absolute right-3 bottom-3 opacity-100 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent the click from propagating to the Link
              setModalIsOpen(true);
            }} 
            className="flex items-center justify-center text-xs text-white bg-green-500 px-2 py-1 rounded"
          >
            <FaDownload className="mr-1" /> Download
          </button>
        </div>
      )}
      {provider === "gogoanime" && (
        <DownloadModal 
          isOpen={modalIsOpen} 
          onRequestClose={() => setModalIsOpen(false)} 
          epId={epi.id} 
        />
      )}
    </div>
  );
}
