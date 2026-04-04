import Image from "next/image";
import Link from "next/link";
import { parseImageProxy } from "../../../utils/imageUtils"; 
import { useState } from "react";

export default function ThumbnailOnly({
  info,
  providerId,
  episode,
  artStorage,
  progress,
  dub,
}) {
  const time = artStorage?.[episode?.id]?.timeWatched;
  const duration = artStorage?.[episode?.id]?.duration;
  let prog = (time / duration) * 100;
  if (prog > 90) prog = 100;

  const parsedImage = episode?.img
    ? episode?.img?.includes("null")
      ? info.coverImage?.extraLarge
      : episode?.img
    : info.coverImage?.extraLarge || null;

  return (
    <>
      <div
        className="group relative w-full h-[150px] sm:h-[100px] rounded-md overflow-hidden transition-all duration-200 ease-out hover:ring-2 hover:ring-primary hover:shadow-lg"
      >
        {parsedImage && (
          <Image
            src={parseImageProxy(parsedImage, providerId === "animepahe" ? "https://animepahe.ru" : undefined) || ""}
            alt={`Episode ${episode?.number} Thumbnail`}
            layout="fill"
            objectFit="cover"
            className="brightness-75 group-hover:brightness-100 transition-all duration-200"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-1 flex flex-col">
          <span className="text-xs font-semibold text-white">
            Episode {episode?.number || 0}
          </span>
          <div className="w-full h-1 bg-gray-700 rounded-full mt-1 overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${
                prog === 100 || (progress && episode?.number <= progress) ? 'bg-green-500' : 'bg-primary'
              }`}
              style={{
                width:
                  progress && episode?.number <= progress
                    ? "100%"
                    : artStorage?.[episode?.id]
                    ? `${prog}%`
                    : "0%",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
