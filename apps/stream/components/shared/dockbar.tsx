import { useSearch } from "@/lib/context/isOpenState";
import { getCurrentSeason } from "@/utils/getTimes";
import {
  ArrowLeftIcon,
  ArrowUpCircleIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  HomeIcon,
  MapIcon,
  BookOpenIcon,
  ExclamationTriangleIcon,
  VideoCameraIcon,
  BookmarkIcon,
  BellIcon
} from "@heroicons/react/24/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AniListInfoTypes } from "types/info/AnilistInfoTypes";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Usernotifications } from "@/lib/AnilistUser";
import { NotificationTime } from "@/utils/TimeFunctions";
import { parseString } from "xml2js";
import Notifications from "@/components/Notifications";

const getScrollPosition = (el: Window | Element = window) => {
  if (el instanceof Window) {
    return { x: el.pageXOffset, y: el.pageYOffset };
  } else {
    return { x: el.scrollLeft, y: el.scrollTop };
  }
};

type NavbarProps = {
  info?: AniListInfoTypes | null;
  scrollP?: number;
  toTop?: boolean;
  withNav?: boolean;
  paddingY?: string;
  home?: boolean;
  back?: boolean;
  manga?: boolean;
  shrink?: boolean;
  bgHover?: boolean;
};

type Notification = {
  context: string;
  createdAt: number;
};

type Announcement = {
  title: string;
  link: string;
  pubDate: string;
};

