// @ts-nocheck

import Image from "next/image";
import { cubicBezier, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import Loading from "@/components/shared/loading";
import { timeStamptoAMPM, timeStamptoHour } from "@/utils/getTimes";
import {
  filterFormattedSchedule,
  filterScheduleByDay,
  sortScheduleByDay,
  transformSchedule
} from "@/utils/schedulesUtils";

import { scheduleQuery } from "@/lib/graphql/query";

// Removed redis import to avoid build errors related to 'dns', 'net', and 'tls'
import Head from "next/head";
import { Navbar } from "@/components/shared/NavBar";

const day = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const isAired = (timestamp: number | null) => {
  if (!timestamp) return false;
  const currentTime = new Date().getTime() / 1000;
  return timestamp <= currentTime;
};

export const getScheduleProps = async () => {
  const now = new Date();
  const nowJapan = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const midnightTomorrowJapan = new Date(
    nowJapan.getFullYear(),
    nowJapan.getMonth(),
    nowJapan.getDate() + 1,
    0,
    0,
    0,
    0
  );
  const timeUntilMidnightJapan = Math.round(
    (midnightTomorrowJapan.getTime() - nowJapan.getTime()) / 1000
  );

  let cachedData = null;

  // Removed redis logic to avoid build errors
  // if (redis) {
  //   cachedData = await redis.get("new_schedule");
  // }

  if (cachedData) {
    const scheduleByDay = JSON.parse(cachedData);
    return {
      props: {
        schedule: scheduleByDay
      }
    };
  } else {
    now.setHours(0, 0, 0, 0);
    const dayInSeconds = 86400;
    const yesterdayStart = Math.floor(now.getTime() / 1000) - dayInSeconds;
    const weekStart = yesterdayStart;
    const weekEnd = weekStart + 604800;

    let page = 1;
    const airingSchedules = [];

    while (true) {
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          query: scheduleQuery,
          variables: {
            weekStart,
            weekEnd,
            page
          }
        })
      });

      const json = await res.json();
      const schedules = json.data.Page.airingSchedules;

      if (schedules.length === 0) {
        break;
      }

      airingSchedules.push(...schedules);
      page++;
    }

    const timestampToDay = (timestamp: number) => {
      return new Date(timestamp * 1000).toLocaleDateString(undefined, {
        weekday: "long"
      });
    };

    const scheduleByDay: { [key: string]: any } = {};
    airingSchedules.forEach((schedule) => {
      const day = timestampToDay(schedule.airingAt);
      if (!scheduleByDay[day]) {
        scheduleByDay[day] = [];
      }
      scheduleByDay[day].push(schedule);
    });

    // Removed redis logic to avoid build errors
    // if (redis) {
    //   await redis.set(
    //     "new_schedule",
    //     JSON.stringify(scheduleByDay),
    //     "EX",
    //     timeUntilMidnightJapan
    //   );
    // }

    return {
      props: {
        schedule: scheduleByDay
      }
    };
  }
};

export async function getServerSideProps() {
  return await getScheduleProps();
}

