import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useRef } from "react";

const genres = [
  "Action",
  "Comedy",
  "Horror",
  "Romance",
  "Music",
  "Sports",
  "Adventure",
  "Fantasy",
  "Slice of Life",
  "Sci-Fi",
  "Mystery",
  "Supernatural",
  "Drama",
  "Mecha",
  "Thriller",
  "Psychological",
  "Historical",
  "Ecchi",
  "Shounen",
  "Shoujo",
  "Seinen",
  "Josei",
  "Isekai",
  "Cyberpunk",
  "Post-Apocalyptic",
  "Magical Girl",
  "Harem",
  "Reverse Harem",
];

export default function Genres() {
  const scrollRef = useRef(null);


  const scrollByWidth = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  };

 
  useEffect(() => {
    const interval = setInterval(() => {
      scrollByWidth(160); 
    }, 3000);

    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="relative w-full group">
      <div className="flex items-center justify-between px-5 mb-4">
        <h1 className="font-Archivo text-2xl font-bold">Explore Genres</h1>
      </div>
      <div className="relative flex items-center w-full">
        <button
          className="absolute left-0 z-10 p-2 bg-transparent rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
          onClick={() => scrollByWidth(-160)}
        >
          <ChevronLeftIcon className="w-5 h-5 text-white" />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-scroll scrollbar-none gap-4 px-5 scroll-smooth"
          style={{ scrollBehavior: "smooth", whiteSpace: "nowrap" }} 
        >
          {genres.map((genre, index) => (
            <Link
              href={`/search/anime/?genres=${genre}`}
              key={index}
              className="inline-block w-[150px]" 
            >
              <button className="w-full text-lg font-Archivo font-semibold bg-secondary rounded-md p-3 hover:bg-gray-100 transition-colors duration-200 ease-out">
                {genre}
              </button>
            </Link>
          ))}
        </div>
        <button
          className="absolute right-0 z-10 p-2 bg-transparent rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
          onClick={() => scrollByWidth(160)}
        >
          <ChevronRightIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