export function Navbar({
  info = null,
  scrollP = 200,
  toTop = false,
  withNav = false,
  paddingY = "py-3",
  home = false,
  back = false,
  manga = true,
  shrink = false,
  bgHover = false
}: NavbarProps) {
  const { data: session }: { data: any } = useSession();
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState<
    { x: number; y: number } | undefined
  >();
  const { setIsOpen } = useSearch();

  const year = new Date().getFullYear();
  const season = getCurrentSeason();

  const [clickCount, setClickCount] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isDockVisible, setIsDockVisible] = useState<boolean>(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(getScrollPosition());
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setHasMounted(true);

    const storedVisibility = localStorage.getItem("dockVisibility");
    if (storedVisibility !== null) {
      setIsDockVisible(JSON.parse(storedVisibility));
    }
  }, []);

  const toggleDock = () => {
    const newVisibility = !isDockVisible;
    setIsDockVisible(newVisibility);
    localStorage.setItem("dockVisibility", JSON.stringify(newVisibility));
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session?.user?.token) return;

      setNotificationLoading(true);
      try {
        const response = await Usernotifications(session.user.token, 1);
        if (response?.notifications?.length > 0) {
          setNotifications(response.notifications.slice(0, 5)); // Show only the latest 5 notifications
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
      setNotificationLoading(false);
    };

    if (showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications, session]);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch("https://1anime.app/feed.rss", {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
          console.error("Failed to fetch RSS:", response.status);
          return;
        }
        const xmlText = await response.text();
        parseString(xmlText, (err, result) => {
          if (err) {
            console.error("Error parsing RSS:", err);
            return;
          }
          if (!result?.rss?.channel?.[0]?.item?.[0]) {
            console.error("Invalid RSS format:", result);
            return;
          }
          const latestItem = result.rss.channel[0].item[0];
          setAnnouncement({
            title: latestItem.title[0],
            link: latestItem.link[0],
            pubDate: latestItem.pubDate[0]
          });
        });
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Error fetching RSS:", error);
      }
    };

    fetchAnnouncement();
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-2xl">
          1Anime
        </Link>
        {session ? (
          <div className="w-7 h-7 relative flex flex-col items-center group shrink-0">
            <Link
              href={`/profile/${session?.user?.name}`}
              className="hover:text-action"
            >
              <Image
                src={session?.user?.image}
                alt="avatar"
                width={50}
                height={50}
                className="w-7 h-7 object-cover"
              />
            </Link>
            <div className="hidden absolute z-50 w-28 text-center -bottom-20 text-white shadow-2xl opacity-0 bg-secondary p-1 py-2 rounded-md font-Archivo font-light invisible group-hover:visible group-hover:opacity-100 duration-300 transition-all md:grid place-items-center gap-1">
              <Link
                href={`/profile/${session?.user?.name}`}
                className="hover:text-action"
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={() => signOut({ redirect: true })}
                className="hover:text-action"
              >
                Log out
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => signIn("AniListProvider")}
            title="Login With AniList"
            className="w-7 h-7 bg-white/30 rounded-full overflow-hidden shrink-0"
          >
            <Image
              className="h-7 w-7 rounded-full"
              width={0}
              height={0}
              quality={100}
              src={`https://avatar.vercel.sh/1`}
              alt="pfp"
            />
          </button>
        )}
        {!isDockVisible && (
          <button
            onClick={toggleDock}
            className="w-8 h-8 rounded-full bg-black text-white absolute right-20 flex-center z-50 transform -translate-y-1/2 top-1/2 "
          >
            <EyeIcon className="w-5 h-5" />
          </button>
        )}
      </header>
      <nav
        className={`hidden md:flex fixed dock bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-secondary rounded-full px-8 py-2 shadow-lg items-center justify-between w-[95%] max-w-xl ${bgHover ? "hover:bg-opacity-90" : ""} ${isDockVisible ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <ul className="flex items-center justify-between w-full relative">
          {/* Discover */}
          <li className="text-center group relative">
            <div className="flex flex-col items-center">
              <Link
                href="/discover"
                className="hover:text-action/80 transition-all duration-150 ease-linear"
              >
                <MapIcon className="w-6 h-6" />
              </Link>
              <span className="text-xs mt-1 hidden md:block">Discover</span>
            </div>
          </li>
          {/* Home */}
          <li className="text-center group relative">
            <div className="flex flex-col items-center">
              <Link
                href="/"
                className="hover:text-action/80 transition-all duration-150 ease-linear"
              >
                <HomeIcon className="w-6 h-6" />
              </Link>
              <span className="text-xs mt-1 hidden md:block">Home</span>
            </div>
          </li>

          {/* Schedule */}
          <li className="text-center group relative">
            <div className="flex flex-col items-center">
              <Link
                href="/schedule"
                className="hover:text-action/80 transition-all duration-150 ease-linear"
              >
                <CalendarIcon className="w-6 h-6" />
              </Link>
              <span className="text-xs mt-1 hidden md:block">Schedule</span>
            </div>
          </li>

          {/* Anime */}
          <li className="text-center">
            <div className="flex flex-col items-center">
              <Link
                href={`/search/anime?season=${season}&year=${year}`}
                className="hover:text-action/80 transition-all duration-150 ease-linear"
              >
                <VideoCameraIcon className="w-6 h-6" />
              </Link>
              <span className="text-xs mt-1 hidden md:block margin-dock">
                Anime
              </span>
            </div>
          </li>

          {/* Manga */}
          <li className="text-center">
            <div className="flex flex-col items-center">
              <Link
                href="/search/manga"
                className="hover:text-action/80 transition-all duration-150 ease-linear"
              >
                <BookOpenIcon className="w-6 h-6" />
              </Link>
              <span className="text-xs mt-1 hidden md:block margin-dock ">
                Manga
              </span>
            </div>
          </li>

          {/* My List */}
          <li className="text-center">
            <div className="flex flex-col items-center">
              <Link
                href={`/profile/${session?.user?.name}`}
                className="hover:text-action/80 transition-all duration-150 ease-linear"
              >
                <BookmarkIcon className="w-6 h-6" />
              </Link>
              <span className="text-xs mt-1 hidden md:block margin-dock">
                My List
              </span>
            </div>
          </li>

          {/* settings*/}
          <li className="text-center">
            <div className="flex flex-col items-center">
              <Link
                href={`/settings`}
                className="hover:text-action/80 transition-all duration-150 ease-linear"
              >
                <svg
                  className="w-6 h-6 size-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </Link>
              <span className="text-xs mt-1 hidden md:block margin-dock">
                Settings
              </span>
            </div>
          </li>

          {/* Search */}
          <li className="text-center">
            <button
              type="button"
              title="Search"
              className="hover:text-action/80 transition-all duration-150 ease-linear"
              onClick={() => setIsOpen(true)}
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
              <span className="text-xs mt-1 hidden md:block margin-dock">
                Search
              </span>
            </button>
          </li>

          {/* Top */}
          {toTop && (
            <li className="text-center">
              <button
                type="button"
                title="To Top"
                className="hover:text-action/80 transition-all duration-150 ease-linear"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <ArrowUpCircleIcon className="w-6 h-6" />
                <span className="text-xs mt-1 hidden md:block ">Top</span>
              </button>
            </li>
          )}

          <li className="text-center">
            <button
              type="button"
              title="Hide Dock"
              className="hover:text-action/80 transition-all duration-150 ease-linear"
              onClick={toggleDock}
            >
              <ArrowLeftIcon className="w-6 h-6" />
              <span className="text-xs mt-1 hidden md:block margin-dock">
                Hide
              </span>
            </button>
          </li>

          {/* Notifications */}
          <li className="text-center group relative">
            <div className="flex flex-col items-center">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="hover:text-action/80 transition-all duration-150 ease-linear"
                title="Notifications"
              >
                <BellIcon className="w-6 h-6" />
              </button>
              <span className="text-xs mt-1 hidden md:block">
                Notifications
              </span>
            </div>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-64 bg-secondary rounded-md shadow-lg overflow-hidden">
                <div className="p-2 bg-primary text-white font-semibold">
                  Notifications
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {/* Announcement */}
                  {announcement && (
                    <div className="p-2 bg-yellow-500 text-black">
                      <a
                        href={announcement.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        <p className="font-semibold">Announcement</p>
                        <p className="text-sm">{announcement.title}</p>
                        <p className="text-xs">
                          {new Date(announcement.pubDate).toLocaleString()}
                        </p>
                      </a>
                    </div>
                  )}

                  {/* User Notifications */}

                  {notificationLoading ? (
                    <div className="p-4 text-center">Loading...</div>
                  ) : (
                    <Notifications nav={true} session={session} />
                  )}
                </div>
                <div className="p-2 bg-primary text-center">
                  <Link
                    href="/notifications"
                    className="text-sm text-action hover:underline"
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
}
