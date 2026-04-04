import "../styles/globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import MobileNav from "@/components/shared/MobileNav";
import { useRouter } from "next/router";
import { AnimatePresence, motion as m } from "framer-motion";
import NextNProgress from "nextjs-progressbar";
import { SessionProvider } from "next-auth/react";
import { SkeletonTheme } from "react-loading-skeleton";
import SearchPalette from "@/components/searchPalette";
import ShortcutModal from "@/components/ShortcutModal";
import { SearchProvider } from "@/lib/context/isOpenState";
import { WatchPageProvider } from "@/lib/context/watchPageProvider";
import { useState, useEffect } from "react";
import { unixTimestampToRelativeTime } from "@/utils/getTimes";
import { Toaster, toast } from "sonner";
import ChangeLogs from "../components/shared/changelogs";
import type { AppProps } from "next/app";
import ThemeManager from './ThemeManager';
import Head from 'next/head';
import { FiX, FiDownload } from 'react-icons/fi';
import Events from "../components/shared/events";
import axios from "axios";
import Skeleton from 'react-loading-skeleton'; // Import Skeleton

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showRefreshButton, setShowRefreshButton] = useState(false);
  const [randomFact, setRandomFact] = useState<string | null>(null);
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [isIncognitoMode, setIsIncognitoMode] = useState(false);
  const [isFactLoading, setIsFactLoading] = useState(true); // State for loading fact

  useEffect(() => {
    const handleRouteChange = () => {
      setIsLoading(true);
      setShowRefreshButton(false);
      if (loadingTimeout) clearTimeout(loadingTimeout);
      setLoadingTimeout(setTimeout(() => setShowRefreshButton(true), 10000));
      fetchRandomFact(); // Fetch random anime fact on route change
    };

    const handleRouteComplete = () => {
      setIsLoading(false);
      if (loadingTimeout) clearTimeout(loadingTimeout);
      setShowRefreshButton(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteComplete);
    router.events.on("routeChangeError", handleRouteComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", handleRouteComplete);
      router.events.off("routeChangeError", handleRouteComplete);
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, [router.events, loadingTimeout]);

  const fetchRandomFact = async () => {
    setIsFactLoading(true); // Start loading
    const url = "https://waifu.it/api/v4/fact";
    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: "MTI5NzY5NTYwNjEzOTEyOTkxMQ--.MTcyOTY3NDQ3NQ--.aaed1db1de",
        },
      });
      setRandomFact(data.fact);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFactLoading(false); // End loading
    }
  };

  useEffect(() => {
    async function getBroadcast() {
      try {
        const res = await fetch("/api/v2/admin/broadcast", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Broadcast-Key": "get-broadcast"
          }
        });
        const data = await res.json();
        const lastBroadcast = localStorage.getItem("lastBroadcastMessage");
        
        if (data?.show === true && (!lastBroadcast || lastBroadcast !== data.message)) {
          toast.message(`Announcement`, {
            position: "bottom-right",
            important: true,
            duration: Infinity,
            className: "font-Archivo",
            description: `${data.message} ${data?.startAt ? unixTimestampToRelativeTime(data.startAt) : ""}`,
            onDismiss: () => {
              localStorage.setItem("updateNoticeDismissed", "true");
            }
          });
          localStorage.setItem("lastBroadcastMessage", data.message); // Store the latest broadcast message
        }
      } catch (err) {
        console.log(err);
      }
    }
    getBroadcast();
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!localStorage.getItem("installPromptDismissed")) {
        setShowInstallPopup(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowInstallPopup(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleClosePopup = () => {
    setShowInstallPopup(false);
    localStorage.setItem("installPromptDismissed", "true");
  };

  useEffect(() => {
    const storedIncognitoMode = localStorage.getItem('incognitoMode');
    setIsIncognitoMode(storedIncognitoMode === 'true');
  }, []);

  useEffect(() => {
    if (isIncognitoMode) {
      document.title = '1Anime';
    }
  }, [isIncognitoMode]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="planet mt-4"></div>
          {isFactLoading ? ( // Show skeleton while loading fact
            <Skeleton count={1} height={20} className="text-white text-sm mt-2" />
          ) : (
            randomFact && <div className="text-white text-sm mt-2">Did you know: {randomFact}</div>
          )}
          {showRefreshButton && (
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-purple-600 text-white px-3 py-1.5 rounded hover:bg-purple-700 transition-colors"
            >
              Page didn't load? Refresh
            </button>
          )}
        </div>
      )}

      <Head>
        <title>{isIncognitoMode ? '1Anime' : '1Anime'}</title>
      </Head>
      <ThemeManager />
      <SessionProvider session={pageProps.session}>
        <SearchProvider>
          <WatchPageProvider>
            <AnimatePresence mode="wait">
              <SkeletonTheme baseColor="#232329" highlightColor="#2a2a32">
                <Toaster richColors theme="dark" closeButton />
                {showInstallPopup && (
                  <div className="fixed sm:bottom-4 sm:right-4 sm:max-w-sm w-full sm:w-auto top-0 left-0 right-0 sm:top-auto bg-primary p-4 rounded-b-lg sm:rounded-lg shadow-lg z-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">Install 1Anime</h3>
                      <button onClick={handleClosePopup} className="text-gray-400 hover:text-white sm:block hidden">
                        <FiX size={20} />
                      </button>
                    </div>
                    <p className="text-gray-300 mb-4">Get a faster, full-screen experience with our app.</p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={handleInstallClick}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                      >
                        <FiDownload className="mr-2" />
                        Install
                      </button>
                      <button
                        onClick={handleClosePopup}
                        className="sm:hidden flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                      >
                        <FiX className="mr-2" />
                        Close
                      </button>
                    </div>
                  </div>
                )}
                <m.div
                  key={`route-${router.route}`}
                  transition={{ duration: 0.5 }}
                  initial="initialState"
                  animate="animateState"
                  exit="exitState"
                  variants={{
                    initialState: {
                      opacity: 0
                    },
                    animateState: {
                      opacity: 1
                    },
                    exitState: {}
                  }}
                  className="z-50 w-screen"
                >
                  <NextNProgress
                    color="#FFFFFF"
                    startPosition={0.3}
                    stopDelayMs={200}
                    height={3}
                    showOnShallow={true}
                  />
                  <MobileNav hideProfile={true} />
                  <SearchPalette />
                  <ShortcutModal />
                  <Component {...pageProps} isIncognitoMode={isIncognitoMode} />
                </m.div>
                <ChangeLogs />
               {/* <Events /> */}
              </SkeletonTheme>
            </AnimatePresence>
          </WatchPageProvider>
        </SearchProvider>
      </SessionProvider>
    </>
  );
}
