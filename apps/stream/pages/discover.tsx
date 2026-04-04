import React, { useState, Fragment, useEffect } from "react";
import { aniListData } from "@/lib/anilist/AniList";
import Head from "next/head";
import { Navbar } from "@/components/shared/NavBar";
import Content from "@/components/home/content";
import { useSession } from "next-auth/react";
import Footer from "@/components/shared/footer";
import Image from "next/image";

export async function getServerSideProps() {
  try {
    const trendingData = await aniListData({
      type: "ANIME",
      sort: "TRENDING_DESC",
      page: 1
    });

    const popularData = await aniListData({
      type: "ANIME",
      sort: "POPULARITY_DESC",
      page: 1
    });

    const upcomingData = await aniListData({
      type: "ANIME",
      sort: "START_DATE_DESC",
      page: 1
    });

    const topRatedData = await aniListData({
      type: "ANIME",
      sort: "SCORE_DESC",
      page: 1
    });

    const favouritesData = await aniListData({
      type: "ANIME",
      sort: "FAVOURITES_DESC",
      page: 1
    });

    return {
      props: {
        trending: trendingData.props.data || [],
        popular: popularData.props.data || [],
        upcoming: upcomingData.props.data || [],
        topRated: topRatedData.props.data || [],
        favourites: favouritesData.props.data || []
      }
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        trending: [],
        popular: [],
        upcoming: [],
        topRated: [],
        favourites: []
      }
    };
  }
}

type Community = {
  name: string;
  image: string;
  banner: string;
  verified: boolean;
  link: string;
  description: string;
};

type SocialMedia = {
  name: string;
  logo: string;
  banner: string;
  link: string;
  description: string;
};

type DiscoverProps = {
  trending: any[];
  popular: any[];
  upcoming: any[];
  topRated: any[];
  favourites: any[];
};

