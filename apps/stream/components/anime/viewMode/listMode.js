import Link from "next/link";
import DownloadModal from "@/components/shared/download"; 
import { useState } from "react";

export default function ListMode({
  info,
  episode,
  artStorage,
  providerId,
  progress,
  dub,
}) {
  const time = artStorage?.[episode?.id]?.timeWatched;
  const duration = artStorage?.[episode?.id]?.duration;
  let prog = (time / duration) * 100;
  if (prog > 90) prog = 100;

  const isWatched = progress ? episode.number <= progress : prog === 100;
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <>
      <div
        className="flex items-center gap-3 py-2 px-3 hover:bg-secondary transition-colors duration-200 odd:bg-secondary/30 even:bg-primary"
      >
        <Link
          key={episode.number}
          href={`/anime/watch/${info.id}/${providerId}?id=${encodeURIComponent(
            episode.id
          )}&num=${episode.number}${dub ? `&dub=${dub}` : ""}`}
          className="flex-grow"
        >
          <span className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-base font-semibold">
            {episode.number}
          </span>
          <div>
            <p className={`line-clamp-1 text-base ${isWatched ? "text-gray-500" : "text-white"}`}>
              {episode?.title || `Episode ${episode.number}`}
            </p>
            <div className="flex items-center mt-1">
              <span className="text-xs text-white/50 capitalize">{providerId}</span>
              {prog > 0 && prog < 100 && (
                <div className="ml-3 bg-gray-700 h-1 w-20 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${prog}%` }}></div>
                </div>
              )}
              {isWatched && (
                <span className="ml-3 text-xs bg-green-500 text-white px-1 py-0.5 rounded-full">
                  Watched
                </span>
              )}
            </div>
          </div>
        </Link>
        {providerId === "gogoanime" && (
          <button 
            onClick={() => setModalIsOpen(true)} 
            className="ml-3 text-xs text-white bg-green-500 px-2 py-1 rounded"
          >
            Download Episode
          </button>
        )}
      </div>
      {providerId === "gogoanime" && (
        <DownloadModal 
          isOpen={modalIsOpen} 
          onRequestClose={() => setModalIsOpen(false)} 
          epId={episode.id} 
        />
      )}
    </>
  );
}
