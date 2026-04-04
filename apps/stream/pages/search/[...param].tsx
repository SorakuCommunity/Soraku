import { Key, useEffect, useRef, useState } from "react";
import { motion as m } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Footer from "@/components/shared/footer";

import Image from "next/image";
import { aniAdvanceSearch } from "@/lib/anilist/aniAdvanceSearch";
import MultiSelector from "@/components/search/dropdown/multiSelector";
import SingleSelector from "@/components/search/dropdown/singleSelector";
import {
  animeFormatOptions,
  formatOptions,
  genreOptions,
  mangaFormatOptions,
  mediaType,
  seasonOptions,
  tagsOption,
  yearOptions,
  sortOptions, // Added sort options
} from "@/components/search/selection";
import InputSelect from "@/components/search/dropdown/inputSelect";
import { Cog6ToothIcon, TrashIcon } from "@heroicons/react/20/solid";
import useDebounce from "@/lib/hooks/useDebounce";
import { Navbar } from "@/components/shared/NavBar";
import MobileNav from "@/components/shared/MobileNav";
import SearchByImage, {
  TraceMoeResultTypes,
} from "@/components/search/searchByImage";
import { PlayIcon } from "@heroicons/react/24/outline";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export async function getServerSideProps(context: any) {
  const { param } = context.query;

  const { search, format, genres, season, year, sort, adultContent } = context.query; // Added adultContent to query

  let getFormat, getSeason, getYear;
  let getGenres = [];

  if (genres) {
    const gr = genreOptions.find(
      (i) => i.value.toLowerCase() === genres.toLowerCase()
    );
    getGenres.push(gr);
  }

  if (season) {
    getSeason = seasonOptions.find(
      (i) => i.value.toLowerCase() === season.toLowerCase()
    );
    if (!year) {
      const now = new Date().getFullYear();
      getYear = yearOptions.find((i) => i.value === now.toString());
    } else {
      getYear = yearOptions.find((i) => i.value === year);
    }
  }

  if (format) {
    getFormat = formatOptions.find(
      (i) => i.value.toLowerCase() === format.toLowerCase()
    );
  }

  if (!param && param.length !== 1) {
    return {
      notFound: true,
    };
  }

  const typeIndex = param[0] === "anime" ? 0 : 1;

  return {
    props: {
      index: typeIndex,
      query: search || null,
      formats: getFormat || null,
      seasons: getSeason || null,
      years: getYear || null,
      genres: getGenres || null,
      sort: sort || null, // Added sort to props
      adultContent: adultContent === 'true', // Added adultContent to props
    },
  };
}

type CardProps = {
  index: number;
  query: string;
  genres: any;
  formats: any;
  seasons: any;
  years: any;
  sort: { name: string; value: string } | null | undefined; // Updated to allow undefined
  adultContent: boolean; // Added adultContent type
};

