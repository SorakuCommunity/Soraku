import React, { FC, useRef } from "react";
import { getFormat } from "@/utils/getFormat";
import { FaStar, FaFilm, FaFlag, FaCheckCircle, FaTv, FaVideo } from "react-icons/fa"; // Importing additional icons
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface Info {
  id: number;
  episodes?: number;
  averageScore?: number;
  format?: string;
  status?: string;
  genres?: string[];
  countryOfOrigin: string;
  isAdult?: boolean; // Added isAdult property
}

interface InfoChipProps {
  info: Info;
  color: any;
  className: string;
  showItems?: string[];
}

const InfoChip: FC<InfoChipProps> = ({ info, color, className, showItems = ['all'] }) => {
  const exceptions = [140960, 10302, 151801, 153845, 153339];
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const determineAgeRating = (info: { id: number; genres?: string[]; isAdult?: boolean }) => {
    if (info.isAdult) {
      return "18+";
    }
    
    if (exceptions.includes(info.id)) {
      return "PG/13+";
    }

    const hasDramaGenre = info.genres?.includes("Drama");
    const hasEcchiGenre = info.genres?.includes("Ecchi");
    const hasActionGenre = info.genres?.includes("Action");

    if (hasDramaGenre && hasActionGenre) {
      return "16+";
    }

    return hasDramaGenre || hasEcchiGenre ? "16+" : "PG/13+";
  };

  const ageRating = determineAgeRating(info);

  const items = [
    { key: 'episodes', condition: info?.episodes, text: <><FaFilm className="inline-block mr-1" /> {`${info?.episodes} Episodes`}</> },
    { key: 'ageRating', condition: true, text: <><FaCheckCircle className="inline-block mr-1" /> {`Rated: ${ageRating}`}</> },
    { key: 'country', condition: info?.countryOfOrigin, text: <><FaFlag className="inline-block mr-1" /> {info?.countryOfOrigin}</> },
    { key: 'score', condition: info?.averageScore, text: <span><FaStar className="inline-block mr-1" /> {info?.averageScore}%</span> },
    { key: 'format', condition: info?.format, text: <><FaVideo className="inline-block mr-1" /> {getFormat(info?.format ?? '')}</> }, // Updated to use movie tape icon
    { key: 'status', condition: info?.status, text: <><FaTv className="inline-block mr-1" /> {info?.status}</> }, // Updated to use TV icon
  ];

  const scrollByWidth = (scrollOffset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <button
        className="absolute left-0 z-10 p-1 bg-transparent rounded-full opacity-50 hover:opacity-100 transition-opacity duration-300 ease-in-out"
        onClick={() => scrollByWidth(-160)}
      >
        <ChevronLeftIcon className="w-4 h-4 text-white" />
      </button>
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll scrollbar-none gap-2 px-3 scroll-smooth"
        style={{ scrollBehavior: "smooth", whiteSpace: "nowrap" }}
      >
        {info?.genres?.map((genre: string, index: number) => ( // Explicitly typed genre as string
          <Link
            href={`/search/anime?genres=${encodeURIComponent(genre)}`}
            key={index}
            className="inline-block"
          >
            <button className="dynamic-text rounded-full px-3 py-1 text-sm font-medium hover:opacity-80 transition-opacity" style={{ backgroundColor: color.backgroundColor, color: color.color }}>
              {genre}
            </button>
          </Link>
        ))}
        {items.map((item, index) => (
          (showItems.includes('all') || showItems.includes(item.key)) && item.condition && (
            <div
              key={index}
              className="dynamic-text rounded-full px-3 py-1 text-sm font-medium"
              style={{ backgroundColor: color.backgroundColor, color: color.color }}
            >
              {item.text}
            </div>
          )
        ))}
      </div>
      <button
        className="absolute right-0 z-10 p-1 bg-transparent rounded-full opacity-50 hover:opacity-100 transition-opacity duration-300 ease-in-out flex items-center justify-center"
        onClick={() => scrollByWidth(160)}
      >
        <ChevronRightIcon className="w-4 h-4 text-white" />
      </button>
    </div>
  );
};

export default InfoChip;
