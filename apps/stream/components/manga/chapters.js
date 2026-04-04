import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const ChapterSelector = ({ chaptersData, data, setWatch, mangaId }) => {
  const [selectedProvider, setSelectedProvider] = useState(
    chaptersData[0]?.providerId || ""
  );
  const [chapters, setChapters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [chaptersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const selectedChapters = chaptersData.find(
      (c) => c.providerId === selectedProvider
    );
    setChapters(selectedChapters?.chapters || []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvider, chaptersData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [data.id]);

  // Filter chapters based on search term
  const filteredChapters = chapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current posts
  const indexOfLastChapter = currentPage * chaptersPerPage;
  const indexOfFirstChapter = indexOfLastChapter - chaptersPerPage;
  const currentChapters = filteredChapters.slice(
    indexOfFirstChapter,
    indexOfLastChapter
  );

  // Create page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredChapters.length / chaptersPerPage); i++) {
    pageNumbers.push(i);
  }

  // Custom function to handle pagination display
  const getDisplayedPageNumbers = (currentPage, totalPages, margin) => {
    const pageRange = [...Array(totalPages).keys()].map((i) => i + 1);

    if (totalPages <= 5) {
      return pageRange;
    }

    if (currentPage <= margin) {
      return [...pageRange.slice(0, margin), "...", totalPages];
    }

    if (currentPage > totalPages - margin) {
      return [1, "...", ...pageRange.slice(-margin)];
    }

    return [
      1,
      "...",
      ...pageRange.slice(currentPage - 2, currentPage + 1),
      "...",
      totalPages,
    ];
  };

  const displayedPageNumbers = getDisplayedPageNumbers(
    currentPage,
    pageNumbers.length,
    3
  );

  useEffect(() => {
    if (currentChapters.length > 0) {
      const getEpi = currentChapters[0]; // Always start with the first chapter
      if (getEpi) {
        const watchUrl = `/manga/read/${selectedProvider}?id=${mangaId}&chapterId=${encodeURIComponent(
          getEpi.id
        )}&anilist=${data.id}&num=${getEpi.number - 1}`; // Adjusted to start from chapter 0
        setWatch(watchUrl);
      } else {
        setWatch(null);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapters, mangaId]);

  return (
    <div className="flex flex-col gap-2 px-3">
      <div className="flex justify-between">
        <h1 className="text-[20px] lg:text-2xl font-bold font-Archivo">
          Chapters
        </h1>
        <div className="relative flex gap-2 items-center group">
          <select
            id="provider"
            className="flex items-center text-sm gap-5 rounded-[3px] bg-secondary py-1 px-3 pr-8 font-Archivo appearance-none cursor-pointer outline-none focus: focus:ring-action group-hover: group-hover:ring-action"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
          >
            {chaptersData.map((provider, index) => (
              <option key={provider.providerId} value={provider.providerId}>
                {provider.providerId}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      <input
        type="text"
        placeholder="Search chapter..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-2 p-2 rounded border border-gray-300"
      />

      <div className="flex flex-col items-center z-40">
        <div className="mt-4 w-full">
          {currentChapters.map((chapter, index) => {
            const isRead = chapter.number <= data?.mediaListEntry?.progress;
            return (
              <Link
                key={index}
                href={`/manga/read/${selectedProvider}?id=${mangaId}&chapterId=${encodeURIComponent(
                  chapter.id
                )}${data?.id?.length > 6 ? "" : `&anilist=${data.id}`}&num=${
                  chapter.number - 1 // Adjusted to start from chapter 0
                }`}
                className={`flex gap-3 py-4 hover:bg-secondary odd:bg-secondary/30 even:bg-primary`}
              >
                <div className="flex w-full">
                  <span className="shrink-0 px-4 text-center text-white/50">
                    {chapter.number - 1} {/* Adjusted to display chapter starting from 0 */}
                  </span>
                  <p
                    className={`w-full line-clamp-1 ${
                      isRead ? "text-[#5f5f5f]" : "text-white"
                    }
                    `}
                  >
                    {chapter.title || `Chapter ${chapter.number - 1}`} {/* Adjusted to display chapter starting from 0 */}
                  </p>
                  <p className="capitalize text-sm text-white/50 px-4">
                    {selectedProvider}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col mt-5 md:flex-row w-full sm:items-center sm:justify-between">
          <div className="flex-center">
            <p className="text-sm text-txt">
              Showing{" "}
              <span className="font-medium">{indexOfFirstChapter + 1}</span> to{" "}
              <span className="font-medium">
                {indexOfLastChapter > filteredChapters.length
                  ? filteredChapters.length
                  : indexOfLastChapter}
              </span>{" "}
              of <span className="font-medium">{filteredChapters.length}</span> chapters
            </p>
          </div>
          <div className="flex-center">
            <nav
              className="isolate inline-flex space-x-1 rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded px-2 py-2 text-gray-400 hover:bg-secondary focus:z-20 focus:outline-offset-0 ${
                  currentPage === 1
                    ? "opacity-50 cursor-default pointer-events-none"
                    : ""
                }`}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="flex w-full gap-1 overflow-x-scroll scrollbar-thin scrollbar-thumb-image scrollbar-thumb-rounded">
                {displayedPageNumbers.map((pageNumber, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(pageNumber)}
                    disabled={pageNumber === "..."}
                    className={`relative rounded inline-flex items-center px-4 py-2 text-sm font-semibold text-txt  hover:bg-secondary focus:z-20 focus:outline-offset-0 ${
                      currentPage === pageNumber
                        ? "z-10 bg-secondary rounded text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-none"
                        : ""
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === pageNumbers.length}
                className={`relative inline-flex items-center rounded px-2 py-2 text-gray-400  hover:bg-secondary focus:z-20 focus:outline-offset-0 ${
                  currentPage === pageNumbers.length
                    ? "opacity-50 cursor-default"
                    : ""
                }`}
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterSelector;
