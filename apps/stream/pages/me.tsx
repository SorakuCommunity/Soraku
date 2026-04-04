import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaUser,
  FaInfoCircle,
  FaCog,
  FaList,
  FaPalette,
  FaExclamationCircle,
  FaEnvelope,
  FaDownload,
  FaBell,
  FaSearch,
  FaRandom
} from "react-icons/fa";
import { GithubIcon, DiscordIcon, KofiIcon } from "@/components/shared/icons";
import MobileNav from "@/components/shared/MobileNav";
import { Navbar } from "@/components/shared/NavBar";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Me() {
  const [themeValue, setThemeValue] = useState("default"); // Initialize state for themeValue
  const { data: session } = useSession();
  const [showSauce, setShowSauce] = useState(false);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    // Access document.cookie only on the client side
    const selectedTheme = document.cookie
      .split("; ")
      .find((row) => row.startsWith("selectedTheme="));
    setThemeValue(selectedTheme ? selectedTheme.split("=")[1] : "default");

    const storedShowSauce = localStorage.getItem("showSauce");
    setShowSauce(storedShowSauce === "true");

    // Simulate loading for 5 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []); // Empty dependency array to run only once on mount

  const pageVariants = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 }
  };

  const greeting = session?.user?.name
    ? `Welcome back, ${session.user.name}!`
    : "Welcome to 1Anime!";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary text-white">
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    ); // Skeleton loading effect
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery) {
      window.location.href = `/search/anime?query=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <Navbar withNav={true} scrollP={5} shrink={true} />
      <MobileNav hideProfile={true} />

      <motion.div
        initial="initial"
        animate="animate"
        variants={pageVariants}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col items-center justify-center bg-primary text-white p-8 mt-16 rounded-lg shadow-lg"
      >
        <h1 className="text-5xl font-extrabold mb-6">{greeting}</h1>
        <div className="relative mb-6">
          <Link
            href={`/profile/${session?.user?.name}`}
            className="flex items-center relative z-10"
          >
            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt="Profile Picture"
                className="w-20 h-20 rounded-full border-4 border-yellow-400 mr-4 shadow-md"
              />
            )}
            <p className="text-xl font-semibold">
              {session?.user?.name || "Guest"}
            </p>
          </Link>
        </div>
        {/* Custom Ad Below Username */}
        <div className="bg-secondary text-primary p-4 rounded-lg mb-6">
          <p className="text-center">
            Check out our latest offers and updates!
          </p>
        </div>
        <p className="mt-4 text-sm">Version: 2.0-11.17</p>
        <div className="flex flex-col space-y-4 w-full max-w-md">
          <form onSubmit={handleSearch} className="flex items-center mb-6">
            <input
              type="text"
              placeholder="Advanced Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary px-4 py-2 rounded-lg border border-gray-300 flex-grow"
            />
            <button
              type="submit"
              className="ml-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FaSearch />
            </button>
            <Link
              href="/anime/random"
              className="ml-2 p-2 bg-secondary text-blue-600 rounded-lg hover:bg-gray-200 transition"
            >
              <FaRandom />
            </Link>
          </form>
          {session ? (
            <Link
              href={`/profile/${session?.user?.name}`}
              className="flex items-center bg-secondary text-primary px-5 py-3 rounded-lg hover:bg-gray-200 transition"
            >
              <FaUser className="mr-2 text-blue-600" /> Profile
            </Link>
          ) : null}
          <Link
            href="/notifications"
            className="flex items-center bg-secondary text-primary px-5 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            <FaBell className="mr-2 text-blue-600" /> Notifications
          </Link>
          <Link
            href="/settings"
            className="flex items-center bg-secondary text-primary px-5 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            <FaCog className="mr-2 text-blue-600" /> Settings
          </Link>
          <Link
            href="/status"
            className="flex items-center bg-secondary text-primary px-5 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            <FaExclamationCircle className="mr-2 text-blue-600" /> Status
          </Link>
          <Link
            href="/about"
            className="flex items-center bg-secondary text-primary px-5 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            <FaInfoCircle className="mr-2 text-blue-600" /> About Us
          </Link>
          {session && (
            <Link
              href="/my-list"
              className="flex items-center bg-secondary text-primary px-5 py-3 rounded-lg hover:bg-gray-200 transition"
            >
              <FaList className="mr-2 text-blue-600" /> My List
            </Link>
          )}
          <Link
            href="/anime/recently-watched"
            className="flex items-center bg-secondary text-primary px-5 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            <FaList className="mr-2 text-blue-600" /> Watch History
          </Link>
          <Link
            href="/settings"
            className="flex items-center bg-secondary text-primary px-5 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            <FaPalette className="mr-2 text-blue-600" /> Themes = {themeValue}
          </Link>
          <Link
            href="/contact"
            className="flex items-center bg-secondary text-primary px-5 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            <FaEnvelope className="mr-2 text-blue-600" /> Contact Support
          </Link>
          <Link
            href="/install"
            className="flex items-center bg-secondary text-primary px-5 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            <FaDownload className="mr-2 text-blue-600" /> Install App
          </Link>
          {showSauce && (
            <Link
              href="/sauce"
              className="flex items-center bg-secondary text-primary px-5 py-3 rounded-lg hover:bg-gray-200 transition"
            >
              <FaExclamationCircle className="mr-2 text-blue-600" /> Sauce (18+)
            </Link>
          )}
          <Link
            href="/discord"
            className="flex items-center bg-secondary text-primary px-5 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            <DiscordIcon className="mr-2 w-7 h-7" /> Join our Discord
          </Link>
          <Link
            href="/donate"
            className="flex items-center bg-secondary text-primary px-5 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            <KofiIcon className="mr-2 w-7 h-7" /> Donate/Support Us
          </Link>
          <Link
            href="/github"
            className="flex items-center bg-secondary text-primary px-5 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            <GithubIcon className="mr-2 w-7 h-7" /> GitHub
          </Link>
          <Link
            href="https://1anime.app/proxy/"
            className="flex items-center bg-secondary text-primary px-5 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            <FaList className="mr-2 text-blue-600" /> Official Domain List
          </Link>
        </div>
        <p className="mt-6 text-sm">
          Thank you for using 1Anime! Enjoy your stay! :3
        </p>
      </motion.div>
    </>
  );
}
