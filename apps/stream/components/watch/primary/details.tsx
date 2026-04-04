import React from "react"; 
import { useEffect, useState } from "react";
import { useAniList } from "../../../lib/anilist/useAnilist";
import Skeleton from "react-loading-skeleton";
import AniListComments from "../../disqus";
import { AniListInfoTypes } from "types/info/AnilistInfoTypes";
import { SessionTypes } from "pages";
import Link from "next/link";
import Image from "next/image";
import DisqusComments from "../../disqus";
import CommentCountComponent from "../../commentcount";
type DetailsProps = {
  info: AniListInfoTypes | null; // Allow info to be null
  session: SessionTypes;
  epiNumber: number;
  description: string;
  id: string;
  onList: boolean;
  setOnList: (value: boolean) => void;
  handleOpen: () => void;
  disqus: string;
};

export default function Details({
  info,
  session,
  epiNumber,
  description,
  id,
  onList,
  setOnList,
  handleOpen,
  disqus
}: DetailsProps) {
  const [showComments, setShowComments] = useState(false);
  const { markPlanning } = useAniList(session);
  const [showDesc, setShowDesc] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("Main");

  const truncatedDesc = truncateText(description, 420);

  function handlePlan() {
    if (onList === false && info) { // Check if info is not null
      markPlanning(info.id);
      setOnList(true);
    }
  }

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      setShowComments(false);
    } else {
      setShowComments(true);
    }
    return () => {
      setShowComments(false);
      setShowDesc(false);
    };
  }, [id]);

  const disqusShortname = selectedProvider === "Gogo" ? "gogoanimetv" : 
  selectedProvider === "Miruro" ? "miruro-no-kuon" : 
  "aniwatchcommunity"; // Default shortname

  // Function to get the Disqus URL based on the selected provider
  function getDisqusUrl(provider: string, id: number | null, episode: number, title: string) {
    switch (provider) {
      default:
      case "Main":
        return `https://1anime.one/anime/watch?id=${id}&ep=${episode}`;

      case "Miruro":
        return `https://www.miruro.tv/watch?id=${id}&ep=${episode}`;

      case "Gogo":
        const formattedTitle = title.replace(/\s+/g, '-').toLowerCase(); // Format title for URL
        return `https://gogoanime.vc/${formattedTitle}-episode-${episode}`;
    }
  }

  return (
    <div className="flex flex-col gap-4 bg-primary rounded-lg p-4 sm:p-6 shadow-lg">

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="aspect-[9/13] h-[200px] sm:h-[240px] md:h-[320px] flex-shrink-0 mx-auto sm:mx-0">
          {info ? (
            <Link
              className="block overflow-hidden rounded-lg transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl"
              href={`/anime/${info.id}`}
            >
              <Image
                src={info.coverImage.extraLarge}
                alt="Anime Cover"
                width={1000}
                height={1000}
                className="object-cover w-full h-full"
              />
            </Link>
          ) : (
            <Skeleton height="100%" />
          )}
        </div>
        <div className="flex flex-col gap-3 sm:gap-4 flex-grow">
          <h1 className="text-xl sm:text-2xl font-bold text-white text-center sm:text-left">
            {info?.title?.romaji || <Skeleton width={200} />}
          </h1>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Studios */}
            <div>
              <h2 className="text-xs sm:text-sm font-medium text-gray-400">Studios</h2>
              <p className="text-sm sm:text-base text-white">{info && info.studios?.edges.length > 0 ? info.studios.edges[0].node.name : <Skeleton width={80} />}</p>
            </div>
            {/* Status */}
            <div>
              <h2 className="text-xs sm:text-sm font-medium text-gray-400">Status</h2>
              <p className="text-sm sm:text-base text-white">{info ? info.status : <Skeleton width={75} />}</p>
            </div>
            {/* Titles */}
            <div className="col-span-2">
              <h2 className="text-xs sm:text-sm font-medium text-gray-400">Titles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                {info ? (
                  <>
                    <p className="text-sm sm:text-base text-white">{info.title?.english || ""}</p>
                    <p className="text-sm sm:text-base text-white">{info.title?.native || ""}</p>
                  </>
                ) : (
                  <Skeleton count={2} />
                )}
              </div>
            </div>
          </div>
          {/* Genres */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {info && info.genres?.map((item, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs sm:text-sm bg-action text-white rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
          {/* Description */}
          <div className="bg-secondary rounded-lg p-3 sm:p-4">
            {info && (
              <>
                <p
                  dangerouslySetInnerHTML={{
                    __html: showDesc ? description : truncatedDesc
                  }}
                  className="text-sm sm:text-base text-gray-300"
                />
                {!showDesc && description?.length > 420 && (
                  <button
                    onClick={() => setShowDesc(true)}
                    className="mt-2 text-sm sm:text-base text-action hover:underline focus:outline-none"
                  >
                    Read More
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {/* Comments section */}
      <div className="w-full flex items-center py-2 font-Archivo lg:px-0">
        <div>
          <CommentCountComponent
            post={{
              title: info?.title?.english || info?.title?.romaji || "Unknown Title", // Provide a default value
              url: getDisqusUrl(selectedProvider, info?.id || 0, epiNumber, info?.title?.romaji || "Unknown Title") || "", // Ensure url is a string
              name: (() => {
                switch (selectedProvider) {
                  case "Gogo":
                    return "gogoanimetv";
                  case "Miruro":
                    return "miruro-no-kuon";
                  default:
                    return "aniwatchcommunity";
                }
              })(), // Use switch case based on provider
              id: info?.id || 0, // Use optional chaining and provide a default value
              episode: epiNumber // Add the episode number here
            }} 
          />
        </div>
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          className="ml-2 h-10 bg-secondary text-white rounded">
          <option value="Main">Main</option>
          <option value="Gogo">Gogo</option>
          <option value="Miruro">Miruro</option>
        </select>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-center gap-2 h-10 bg-secondary rounded ml-2"
        >
          {showComments ? "Hide" : "Show"} 
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
            />
          </svg>
        </button>
        <a 
          href="https://rentry.co/1anixmirurorules" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="ml-2 h-10 bg-blue-600 text-white rounded flex items-center justify-center px-3"
        >
          Rules
        </a>
      </div>
      {showComments && (
        <div className="mb-4 bg-secondary rounded-lg p-4">
          <div>
            {info && (
              <div className="mt-5">
                <DisqusComments
                  post={{
                    title: info.title?.english || info.title?.romaji || "Unknown Title", // Provide a default value
                    url: getDisqusUrl(selectedProvider, info.id || 0, epiNumber, info.title?.romaji || "Unknown Title") || "", // Ensure url is a string
                    name: (() => {
                      switch (selectedProvider) {
                        case "Gogo":
                          return "gogoanimetv";
                        case "Miruro":
                          return "miruro-no-kuon";
                        default:
                          return "aniwatchcommunity";
                      }
                    })(), // Use switch case based on provider
                    id: info.id,
                    episode: epiNumber // Add the episode number here
                  }} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
      );
    }

function truncateText(txt: string, length: number) {
  const text = txt.replace(/(<([^>]+)>)/gi, "");
  return text.length > length ? text.slice(0, length) + "..." : text;
}
