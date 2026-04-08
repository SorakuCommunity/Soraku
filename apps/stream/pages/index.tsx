import React from "react";
import { aniListData } from "@/lib/anilist/AniList";
import { altData } from "@/lib/anilist/Alt";
import { useState, useEffect, Fragment, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Footer from "@/components/shared/footer";
import Image from "next/image";
import Content from "@/components/home/content";
import styles from "./tabs.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Genres from "@/components/home/genres";
import Schedule from "@/components/home/schedule";
import getUpcomingAnime from "@/lib/anilist/getUpcomingAnime";
import GetMedia from "@/lib/anilist/getMedia";
import { getGreetings } from "@/utils/getGreetings";
import { redis, safeRedisGet } from "@/lib/redis";
import { Navbar } from "@/components/shared/NavBar";
import UserRecommendation from "@/components/home/recommendation";
import FeaturedSection from "@/components/home/featured";
import RandomSection from "@/components/home/random";
import { useRouter } from "next/router";
import { ChevronLeftIcon, ChevronRightIcon } from "@vidstack/react/icons";
import dynamic from "next/dynamic";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import { FireIcon } from "@heroicons/react/24/outline";
import AnimeSchedule from "@/components/home/AnimeSchedule"; // Adjust the path as necessary
import { getScheduleProps } from "./schedule/index"; // Adjust the path as necessary

const MAX_TRENDS = 7;

export async function getServerSideProps() {
  let cachedData;
  let error = false;

  if (redis) {
    cachedData = await safeRedisGet("index_server");
  }

  if (cachedData) {
    const {
      genre,
      detail,
      populars,
      seasonal,
      nextSeasonal,
      popularMovies,
      trendData,
      previousSeasonal,
      schedule
    } = JSON.parse(cachedData);
    const upComing = await getUpcomingAnime();
    return {
      props: {
        genre,
        detail,
        populars,
        seasonal,
        nextSeasonal,
        popularMovies,
        upComing,
        trendData,
        previousSeasonal,
        schedule
      }
    };
  } else {
    try {
      const td = aniListData({
        type: "ANIME",
        sort: "TRENDING_DESC",
        page: 1
      });
      const pd = aniListData({
        type: "ANIME",
        sort: "POPULARITY_DESC",
        page: 1
      });
      const sd = aniListData({
        type: "ANIME",
        sort: "POPULARITY_DESC",
        season: "FALL",
        page: 1
      });
      const nsd = aniListData({
        type: "ANIME",
        sort: "POPULARITY_DESC",
        season: "WINTER",
        page: 1,
        seasonYear: 2025
      });
      const pmd = altData({
        sort: "POPULARITY_DESC",
        page: 1
      });
      const gd = aniListData({
        type: "ANIME",
        sort: "TYPE",
        page: 1
      });
      const previousSd = aniListData({
        type: "ANIME",
        sort: "POPULARITY_DESC",
        season: "SUMMER", // Fetching previous season data
        page: 1
      });

      const [
        trendingDetail,
        popularDetail,
        seasonDetail,
        nextSeasonDetail,
        popularMovieDetail,
        genreDetail,
        previousSeasonDetail
      ] = await Promise.all([td, pd, sd, nsd, pmd, gd, previousSd]);

      const scheduleProps = await getScheduleProps(); // Declare and assign scheduleProps here
      if (redis) {
        const trendData = trendingDetail.props.data.slice(0, MAX_TRENDS) || [];
        await redis.set(
          "index_server",
          JSON.stringify({
            genre: genreDetail.props,
            detail: trendingDetail.props,
            populars: popularDetail.props,
            seasonal: seasonDetail.props,
            nextSeasonal: nextSeasonDetail.props,
            popularMovies: popularMovieDetail.props,
            trendData: trendData,
            previousSeasonal: previousSeasonDetail.props,
            schedule: scheduleProps.props.schedule // Now scheduleProps is declared before use
          }), // set cache for 6 hours
          "EX",
          60 * 60 * 6
        );
      }

      const upComing = await getUpcomingAnime();
      const trendData = trendingDetail.props.data.slice(0, MAX_TRENDS) || [];
      return {
        props: {
          genre: genreDetail.props,
          detail: trendingDetail.props,
          populars: popularDetail.props,
          seasonal: seasonDetail.props,
          nextSeasonal: nextSeasonDetail.props,
          popularMovies: popularMovieDetail.props,
          upComing,
          trendData,
          previousSeasonal: previousSeasonDetail.props, // Pass previous season data to props
          schedule: scheduleProps.props.schedule
        }
      };
    } catch (fetchError) {
      // Renamed error to fetchError
      console.error("Error fetching data from AniList:", fetchError);
      error = true; // Set error flag to true on 500 error
      // Return dummy/test data in case of error
      return {
        props: {
          genre: [],
          detail: { data: [] },
          populars: { data: [] },
          seasonal: { data: [] },
          nextSeasonal: { data: [] },
          popularMovies: { data: [] },
          upComing: [],
          trendData: [
            {
              id: 1,
              title: {
                english: "Temporary Test Anime",
                romaji: "Test Anime Romaji"
              },
              description: "This is a test description.",
              format: "TV",
              status: "RELEASING",
              startDate: { month: 1, year: 2023 },
              coverImage: { extraLarge: "" },
              bannerImage: "",
              trailer: { id: "test_trailer_id" }
            }
          ],
          previousSeasonal: { data: [] },
          error,
          schedule: { data: [] }
        }
      };
    }
  }

  // If no error, return the fetched data
  return {
    props: {
      genre: [], // Replace with actual data
      detail: {}, // Replace with actual data
      populars: {}, // Replace with actual data
      seasonal: {}, // Replace with actual data
      nextSeasonal: {}, // Replace with actual data
      popularMovies: {}, // Replace with actual data
      upComing: [], // Replace with actual data
      trendData: [], // Replace with actual data
      previousSeasonal: {}, // Replace with actual data
      error // Pass the error flag to props
    }
  };
}

type HomeProps = {
  genre: any;
  detail: any;
  populars: any;
  seasonal: any;
  nextSeasonal: any;
  popularMovies: any;
  upComing: any;
  trendData: any;
  previousSeasonal: any;
  error: boolean;
  schedule: any;
};

export interface SessionTypes {
  name: string;
  picture: Picture;
  sub: string;
  token: string;
  id: number;
  image: Image;
  list: string[];
  version: string;
  iat: number;
  exp: number;
  jti: string;
}

interface Picture {
  large: string;
  medium: string;
}

interface Image {
  large: string;
  medium: string;
}

// Create a dynamic component for the trailer toggle button
const TrailerToggleButton = dynamic(
  () => import("@/components/TrailerToggleButton"),
  { ssr: false }
);

export default function Home({
  detail,
  populars,
  seasonal,
  nextSeasonal,
  popularMovies,
  upComing,
  trendData,
  previousSeasonal, // Added previousSeasonal to props
  error,
  schedule
}: HomeProps) {
  const { data: sessions }: any = useSession();
  const userSession: SessionTypes = sessions?.user;
  const [hasError, setHasError] = useState(error); // Set error state based on the prop
  console.log({ trendData });

  const {
    anime: currentAnime,
    manga: currentManga,
    recommendations
  }: {
    anime: CurrentMediaTypes[];
    manga: CurrentMediaTypes[];
    recommendations: CurrentMediaTypes[];
  } = GetMedia(sessions, {
    stats: "CURRENT"
  });
  const { anime: plan }: { anime: CurrentMediaTypes[] } = GetMedia(sessions, {
    stats: "PLANNING"
  });
  const { anime: release } = GetMedia(sessions);

  const router = useRouter();

  const [schedules, setSchedules] = useState(null);
  const [anime, setAnime] = useState([]);

  const [recentAdded, setRecentAdded] = useState([]);

  async function getRecent() {
    const data = await fetch(`/api/v2/etc/recent/1`)
      .then((res) => res.json())
      .catch((err) => console.log(err));

    setRecentAdded(data?.results);
  }

  useEffect(() => {
    if (userSession?.version) {
      if (userSession?.version !== "1.0.1") {
        signOut({ redirect: true });
      }
    }
  }, [userSession?.version]);

  useEffect(() => {
    getRecent();
  }, []);

  const update = () => {
    setAnime((prevAnime) => prevAnime.slice(1));
  };

  useEffect(() => {
    if (upComing && upComing.length > 0) {
      setAnime(upComing);
    }
  }, [upComing]);

  const [releaseData, setReleaseData] = useState<any[]>([]);

  useEffect(() => {
    function getRelease() {
      let releasingAnime: any[] = [];
      let progress: any[] = [];
      let seenIds = new Set<number>(); // Create a Set to store the IDs of seen anime
      (release as any[]).forEach((list: any) => {
        list.entries.forEach((entry: any) => {
          if (
            entry.media.status === "RELEASING" &&
            !seenIds.has(entry.media.id)
          ) {
            releasingAnime.push(entry.media);
            seenIds.add(entry.media.id); // Add the ID to the Set
          }
          progress.push(entry);
        });
      });
      setReleaseData(releasingAnime);
      if (progress.length > 0) setProg(progress);
    }
    getRelease();
  }, [release]);

  const [listAnime, setListAnime] = useState<any[] | null>();
  const [listManga, setListManga] = useState<any[] | null>(null);
  const [planned, setPlanned] = useState<any[] | null>(null);
  const [user, setUser] = useState<any[] | null>(null);
  const [removed, setRemoved] = useState();
  const [tmdbId, setTmdbId] = useState<number | null>(null);
  const [animeLogo, setAnimeLogo] = useState<string | null>(null);

  const [prog, setProg] = useState<any[] | null>();

  const popular = populars?.data;

  useEffect(() => {
    async function userData() {
      try {
        if (userSession?.name) {
          await fetch(`/api/user/profile`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: sessions.user.name
            })
          });
        }
      } catch (error) {
        console.log(error);
      }
      let data: UserDataType | null = null;
      try {
        if (userSession?.name) {
          const res = await fetch(
            `/api/user/profile?name=${sessions.user.name}`
          );
          if (!res.ok) {
            switch (res.status) {
              case 404: {
                console.log("user not found");
                break;
              }
              case 500: {
                console.log("server error");
                break;
              }
              default: {
                console.log("unknown error");
                break;
              }
            }
          } else {
            data = await res.json();
            // Do something with the data
          }
        }
      } catch (error) {
        console.error(error);
        // Handle the error here
      }
      if (!data) {
        const dat: any = localStorage.getItem("artplayer_settings");
        if (dat) {
          const arr = Object.keys(dat).map((key: string) => dat[key] as any);
          const newFirst = arr?.sort((a: any, b: any) => {
            return (
              new Date(b?.createdAt).getTime() -
              new Date(a?.createdAt).getTime()
            );
          });

          const uniqueTitles = new Set();

          // Filter out duplicates and store unique entries
          const filteredData = newFirst.filter((entry: any) => {
            if (uniqueTitles.has(entry.aniTitle)) {
              return false;
            }
            uniqueTitles.add(entry.aniTitle);
            return true;
          });

          if (filteredData) {
            setUser(filteredData);
          }
        }
      } else {
        // Create a Set to store unique aniTitles
        const uniqueTitles = new Set();

        // Filter out duplicates and store unique entries
        const filteredData = data?.WatchListEpisode.filter((entry) => {
          if (uniqueTitles.has(entry.aniTitle)) {
            return false;
          }
          uniqueTitles.add(entry.aniTitle);
          return true;
        });
        setUser(filteredData);
      }
      // const data = await res.json();
    }
    userData();
  }, [userSession?.name, removed]);

  useEffect(() => {
    async function userData() {
      if (!userSession?.name) return;

      const getMedia =
        currentAnime.find((item) => item.status === "CURRENT") || null;
      const listAnime = getMedia?.entries
        .map(({ media }) => media)
        .filter((media) => media);

      const getManga =
        currentManga?.find((item) => item.status === "CURRENT") || null;
      const listManga = getManga?.entries
        .map(({ media }) => media)
        .filter((media) => media);

      const planned = plan?.[0]?.entries
        .map(({ media }) => media)
        .filter((media) => media);

      if (listManga) {
        setListManga(listManga);
      }
      if (listAnime) {
        setListAnime(listAnime);
      }
      if (planned) {
        setPlanned(planned);
      }
    }
    userData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSession?.name, currentAnime, plan]);

  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);
  const maxTimeout: number = 15000; // 15 seconds
  const [currentTime, setCurrentTime] = useState(0); // State to track current time

  const nextSlide = () => {
    setIsFading(true);
    setTimeout(() => {
      setCarouselIndex((prevIndex) => (prevIndex + 1) % trendData.length);
      setIsFading(false);
    }, 250);
  };

  const prevSlide = () => {
    setIsFading(true);
    setTimeout(() => {
      setCarouselIndex(
        (prevIndex) => (prevIndex - 1 + trendData.length) % trendData.length
      );
      setIsFading(false);
    }, 250);
  };

  const manualSlide = (index: number) => {
    setIsFading(true);
    setTimeout(() => {
      setCarouselIndex(index);
      setIsFading(false);
    }, 250);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, maxTimeout);

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only proceed if Ctrl key is pressed
      if (event.ctrlKey) {
        switch (event.key) {
          case "ArrowRight":
          case " ":
            event.preventDefault();
            nextSlide();
            break;
          case "ArrowLeft":
            event.preventDefault();
            prevSlide();
            break;
          default:
            break;
        }
      }
    };

    // Attach event listener
    document.addEventListener("keydown", handleKeyDown);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(intervalId);
    };
  }, [carouselIndex]);

  useEffect(() => {
    // Reset currentTime when the slide changes
    setCurrentTime(0);

    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= 14) {
          clearInterval(timer); // Clear timer when it reaches 15 seconds
          return 14; // Ensure it stays at 15
        }
        return prev + 1; // Increment time
      });
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [carouselIndex]); // Run effect when carouselIndex changes

  const tabs = [
    {
      name: "Anime",
      label: "Anime"
    },
    {
      name: "Manga",
      label: "Manga"
    },
    {
      name: "My List",
      label: "My List"
    }
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    tab: { name: string; label: string }
  ) => {
    e.preventDefault();
    setActiveTab(tab);
  };

  const isSelected = (tab: { name: string; label: string }) =>
    activeTab.name === tab.name;

  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchUrl = `/search/manga?search=${encodeURIComponent(searchTerm)}`;
    window.location.href = searchUrl;
  };

  const Month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef(null);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if ("touches" in e) {
      setTouchStart(e.touches[0].clientX);
    } else {
      setTouchStart(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if ("touches" in e) {
      setTouchEnd(e.touches[0].clientX);
    } else {
      setTouchEnd(e.clientX);
    }
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left
      nextSlide();
    }

    if (touchStart - touchEnd < -100) {
      // Swipe right
      prevSlide();
    }

    // Reset values
    setTouchStart(0);
    setTouchEnd(0);
  };

  const [showTrailer, setShowTrailer] = useState(true);

  useEffect(() => {
    // Load showTrailer setting from localStorage
    const storedShowTrailer = localStorage.getItem("showTrailer");
    setShowTrailer(storedShowTrailer !== "false");
  }, []);

  const fetchAnimeLogo = async (aniListId: number) => {
    try {
      const response = await fetch(
        `https://api.ani.zip/mappings?anilist_id=${aniListId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch logo");
      }
      const data = await response.json();
      if (data.images) {
        // Check if images exist before trying to access it
        const clearLogo = data.images.find(
          (image: any) => image.coverType === "Clearlogo"
        );
        if (clearLogo) {
          setAnimeLogo(clearLogo.url);
        } else {
          console.error(
            "Clearlogo not found in the response data, trying TVDB API"
          );
          // If Clearlogo is not found, try using the mapped TVDB ID
          const tvdbId = data.mappings.thetvdb_id;
          if (tvdbId) {
            const tvdbResponse = await fetch(
              `https://api.thetvdb.com/v4/series/${tvdbId}/images`,
              {
                headers: {
                  Authorization: "Bearer 4c83f4ff-e376-4a81-abfb-9252313a3f2a"
                }
              }
            );
            if (!tvdbResponse.ok) {
              throw new Error("Failed to fetch logo from TVDB");
            }
            const tvdbData = await tvdbResponse.json();
            const tvdbClearLogo = tvdbData.data.find(
              (image: any) => image.coverType === "Clearlogo"
            );
            if (tvdbClearLogo) {
              setAnimeLogo(tvdbClearLogo.url);
            } else {
              console.error("Clearlogo not found in TVDB response");
              setAnimeLogo(""); // Clear the logo if no valid logo is found
            }
          } else {
            console.error("No TVDB ID found in the response data");
            setAnimeLogo(""); // Clear the logo if no TVDB ID is found
          }
        }
      } else {
        console.error("No images found in the response data");
        setAnimeLogo(""); // Clear the logo if no images are found
      }
    } catch (error) {
      console.error("Error fetching anime logo:", error);
      setAnimeLogo(""); // Clear the logo if there's an error
    }
  };

  useEffect(() => {
    if (trendData[carouselIndex]?.id) {
      fetchAnimeLogo(trendData[carouselIndex].id);
    } else {
      setAnimeLogo(""); // Clear the logo if the anime is not related to the index
    }
  }, [carouselIndex]);

  useEffect(() => {
    if (tmdbId) {
      fetchAnimeLogo(tmdbId);
    } else {
      setAnimeLogo(""); // Clear the logo if tmdbId is not available
    }
  }, [tmdbId]);

  // State to track if the logo should be displayed
  const [displayLogo, setDisplayLogo] = useState(false);

  useEffect(() => {
    if (animeLogo && animeLogo.trim() !== "") {
      setDisplayLogo(true); // Show logo if it exists
    } else {
      setDisplayLogo(false); // Hide logo if it doesn't exist or is empty
    }
  }, [animeLogo, carouselIndex]); // Added carouselIndex to ensure logo is hidden on index change

  return (
    <Fragment>
      <Head>
        <title>1Anime</title>
        <meta charSet="UTF-8"></meta>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://1Anime.co/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="description"
          content="Discover your new favorite anime or manga title! 1Anime offers a vast library of high-quality content, accessible on multiple devices and without any interruptions. Start using 1Anime today!"
        />
        <meta
          name="keywords"
          content="anime, anime streaming, anime streaming website, anime streaming free, anime streaming website free, anime streaming website free english subbed, anime streaming website free english dubbed, anime streaming website free english subbed and dubbed, anime streaming webs
          ite free english subbed and dubbed download, anime streaming website free english subbed and dubbed"
        />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://1Anime.co/" />
        <meta
          property="og:title"
          content="1Anime - Free Anime and Manga Streaming"
        />
        <meta
          property="og:description"
          content="Discover your new favorite anime or manga title! 1Anime offers a vast library of high-quality content, accessible on multiple devices and without any interruptions. Start using 1Anime today!"
        />
        <meta property="og:image" content="https://1anime.app/banner.jpg" />
        <meta property="og:site_name" content="1Anime" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="1Anime - Free Anime and Manga Streaming"
        />
        <meta
          name="twitter:description"
          content="Discover your new favorite anime or manga title! 1Anime offers a vast library of high-quality content, accessible on multiple devices and without any interruptions. Start using 1Anime today!"
        />
        <meta name="twitter:image" content="https://1anime.app/banner.jpg" />
      </Head>
      <div className="h-auto min-w-screen bg-primary text-[#dbdcdd] relative z-40 overflow-x-hidden">
        <div className="relative z-10">
          {" "}
          {/* Added z-index to ensure Navbar is above the carousel */}
          <Navbar
            home={true}
            withNav
            toTop
            shrink
            bgHover
            scrollP={110}
            paddingY={"py-1"}
          />
          {error && (
            <div className="text-red-500 text-center mt-4">
              <p>
                There was an error fetching data from AniList. Displaying
                Temporary data instead.
              </p>
            </div>
          )}
        </div>
        {/* Hero Section */}
        <div className="relative -mt-16 mb-4">
          {" "}
          {/* Adjusted negative margin to pull the section down a bit more */}
          <section className="relative h-[80vh] md:h-[85vh] lg:h-[90vh] rounded-3xl overflow-hidden w-full bg-primary">
            {" "}
            {/* Increased height for mobile and desktop */}
            <motion.div
              ref={carouselRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-[95%] h-full mx-auto rounded-3xl" // Increased width for better visibility
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onMouseDown={handleTouchStart}
              onMouseMove={handleTouchMove}
              onMouseUp={handleTouchEnd}
            >
              {/* Background Image/Video */}
              <div className="absolute inset-0 w-full h-full bg-secondary rounded-3xl">
                {" "}
                {/* Added rounded corners to the background */}
                {isClient && (
                  <div className="relative w-full h-full overflow-hidden">
                    {showTrailer && trendData[carouselIndex]?.trailer?.id ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${trendData[carouselIndex]?.trailer?.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trendData[carouselIndex]?.trailer?.id}`}
                        title="Trailer"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full rounded-3xl" // Set size to match bannerImage
                        style={{
                          filter: "brightness(0.4)",
                          objectFit: "cover"
                        }} // Ensure the trailer fits the section
                      ></iframe>
                    ) : (
                      <Image
                        src={
                          trendData[carouselIndex]?.bannerImage ||
                          trendData[carouselIndex]?.coverImage.extraLarge
                        }
                        alt={`cover ${trendData[carouselIndex]?.title?.english || trendData[carouselIndex]?.title?.romaji}`}
                        layout="fill"
                        objectFit="cover"
                        priority
                        className="absolute inset-0 w-full h-full object-cover rounded-3xl" // Added rounded corners to the image
                        style={{ filter: "brightness(0.4)" }}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center bg-gradient-to-t from-primary to-transparent rounded-3xl">
                {" "}
                {/* Added rounded corners to the overlay */}
                <div className="container mx-auto px-6 md:px-10 lg:px-20">
                  {" "}
                  {/* Increased padding for more space */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl w-full" // Set width to full while keeping max width
                  >
                    <h2 className="text-lg font-semibold text-gray-300 mb-2">
                      {" "}
                      {/* Increased text size */}
                      <span className="inline-flex items-center">
                        <FireIcon className="w-10 h-10 text-red-500 mr-2" />{" "}
                        {/* Increased icon size */}#
                        {trendData?.indexOf(trendData[carouselIndex]) + 1}{" "}
                        Trending
                      </span>
                    </h2>
                    {displayLogo && animeLogo ? ( // Show logo only if it exists and displayLogo is true
                      <Image
                        src={animeLogo}
                        alt="Anime Logo"
                        layout="responsive"
                        width={250} // Increased width
                        height={90} // Increased height
                        className="mb-3"
                      />
                    ) : (
                      <h1 className="text-4xl font-bold mb-3">
                        {" "}
                        {/* Increased text size */}
                        {trendData[carouselIndex]?.title?.english ||
                          trendData[carouselIndex]?.title?.romaji}
                      </h1>
                    )}
                    <div className="flex items-center space-x-3 mb-3">
                      {" "}
                      {/* Increased space */}
                      <span className="px-3 py-1 bg-secondary rounded-full text-sm">
                        {trendData[carouselIndex]?.format}
                      </span>{" "}
                      {/* Increased text size for mobile */}
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${trendData[carouselIndex]?.status === "RELEASING" ? "bg-green-600" : "bg-gray-600"}`}
                      >
                        {trendData[carouselIndex]?.status}
                      </span>
                      <span className="px-3 py-1 bg-secondary rounded-full text-sm">
                        {Month[trendData[carouselIndex]?.startDate?.month - 1]}{" "}
                        {trendData[carouselIndex]?.startDate?.year}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-3 line-clamp-2">
                      {" "}
                      {/* Increased margin and line clamp */}
                      {trendData[carouselIndex]?.description?.replace(
                        /<[^>]*>?/gm,
                        ""
                      )}
                    </p>
                    <div className="flex space-x-3">
                      {" "}
                      {/* Increased space */}
                      <a
                        href={`/anime/${trendData[carouselIndex]?.id || ""}`}
                        className="px-5 py-2 bg-primary text-white font-semibold rounded-full flex items-center space-x-2 hover:bg-primary-dark transition duration-300"
                      >
                        {" "}
                        {/* Made buttons larger */}
                        <FaPlay />
                        <span className="text-md">Watch Now</span>{" "}
                        {/* Increased text size for mobile */}
                      </a>
                      <a
                        href={`/anime/${trendData[carouselIndex]?.id || ""}`}
                        className="px-5 py-2 bg-gray-800 text-white font-semibold rounded-full flex items-center space-x-2 hover:bg-gray-700 transition duration-300"
                      >
                        <FaInfoCircle />
                        <span className="text-md">More Info</span>{" "}
                        {/* Increased text size for mobile */}
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
              {/* Navigation Arrows */}
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition duration-300"
              >
                <ChevronRightIcon className="w-8 h-8" />{" "}
                {/* Increased icon size */}
              </button>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-600">
                <div
                  className="h-full bg-white transition-all duration-1000" // Added transition for smooth effect
                  style={{ width: `${(currentTime / 14) * 100}%` }} // Progress bar width
                ></div>
              </div>
            </motion.div>
          </section>
        </div>
        {sessions && (
          <div className="flex items-center justify-center lg:bg-none mt-4 lg:mt-0 w-screen">
            <div className="lg:w-[85%] w-screen px-5 lg:px-0 lg:text-3xl flex items-center gap-3 text-xl font-bold font-Archivo">
              {" "}
              {/* Made greeting smaller */}
              {getGreetings() && (
                <>
                  {getGreetings()},
                  <h1 className="lg:hidden">{sessions?.user.name}</h1>
                </>
              )}
              <button
                onClick={() => signOut()}
                className="hidden text-center relative lg:flex justify-center group"
              >
                {sessions?.user.name}
                <span className="absolute text-sm z-50 w-20 text-center bottom-11 text-white shadow-lg opacity-0 bg-secondary p-1 rounded-md font-Archivo font-light invisible group-hover:visible group-hover:opacity-100 duration-300 transition-all">
                  Sign Out
                </span>
              </button>
            </div>
          </div>
        )}

        <div>
          <div className={styles.tabHeader}>
            {tabs.map((tab) => {
              // Only show "My List" tab if user is logged in
              if (tab.name === "My List" && !sessions) {
                return null;
              }
              return (
                <div
                  key={tab.name}
                  className={[
                    styles.tabItem,
                    isSelected(tab) ? styles.selected : ""
                  ].join(" ")}
                >
                  <button
                    className="text-white px-3 py-2 text-md font-archivo font-bold rounded transition-transform transform hover:scale-90 flex items-center space-x-2"
                    key={tab.name}
                    onClick={(e) => handleClick(e, tab)}
                  >
                    {tab.label}
                  </button>
                  {isSelected(tab) && (
                    <motion.div
                      layoutId="indicator"
                      className={styles.indicator}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.name || "empty"}
              initial="initial"
              animate="enter"
              exit="exit"
              transition={{
                duration: 0.3
              }}
            >
              {activeTab && activeTab.name === "Anime" && (
                <div className="lg:mt-16 mt-5 flex flex-col items-center">
                  <motion.div
                    className="w-screen flex-none lg:w-[95%] xl:w-[87%]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, staggerChildren: 0.2 }} // Add staggerChildren prop
                  >
                    {user &&
                      user?.length > 0 &&
                      user?.some((i) => i?.watchId) && (
                        <motion.section // Add motion.div to each child component
                          key="recentlyWatched"
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          viewport={{ once: true }}
                        >
                          <Content
                            ids="recentlyWatched"
                            section="Recently Watched"
                            userData={user}
                            userName={userSession?.name}
                            setRemoved={setRemoved}
                          />
                        </motion.section>
                      )}

                    {recommendations.length > 0 && (
                      <div className="space-y-4 lg:space-y-5 mb-5 lg:mb-10">
                        <div className="px-5">
                          <p className="text-sm lg:text-base">
                            Based on Your List
                            <br />
                            <span className="font-Archivo text-[20px] lg:text-3xl font-bold">
                              Recommendations
                            </span>
                          </p>
                        </div>
                        <UserRecommendation data={recommendations} />
                      </div>
                    )}

                    {/* SECTION 3 */}
                    {recentAdded?.length > 0 && (
                      <motion.section // Add motion.div to each child component
                        key="recentAdded"
                        initial={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <Content
                          ids="recentAdded"
                          section="Freshly Added"
                          data={recentAdded}
                        />
                      </motion.section>
                    )}

                    {/* SECTION 4 */}
                    {detail && (
                      <motion.section // Add motion.div to each child component
                        key="trendingAnime"
                        initial={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <Content
                          ids="trendingAnime"
                          section="Trending Now"
                          data={detail.data}
                        />
                      </motion.section>
                    )}
                    {/* <div className="w-full h-[150px] bg-white flex-center my-5 text-black">
           ad banner
         </div> */}

                    <FeaturedSection />

                    {/* Schedule */}
                    {anime.length > 0 && (
                      <motion.section // Add motion.div to each child component
                        key="schedule"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <Schedule
                          data={anime[0]}
                          anime={anime}
                          update={update}
                          scheduleData={schedules}
                        />
                      </motion.section>
                    )}

                    {/* SECTION 5 */}
                    {popular && (
                      <motion.section // Add motion.div to each child component
                        key="popularAnime"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <Content
                          ids="popularAnime"
                          section="Popular Anime"
                          data={popular}
                        />
                      </motion.section>
                    )}

                    <motion.section // Add motion.div to each child component
                      key="Genres"
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <Genres />
                    </motion.section>

                    <AnimeSchedule schedule={schedule} />

                    {/* SECTION 6 */}
                    {seasonal && (
                      <motion.section // Add motion.div to each child component
                        key="Seasonal"
                        initial={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <Content
                          ids="Seasonal"
                          section="Trending This Season"
                          data={seasonal.data}
                        />
                      </motion.section>
                    )}

                    {/* SECTION 7 */}
                    {nextSeasonal && (
                      <motion.section // Add motion.div to each child component
                        key="NextSeasonal"
                        initial={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <Content
                          ids="NextSeasonal"
                          section="Next Season"
                          data={nextSeasonal.data}
                        />
                      </motion.section>
                    )}
                    {/* SECTION 8 */}
                    {previousSeasonal && ( // Added previous season section
                      <motion.section // Add motion.div to each child component
                        key="PreviousSeasonal"
                        initial={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <Content
                          ids="PreviousSeasonal"
                          section="Previous Season"
                          data={previousSeasonal.data}
                        />
                      </motion.section>
                    )}
                    {/* SECTION 9 */}
                    {popularMovies && (
                      <motion.section // Add motion.div to each child component
                        key="PopularMovies"
                        initial={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <Content
                          ids="PopularMovies"
                          section="Popular Movies"
                          data={popularMovies.data}
                        />
                      </motion.section>
                    )}

                    <RandomSection />
                  </motion.div>
                </div>
              )}

              {activeTab.name === "Manga" && (
                <div className={styles.detailscard}>
                  {" "}
                  <section className="py-14 max-w-screen-xl mx-auto">
                    <div className="relative overflow-hidden mx-4 px-4 py-14 rounded-2xl bg-blue-600 md:px-8 md:mx-8">
                      <div className="relative z-10 max-w-xl mx-auto sm:text-center">
                        <div className="space-y-3">
                          <h3 className="text-3xl text-white font-bold">
                            Manga Discovery page isn't available for now
                          </h3>
                          <p className="text-blue-100 leading-relaxed">
                            Try searching for a manga instead.
                          </p>
                        </div>
                        <div className="mt-6">
                          <form
                            onSubmit={handleSubmit}
                            className="flex items-center justify-center bg-white rounded-lg p-1 sm:max-w-md sm:mx-auto"
                          >
                            <input
                              type="search"
                              placeholder="Search any Manga"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="text-gray-500 w-full p-2 outline-none"
                            />
                            <button
                              type="submit"
                              className="p-2 px-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 duration-150 outline-none shadow-md focus:shadow-none sm:px-4"
                            >
                              Search
                            </button>
                          </form>
                          <p className="mt-3 max-w-lg text-[15px] text-blue-100 sm:mx-auto">
                            Enjoy! - 1Anime Development Team
                          </p>
                        </div>
                      </div>
                      <div
                        className="absolute inset-0 w-full h-full"
                        style={{
                          background:
                            "linear-gradient(268.24deg, rgba(59, 130, 246, 0.76) 50%, rgba(59, 130, 246, 0.545528) 80.61%, rgba(55, 48, 163, 0) 117.35%)"
                        }}
                      ></div>
                    </div>
                  </section>
                </div>
              )}
              {activeTab.name === "My List" && (
                <div className="lg:mt-16 mt-5 flex flex-col items-center">
                  <motion.div
                    className="w-screen flex-none lg:w-[95%] xl:w-[87%]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, staggerChildren: 0.2 }} // Add staggerChildren prop
                  >
                    {sessions && releaseData?.length > 0 && (
                      <motion.section // Add motion.div to each child component
                        key="onGoing"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <Content
                          ids="onGoing"
                          section="On-Going Anime"
                          data={releaseData}
                          og={prog}
                          userName={userSession?.name}
                        />
                      </motion.section>
                    )}

                    {sessions && listAnime && listAnime?.length > 0 && (
                      <motion.section // Add motion.div to each child component
                        key="listAnime"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <Content
                          ids="listAnime"
                          section="Your Watch List"
                          data={listAnime}
                          og={prog}
                          userName={userSession?.name}
                        />
                      </motion.section>
                    )}

                    {sessions && listManga && listManga?.length > 0 && (
                      <motion.section // Add motion.div to each child component
                        key="listManga"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <Content
                          ids="listManga"
                          section="Your Manga List"
                          data={listManga}
                          // og={prog}
                          userName={userSession?.name}
                        />
                      </motion.section>
                    )}
                    {/* SECTION 2 */}
                    {sessions && planned && planned?.length > 0 && (
                      <motion.section // Add motion.div to each child component
                        key="plannedAnime"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <Content
                          ids="plannedAnime"
                          section="Your Plan"
                          data={planned}
                          userName={userSession?.name}
                        />
                      </motion.section>
                    )}
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
}

export interface CurrentMediaTypes {
  status?: string;
  name: string;
  entries: Entry[];
}

export interface Entry {
  id: number;
  mediaId: number;
  status: string;
  progress: number;
  score: number;
  media: Media;
}

export interface Media {
  id: number;
  status: string;
  nextAiringEpisode: any;
  title: Title;
  episodes: number;
  coverImage: CoverImage;
  chapters: number;
}

export interface Title {
  english: string;
  romaji: string;
}

export interface CoverImage {
  large: string;
}

export interface UserDataType {
  id: string;
  name: string;
  setting: Setting;
  WatchListEpisode: WatchListEpisode[];
}

export interface Setting {
  CustomLists: boolean;
}

export interface WatchListEpisode {
  id: string;
  aniId?: string;
  title?: string;
  aniTitle?: string;
  image?: string;
  episode?: number;
  timeWatched?: number;
  duration?: number;
  provider?: string;
  nextId?: string;
  nextNumber?: number;
  dub?: boolean;
  createdDate: string;
  userProfileId: string;
  watchId: string;
}