export default function Card({
  index,
  query,
  genres,
  formats,
  seasons,
  years,
  sort, // Added sort to props
}: CardProps) {
  const inputRef = useRef(null);
  const router = useRouter();

  const [data, setData] = useState<any>();
  const [imageSearch, setImageSearch] = useState<TraceMoeResultTypes[]>();

  const [loading, setLoading] = useState(true);

  const [search, setQuery] = useState<string | null | undefined>(query);
  const debounceSearch = useDebounce(search, 500);

  const [type, setSelectedType] = useState<{
    name: string;
    value: string;
  } | null>(mediaType[index]);
  const [year, setYear] = useState(years);
  const [season, setSeason] = useState(seasons);
  const [sortOption, setSelectedSort] = useState<{ name: string; value: string } | null>(sort ?? null); // Use nullish coalescing to default to null
  const [genre, setGenre] = useState(genres);
  const [format, setFormat] = useState(formats);
  const [isVisible, setIsVisible] = useState(false);
  const [adultContent, setAdultContent] = useState<boolean>(false); // Declare state for adultContent
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(true);
  const [showSauce, setShowSauce] = useState(false);


  async function advance() {
    setLoading(true);
    const data = await aniAdvanceSearch({
      search: debounceSearch,
      type: type?.value as "ANIME" | "MANGA" | undefined,
      genres: genre,
      page: page,
      sort: sortOption?.value, // Updated to use sortOption
      format: format?.value,
      season: season?.value,
      seasonYear: year?.value,
      adultContent: adultContent, // Added adultContent to the search parameters
    });
    if (data?.media?.length === 0) {
      setNextPage(false);
      setLoading(false);
    } else if (data !== null && page > 1) {
      setData((prevData: any) => {
        return [...(prevData ?? []), ...data?.media];
      });
      setNextPage(data?.pageInfo.hasNextPage);
      setLoading(false);
    } else {
      setData(data?.media);
      setNextPage(data?.pageInfo.hasNextPage);
      setLoading(false);
    }
  }

  useEffect(() => {
    const storedShowSauce = localStorage.getItem('showSauce');
    setShowSauce(storedShowSauce === 'true');

    setData(null);
    setPage(1);
    setNextPage(true);
    if (page === 1) {
      advance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debounceSearch,
    type?.value,
    sortOption?.value, // Updated to use sortOption
    genre,
    format?.value,
    season?.value,
    year?.value,
    adultContent, // Added adultContent to dependencies
  ]);

  useEffect(() => {
    if (imageSearch) return;
    if (page > 1) {
      advance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, imageSearch]);

  useEffect(() => {
    function handleScroll() {
      if (imageSearch) {
        window.removeEventListener("scroll", handleScroll);
        return;
      }
      if (page > 10 || !nextPage) {
        window.removeEventListener("scroll", handleScroll);
        return;
      }

      if (
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight - 3
      ) {
        if (!loading) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, nextPage, imageSearch, loading]);

  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputValue = event.target.value;
      if (inputValue === "") {
        setQuery(undefined);
      } else {
        setQuery(inputValue);
      }
    }
  };

  function trash() {
    setImageSearch(undefined);
    setQuery(undefined);
    setGenre(undefined);
    setFormat(undefined);
    setSelectedSort(null);
    setSeason(undefined);
    setYear(undefined);
    router.push(`/search/${mediaType[index]?.value?.toLowerCase()}`);
  }

  function handleVisible() {
    setIsVisible(!isVisible);
  }

  const handleVideoHover = (hovered: boolean, id: any) => {
    const updatedImageSearch = imageSearch?.map((item: any) => {
      if (item.filename === id) {
        return { ...item, hovered };
      }
      return item;
    });
    setImageSearch(updatedImageSearch);
  };

  const toggleAdultContent = () => {
    setAdultContent((prev) => !prev);
  };

  return (
    <>
      <Head>
        <title>1Anime - search</title>
        <meta name="title" content="Search" />
        <meta name="description" content="Search your favourites Anime/Manga" />
      </Head>

      <Navbar
        scrollP={10}
        withNav={true}
        shrink={true}
        paddingY="py-1 lg:py-3"
      />
      <MobileNav hideProfile={true} />
      <main className="w-screen min-h-screen z-40 py-14 lg:py-24">
        <div className="max-w-screen-xl flex flex-col gap-3 mx-auto">
          <div className="w-full flex justify-between items-end gap-2 my-3 lg:gap-10 px-5 xl:px-0 relative">
            <div className="hidden lg:flex items-end w-full gap-5 z-50">
              <InputSelect
                inputRef={inputRef}
                data={mediaType}
                label="Search"
                keyDown={handleKeyDown}
                query={search}
                setQuery={setQuery}
                selected={type}
                setSelected={setSelectedType}
              />
              {/* GENRES */}
              <MultiSelector
                data={genreOptions}
                other={tagsOption}
                selected={genre}
                setSelected={setGenre}
                label="Genres"
                inputRef={inputRef}
              />
              {/* SORT */}
              <SingleSelector
                data={sortOptions} // Added sort options
                selected={sortOption} // Updated to use sortOption
                setSelected={setSelectedSort} // Updated to set sortOption
                label="Sort"
              />
              {/* FORMAT */}
              <SingleSelector
                data={index === 0 ? animeFormatOptions : mangaFormatOptions}
                selected={format}
                setSelected={setFormat}
                label="Format"
              />
              {/* SEASON */}
              <SingleSelector
                data={seasonOptions}
                selected={season}
                setSelected={setSeason}
                label="Season"
              />
              {/* YEAR */}
              <SingleSelector
                data={yearOptions}
                selected={year}
                setSelected={setYear}
                label="Year"
              />
              
          {showSauce && (
              <div className="flex items-center">
                <label className="mr-2">Adult Content:</label>
                <button
                  onClick={toggleAdultContent}
                  className={`py-1 px-3 rounded ${adultContent ? 'bg-green-500' : 'bg-red-300'}`}
                >
                  {adultContent ? 'On' : 'Off'}
                </button>
              </div> )}

            </div>
            <div className="w-full lg:hidden">
              <InputSelect
                inputRef={inputRef}
                data={mediaType}
                label="Search"
                keyDown={handleKeyDown}
                query={search}
                setQuery={setQuery}
                selected={type}
                setSelected={setSelectedType}
              />
            </div>

            <div className="flex gap-2">
              <div
                className="lg:hidden py-2 px-2 bg-secondary rounded flex justify-center items-center cursor-pointer hover:bg-opacity-75 transition-all duration-100 group"
                onClick={handleVisible}
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </div>
              <SearchByImage setMedia={setData} setData={setImageSearch} />
              <div
                className="py-2 px-2 bg-secondary rounded flex justify-center items-center cursor-pointer hover:bg-opacity-75 transition-all duration-100 group"
                onClick={trash}
              >
                <TrashIcon className="w-5 h-5" />
              </div>
            </div>
          </div>
          {isVisible && (
            <div className="lg:hidden w-full flex justify-center z-40">
              <div className="grid grid-cols-2 grid-rows-2 place-items-center w-full px-5 z-30 gap-4">
              {showSauce && (
              <div className="flex items-center">
                <label className="mr-2">Adult Content:</label>
                <button
                  onClick={toggleAdultContent}
                  className={`py-1 px-3 rounded ${adultContent ? 'bg-green-500' : 'bg-red-300'}`}
                >
                  {adultContent ? 'On' : 'Off'}
                </button>
              </div> )}


                {/* GENRES */}
                <MultiSelector
                  data={genreOptions}
                  other={tagsOption}
                  selected={genre}
                  setSelected={setGenre}
                  label="Genres"
                  inputRef={inputRef}
                />
                {/* SORT */}
                <SingleSelector
                  data={sortOptions} // Added sort options
                  selected={sortOption} // Updated to use sortOption
                  setSelected={setSelectedSort} // Updated to set sortOption
                  label="Sort"
                />
                {/* FORMAT */}
                <SingleSelector
                  data={index === 0 ? animeFormatOptions : mangaFormatOptions}
                  selected={format}
                  setSelected={setFormat}
                  label="Format"
                />
                {/* SEASON */}
                <SingleSelector
                  data={seasonOptions}
                  selected={season}
                  setSelected={setSeason}
                  label="Season"
                />
                {/* YEAR */}
                <SingleSelector
                  data={yearOptions}
                  selected={year}
                  setSelected={setYear}
                  label="Year"
                />
              </div>
            </div>
          )}
          <div className="flex flex-col gap-14 items-center z-30 overflow-x-hidden">
            <div
              key="card-keys"
              className={`${
                imageSearch ? "hidden" : ""
              } grid pt-3 px-5 xl:px-0 xxs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 justify-items-center grid-cols-2 w-screen xl:w-auto xl:gap-7 gap-5 gap-y-10`}
            >
              {loading
                ? ""
                : !data && (
                    <div className="w-full text-[#ff7f57] col-span-6 items-center flex justify-center text-center font-bold font-karla xl:text-2xl">
                      Oops!<br></br> Nothing's Found...
                    </div>
                  )}

              {data &&
                data?.length > 0 &&
                !imageSearch &&
                data?.map(
                  (
                    anime: {
                      format: string;
                      id: any;
                      title: { userPreferred: string };
                      coverImage: { extraLarge: string | StaticImport };
                      status: string;
                      episodes: any;
                      chapters: any;
                      adultContent: boolean; // Added adultContent property
                    },
                    index: Key | null | undefined
                  ) => {
                    return (
                      <m.div
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1, transition: { duration: 0.35 } }}
                        className="w-full"
                        key={index}
                      >
                        <Link
                          href={
                            anime.format === "MANGA" || anime.format === "NOVEL"
                              ? `/manga/${anime.id}`
                              : `/anime/${anime.id}`
                          }
                          title={anime.title.userPreferred}
                          className="block relative overflow-hidden bg-secondary hover:scale-[1.03] scale-100 transition-all cursor-pointer duration-200 ease-out rounded"
                          style={{
                            paddingTop: "145%", // 2:3 aspect ratio (3/2 * 100%)
                          }}
                        >
                          <Image
                            className="object-cover"
                            src={anime.coverImage.extraLarge}
                            alt={anime.title.userPreferred}
                            sizes="(min-width: 808px) 50vw, 100vw"
                            quality={100}
                            fill
                          />
                        </Link>
                        <Link
                          href={
                            anime.format === "MANGA" || anime.format === "NOVEL"
                              ? `/manga/${anime.id}`
                              : `/anime/${anime.id}`
                          }
                          title={anime.title.userPreferred}
                        >
                          <h1 className="font-outfit font-bold xl:text-base text-[15px] pt-4 line-clamp-2">
                            {anime.status === "RELEASING" ? (
                              <span className="dots bg-green-500" />
                            ) : anime.status === "NOT_YET_RELEASED" ? (
                              <span className="dots bg-red-500" />
                            ) : null}
                            {anime.title.userPreferred}
                          </h1>
                        </Link>
                        <h2 className="font-outfit xl:text-[15px] text-[11px] font-light pt-2 text-[#8B8B8B]">
                          {anime.format || <p>-</p>} &#183;{" "}
                          {anime.status || <p>-</p>} &#183;{" "}
                          {anime.episodes
                            ? `${anime.episodes || "N/A"} Episodes`
                            : `${anime.chapters || "N/A"} Chapters`}
                          {anime.adultContent && <span className="text-red-500"> (Adult Content)</span>} {/* Indicate adult content */}
                        </h2>
                      </m.div>
                    );
                  }
                )}

              {loading && (
                <>
                  {[1, 2, 4, 5, 6, 7, 8].map((item) => (
                    <div className="w-full" key={item}>
                      <div className="w-full">
                        <Skeleton
                          className="w-full rounded"
                          style={{
                            paddingTop: "140%", // 2:3 aspect ratio (3/2 * 100%)
                            width: "(min-width: 808px) 50vw, 100vw",
                            lineHeight: 1,
                          }}
                        />
                      </div>
                      <div>
                        <h1 className="font-outfit w-[320px] font-bold xl:text-base text-[15px] pt-4 line-clamp-2">
                          <Skeleton width={120} height={26} />
                        </h1>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {imageSearch && (
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-7 px-5 lg:px-0">
                {imageSearch.map((a, index) => {
                  return (
                    <m.div
                      key={index}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1, transition: { duration: 0.35 } }}
                      className="flex flex-col gap-2 shrink-0 cursor-pointer relative group/item"
                    >
                      <Link
                        className="relative aspect-video rounded-md overflow-hidden group"
                        href={`/anime/${a.anilist.id}`}
                        onMouseEnter={() => {
                          handleVideoHover(true, a.filename);
                        }}
                        onMouseLeave={() => handleVideoHover(false, a.filename)}
                      >
                        <div className="w-full h-full bg-gradient-to-t from-black/70 from-20% to-transparent group-hover:to-black/40 transition-all duration-300 ease-out absolute z-30" />
                        <div className="absolute bottom-3 left-0 mx-2 text-white flex gap-2 items-center w-[80%] z-30">
                          <PlayIcon className="w-5 h-5 shrink-0" />
                          <h1
                            className="font-semibold font-karla line-clamp-1"
                            title={a?.anilist.title.romaji}
                          >
                            {`Episode ${a.episode}`}
                          </h1>
                        </div>

                        {a?.image && (
                          <Image
                            src={a?.image}
                            width={200}
                            height={200}
                            alt="Episode Thumbnail"
                            className={`w-full object-cover group-hover:scale-[1.02] duration-300 ease-out z-10 ${
                              !a.hovered ? "visible" : "hidden"
                            }`}
                          />
                        )}
                        {a?.video && (
                          <video
                            src={a.video}
                            className={`w-full object-cover group-hover:scale-[1.02] duration-300 ease-out z-10 ${
                              a.hovered ? "visible" : "hidden"
                            }`}
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        )}
                      </Link>

                      <Link
                        className="flex flex-col font-karla w-full"
                        href={`/anime/${a.anilist.id}`}
                      >
                        <p className="flex items-center gap-1 text-sm text-gray-400 max-w-[320px]">
                          <span
                            className="text-white max-w-[120px] md:max-w-[200px] lg:max-w-[220px]"
                            style={{
                              display: "inline-block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={a?.anilist.title.romaji}
                          >
                            {a?.anilist.title.romaji}
                          </span>{" "}
                          | Episode {a.episode}
                        </p>
                      </Link>
                    </m.div>
                  );
                })}
              </div>
            )}
            {!loading && page > 10 && nextPage && (
              <button
                onClick={() => setPage((p) => p + 1)}
                className="bg-secondary xl:w-[30%] w-[80%] h-10 rounded-md"
              >
                Load More
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
