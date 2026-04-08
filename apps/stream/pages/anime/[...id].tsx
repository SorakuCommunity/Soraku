import React from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Content from "@/components/home/content";
import Modal from "@/components/modal";
import { AnimatePresence, motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import AniList from "@/components/media/aniList";
import ListEditor from "@/components/listEditor";
import styles from "../detailstabs.module.css";
import DetailTop from "@/components/anime/mobile/topSection";
import AnimeEpisode from "@/components/anime/episode";
import { useAniList } from "@/lib/anilist/useAnilist";
import Footer from "@/components/shared/footer";
import { mediaInfoQuery } from "@/lib/graphql/query";
import Draggable from "react-draggable";
import Link from "next/link";
import pls from "@/utils/request/index";
import Reviews from "@/components/anime/reviews";
import Characters from "@/components/anime/charactersCard";
import { redis, safeRedisGet, safeRedisSet } from "@/lib/redis";
import { toast } from "sonner";
import { Navbar } from "@/components/shared/NavBar";
import { AniListInfoTypes } from "types/info/AnilistInfoTypes";

type InfoTypes = {
  info: AniListInfoTypes;
  color: string;
  api: string;
  chapterNotFound: string;
};

interface Info {
  genres?: string[];
}

export default function Info({ info, color, chapterNotFound }: InfoTypes) {
  const { data: session }: any = useSession();
  const { getUserLists } = useAniList(session);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [statuses, setStatuses] = useState<any>(null);
  const [domainUrl, setDomainUrl] = useState("");
  const [watch, setWatch] = useState<string>();

  const [open, setOpen] = useState(false);
  const { id } = useRouter().query;
  const router = useRouter();

  const rec = info?.recommendations?.nodes?.map(
    (data) => data.mediaRecommendation
  );

  useEffect(() => {
    if (chapterNotFound) {
      toast.error("Source not found");
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState(null, "", cleanUrl);
    }
  }, [chapterNotFound]);

  useEffect(() => {
    handleClose();
    async function fetchData() {
      setLoading(true);
      if (id) {
        try {
          setDomainUrl(window.location.origin);

          setProgress(0);
          setStatuses(null);

          if (session?.user?.name) {
            const res = await getUserLists(info.id);
            const user = res?.data?.Media?.mediaListEntry;

            if (user) {
              setProgress(user.progress);
              const statusMapping: {
                [key: string]: { name: string; value: string };
              } = {
                CURRENT: { name: "Watching", value: "CURRENT" },
                PLANNING: { name: "Plan to watch", value: "PLANNING" },
                COMPLETED: { name: "Completed", value: "COMPLETED" },
                DROPPED: { name: "Dropped", value: "DROPPED" },
                PAUSED: { name: "Paused", value: "PAUSED" },
                REPEATING: { name: "Rewatching", value: "REPEATING" }
              };
              setStatuses(statusMapping[user.status]);
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, info, session?.user?.name]);

  function handleOpen() {
    setOpen(true);
    document.body.style.overflow = "hidden";
  }

  function handleClose() {
    setOpen(false);
    document.body.style.overflow = "auto";
  }
  const [showAll, setShowAll] = useState(false);

  const tabs = [
    {
      name: "Watch",
      label: "Watch"
    },
    {
      name: "Reviews",
      label: "Reviews"
    },
    {
      name: "Characters",
      label: "Characters"
    },
    {
      name: "Related",
      label: "Related"
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

  // New state to control the visibility of the floating indicator
  const [showIndicator, setShowIndicator] = useState(false);

  // Function to handle scroll and show/hide the indicator
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, clientWidth, scrollWidth } = e.currentTarget;
    setShowIndicator(scrollLeft + clientWidth < scrollWidth);
  };

  return (
    <>
      <Head>
        <title>
          {info
            ? info?.title?.romaji || info?.title?.english
            : "Retrieving Data..."}
        </title>
        <meta
          name="title"
          content={info?.title?.romaji}
          data-title-romaji={info?.title?.romaji}
          data-title-english={info?.title?.english}
          data-title-native={info?.title?.native}
        />
        <meta name="description" content={info.description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`1Anime - ${info.title.romaji || info.title.english}`}
        />
        <meta
          name="twitter:description"
          content={`${info.description?.slice(0, 180)}...`}
        />
        <meta
          name="twitter:image"
          content={`${domainUrl}/api/og?info=${encodeURIComponent(
            JSON.stringify({
              title: {
                english: info.title.english,
                romaji: info.title.romaji,
                native: info.title.native
              },
              coverImage: {
                extraLarge: info.coverImage.extraLarge,
                large: info.coverImage.large
              },
              bannerImage: info.bannerImage,
              averageScore: info.averageScore,
              genres: info.genres
            })
          )}`}
        />
      </Head>
      <Navbar info={info} toTop />
      <Modal open={open} onClose={() => handleClose()}>
        <div>
          {!session && (
            <div className="flex-center flex-col gap-5 px-10 py-5 bg-secondary rounded-md">
              <div className="text-md font-extrabold font-Archivo">
                Edit your list
              </div>
              <button
                className="flex items-center bg-[#363642] rounded-md text-white p-1"
                onClick={() => signIn("AniListProvider")}
              >
                <h1 className="px-1 font-bold font-Archivo">
                  Login with AniList
                </h1>
                <div className="scale-[60%] pb-[1px]">
                  <AniList />
                </div>
              </button>
            </div>
          )}
          {session && info && (
            <ListEditor
              animeId={info?.id}
              session={session}
              stats={statuses?.value}
              prg={progress}
              max={info?.episodes}
              info={info}
              close={handleClose}
            />
          )}
        </div>
      </Modal>

      <main className="w-screen min-h-screen relative flex flex-col items-center bg-primary gap-5">
        <div className="w-screen absolute">
          <div className="bg-gradient-to-t from-primary from-10% to-transparent absolute h-[280px] w-screen z-10 inset-0" />
          {info?.bannerImage && (
            <Image
              src={info?.bannerImage}
              alt="banner anime"
              height={1000}
              width={1000}
              blurDataURL={info?.bannerImage}
              className="object-cover bg-image blur-[2px] w-screen absolute top-0 left-0 h-[250px] brightness-[55%] z-0"
            />
          )}
        </div>
        <div className="w-full lg:max-w-screen-lg xl:max-w-screen-2xl z-30 flex flex-col gap-5 px-4 md:px-8 lg:px-12">
          <DetailTop
            info={info}
            handleOpen={handleOpen}
            statuses={statuses}
            watchUrl={watch}
            progress={progress || 0}
            color={color}
          />

          <div className={styles.tabHeaderWrapper}>
            <div
              className="overflow-y-hidden overflow-x-scroll snap-x snap-proximity scrollbar-none relative"
              onScroll={handleScroll}
            >
              <div className={styles.tabHeader}>
                {tabs.map((tab) => (
                  <div
                    key={tab.name}
                    className={[
                      styles.tabItem,
                      isSelected(tab) ? styles.selected : "",
                      ""
                    ].join(" ")}
                  >
                    <button
                      className="text-white px-2 py-2 text-md font-archivo font-bold rounded bg-primary transition-transform transform hover:scale-90 flex items-center space-x-1" // Reduced padding and space between items
                      onClick={(e) => handleClick(e, tab)}
                    >
                      {tab.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
              {activeTab && activeTab.name === "Watch" && (
                <AnimeEpisode
                  info={info}
                  session={session}
                  progress={progress}
                  setProgress={setProgress}
                  setWatch={setWatch}
                />
              )}
              {activeTab.name === "Reviews" && (
                <div>
                  <Reviews id={info?.id} /> {/* Passing the ID as a prop */}
                </div>
              )}

              {activeTab.name === "Characters" && (
                <div className="w-full">
                  <Characters info={info?.characters?.edges} />
                </div>
              )}
              {activeTab.name === "Related" && (
                <motion.div
                  className="w-screen flex-none lg:w-[95%] xl:w-[87%] bg-primary p-4 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, staggerChildren: 0.2 }}
                >
                  {info && info?.relations?.edges?.length > 0 && (
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold font-Archivo">
                          Relations
                        </h2>
                        {info?.relations?.edges?.length > 3 && (
                          <button
                            className="text-action font-Archivo hover:underline"
                            onClick={() => setShowAll(!showAll)}
                          >
                            {showAll ? "Show less" : "Show more"}
                          </button>
                        )}
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {info?.relations?.edges
                          .slice(0, showAll ? info?.relations?.edges.length : 3)
                          .map((r, index) => {
                            const rel = r.node;
                            const isNextOrPrevSeason =
                              r.relationType === "SEQUEL" ||
                              r.relationType === "PREQUEL";
                            return (
                              <Link
                                key={rel.id}
                                href={
                                  rel.type === "ANIME" ||
                                  rel.type === "OVA" ||
                                  rel.type === "MOVIE" ||
                                  rel.type === "SPECIAL" ||
                                  rel.type === "ONA"
                                    ? `/anime/${rel.id}`
                                    : `/manga/${rel.id}`
                                }
                                className={`block ${
                                  rel.type === "MUSIC"
                                    ? "pointer-events-none opacity-50"
                                    : ""
                                }`}
                              >
                                <div
                                  className={`bg-secondary rounded-lg overflow-hidden shadow-md transition-all duration-200 ease-out hover:shadow-lg ${
                                    isNextOrPrevSeason
                                      ? "ring-2 ring-action"
                                      : ""
                                  }`}
                                >
                                  <div className="relative h-40">
                                    {rel &&
                                    rel.coverImage &&
                                    rel.coverImage.extraLarge ? (
                                      <Image
                                        src={rel.coverImage.extraLarge}
                                        alt={
                                          rel.id ? rel.id.toString() : "Unknown"
                                        }
                                        layout="fill"
                                        objectFit="cover"
                                      />
                                    ) : (
                                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                        <p className="text-gray-500">
                                          Image not available
                                        </p>
                                      </div>
                                    )}
                                    <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-sm font-bold">
                                      {r.relationType.replace(/_/g, " ")}
                                    </div>
                                  </div>
                                  <div className="p-4">
                                    <h3 className="font-Archivo font-bold text-lg line-clamp-2 mb-2">
                                      {rel.title.userPreferred}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                      {rel.format}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Seasons and Parts Section */}
        {info?.relations?.edges?.some((relation) => {
          const rel = relation.node as unknown as { [key: string]: any }; // Use a more flexible type to capture all properties
          return (
            rel.type === "ANIME" &&
            (rel.title.userPreferred.includes("Season") ||
              rel.title.userPreferred.includes("Part") ||
              rel.title.userPreferred.includes("VI") ||
              rel.title.userPreferred.includes("V") ||
              rel.title.userPreferred.includes("IV") ||
              rel.title.userPreferred.includes("III") ||
              rel.title.userPreferred.includes("II") ||
              rel.title.userPreferred.includes(""))
          );
        }) && (
          <div className="flex flex-col gap-2 ml-4">
            {" "}
            {/* Added margin-left to move it to the right */}
            <h2 className="text-xl font-bold">Seasons & Parts</h2>
            <div className="flex flex-wrap gap-2">
              {info.relations.edges
                .map((relation) => {
                  const rel = relation.node as unknown as {
                    [key: string]: any;
                  }; // Use a more flexible type to capture all properties

                  // Logic to determine if it's a season or part
                  const isSeasonOrPart =
                    rel.type === "ANIME" &&
                    (rel.title.userPreferred.includes("Season") ||
                      rel.title.userPreferred.includes("Part") ||
                      rel.title.userPreferred.includes("VI") ||
                      rel.title.userPreferred.includes("V") ||
                      rel.title.userPreferred.includes("IV") ||
                      rel.title.userPreferred.includes("III") ||
                      rel.title.userPreferred.includes("II") ||
                      rel.title.userPreferred.includes(""));

                  if (isSeasonOrPart) {
                    return (
                      <Link
                        key={rel.id}
                        href={
                          rel.type === "ANIME" ||
                          rel.type === "OVA" ||
                          rel.type === "MOVIE" ||
                          rel.type === "SPECIAL" ||
                          rel.type === "ONA"
                            ? `/anime/${rel.id}`
                            : `/manga/${rel.id}`
                        }
                        className="flex items-center bg-secondary rounded-md p-2 text-sm"
                      >
                        <span className="font-bold">
                          {rel.title.userPreferred}
                        </span>
                        {rel.title.english && (
                          <span className="ml-2 text-xs text-gray-500">
                            ({rel.title.english})
                          </span>
                        )}{" "}
                        {/* Display English title if available */}
                        <span className="ml-2 text-xs text-gray-500">
                          {rel.type}
                        </span>
                      </Link>
                    );
                  }
                  return null; // Ensure to return null if not a season or part
                })
                .filter(Boolean)}{" "}
              {/* Filter out any null values */}
            </div>
          </div>
        )}
        {info && rec?.length !== 0 && (
          <div className="w-full">
            <Content
              ids="recommendAnime"
              section="Recommendations"
              data={rec}
            />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps(ctx: any) {
  const { id, notfound } = ctx.query;

  const API_URI = process.env.NEXT_PUBLIC_SORAKU_URL || null;

  let cache, chapterNotFound;
  // Check if notfound is defined and truthy before using it
  if (notfound) {
    // create random id string
    chapterNotFound = Math.random().toString(36).substring(7);
  } else {
    chapterNotFound = null; // Ensure chapterNotFound is set to null if notfound is falsy
  }

  if (redis) {
    cache = await safeRedisGet(`anime:${id}`);
  }

  if (cache) {
    const { info, color } = JSON.parse(cache);
    return {
      props: {
        info,
        color,
        api: API_URI,
        chapterNotFound: chapterNotFound || null
      }
    };
  } else {
    const [resp] = await pls.post("https://graphql.anilist.co/", {
      // method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: JSON.stringify({
        query: mediaInfoQuery,
        variables: {
          id: id?.[0]
        }
      })
    });

    // const json = await resp.json();
    const data = resp?.data?.Media;

    const cacheTime = data?.nextAiringEpisode?.episode
      ? 60 * 10
      : 60 * 60 * 24 * 30;

    if (!data) {
      return {
        notFound: true
      };
    }

    const textColor = setTxtColor(data?.coverImage?.color);

    const color = {
      backgroundColor: `${data?.coverImage?.color || "#ffff"}`,
      color: textColor
    };

    if (redis) {
      await safeRedisSet(
        `anime:${id}`,
        JSON.stringify({
          info: data,
          color: color
        }),
        cacheTime
      );
    }

    return {
      props: {
        info: data,
        color: color,
        api: API_URI,
        chapterNotFound: chapterNotFound || null
      }
    };
  }
}

function getBrightness(hexColor: { match: (arg0: RegExp) => any[] }) {
  if (!hexColor) {
    return 200;
  }
  const rgb = hexColor
    .match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
    .slice(1)
    .map((x) => parseInt(x, 16));
  return (299 * rgb[0] + 587 * rgb[1] + 114 * rgb[2]) / 1000;
}

function setTxtColor(hexColor: { match: (arg0: RegExp) => any[] }) {
  const brightness = getBrightness(hexColor);
  return brightness < 150 ? "#fff" : "#000";
}
