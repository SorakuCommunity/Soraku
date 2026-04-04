import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";
import { getUser } from "@/prisma/user";
import { toast } from "sonner";
import { Navbar } from "@/components/shared/NavBar";
import pls from "@/utils/request";
import { CurrentMediaTypes } from "..";
import Modal from "@/components/shared/Modal"; // Import Modal component
import { FaUserCog, FaCheckCircle, FaDonate, FaStar, FaUserShield } from 'react-icons/fa'; // Importing react-icons

type User = {
  bannerImage: string;
  avatar: any;
  name: string;
  createdAt: number;
  about: string;
  statistics: any;
  setting?: any; 
};

type MyListProps = {
  media: CurrentMediaTypes[];
  mangaMedia: CurrentMediaTypes[];
  sessions: any;
  user: User;
  time: any;
  userSettings: any;
};

type UserLists = {
  developers: string[];
  verifiedUsers: string[];
  donatorUsers: string[];
  silverDonators: string[];
  goldDonators: string[];
  diamondDonators: string[];
  staffUsers: string[];
};

export default function MyList({
  media,
  mangaMedia,
  sessions,
  user,
  time,
  userSettings,
}: MyListProps) {
  const [listFilter, setListFilter] = useState("all");
  const [visible, setVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });
  const [userLists, setUserLists] = useState<UserLists>({
    developers: [],
    verifiedUsers: [],
    donatorUsers: [],
    silverDonators: [],
    goldDonators: [],
    diamondDonators: [],
    staffUsers: [],
  });

  useEffect(() => {
    fetch('/verified.json')
      .then(response => response.json())
      .then(data => setUserLists(data))
      .catch(error => console.error('Error fetching user lists:', error));
  }, []);

  const filterMedia = (status: string) => {
    if (status === "all") {
      return media;
    }
    return media.filter((m: { name: string }) => m.name === status);
  };

  const handleBadgeClick = (type: string) => {
    let title = "";
    let content = "";

    switch (type) {
      case "developer":
        title = "Developer";
        content = "This user is a developer of our platform. (They are very cool)";
        break;
      case "verified":
        title = "Verified User";
        content = "This user is verified because they are an OG member.";
        break;
      case "donator":
        title = "Donator";
        content = "This user has generously donated to support our platform.";
        break;
      case "silverDonator":
        title = "Silver Donator";
        content = "This user has generously donated to support our platform.";
        break;
      case "goldDonator":
        title = "Gold Donator";
        content = "This user has generously donated to support our platform.";
        break;
      case "diamondDonator":
        title = "Diamond Donator";
        content = "This user has generously donated to support our platform.";
        break;
      case "staff":
        title = "Staff Member";
        content = "This user is a staff member of our platform.";
        break;
      default:
        return; // If the type is not recognized, don't open the modal
    }

    setModalContent({ title, content });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [mangaListFilter, setMangaListFilter] = useState("all");

  const filterMangaMedia = (status: string) => {
    if (status === "all") {
      return mangaMedia;
    }
    return mangaMedia.filter((m: { name: string }) => m.name === status);
  };

  useEffect(() => {
    document.title = `${user.name}'s Profile - 1Anime`;
  }, [user.name]);

  return (
    <>
      <Head>
        <meta name="description" content={`View ${user.name}'s anime and manga list, statistics, and achievements on 1Anime.`} />
        <meta property="og:image" content={user.avatar.large} />
      </Head>

      <Navbar withNav toTop shrink bgHover scrollP={110} paddingY={"py-1"} />

      <div className="w-screen lg:flex justify-between lg:px-10 xl:px-32 py-5 relative bg-primary">
        <div className="lg:w-[50%] h-full mt-12 lg:mr-10 grid gap-5 mx-3 lg:mx-0 antialiased">
          <div className="flex items-center gap-5">
            <Image
              src={user.avatar.large}
              alt="user avatar"
              width={1000}
              quality={100}
              height={1000}
              className="object-cover h-28 w-28 rounded"
            />
            {user.bannerImage ? (
              <Image
                src={user.bannerImage}
                alt="image"
                width={1000}
                height={1000}
                priority
                className="absolute w-screen h-[500px] object-cover -top-[7.75rem] left-0 -z-50 brightness-[65%]"
              />
            ) : (
              <div className="absolute w-screen h-[500px] object-cover -top-[7.75rem] left-0 -z-50 brightness-[65%] bg-image" />
            )}
            <div className="flex flex-col">
              <h1 className="font-Archivo font-bold text-2xl pt-7 flex items-center text-white">
                {user.name}
              </h1>
              <div className="flex flex-wrap bg-secondary rounded-lg items-center mt-2">
  {userLists.developers.includes(user.name) && (
    <div onClick={() => handleBadgeClick("developer")} className="cursor-pointer flex items-center mr-2 mb-2 text-3xl">
      <FaUserCog className="text-green-500" />
    </div>
  )}
  {userLists.verifiedUsers.includes(user.name) && (
    <div onClick={() => handleBadgeClick("verified")} className="cursor-pointer flex items-center mr-2 mb-2 text-3xl">
      <FaCheckCircle className="text-purple-500" />
    </div>
  )}
  {userLists.staffUsers.includes(user.name) && (
    <div onClick={() => handleBadgeClick("staff")} className="cursor-pointer flex items-center mr-2 mb-2 text-3xl">
      <FaUserShield className="text-blue-500" />
    </div>
  )}
                {userLists.donatorUsers.includes(user.name) && (
                  <div className="cursor-pointer flex items-center mr-2 mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full py-1 px-3 animate-pulse">
                    <span className="font-semibold">Donator</span>
                  </div>
                )}
                {userLists.silverDonators.includes(user.name) && (
                  <div className="cursor-pointer flex items-center mr-2 mb-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-full py-1 px-3 animate-pulse">
                    <span className="font-semibold">Silver Donator</span>
                  </div>
                )}
                {userLists.goldDonators.includes(user.name) && (
                  <div className="cursor-pointer flex items-center mr-2 mb-2 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white rounded-full py-1 px-3 animate-pulse">
                    <span className="font-semibold">Gold Donator</span>
                  </div>
                )}
                {userLists.diamondDonators.includes(user.name) && (
                  <div className="cursor-pointer flex items-center mr-2 mb-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full py-1 px-3 animate-pulse">
                    <span className="font-semibold">Diamond Donator</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2 text-sm font-Archivo text-white">
              Created At :
              <UnixTimeConverter unixTime={user.createdAt} />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const profileUrl = `${window.location.origin}/profile/${user.name}`;
                  navigator.clipboard.writeText(profileUrl);
                  toast.success("Profile link copied to clipboard!");
                }}
                className="flex items-center gap-2 p-1 px-2 ring-[1px] antialiased ring-txt rounded text-xs font-Archivo hover:bg-txt hover:shadow-lg group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:stroke-black">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                <span className="group-hover:text-black">Share Profile</span>
              </button>
              {sessions && user.name === sessions?.user.name ? (
                <Link
                  href={"https://anilist.co/settings/"}
                  className="flex items-center gap-2 p-1 px-2 ring-[1px] antialiased ring-txt rounded text-xs font-Archivo hover:bg-txt hover:shadow-lg group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 group-hover:stroke-black"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 018.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                    />
                  </svg>
                  <span className="group-hover:text-black">Edit Profile</span>
                </Link>
              ) : null}
            </div>
          </div>
          <div className="bg-secondary lg:min-h-[160px] text-xs rounded p-4 font-Archivo">
            <div>
              {user.about ? (
                <div dangerouslySetInnerHTML={{ __html: user.about }} />
              ) : (
                "No description created."
              )}
            </div>
          </div>

          <div className="bg-secondary font-Archivo rounded p-4 mb-4">
            <h2 className="text-lg font-bold mb-4">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user && (
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-yellow-500">
                    <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Otaku on 1Anime: Created a profile on 1Anime!</span>
                </div>
              )}
              {userLists.developers.includes(user.name) && (
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-500">
                    <path fillRule="evenodd" d="M14.447 3.027a.75.75 0 01.527.92l-4.5 16.5a.75.75 0 01-1.448-.394l4.5-16.5a.75.75 0 01.921-.526zM16.72 6.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 010-1.06zm-9.44 0a.75.75 0 010 1.06L2.56 12l4.72 4.72a.75.75 0 11-1.06 1.06L.97 12.53a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">1Anime Developer: Contributed to the development of 1Anime!</span>
                </div>
              )}
              {typeof user.statistics === 'object' && user.statistics.anime && user.statistics.anime.count >= 25 && (
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500">
                    <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Anime Weeb: Watched 25+ anime</span>
                </div>
              )}
              {typeof user.statistics === 'object' && user.statistics.anime && user.statistics.anime.count >= 50 && (
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-purple-500">
                    <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Anime Enthusiast: Watched 50+ anime</span>
                </div>
              )}
              {typeof user.statistics === 'object' && user.statistics.anime && user.statistics.anime.count >= 100 && (
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-500">
                    <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Basement Dweller: Watched 100+ anime</span>
                </div>
              )}
              {typeof user.statistics === 'object' && user.statistics.anime && user.statistics.anime.episodesWatched >= 1000 && (
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-pink-500">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Episode Master: Watched 1000+ episodes</span>
                </div>
              )}
              {typeof user.statistics === 'object' && user.statistics.anime && user.statistics.anime.minutesWatched >= 100000 && (
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-orange-500">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Time Lord: Watched for 100,000+ minutes</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-secondary font-Archivo rounded h-25 p-1 grid grid-cols-3 place-items-center text-center text-txt">
            <div>
              <h1 className="text-action font-bold">
                {user.statistics.anime.episodesWatched}
              </h1>
              <h2 className="text-sm">Total Episodes</h2>
            </div>
            <div>
              <h1 className="text-action font-bold">
                {user.statistics.anime.count}
              </h1>
              <h2 className="text-sm">Total Anime</h2>
            </div>
            {time?.days ? (
              <div>
                <h1 className="text-action font-bold">{time.days}</h1>
                <h2 className="text-sm">Days Watched</h2>
              </div>
            ) : (
              <div>
                <h1 className="text-action font-bold">{time.hours}</h1>
                <h2 className="text-sm">hours</h2>
              </div>
            )}
          </div>
          {media.length !== 0 && (
              <div className="font-Archivo grid gap-4">
                <div className="flex md:justify-normal justify-between items-center">
                  <div className="flex items-center gap-3">
                    <h1 className="text-white">Lists Filter</h1>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-[20px] h-[20px] text-white"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                    />
                  </svg>
                </div>
                <div
                  className="md:hidden bg-secondary p-1 rounded cursor-pointer"
                  onClick={() => setVisible(!visible)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                </div>
              </div>
              <ul
                className={`group md:grid gap-1 text-sm ${
                  visible ? "" : "hidden"
                }`}
              >
                <li
                  onClick={() => setListFilter("all")}
                  className={`p-2 cursor-pointer hover:text-action ${
                    listFilter === "all" && "bg-secondary text-action"
                  }`}
                >
                  <h1 className={`cursor-pointer hover:text-action`}>
                    Show All
                  </h1>
                </li>
                {media.map((item) => (
                  <li
                    key={item.name}
                    onClick={() => setListFilter(item.name)}
                    className={`cursor-pointer hover:text-action flex gap-2 p-2 duration-200 ${
                      item.name === listFilter && "bg-secondary text-action"
                    }`}
                  >
                    <h1 className="text-white">{item.name}</h1>
                    <div className="text-gray-400 opacity-0 invisible duration-200 transition-all group-hover:visible group-hover:opacity-100">
                      ({item.entries.length})
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:w-[70%] grid grid-cols-1 md:grid-cols-2 gap-10 my-5 lg:my-12 lg:pt-16">
          {/* Anime List */}
          <div>
            <h2 className="font-Archivo font-bold text-2xl mb-5 text-white">Anime List</h2>
            {media.length !== 0 ? (
              filterMedia(listFilter).map((item, index) => {
                return (
                  <div
                    key={index}
                    id={item.status?.toLowerCase()}
                    className="flex flex-col gap-5 mx-3"
                  >
                    <h1 className="font-Archivo font-bold text-xl text-white">{item.name}</h1>
                    <table className="bg-secondary rounded">
                      <thead>
                        <tr>
                          <th className="font-bold text-xs py-3 text-start pl-10 lg:w-[75%] w-[65%] text-white">
                            Title
                          </th>
                          <th className="font-bold text-xs py-3 text-white">Score</th>
                          <th className="font-bold text-xs py-3 text-white">Progress</th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {item.entries.map((entry) => {
                          return (
                            <tr
                              key={entry.mediaId}
                              className="hover:bg-orange-400 duration-150 ease-in-out group relative"
                            >
                              <td className="font-medium py-2 pl-2 rounded">
                                <div className="flex items-center gap-2">
                                  {entry.media.status === "RELEASING" ? (
                                    <span className="dot group-hover:invisible bg-green-500 shrink-0" />
                                  ) : entry.media.status === "NOT_YET_RELEASED" ? (
                                    <span className="dot group-hover:invisible bg-red-500 shrink-0" />
                                  ) : (
                                    <span className="dot group-hover:invisible shrink-0" />
                                  )}
                                  <Image
                                    src={entry.media.coverImage.large}
                                    alt="Cover Image"
                                    width={500}
                                    height={500}
                                    className="object-cover rounded w-20 h-20 shrink-0"
                                  />
                                  <div className="absolute -top-10 -left-40 invisible lg:group-hover:visible">
                                    <Image
                                      src={entry.media.coverImage.large}
                                      alt="image"
                                      width={1000}
                                      height={1000}
                                      quality={100}
                                      className="object-cover h-[186px] w-[140px] shrink-0 rounded"
                                    />
                                  </div>
                                  <Link
                                    href={`/anime/${entry.media.id}`}
                                    className="font-bold font-Archivo pl-2 text-lg line-clamp-1 text-white"
                                    title={entry.media.title.romaji}
                                  >
                                    {entry.media.title.romaji}
                                  </Link>
                                </div>
                              </td>
                              <td className="text-center text-xs text-txt">
                                {entry.score === 0 ? null : entry.score}
                              </td>
                              <td className="text-center text-xs text-txt rounded">
                                {entry.progress === entry.media.episodes
                                  ? entry.progress
                                  : entry.media.episodes === null
                                    ? entry.progress
                                    : `${entry.progress}/${entry.media.episodes}`}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })
            ) : (
              <div className="w-screen lg:w-full flex-center flex-col gap-5">
                <p className="text-center font-Archivo font-bold lg:text-lg text-white">
                  No anime in the list yet.
                </p>
              </div>
            )}
          </div>

          {/* Manga List */}
          <div>
            <h2 className="font-Archivo font-bold text-2xl mb-5 text-white">Manga List</h2>
            {mangaMedia.length !== 0 ? (
              filterMangaMedia(mangaListFilter).map((item, index) => {
                return (
                  <div
                    key={index}
                    id={item.status?.toLowerCase()}
                    className="flex flex-col gap-5 mx-3"
                  >
                    <h1 className="font-Archivo font-bold text-xl text-white">{item.name}</h1>
                    <table className="bg-secondary rounded">
                      <thead>
                        <tr>
                          <th className="font-bold text-xs py-3 text-start pl-10 lg:w-[75%] w-[65%] text-white">
                            Title
                          </th>
                          <th className="font-bold text-xs py-3 text-white">Score</th>
                          <th className="font-bold text-xs py-3 text-white">Progress</th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {item.entries.map((entry) => {
                          return (
                            <tr
                              key={entry.mediaId}
                              className="hover:bg-orange-400 duration-150 ease-in-out group relative"
                            >
                              <td className="font-medium py-2 pl-2 rounded">
                                <div className="flex items-center gap-2">
                                  <Image
                                    src={entry.media.coverImage.large}
                                    alt="Cover Image"
                                    width={500}
                                    height={500}
                                    className="object-cover rounded w-20 h-20 shrink-0"
                                  />
                                  <Link
                                    href={`/manga/${entry.media.id}`}
                                    className="font-bold font-Archivo pl-2 text-lg line-clamp-1 text-white"
                                    title={entry.media.title.romaji}
                                  >
                                    {entry.media.title.romaji}
                                  </Link>
                                </div>
                              </td>
                              <td className="text-center text-xs text-txt">
                                {entry.score === 0 ? null : entry.score}
                              </td>
                              <td className="text-center text-xs text-txt rounded">
                                {entry.progress === entry.media.chapters
                                  ? entry.progress
                                  : entry.media.chapters === null
                                    ? entry.progress
                                    : `${entry.progress}/${entry.media.chapters}`}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })
            ) : (
              <div className="w-screen lg:w-full flex-center flex-col gap-5">
                <p className="text-center font-Archivo font-bold lg:text-lg text-white">
                  No manga in the list yet.
                </p>
              </div>
            )}
          </div>
        </div>
        {isModalOpen && (
          <Modal
          isOpen={true}
          onClose={closeModal}
          title={modalContent.title}
        >
          {modalContent.content}
        </Modal>
        )}
</div>    </>
  );
}

export async function getServerSideProps(context: any) {
  const query = context.query;

  const [data, session] = await pls.post(
    "https://graphql.anilist.co/",
    {
      body: JSON.stringify({
        query: `
        query ($username: String, $status: MediaListStatus) {
          MediaListCollection(userName: $username, type: ANIME, status: $status, sort: SCORE_DESC) {
            user {
              id
              name
              about (asHtml: true)
              createdAt
              avatar {
                  large
              }
              statistics {
                anime {
                    count
                    episodesWatched
                    meanScore
                    minutesWatched
                }
                manga {
                    count
                    chaptersRead
                    volumesRead
                }
              }
              bannerImage
              mediaListOptions {
                animeList {
                    sectionOrder
                }
              }
            }
            lists {
              status
              name
              entries {
                id
                mediaId
                status
                progress
                score
                media {
                  id
                  status
                  title {
                    english
                    romaji
                  }
                  episodes
                  coverImage {
                    large
                  }
                }
              }
            }
          }
          MangaListCollection: MediaListCollection(userName: $username, type: MANGA, status: $status, sort: SCORE_DESC) {
            user {
              id
              name
              about (asHtml: true)
              createdAt
              avatar {
                  large
              }
              statistics {
                manga {
                    count
                    chaptersRead
                    volumesRead
                }
              }
              bannerImage
              mediaListOptions {
                mangaList {
                    sectionOrder
                }
              }
            }
            lists {
              status
              name
              entries {
                id
                mediaId
                status
                progress
                score
                media {
                  id
                  status
                  title {
                    english
                    romaji
                  }
                  chapters
                  coverImage {
                    large
                  }
                }
              }
            }
          }
        }
      `,
        variables: {
          username: query.user,
        },
      }),
    },
    context
  );

  const get = data?.data?.MediaListCollection;
  const sectionOrder = get?.user.mediaListOptions.animeList.sectionOrder;

  if (!sectionOrder) {
    return {
      notFound: true,
    };
  }

  let userData;

  if (session) {
    userData = await getUser(session.user.name, false);
  }

  const prog = get.lists;

  function getIndex(status: string) {
    const index = sectionOrder.indexOf(status);
    return index === -1 ? sectionOrder.length : index;
  }

  prog.sort(
    (a: { name: string }, b: { name: string }) =>
      getIndex(a.name) - getIndex(b.name)
  );

  const user = get.user;

  const time = convertMinutesToDays(user.statistics.anime.minutesWatched);

  const mangaGet = data?.data?.MangaListCollection;
  const mangaSectionOrder = mangaGet?.user.mediaListOptions.mangaList.sectionOrder;

  const mangaProg = mangaGet.lists;

  function getMangaIndex(status: string) {
    const index = mangaSectionOrder.indexOf(status);
    return index === -1 ? mangaSectionOrder.length : index;
  }

  mangaProg.sort(
    (a: { name: string }, b: { name: string }) =>
      getMangaIndex(a.name) - getMangaIndex(b.name)
  );

  return {
    props: {
      media: prog,
      mangaMedia: mangaProg,
      sessions: session,
      user: user,
      time: time,
      
    },
  };
}

function UnixTimeConverter({ unixTime }: { unixTime: number }) {
  const date = new Date(unixTime * 1000); // multiply by 1000 to convert to milliseconds
  const formattedDate = date.toISOString().slice(0, 10); // format date to YYYY-MM-DD

  return <p>{formattedDate}</p>;
}

function convertMinutesToDays(minutes: number) {
  const hours = minutes / 60;
  const days = hours / 24;

  if (days >= 1) {
    return days % 1 === 0
        ? { days: `${days}` }
        : { days: `${days.toFixed(1)}` };
  } else {
    return hours % 1 === 0
        ? { hours: `${hours}` }
        : { hours: `${hours.toFixed(1)}` };
  }
}