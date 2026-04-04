import { useEffect, useState } from "react";
import {
  FlagIcon,
  ShareIcon,
  ArrowDownOnSquareIcon
} from "@heroicons/react/24/solid";
import Details from "@/components/watch/primary/details";
import EpisodeLists from "@/components/watch/secondary/episodeLists";
import { getServerSession } from "next-auth";
import { useWatchProvider } from "@/lib/context/watchPageProvider";
import { authOptions } from "../../api/auth/[...nextauth]";
import { getRemovedMedia } from "@/prisma/removed";
import { createList, createUser, getEpisode, getAllUsers } from "@/prisma/user";
import Link from "next/link";
import { Navbar } from "@/components/shared/NavBar";
import Modal from "@/components/modal";
import AniList from "@/components/media/aniList";
import { signIn } from "next-auth/react";
import BugReportForm from "@/components/shared/bugReport";
import Skeleton from "react-loading-skeleton";
import Head from "next/head";
import VidStack from "@/components/watch/new-player/player";
import { useRouter } from "next/router";
import { Spinner } from "@vidstack/react";
import RateModal from "@/components/shared/RateModal";
import DownloadModal from "@/components/shared/download";
import ShareModal from "@/components/shared/share";

export async function getServerSideProps(context) {
  let userData = null;
  const session = await getServerSession(context.req, context.res, authOptions);
  const accessToken = session?.user?.token || null;

  const query = context?.query;
  if (!query) {
    return {
      notFound: true
    };
  }

  let proxy;
  proxy = process.env.PROXY_URI || null;

  const disqus = process.env.DISQUS_SHORTNAME || null;

  const [aniId, provider] = query?.info;
  const watchId = query?.id;
  const epiNumber = query?.num;
  const dub = query?.dub;

  const removed = await getRemovedMedia();

  const isRemoved = removed?.find((i) => +i?.aniId === +aniId);

  if (isRemoved) {
    return {
      redirect: {
        destination: "/removed",
        permanent: false
      }
    };
  }

  const ress = await fetch(`https://graphql.anilist.co`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` })
    },
    body: JSON.stringify({
      query: `query ($id: Int) {
              Media (id: $id) {
                mediaListEntry {
                  progress
                  status
                  customLists
                  repeat
                }
                id
                idMal
                title {
                  romaji
                  english
                  native
                }
                status
                genres
                episodes
                studios {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
                bannerImage
                description
                coverImage {
                  extraLarge
                  color
                }
                synonyms

              }
            }
          `,
      variables: {
        id: aniId
      }
    })
  });
  const data = await ress.json();
  // const variables = { id: aniId };
  // const data = await getAnilistMediaInfo(variables, context.req);

  try {
    if (session) {
      await createUser(session.user.name);
      await createList(session.user.name, watchId);
      const data = await getEpisode(session.user.name, watchId);
      userData = JSON.parse(
        JSON.stringify(data, (key, value) => {
          if (key === "createdDate") {
            return String(value);
          }
          return value;
        })
      );
    }
  } catch (error) {
    console.error(error);
    // Handle the error here
  }
  return {
    props: {
      sessions: session,
      provider: provider || null,
      watchId: watchId || null,
      epiNumber: epiNumber || null,
      dub: dub || null,
      userData: userData?.[0] || null,
      info: data?.data?.Media || null,
      proxy,
      disqus
    }
  };
}

export default function Watch({
  info,
  watchId,
  disqus,
  proxy,
  dub,
  userData,
  sessions,
  provider,
  epiNumber
}) {
  const [artStorage, setArtStorage] = useState(null);
  const [episodeNavigation, setEpisodeNavigation] = useState(null);
  const [episodesList, setepisodesList] = useState();
  const [mapEpisode, setMapEpisode] = useState(null);
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal
  const epId = watchId; // Assuming watchId is the episode ID
  const [bannerVisible, setBannerVisible] = useState(true);
  const { setAutoNext, ratingModalState, setRatingModalState } =
    useWatchProvider();

  const [onList, setOnList] = useState(false);

  const router = useRouter();

  const {
    theaterMode,
    setPlayerState,
    setAutoPlay,
    setMarked,
    setTrack,
    aspectRatio,
    setDataMedia
  } = useWatchProvider();

  useEffect(() => {
    async function getInfo() {
      if (info.mediaListEntry) {
        setOnList(true);
      }

      setDataMedia(info);

      const response = await fetch(
        `/api/v2/episode/${info.id}?releasing=${
          info.status === "RELEASING" ? "true" : "false"
        }${dub ? "&dub=true" : ""}`
      ).then((res) => res.json());
      const getMap = response.find((i) => i?.map === true) || response[0];
      let episodes = response;

      if (getMap) {
        if (provider === "gogoanime" && !watchId.startsWith("/")) {
          episodes = episodes.filter((i) => {
            if (i?.providerId === "gogoanime" && i?.map !== true) {
              return null;
            }
            return i;
          });
        }

        setMapEpisode(getMap?.episodes);
      }

      if (episodes) {
        const getProvider = episodes?.find((i) => i.providerId === provider);
        const episodeList = getProvider?.episodes.slice(
          0,
          getMap?.episodes.length
        );
        const playingData = getMap?.episodes.find(
          (i) => i.number === Number(epiNumber)
        );

        if (getProvider) {
          setepisodesList(episodeList);
          const currentEpisode = episodeList?.find(
            (i) => i.number === parseInt(epiNumber)
          );
          const nextEpisode = episodeList?.find(
            (i) => i.number === parseInt(epiNumber) + 1
          );
          const previousEpisode = episodeList?.find(
            (i) => i.number === parseInt(epiNumber) - 1
          );
          const vidNav = {
            prev: previousEpisode,
            playing: {
              id: currentEpisode.id,
              title: playingData?.title || info?.title?.romaji,
              description: playingData?.description,
              img: playingData?.img || playingData?.image,
              number: currentEpisode.number
            },
            next: nextEpisode
          };
          setEpisodeNavigation(vidNav);
        }
      }

      setArtStorage(JSON.parse(localStorage.getItem("artplayer_settings")));
      // setEpiData(episodes);
    }
    getInfo();

    return () => {
      setEpisodeNavigation(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions?.user?.name, epiNumber, dub]);

  useEffect(() => {
    const autoNext = localStorage.getItem("autoNext"),
      autoPlay = localStorage.getItem("autoplay");
    if (autoNext) {
      setAutoNext(autoNext);
    }
    if (autoPlay) {
      setAutoPlay(autoPlay);
    }

    async function fetchData() {
      if (info) {
        const anify = await fetch("/api/v2/source", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            source:
              provider === "gogoanime" && !watchId.startsWith("/")
                ? "consumet"
                : "anify",
            providerId: provider,
            watchId: watchId,
            episode: epiNumber,
            id: info.id,
            sub: dub ? "dub" : "sub"
          })
        }).then((res) => res.json());

        if (!anify?.sources?.length > 0) {
          router.push(`/anime/${info.id}?notfound=true`);
          return;
        }

        const skip = await fetch(
          `https://api.aniskip.com/v2/skip-times/${info.idMal}/${parseInt(
            epiNumber
          )}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=`
        ).then((res) => {
          if (!res.ok) {
            switch (res.status) {
              case 404: {
                return null;
              }
            }
          }
          return res.json();
        });

        let getOp =
            skip?.results?.find((item) => item.skipType === "op") || null,
          getEd = skip?.results?.find((item) => item.skipType === "ed") || null;

        const op = getOp
            ? {
                startTime:
                  anify?.intro?.start ?? Math.round(getOp?.interval.startTime),
                endTime:
                  anify?.intro?.end ?? Math.round(getOp?.interval.endTime),
                text: "Opening"
              }
            : null,
          ed = {
            startTime:
              anify?.outro?.start ?? Math.round(getEd?.interval.startTime),
            endTime: anify?.outro?.end ?? Math.round(getEd?.interval.endTime),
            text: "Ending"
          };
        const skipData = [op, ed].filter((i) => i !== null);

        const quality =
          anify?.sources?.find(
            (i) => i.quality === "default" || i.quality === "auto"
          ) || anify?.sources[0];

        let defaultQualityUrl;
        if (provider === "gogoanime") {
          defaultQualityUrl = `https://m3u8proxy.anifusion.workers.dev/?u=${quality.url}`;
        } else {
          defaultQualityUrl = quality.url;
        }
        const reFormSubtitles = anify?.subtitles?.map((i) => {
          return {
            src: proxy + i.url,
            label: i.lang,
            kind: i.lang === "Thumbnails" ? "thumbnails" : "subtitles",
            ...(i.lang === "English" && { default: true })
          };
        });

        const thumbnails = reFormSubtitles?.find(
          (i) => i.kind === "thumbnails"
        );

        const subtitles = reFormSubtitles?.filter(
          (i) => i.kind !== "thumbnails"
        );

        const episode = {
          provider,
          isDub: dub,
          defaultQuality: {
            url: defaultQualityUrl,
            headers: anify?.headers
          },
          subtitles: subtitles,
          thumbnails: thumbnails?.src,
          epiData: anify,
          skip: skipData
        };

        setTrack(episode);
      }
    }

    fetchData();
    return () => {
      setPlayerState({
        currentTime: 0,
        isPlaying: false
      });
      setMarked(0);
      setTrack(null);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, watchId, info?.id]);

  useEffect(() => {
    const mediaSession = navigator.mediaSession;
    if (!mediaSession) return;

    const now = episodeNavigation?.playing;
    const poster = now?.img || info?.bannerImage;
    const title = now?.title || info?.title?.romaji;

    const artwork = poster
      ? [{ src: poster, sizes: "512x512", type: "image/jpeg" }]
      : undefined;

    mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: `1Anime ${
        title === info?.title?.romaji
          ? "- Episode " + epiNumber
          : `- ${info?.title?.romaji || info?.title?.english}`
      }`,
      artwork
    });
  }, [episodeNavigation, info, epiNumber]);

  const handleShareClick = async () => {
    setShareModalVisible(true);
  };

  function handleOpen() {
    setOpen(true);
    document.body.style.overflow = "hidden";
  }

  function handleClose() {
    setOpen(false);
    document.body.style.overflow = "auto";
  }

  return (
    <>
      <Head>
        <title>
          {` ${episodeNavigation?.playing?.title} - ${info?.title?.english}` ||
            `${info?.title?.english} - Episode ${epiNumber}`}
        </title>
        <meta
          name="title"
          data-title-romaji={info?.title?.romaji}
          data-title-english={info?.title?.english}
          data-title-native={info?.title?.native}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="description"
          content={episodeNavigation?.playing?.description || info?.description}
        />
        <meta
          name="keywords"
          content="anime, anime streaming, anime streaming website, anime streaming free, anime streaming website free, anime streaming website free english subbed, anime streaming website free english dubbed, anime streaming website free english subbed and dubbed, anime streaming webs
          ite free english subbed and dubbed download, anime streaming website free english subbed and dubbed"
        />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Watch - ${
            episodeNavigation?.playing?.title || info?.title?.english
          }`}
        />
        <meta
          property="og:description"
          content={episodeNavigation?.playing?.description || info?.description}
        />
        <meta
          property="og:image"
          content={episodeNavigation?.playing?.img || info?.bannerImage}
        />
        <meta property="og:site_name" content="1Anime" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content={episodeNavigation?.playing?.img || info?.bannerImage}
        />
        <meta
          name="twitter:title"
          content={`Watch - ${
            episodeNavigation?.playing?.title || info?.title?.english
          }`}
        />
        <meta
          name="twitter:description"
          content={episodeNavigation?.playing?.description || info?.description}
        />
      </Head>
      <Modal open={open} onClose={() => handleClose()}>
        {!sessions && (
          <div className="flex-center flex-col gap-5 px-10 py-5 bg-secondary rounded-md">
            <h1 className="text-md font-extrabold font-Archivo">
              Edit your list
            </h1>
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
      </Modal>
      <ShareModal
        visible={isShareModalVisible}
        onClose={() => setShareModalVisible(false)}
        animeId={String(info?.id)}
        isManga={false}
      />
      <DownloadModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        epId={epId}
      />{" "}
      {/* Add the DownloadModal here */}
      <BugReportForm isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="w-screen h-full">
        {!ratingModalState.isFullscreen && (
          <RateModal
            toggle={ratingModalState.isOpen}
            setToggle={setRatingModalState}
            position="bottom"
            session={sessions}
          />
        )}
        <Navbar
          info={info}
          withNav
          toTop
          shrink
          bgHover
          scrollP={110}
          paddingY={"py-1"}
        />

        <div
          className={`mx-auto pt-16 ${theaterMode ? "lg:pt-16" : "lg:pt-20"}`}
        >
          {theaterMode && (
            <div className="relative w-full h-full">
              {/* Ambient Effect Overlay */}
              <div
                className={`absolute inset-0 bg-black blur-md opacity-50 transform scale-150 z-0`}
                style={{ aspectRatio: aspectRatio }}
              />
              <div
                className={`bg-black w-full max-h-[84dvh] h-full flex-center rounded-md z-10`}
                style={{ aspectRatio: aspectRatio }}
              >
                {episodeNavigation ? (
                  <VidStack
                    id={`${watchId}-theater`}
                    navigation={episodeNavigation}
                    sessions={sessions}
                    userData={userData}
                  />
                ) : (
                  <div className="flex-center aspect-video w-full h-full relative">
                    <SpinLoader />
                  </div>
                )}
              </div>
            </div>
          )}{" "}
          <div
            id="default"
            className={`${
              theaterMode ? "lg:max-w-[95%] xl:max-w-[80%]" : "lg:max-w-[95%]"
            } w-full flex flex-col lg:flex-row mx-auto`}
          >
            <div id="primary" className="w-full">
              {!theaterMode && provider !== "1anime" && (
                <div
                  className={`bg-black w-full flex-center rounded-md overflow-hidden z-10 ${
                    aspectRatio === "4/3" ? "aspect-video" : ""
                  }`}
                >
                  {episodeNavigation ? (
                    <VidStack
                      id={`${watchId}-default`}
                      navigation={episodeNavigation}
                      sessions={sessions}
                      userData={userData}
                    />
                  ) : (
                    <div className="flex-center aspect-video w-full h-full relative">
                      <SpinLoader />
                    </div>
                  )}
                </div>
              )}
              <div
                id="iframe-player"
                className="w-full flex-center rounded-md overflow-hidden"
              >
                {provider === "1anime" && (
                  <iframe
                    src={`https://1anime.app/embed/${watchId}`}
                    className="w-full h-[500px] border-none"
                    title="1Anime Player"
                    allowFullScreen
                  />
                )}
              </div>
              <div
                id="details"
                className="flex flex-col gap-6 w-full px-4 lg:px-2 bg-primary rounded-lg p-4" // Adjusted px values to move right
              >
                <div className="flex flex-col pt-3 border-b-2 border-secondary pb-2">
                  <div className="w-full">
                    <div className="flex font-Archivo font-bold text-xl lg:text-3xl text-white line-clamp-1">
                      <Link
                        href={`/anime/${info?.id}`}
                        className="hover:underline line-clamp-1"
                      >
                        {(episodeNavigation?.playing?.title ||
                          info.title.romaji) ??
                          "Loading..."}
                      </Link>
                    </div>
                    <h3 className="font-Archivo text-lg text-gray-300">
                      {episodeNavigation?.playing?.number ? (
                        `${info.title.english} - Episode ${episodeNavigation?.playing?.number}`
                      ) : (
                        <Skeleton width={120} height={16} />
                      )}
                    </h3>
                  </div>
                  {bannerVisible && (
                    <div className="bg-yellow-100 text-yellow-800 p-2 rounded-md flex justify-between items-center w-full">
                      <span>
                        If buffering,{" "}
                        <a href="#" onClick={() => window.location.reload()}>
                          refresh
                        </a>{" "}
                        or try another provider.
                      </span>
                      <button
                        onClick={() => setBannerVisible(false)}
                        className="text-yellow-800 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <div className="flex gap-3 text-sm mt-2">
                    <button
                      type="button"
                      onClick={() => setModalIsOpen(true)} // Open the modal
                      className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-md hover:bg-blue-700 transition"
                    >
                      <ArrowDownOnSquareIcon className="w-5 h-5" />
                      <span className="hidden lg:block">Download</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleShareClick}
                      className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-md hover:bg-green-700 transition"
                    >
                      <ShareIcon className="w-5 h-5" />
                      <span className="hidden lg:block">Share</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-md hover:bg-red-700 transition"
                    >
                      <FlagIcon className="w-5 h-5" />
                      <span className="hidden lg:block">Report</span>
                    </button>
                  </div>
                </div>

                <Details
                  info={info}
                  session={sessions}
                  description={info?.description}
                  epiNumber={epiNumber}
                  id={info}
                  onList={onList}
                  setOnList={setOnList}
                  handleOpen={() => handleOpen()}
                  disqus={disqus}
                />
              </div>
            </div>
            <div
              id="secondary"
              className={`relative ${theaterMode ? "pt-6" : "pt-5 lg:pt-0"}`}
            >
              <EpisodeLists
                info={info}
                session={sessions}
                map={mapEpisode}
                providerId={provider}
                watchId={watchId}
                episode={episodesList}
                artStorage={artStorage}
                track={episodeNavigation}
                dub={dub}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function SpinLoader() {
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center h-full w-full">
      <Spinner.Root className="text-white animate-spin opacity-100" size={84}>
        <Spinner.Track className="opacity-25" width={8} />
        <Spinner.TrackFill className="opacity-75" width={8} />
      </Spinner.Root>
      {/* <span className="absolute text-white text-lg mt-2">Powered by 1Cloud</span> */}
    </div>
  );
}