export default function Schedule({ schedule }: any) {
  const [filterDay, setFilterDay] = useState("All");
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState(1);
  const [nextAiringAnime, setNextAiringAnime] = useState(null);
  const [currentlyAiringAnime, setCurrentlyAiringAnime] = useState(null);

  useEffect(() => {
    setLoading(true);
    async function setDay() {
      const now = new Date();
      const today = day[now.getDay()];
      setFilterDay(today);
      setLoading(false);
    }
    setDay();
  }, []);

  const sortedSchedule = sortScheduleByDay(schedule);
  const formattedSchedule = transformSchedule(schedule);

  useEffect(() => {
    const now = new Date().getTime() / 1000;
    let nextAiring = null;
    let currentlyAiring = null;

    for (const [, schedules] of Object.entries(sortedSchedule as object)) {
      for (const s of schedules) {
        if (s.airingAt > now) {
          if (!nextAiring) {
            nextAiring = s.id;
          }
        } else if (s.airingAt + 1440 > now) {
          currentlyAiring = s.id;
        }
      }
      if (nextAiring && currentlyAiring) break;
    }

    setNextAiringAnime(nextAiring);
    setCurrentlyAiringAnime(currentlyAiring);
  }, [sortedSchedule]);

  const scrollContainerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeButton =
        scrollContainerRef.current?.querySelector(".text-action");
      if (activeButton) {
        const containerWidth = scrollContainerRef.current.clientWidth;
        const buttonLeft = (activeButton as HTMLElement).offsetLeft;
        const buttonWidth = activeButton.clientWidth;
        const scrollLeft = buttonLeft - containerWidth / 2 + buttonWidth / 2;
        scrollContainerRef.current.scrollLeft = scrollLeft;
      }
    }
  }, [filterDay]);

  return (
    <>
      <Head>
        <title>1Anime - Schedule</title>
        <meta
          name="description"
          content="Explore the latest anime schedules and airing times on 1Anime. Stay up-to-date with your favorite shows and discover new releases."
        />
        <meta
          name="keywords"
          content="anime schedule, airing times, upcoming anime, 1Anime, anime calendar"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="1Anime Team" />
        <meta name="url" content="https://1Anime.co/schedule" />
        <meta
          name="og:title"
          property="og:title"
          content="1Anime - Anime Schedule"
        />
        <meta
          name="og:description"
          property="og:description"
          content="Stay informed about anime release schedules and airing times with 1Anime's comprehensive calendar."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://1Anime.co/schedule" />
        <meta property="og:image" content="https://1anime.app/banner.jpg" />
        <meta property="og:image:alt" content="1Anime Schedule Banner" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="1Anime" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://1anime.app/banner.jpg" />
        <meta name="twitter:image:alt" content="1Anime Schedule Banner" />
        <meta name="twitter:title" content="1Anime - Anime Schedule" />
        <meta
          name="twitter:description"
          content="Explore upcoming anime releases and airing times with 1Anime's user-friendly schedule."
        />
      </Head>

      <Navbar withNav toTop shrink bgHover scrollP={110} paddingY={"py-1"} />
      <div className="bg-primary min-h-screen mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
            Anime Schedule
          </h1>

          <div className="bg-secondary rounded-lg shadow-lg p-2 sm:p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <ul
                ref={scrollContainerRef}
                className="flex overflow-x-auto pb-1 mb-2 sm:mb-0 gap-1 sm:gap-2 font-medium text-xs sm:text-sm w-full sm:w-auto"
              >
                <button
                  type="button"
                  onClick={() => setFilterDay("All")}
                  className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full transition-all duration-200 ease-out ${
                    filterDay === "All"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  All
                </button>
                {day.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setLoading(true);
                      setFilterDay(i);
                      setLoading(false);
                    }}
                    className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full transition-all duration-200 ease-out ${
                      filterDay === i
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {i.slice(0, 3)}
                  </button>
                ))}
              </ul>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => setLayout(1)}
                  className={`p-1 rounded-full transition-all duration-200 ease-out ${
                    layout === 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  <ClockIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayout(2)}
                  className={`p-1 rounded-full transition-all duration-200 ease-out ${
                    layout === 2
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Loading />
              </div>
            ) : layout === 1 ? (
              Object.entries(
                filterFormattedSchedule(formattedSchedule, filterDay)
              ).map(([day, timeSlots]) => (
                <div key={`section_${day}`} className="mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-3">
                    {day}
                  </h2>
                  {Object.entries(timeSlots).map(([time, animeList]) => (
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.2,
                        ease: cubicBezier(0.35, 0.17, 0.3, 0.86)
                      }}
                      key={time}
                      className="mb-4"
                    >
                      <div className="flex items-center gap-1 mb-2">
                        <div
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isAired(+time) ? "bg-green-500" : "bg-yellow-500"}`}
                        ></div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-200">
                          {time && timeStamptoAMPM(time)}
                        </h3>
                      </div>
                      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {animeList.map((s) => {
                          const m = s.media;
                          return (
                            <Link
                              key={m.id}
                              href={`/${m.type.toLowerCase()}/${m.id}`}
                              className="bg-secondary rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 ease-out"
                            >
                              <div className="relative pb-[56.25%]">
                                <Image
                                  src={m.coverImage.extraLarge}
                                  alt={m.title.english}
                                  layout="fill"
                                  objectFit="cover"
                                  className="absolute top-0 left-0"
                                />
                              </div>
                              <div className="p-2">
                                <h4 className="font-semibold text-white mb-1 line-clamp-1">
                                  {m.title.english}
                                </h4>
                                <p className="text-xs text-gray-300">
                                  Ep {s?.episode} -{" "}
                                  {timeStamptoHour(s.airingAt)}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))
            ) : (
              Object.entries(
                filterScheduleByDay(sortedSchedule, filterDay)
              ).map(([day, schedules]) => (
                <div key={`section2_${day}`} className="mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-3">
                    {day}
                  </h2>
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      ease: cubicBezier(0.35, 0.17, 0.3, 0.86)
                    }}
                    className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  >
                    {schedules.map((s) => {
                      const m = s.media;
                      return (
                        <Link
                          key={m.id}
                          href={`/${m.type?.toLowerCase()}/${m.id}`}
                          className={`bg-secondary rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 ease-out ${
                            s.id === nextAiringAnime
                              ? "ring-2 ring-blue-500"
                              : s.id === currentlyAiringAnime
                                ? "ring-2 ring-green-500"
                                : ""
                          }`}
                        >
                          <div className="relative pb-[56.25%]">
                            <Image
                              src={m.coverImage.extraLarge}
                              alt={m.title.english}
                              layout="fill"
                              objectFit="cover"
                              className="absolute top-0 left-0"
                            />
                            {s.id === nextAiringAnime && (
                              <span className="absolute top-1 right-1 bg-blue-500 text-white text-xs font-bold px-1 py-0.5 rounded-full">
                                Next Airing
                              </span>
                            )}
                            {s.id === currentlyAiringAnime && (
                              <span className="absolute top-1 right-1 bg-green-500 text-white text-xs font-bold px-1 py-0.5 rounded-full">
                                Airing Now
                              </span>
                            )}
                          </div>
                          <div className="p-2">
                            <h4 className="font-semibold text-white mb-1 line-clamp-1">
                              {m.title.english}
                            </h4>
                            <p className="text-xs text-gray-300">
                              Ep {s.episode} - {timeStamptoHour(s.airingAt)}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
