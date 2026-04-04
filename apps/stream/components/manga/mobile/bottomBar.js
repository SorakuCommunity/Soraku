import { getHeaders } from "@/utils/imageUtils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

export default function BottomBar({
  id,
  prevChapter,
  nextChapter,
  currentPage,
  chapter,
  data,
  setSeekPage,
  setIsOpen,
  number,
  mangadexId,
}) {
  const [openPage, setOpenPage] = useState(false);
  const router = useRouter();

  return (
    <div className={`fixed lg:hidden flex flex-col gap-3 z-50 w-full transition-all duration-300 ${openPage ? "bottom-0" : "bottom-5"}`}>
      <div className="flex justify-between items-center px-4 py-3 bg-primary rounded-md shadow-lg">
        <div className="flex gap-3">
          <button
            type="button"
            className={`flex items-center justify-center p-2 rounded-md transition-colors duration-200 ${prevChapter ? "bg-secondary hover:bg-secondary/80" : "pointer-events-none bg-gray-700 text-gray-400"}`}
            onClick={() =>
              router.push(
                `/manga/read/${chapter.providerId}?id=${mangadexId}&chapterId=${encodeURIComponent(prevChapter.id)}${id > 6 ? "" : `&anilist=${id}`}&num=${prevChapter.number}`
              )
            }
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            type="button"
            className={`flex items-center justify-center p-2 rounded-md transition-colors duration-200 ${nextChapter ? "bg-secondary hover:bg-secondary/80" : "pointer-events-none bg-gray-700 text-gray-400"}`}
            onClick={() =>
              router.push(
                `/manga/read/${chapter.providerId}?id=${mangadexId}&chapterId=${encodeURIComponent(nextChapter.id)}${id > 6 ? "" : `&anilist=${id}`}&num=${nextChapter.number}`
              )
            }
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
          <button
            type="button"
            className={`flex items-center gap-2 p-2 rounded-md bg-secondary hover:bg-secondary/80`}
            onClick={() => setOpenPage(!openPage)}
          >
            <ChevronUpIcon className={`w-6 h-6 transition-transform ${openPage ? "rotate-180" : ""}`} />
            <span className="text-white">Pages</span>
          </button>
          <button
            type="button"
            className={`flex items-center gap-2 p-2 rounded-md bg-secondary hover:bg-secondary/80`}
            onClick={() => setIsOpen(true)}
          >
            <RectangleStackIcon className="w-6 h-6" />
          </button>
        </div>
        <span className="bg-secondary p-2 rounded-md text-white">{`${currentPage}/${data?.length}`}</span>
      </div>
      {openPage && (
        <div className="bg-secondary flex justify-center py-2">
          <div className="flex overflow-x-auto">
            {Array.isArray(data) ? (
              data.map((x, index) => (
                <div key={x.url} className="hover:bg-gray-600 shrink-0 cursor-pointer rounded-sm">
                  <div className="flex flex-col items-center cursor-pointer" onClick={() => setSeekPage(x.index)}>
                    <Image
                      src={`https://m3u8-proxy-cors-c1i6.vercel.app/cors?url=${encodeURIComponent(x.url)}${x?.headers?.Referer ? `&headers=${encodeURIComponent(JSON.stringify(x?.headers))}` : `&headers=${encodeURIComponent(JSON.stringify(getHeaders(chapter.providerId)))}`}`}
                      alt="chapter image"
                      width={100}
                      height={200}
                      className="w-full h-[120px] object-contain scale-90"
                    />
                    <span className="text-white">Page {x.index + 1}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white">Not found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
