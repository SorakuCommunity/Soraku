import { useSearch } from "@/lib/context/isOpenState";
import { getCurrentSeason } from "@/utils/getTimes";
import {
  ArrowLeftIcon,
  ArrowUpCircleIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  BookOpenIcon,
  Bars3BottomLeftIcon,
  PlayCircleIcon,
  BookmarkIcon,
  BellIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { AniListInfoTypes } from "types/info/AnilistInfoTypes";
import { Usernotifications } from "@/lib/AnilistUser";
import { NotificationTime } from "@/utils/TimeFunctions";
import { parseString } from "xml2js";
import dynamic from "next/dynamic";
import { RiCompassDiscoverLine } from "react-icons/ri";
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

// At the top of the file, add or modify these type definitions
type Notification = {
  context: string;
  createdAt: number;
  // Add other properties as needed
};

type Announcement = {
  title: string;
  link: string;
  pubDate: string;
};

// Add this helper function at the top of your file
function ensureFullUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://1anime.app${url.startsWith("/") ? "" : "/"}${url}`;
}

const Dockbar = dynamic(() => import("./dockbar").then((mod) => mod.Navbar), {
  ssr: false
});
const OldNavbar = dynamic(
  () => import("./NavBarold").then((mod) => mod.Navbar as React.ComponentType),
  { ssr: false }
);

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
  const { setIsOpen } = useSearch();
  const { data: session }: { data: any } = useSession();
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState<
    { x: number; y: number } | undefined
  >();

  const year = new Date().getFullYear();
  const season = getCurrentSeason();
  const [hasMounted, setHasMounted] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [showSauce, setShowSauce] = useState(false); // Changed to false by default
  const [showSauceTooltip, setShowSauceTooltip] = useState(false);
  const sauceClickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const handleSauceClick = () => {
    if (sauceClickTimerRef.current) {
      clearTimeout(sauceClickTimerRef.current);
      sauceClickTimerRef.current = null;
      router.push("/hanime");
    } else {
      sauceClickTimerRef.current = setTimeout(() => {
        sauceClickTimerRef.current = null;
      }, 300); // 300ms double-click threshold
    }
  };

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
    const storedShowSauce = localStorage.getItem("showSauce");
    setShowSauce(storedShowSauce === "true");
  }, []);

  useEffect(() => {
    setHasMounted(true);

    const storedVisibility = localStorage.getItem("sidebarVisibility");
    if (storedVisibility !== null) {
      setIsSidebarVisible(JSON.parse(storedVisibility));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (sauceClickTimerRef.current) {
        clearTimeout(sauceClickTimerRef.current);
      }
    };
  }, []);

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
            link: ensureFullUrl(latestItem.link[0]),
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

  const toggleSidebar = () => {
    const newVisibility = !isSidebarVisible;
    setIsSidebarVisible(newVisibility);
    localStorage.setItem("sidebarVisibility", JSON.stringify(newVisibility));
  };

  const handleNavigationChange = (value: string) => {
    localStorage.setItem("navigationOption", value);
    if (value === "sidebar") {
      setIsSidebarVisible(true);
    } else if (value === "dockbar") {
      setIsSidebarVisible(false);
    } else if (value === "oldnavbar") {
      // Logic for old navbar if needed
    }
  };

  if (!hasMounted) {
    return null;
  }

  const navigationOption = localStorage.getItem("navigationOption");
  const useDockbar = navigationOption === "dockbar";
  const useOldNavbar = navigationOption === "oldnavbar";

  return useDockbar ? (
    <Dockbar />
  ) : useOldNavbar ? (
    <OldNavbar />
  ) : (
    <>
      {/* Top Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center ${
          (scrollPosition?.y ?? 0 >= scrollP + 80)
            ? "bg-primary px-4"
            : "py-4 px-6"
        } transition-all duration-200`}
      >
        <div
          className={`flex items-center h-full ${
            withNav ? `${home ? "" : "w-[20%]"} gap-8` : " w-full gap-4"
          }`}
        >
          {info ? (
            <>
              <button
                type="button"
                className="flex-center w-7 h-7 text-white"
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowLeftIcon className="w-full h-full" />
              </button>

              <span
                className={`font-inter font-semibold w-[50%] line-clamp-1 select-none ${
                  (scrollPosition?.y ?? 0 >= scrollP + 80)
                    ? "opacity-100"
                    : "opacity-0"
                } transition-all duration-200 ease-linear`}
              >
                {info.title.english}
              </span>
            </>
          ) : (
            <div className="flex items-center">
              <Link
                href="/"
                className="text-white font-bold text-2xl mr-2 md:hidden"
              >
                <Image
                  alt="1Anime"
                  src="https://1anime.app/logo.svg"
                  width={50}
                  height={50}
                  className="w-32 h-20"
                />
              </Link>
              {!isSidebarVisible && (
                <Link href="/" className="text-white font-bold text-2xl mr-2">
                  <Image
                    alt="1Anime"
                    src="https://1anime.app/logo.svg"
                    width={50}
                    height={50}
                    className="w-32 h-20"
                  />
                </Link>
              )}
              <button
                onClick={toggleSidebar}
                className="flex w-8 h-8 rounded-full bg-primary text-white flex-center hidden md:flex"
              >
                {isSidebarVisible ? null : (
                  <ChevronDoubleRightIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          )}
        </div>
        <div className="flex w-[20%] justify-end items-center gap-4 md:hidden">
          <button
            type="button"
            title="Search"
            onClick={() => setIsOpen(true)}
            className="flex-center w-[26px] h-[26px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 15l6 6m-11-4a7 7 0 110-14 7 7 0 010 14z"
              ></path>
            </svg>
          </button>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="md:hidden flex-center w-[26px] h-[26px]"
            >
              <BellIcon className="w-7 h-7" />
            </button>
            {/* Notifications Modal */}
            {showNotifications && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden w-80">
                  {" "}
                  {/* Updated width for a more modern look */}
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold flex justify-between items-center">
                    <span className="text-lg">Notifications</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-white hover:text-gray-300 transition duration-200"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {/* Announcement */}
                    {announcement && (
                      <div className="p-3 bg-yellow-400 text-black rounded-md mb-2">
                        <a
                          href={announcement.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          <p className="font-semibold">{announcement.title}</p>
                          <p className="text-sm">
                            {new Date(announcement.pubDate).toLocaleString()}
                          </p>
                        </a>
                      </div>
                    )}

                    {notificationLoading ? (
                      <div className="p-4 text-center text-gray-300">
                        Loading...
                      </div>
                    ) : (
                      <Notifications nav={true} session={session} />
                    )}
                  </div>
                  <div className="p-4 bg-gray-700 text-center rounded-b-lg">
                    <Link
                      href={`/notifications`}
                      className="text-sm text-blue-400 hover:underline"
                    >
                      View All Notifications
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          {session ? (
            <div className="w-7 h-7 relative flex flex-col items-center group shrink-0">
              <button
                type="button"
                onClick={() => router.push(`/profile/${session?.user?.name}`)}
                className="rounded-full w-7 h-7 bg-white/30 overflow-hidden"
              >
                <Image
                  src={session?.user?.image}
                  alt="avatar"
                  width={50}
                  height={50}
                  className="w-7 h-7 object-cover"
                />
              </button>
              <div className="hidden absolute z-50 w-28 text-center -bottom-20 text-white shadow-2xl opacity-0 bg-secondary p-1 py-2 rounded-md font-Archivo font-light invisible group-hover:visible group-hover:opacity-100 duration-300 transition-all md:grid place-items-center gap-1">
                <Link href={`/me`} className="hover:text-action">
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
              <UserIcon className="w-full h-full translate-y-1" />
            </button>
          )}
        </div>
      </header>
      <nav
        className={`hidden md:flex fixed top-0 left-0 transform z-40 bg-primary bg-opacity-60 rounded-r-lg px-4 py-2 shadow-lg items-center justify-between h-full pt-16 transition-all duration-200 ease-linear ${
          isSidebarVisible ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center justify-between h-full space-y-4">
          {/* Home */}
          <li className="items-center group relative">
            <Link
              href="/"
              className="flex items-center justify-center w-10 h-10 hover:bg-primary/30 rounded-full transition-all duration-150 ease-linear"
              title="Home"
            >
              <Image
                alt="1Anime"
                src="/favicon.ico"
                width={256}
                height={256}
                className="w-8 h-8"
              />
            </Link>
            <span className="absolute left-12 w-32 bg-gray-800 text-white text-xs rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Home
            </span>
          </li>

          {/* Discover */}
          <li className="items-center group relative">
            <Link
              href="/discover"
              className="flex items-center justify-center w-10 h-10 hover:bg-primary/30 rounded-full transition-all duration-150 ease-linear"
              title="Discover"
            >
              <RiCompassDiscoverLine className="w-6 h-6" />
            </Link>
            <span className="absolute left-12 w-32 bg-gray-800 text-white text-xs rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Schedule
            </span>
          </li>

          {/* Search */}
          <li className="items-center group relative">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center w-10 h-10 hover:bg-primary/30 rounded-full transition-all duration-150 ease-linear"
              title="Search"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
            <span className="absolute left-12 w-32 bg-gray-800 text-white text-xs rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Search
            </span>
          </li>

          {/* Notifications */}
          <li className="items-center group relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center justify-center w-10 h-10 hover:bg-primary/30 rounded-full transition-all duration-150 ease-linear"
              title="Notifications"
            >
              <BellIcon className="w-6 h-6" />
            </button>
            <span className="absolute left-12 w-32 bg-gray-800 text-white text-xs rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Notifications
            </span>
            {showNotifications && (
              <div className="absolute left-full ml-2 w-96 h-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden hidden md:block transition-transform transform scale-95 hover:scale-100">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg rounded-t-lg">
                  Notifications
                </div>
                <div className="max-h-80 overflow-y-auto p-2">
                  {announcement && (
                    <div className="p-3 bg-yellow-100 border-l-4 border-yellow-500 mb-2">
                      <a
                        href={announcement.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        <p className="font-semibold text-black">
                          {announcement.title}
                        </p>
                        <p className="text-sm text-gray-700">
                          {new Date(announcement.pubDate).toLocaleString()}
                        </p>
                      </a>
                    </div>
                  )}
                  {notificationLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      Loading notifications...
                    </div>
                  ) : (
                    <Notifications nav={true} session={session} />
                  )}
                </div>
                <div className="p-4 bg-gray-700 text-center rounded-b-lg">
                  <Link
                    href={`/notifications`}
                    className="text-sm text-white hover:underline"
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </li>

          {/* Schedule */}
          <li className="items-center group relative">
            <Link
              href="/schedule"
              className="flex items-center justify-center w-10 h-10 hover:bg-primary/30 rounded-full transition-all duration-150 ease-linear"
              title="Schedule"
            >
              <CalendarIcon className="w-6 h-6" />
            </Link>
            <span className="absolute left-12 w-32 bg-gray-800 text-white text-xs rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Schedule
            </span>
          </li>

          {/* Divider */}
          <li className="w-full border-b border-gray-600 my-2"></li>

          {/* Anime */}
          <li className="items-center group relative">
            <Link
              href={`/search/anime`}
              className="flex items-center justify-center w-10 h-10 hover:bg-primary/30 rounded-full transition-all duration-150 ease-linear"
              title="Anime"
            >
              <PlayCircleIcon className="w-6 h-6" />
            </Link>
            <span className="absolute left-12 w-32 bg-gray-800 text-white text-xs rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Anime
            </span>
          </li>

          {/* Manga */}
          <li className="items-center group relative">
            <Link
              href="/search/manga"
              className="flex items-center justify-center w-10 h-10 hover:bg-primary/30 rounded-full transition-all duration-150 ease-linear"
              title="Manga"
            >
              <BookOpenIcon className="w-6 h-6" />
            </Link>
            <span className="absolute left-12 w-32 bg-gray-800 text-white text-xs rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Manga
            </span>
          </li>
          {/* Divider */}
          <li className="w-full border-b border-gray-600 my-2"></li>

          {/* Settings */}
          <li className="items-center group relative">
            <Link
              href="/settings"
              className="flex items-center justify-center w-10 h-10 hover:bg-primary/30 rounded-full transition-all duration-150 ease-linear"
              title="Settings"
            >
              <Cog6ToothIcon className="w-6 h-6" />
            </Link>
            <span className="absolute left-12 w-32 bg-gray-800 text-white text-xs rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Settings
            </span>
          </li>

          {/* Sauce (18+) */}
          {showSauce && (
            <li className="items-center group relative">
              <button
                onClick={handleSauceClick}
                onMouseEnter={() => setShowSauceTooltip(true)}
                onMouseLeave={() => setShowSauceTooltip(false)}
                className="flex items-center justify-center w-10 h-10 hover:bg-primary/30 rounded-full transition-all duration-150 ease-linear"
                title="Sauce (18+)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {showSauceTooltip && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded transition-opacity duration-200">
                  Sauce (18+)
                  <br />
                  Double-click to open
                </span>
              )}
            </li>
          )}

          {/* Profile */}
          {session ? (
            <li className="items-center group relative">
              <button
                type="button"
                onClick={() => router.push(`/me`)}
                className="flex items-center justify-center w-10 h-10 hover:bg-primary/30 rounded-full transition-all duration-150 ease-linear"
                title="Profile"
              >
                <Image
                  src={session?.user?.image}
                  alt="avatar"
                  width={50}
                  height={50}
                  quality={100}
                  className="w-8 h-8 rounded-full"
                />
              </button>
              <span className="absolute left-12 w-32 bg-gray-800 text-white text-xs rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Profile
              </span>
            </li>
          ) : (
            <li className="items-center group relative">
              <button
                type="button"
                onClick={() => {
                  router.push("/login");
                }}
                title="Login"
                className="flex items-center justify-center w-10 h-10 hover:bg-primary/30 rounded-full transition-all duration-150 ease-linear"
              >
                <Image
                  className="h-8 w-8 rounded-full"
                  width={0}
                  height={0}
                  quality={100}
                  src={`https://avatar.vercel.sh/1`}
                  alt="pfp"
                />
              </button>
              <span className="absolute left-12 w-32 bg-gray-800 text-white text-xs rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Login
              </span>
            </li>
          )}
          <li className="text-center">
            <button
              type="button"
              title="Hide Dock"
              className="flex items-center justify-center w-10 h-10 hover:bg-primary/30 rounded-full transition-all duration-150 ease-linear"
              onClick={toggleSidebar}
            >
              <ChevronDoubleLeftIcon className="w-6 h-6" />
            </button>
            <span className="absolute left-12 w-32 bg-gray-800 text-white text-xs rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Hide Dock
            </span>
          </li>
        </ul>
      </nav>
    </>
  );
}
