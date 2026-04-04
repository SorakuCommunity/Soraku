import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import { useAniList } from "../../../lib/anilist/useAnilist";
import { getHeaders } from "@/utils/imageUtils";

export default function ThirdPanel({
  aniId,
  data,
  chapterData,
  hasRun,
  currentId,
  currentChapter,
  seekPage,
  setSeekPage,
  visible,
  setVisible,
  session,
  scaleImg,
  setMobileVisible,
  mobileVisible,
  providerId,
}) {
  const [index, setIndex] = useState(0);
  const [image, setImage] = useState([]);
  const { markProgress } = useAniList(session);

  useEffect(() => {
    setIndex(0);
    setSeekPage(0);
  }, [data, currentId]);

  const seekToIndex = (newIndex) => {
    if (newIndex >= 0 && newIndex < data.length) {
      setIndex(newIndex);
      setSeekPage(newIndex);
    }
  };

  useEffect(() => {
    seekToIndex(seekPage);
  }, [seekPage]);

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setImage([...data].reverse());
    }
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight" && index > 0) {
        setIndex(index - 1);
        setSeekPage(index - 1);
      } else if (event.key === "ArrowLeft" && index < image.length - 1) {
        setIndex(index + 1);
        setSeekPage(index + 1);
        if (index + 1 >= image.length - 2 && !hasRun.current) {
          const current = chapterData.chapters?.find((x) => x.id === currentChapter.id);
          const chapterNumber = chapterData.chapters.indexOf(current) + 1;
          if (chapterNumber) {
            markProgress({ mediaId: aniId, progress: chapterNumber });
          }
          hasRun.current = true;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [index, image]);

  const handleNext = () => {
    if (index < image.length - 1) {
      setIndex(index + 1);
      setSeekPage(index + 1);
    }
    if (index + 1 >= image.length - 2 && !hasRun.current) {
      const current = chapterData.chapters?.find((x) => x.id === currentChapter.id);
      const chapterNumber = chapterData.chapters.indexOf(current) + 1;
      if (chapterNumber) {
        markProgress({ mediaId: aniId, progress: chapterNumber });
      }
      hasRun.current = true;
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setSeekPage(index - 1);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-primary">
      <div className="flex-grow flex items-center justify-center relative">
        {image.length > 0 ? (
          <>
            <div className="flex justify-center items-center overflow-hidden">
              <Image
                key={image[image.length - index - 1]?.url}
                width={500}
                height={500}
                className="object-contain h-full"
                onClick={() => setMobileVisible(!mobileVisible)}
                src={`https://m3u8-proxy-cors-c1i6.vercel.app/cors?url=${encodeURIComponent(image[image.length - index - 1]?.url)}${
                  image[image.length - index - 1]?.headers?.Referer
                    ? `&headers=${encodeURIComponent(JSON.stringify(image[image.length - index - 1]?.headers))}`
                    : `&headers=${encodeURIComponent(JSON.stringify(getHeaders(providerId)))}`}`
                }
                alt="Manga Page"
                style={{ transform: `scale(${scaleImg})`, transformOrigin: "top" }}
              />
            </div>
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-dark transition" onClick={handlePrev}>
                <ArrowsPointingInIcon className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-dark transition" onClick={handleNext}>
                <ArrowsPointingOutIcon className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="w-full flex items-center justify-center h-full bg-secondary text-white">
            {data.error || "Not found"} :(
          </div>
        )}
        <span className="absolute bottom-5 left-5 bg-secondary p-2 rounded-lg shadow-lg text-white">
          {visible ? (
            <button type="button" onClick={() => setVisible(!visible)}>
              <ArrowsPointingOutIcon className="w-5 h-5" />
            </button>
          ) : (
            <button type="button" onClick={() => setVisible(!visible)}>
              <ArrowsPointingInIcon className="w-5 h-5" />
            </button>
          )}
        </span>
        <span className="absolute bottom-5 right-5 bg-secondary p-2 rounded-lg shadow-lg text-white">
          Page {index + 1}/{data.length}
        </span>
      </div>
    </div>
  );
}