export default function Discover({
  trending,
  popular,
  upcoming,
  topRated,
  favourites
}: DiscoverProps) {
  const { data: sessions }: any = useSession();
  const [discordCommunities, setDiscordCommunities] = useState<Community[]>([]);
  const [socialMediaCommunities, setSocialMediaCommunities] = useState<
    SocialMedia[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://1anime.app/imp/discover.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDiscordCommunities(data.discordCommunities);
        setSocialMediaCommunities(data.socialMediaCommunities);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  );
  const [selectedSocialMedia, setSelectedSocialMedia] =
    useState<SocialMedia | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSocialMediaModalOpen, setIsSocialMediaModalOpen] = useState(false);

  const openCommunityModal = (community: Community) => {
    setSelectedCommunity(community);
    setIsModalOpen(true);
  };

  const openSocialMediaModal = (socialMedia: SocialMedia) => {
    setSelectedSocialMedia(socialMedia);
    setIsSocialMediaModalOpen(true);
  };

  const closeCommunityModal = () => {
    setIsModalOpen(false);
    setSelectedCommunity(null);
  };

  const closeSocialMediaModal = () => {
    setIsSocialMediaModalOpen(false);
    setSelectedSocialMedia(null);
  };

  return (
    <Fragment>
      <Head>
        <title>Discover Anime, Communities, and More - 1Anime</title>
        <meta
          name="description"
          content="Explore trending, popular, upcoming, and top-rated anime along with communities and social media."
        />
      </Head>
      <div className="flex flex-col h-screen bg-primary text-[#dbdcdd]">
        <Navbar home={false} />
        <div className="flex-grow mt-20 mb-4 p-4 md:ml-20">
          <h1 className="text-3xl font-bold text-left">Discover</h1>
          <h2 className="text-2xl font-bold text-left mt-10">
            Discord Communities
          </h2>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-10 bg-gray-700 rounded mb-4"></div>
              <div className="h-10 bg-gray-700 rounded mb-4"></div>
              <div className="h-10 bg-gray-700 rounded mb-4"></div>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div
              className="flex overflow-x-auto space-x-4 mt-4 p-4 scrollbar-hide"
              draggable
            >
              {discordCommunities.map((community, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg w-40 flex-shrink-0"
                >
                  <Image
                    src={community.banner}
                    alt={`${community.name} Banner`}
                    className="w-full h-20 object-cover"
                  />
                  <div className="p-2">
                    <Image
                      src={community.image}
                      alt={community.name}
                      className="w-12 h-12 rounded-full mx-auto mb-2"
                    />
                    <h3 className="text-lg font-semibold text-center flex items-center justify-center group">
                      {community.name}
                      {community.verified && (
                        <div className="relative">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 text-green-500 ml-1"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Verified Community
                          </span>
                        </div>
                      )}
                    </h3>
                    <button
                      onClick={() => openCommunityModal(community)}
                      className="bg-blue-400 text-white hover:bg-blue-500 text-center block mt-2 py-1 px-3 rounded"
                    >
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <h2 className="text-2xl font-bold text-left mt-10">
            Social Media Communities
          </h2>
          <div
            className="flex overflow-x-auto space-x-4 mt-4 p-4 scrollbar-hide"
            draggable
          >
            {socialMediaCommunities.map((socialMedia, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg w-40 flex-shrink-0"
              >
                <Image
                  src={socialMedia.banner}
                  alt={`${socialMedia.name} Banner`}
                  className="w-full h-20 object-cover"
                />
                <div className="p-2">
                  <Image
                    src={socialMedia.logo}
                    alt={socialMedia.name}
                    className="w-12 h-12 rounded-full mx-auto mb-2"
                  />
                  <h3 className="text-lg font-semibold text-center">
                    {socialMedia.name}
                  </h3>
                  <button
                    onClick={() => openSocialMediaModal(socialMedia)}
                    className="bg-blue-400 text-white hover:bg-blue-500 text-center block mt-2 py-1 px-3 rounded"
                  >
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Content
            ids="trendingAnime"
            section="Trending Anime"
            data={trending}
          />
          <Content ids="popularAnime" section="Popular Anime" data={popular} />
          <Content
            ids="upcomingAnime"
            section="Upcoming Anime"
            data={upcoming}
          />
          <Content
            ids="topRatedAnime"
            section="Top Rated Anime"
            data={topRated}
          />
          <Content
            ids="favouritesAnime"
            section="Most Favorited"
            data={favourites}
          />
        </div>
        <Footer />
      </div>

      {isModalOpen && selectedCommunity && (
        <div className="fixed inset-0 flex items-center justify-center bg-primary bg-opacity-50">
          <div className="bg-secondary rounded-lg p-4 w-80">
            <h2 className="text-xl font-bold text-center">
              {selectedCommunity.name}
            </h2>
            <Image
              src={selectedCommunity.banner}
              alt={`${selectedCommunity.name} Banner`}
              className="w-full h-20 object-cover rounded mt-2"
            />
            <Image
              src={selectedCommunity.image}
              alt={selectedCommunity.name}
              className="w-16 h-16 rounded-full mx-auto mt-2"
            />
            <p className="text-center mt-2">
              {selectedCommunity.verified && (
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-green-500 ml-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Verified Community
                  </span>
                </div>
              )}
              {selectedCommunity.description}
            </p>
            <div className="flex justify-center mt-4">
              <a
                href={selectedCommunity.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-400 text-white hover:bg-blue-500 py-2 px-4 rounded"
              >
                Join Now
              </a>
            </div>
            <button onClick={closeCommunityModal} className="mt-4 text-red-500">
              Close
            </button>
          </div>
        </div>
      )}

      {isSocialMediaModalOpen && selectedSocialMedia && (
        <div className="fixed inset-0 flex items-center justify-center bg-primary bg-opacity-50">
          <div className="bg-secondary rounded-lg p-4 w-80">
            <h2 className="text-xl font-bold text-center">
              {selectedSocialMedia.name}
            </h2>
            <Image
              src={selectedSocialMedia.banner}
              alt={`${selectedSocialMedia.name} Banner`}
              className="w-full h-20 object-cover rounded mt-2"
            />
            <Image
              src={selectedSocialMedia.logo}
              alt={selectedSocialMedia.name}
              className="w-16 h-16 rounded-full mx-auto mt-2"
            />
            <p className="text-center mt-2">
              {selectedSocialMedia.description}
            </p>
            <div className="flex justify-center mt-4">
              <a
                href={selectedSocialMedia.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-400 text-white hover:bg-blue-500 py-2 px-4 rounded"
              >
                Follow Now
              </a>
            </div>
            <button
              onClick={closeSocialMediaModal}
              className="mt-4 text-red-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
}
