import { useEffect, useRef, useState } from "react";
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAniList } from "../../../lib/anilist/useAnilist";
import { getHeaders, getRandomId } from "@/utils/imageUtils";

export default function FirstPanel({
  aniId,
  data,
  hasRun,
  currentId,
  seekPage,
  setSeekPage,
  visible,
  setVisible,
  chapter,
  nextChapter,
  prevChapter,
  paddingX,
  session,
  mobileVisible,
  setMobileVisible,
  setCurrentPage,
  number,
  mangadexId,
}) {
  const { markProgress } = useAniList(session);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageRefs = useRef([]);
  const scrollContainerRef = useRef();
  const [imageQuality, setImageQuality] = useState(80);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = scrollContainerRef.current.scrollTop;
      let index = 0;

      for (let i = 0; i < imageRefs.current.length; i++) {
        const img = imageRefs.current[i];
        if (
          scrollTop >= img?.offsetTop - scrollContainerRef.current.offsetTop &&
          scrollTop <
            img.offsetTop -
              scrollContainerRef.current.offsetTop +
              img.offsetHeight
        ) {
          index = i;
          break;
        }
      }

      if (index === data?.length - 3 && !hasRun.current) {
        if (session) {
          if (aniId?.length > 6) return;
          const currentChapter = chapter.chapters?.find(
            (x) => x.id === currentId,
          );
          if (currentChapter) {
            const chapterNumber =
              currentChapter.number ??
              chapter.chapters.indexOf(currentChapter) + 1;
            markProgress({ mediaId: aniId, progress: chapterNumber });
            console.log("marking progress");
          }
        }
        hasRun.current = true;
      }

      setCurrentPage(index + 1);
      setCurrentImageIndex(index);
      setSeekPage(index);
    };

    scrollContainerRef?.current?.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScroll, {
          passive: true,
        });
      }
    };
  }, [data, session, chapter]);

  useEffect(() => {
    if (scrollContainerRef.current && seekPage !== currentImageIndex) {
      const targetImageRef = imageRefs.current[seekPage];
      if (targetImageRef) {
        scrollContainerRef.current.scrollTo({
          top: targetImageRef.offsetTop - scrollContainerRef.current.offsetTop,
          behavior: "smooth",
        });
      }
    }
  }, [seekPage, currentImageIndex]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [currentId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      root.style.setProperty("--dynamic-padding", `${paddingX}px`);
    }
  }, [paddingX]);

  return (
    <section className="flex-grow flex flex-col items-center relative bg-primary">
      <div
        className="h-screen w-full overflow-y-scroll scrollbar-thin scrollbar-thumb-[#4A4A4A] scrollbar-thumb-rounded-md scrollbar-track-[#2A2A2A] scrollbar-track-rounded-md"
        ref={scrollContainerRef}
      >
        {data && Array.isArray(data) && data.length > 0 ? (
          data.map((i, index) => (
            <div
              key={getRandomId()}
              className="w-screen lg:h-auto lg:w-full"
              ref={(el) => (imageRefs.current[index] = el)}
            >
              <Image
                src={`https://m3u8-proxy-cors-c1i6.vercel.app/cors?url=${encodeURIComponent(i.url)}${
                  i?.headers?.Referer
                    ? `&headers=${encodeURIComponent(JSON.stringify(i?.headers))}`
                    : `&headers=${encodeURIComponent(JSON.stringify(getHeaders(chapter.providerId)))}` 
                }`}
                alt={`Image ${index + 1}`}
                width={500}
                height={500}
                quality={imageQuality}
                onClick={() => setMobileVisible(!mobileVisible)}
                className="w-screen lg:w-full h-auto bg-secondary rounded-lg shadow-lg transition-transform transform hover:scale-105"
              />
            </div>
          ))
        ) : (
          <div className="w-full flex-center h-full bg-secondary rounded-lg shadow-lg">
            <p className="text-white">{data}</p>
          </div>
        )}
      </div>
      <div className="absolute hidden lg:flex bottom-5 left-5 gap-5">
        <span className="flex bg-secondary p-2 rounded-sm shadow-md">
          {visible ? (
            <button type="button" onClick={() => setVisible(!visible)}>
              <ArrowsPointingOutIcon className="w-5 h-5 text-primary" />
            </button>
          ) : (
            <button type="button" onClick={() => setVisible(!visible)}>
              <ArrowsPointingInIcon className="w-5 h-5 text-primary" />
            </button>
          )}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            className={`flex-center rounded-sm p-2 ${
              prevChapter
                ? "bg-secondary"
                : "pointer-events-none bg-[#18181A] text-[#424245]"
            } shadow-md transition duration-200`}
            onClick={() =>
              router.push(
                `/manga/read/${chapter.providerId}?id=${mangadexId}&chapterId=${encodeURIComponent(prevChapter?.id)}${aniId?.length > 6 ? "" : `&anilist=${aniId}`}&num=${prevChapter?.number}`,
              )
            }
          >
            <ChevronLeftIcon className="w-5 h-5 text-primary" />
          </button>
          <button
            type="button"
            className={`flex-center rounded-sm p-2 ${
              nextChapter
                ? "bg-secondary"
                : "pointer-events-none bg-[#18181A] text-[#424245]"
            } shadow-md transition duration-200`}
            onClick={() =>
              router.push(
                `/manga/read/${chapter.providerId}?id=${mangadexId}&chapterId=${encodeURIComponent(nextChapter?.id)}${aniId?.length > 6 ? "" : `&anilist=${aniId}`}&num=${nextChapter?.number}`,
              )
            }
          >
            <ChevronRightIcon className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>
      <span className="hidden lg:flex bg-secondary p-2 rounded-sm absolute bottom-5 right-5 text-primary shadow-md">{`Page ${currentImageIndex + 1}/${data?.length}`}</span>
    </section>
  );
}
