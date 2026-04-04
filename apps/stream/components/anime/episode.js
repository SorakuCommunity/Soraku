import { useEffect, useState, Fragment } from "react";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import ViewSelector from "./viewSelector";
import ThumbnailOnly from "./viewMode/thumbnailOnly";
import ThumbnailDetail from "./viewMode/thumbnailDetail";
import ListMode from "./viewMode/listMode";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 24;
const DEFAULT_VIEW = 2;

const fetchEpisodes = async (info, isDub, refresh = false) => {
  const response = await fetch(
    `/api/v2/episode/${info.id}?releasing=${
      info.status === "RELEASING" ? "true" : "false"
    }${isDub ? "&dub=true" : ""}${refresh ? "&refresh=true" : ""}`
  ).then((res) => res.json());

  const providers = filterProviders(response);

  return providers;
};

const filterProviders = (response) => {
  const providersWithMap = response.find((i) => i?.map === true);
  let providers = response;

  if (providersWithMap) {
    providers = response.filter((i) => {
      if (i?.providerId === "gogoanime" && i?.map !== true) {
        return null;
      }
      return i;
    });
  }

  return providers;
};

const setDefaultProvider = (providers, setProviderId) => {
  if (providers.length > 0) {
    const defaultProvider = providers.find(
      (x) => x.providerId === "gogoanime" || x.providerId === "9anime"
    );
    setProviderId(defaultProvider?.providerId || providers[0].providerId);
  }
};

export default function AnimeEpisode({
  info,
  session,
  progress,
  setProgress,
  setWatch,
}) {
  const [providerId, setProviderId] = useState(); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [visible, setVisible] = useState(false); 
  const itemsPerPage = 24; 

  const [loading, setLoading] = useState(true);
  const [artStorage, setArtStorage] = useState(null);
  const [view, setView] = useState(3);
  const [isDub, setIsDub] = useState(false);
  const [providers, setProviders] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [bannerVisible, setBannerVisible] = useState(true); 

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const providers = await fetchEpisodes(info, isDub);
      setDefaultProvider(providers, setProviderId);
      setView(Number(localStorage.getItem("view")) || DEFAULT_VIEW);
      setArtStorage(JSON.parse(localStorage.getItem("artplayer_settings")));
      setProviders(providers);
      setLoading(false);
    };
    fetchData();

    return () => {
      setCurrentPage(1);
      setProviders(null);
    };
  }, [info.id, isDub]); 

  const episodes =
    providers?.find((provider) => provider.providerId === providerId)
      ?.episodes || [];

  const filteredEpisodes = episodes.filter((episode) =>
    episode && episode.number != null && episode.number.toString().includes(searchTerm)
  );

  const totalFilteredPages = Math.ceil(filteredEpisodes.length / itemsPerPage);

  const lastEpisodeIndex = currentPage * itemsPerPage;
  const firstEpisodeIndex = lastEpisodeIndex - itemsPerPage;
  let currentEpisodes = filteredEpisodes.slice(firstEpisodeIndex, lastEpisodeIndex);

  const totalPages = Math.ceil(episodes.length / itemsPerPage);

  const handleChange = (event) => {
    setProviderId(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (
      currentEpisodes && // Check if currentEpisodes is defined
      currentEpisodes.every(
        (item) =>
          item?.img?.includes("https://s4.anilist.co/") || 
          item?.image?.includes("https://s4.anilist.co/") ||
          item?.img === null
      )
    ) {
      setView(3); 
    }
  }, [providerId, episodes]); 
  
  useEffect(() => {
    if (episodes) {
      const getEpi = info?.nextAiringEpisode
        ? episodes.find((i) => i.number === progress + 1)
        : episodes[0];
      if (getEpi) {
        const watchUrl = `/anime/watch/${
          info.id
        }/${providerId}?id=${encodeURIComponent(getEpi.id)}&num=${
          getEpi.number
        }${isDub ? `&dub=${isDub}` : ""}`;
        setWatch(watchUrl);
      } else {
        setWatch(null);
      }
    }
  }, [episodes]); 

  useEffect(() => {
    if (artStorage) {
      const currentData =
        JSON.parse(localStorage.getItem("artplayer_settings")) || {};

      const updatedData = {};

      for (const key in currentData) {
        const item = currentData[key];
        if (Number(item.aniId) === info.id && item.provider === providerId) {
          updatedData[key] = item;
        }
      }

      if (!session?.user?.name) {
        const maxWatchedEpisode = Object.keys(updatedData).reduce(
          (maxEpisode, key) => {
            const episodeData = updatedData[key];
            if (episodeData.timeWatched >= episodeData.duration * 0.9) {
              return Math.max(maxEpisode, episodeData.episode);
            }
            return maxEpisode;
          },
          0
        );

        setProgress(maxWatchedEpisode);
      } else {
        return;
      }
    }
  }, [providerId, artStorage, info.id, session?.user?.name]);

  let debounceTimeout;

  const handleRefresh = async () => {
    try {
      setLoading(true);
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(async () => {
        const providers = await fetchEpisodes(info, isDub, true);
        setDefaultProvider(providers, setProviderId);
        setView(Number(localStorage.getItem("view")) || DEFAULT_VIEW);
        setArtStorage(JSON.parse(localStorage.getItem("artplayer_settings")));
        setProviders(providers);
        setLoading(false);
      }, 5000);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const storedView = localStorage.getItem("view");
    const storedIsDub = localStorage.getItem("isDub") === 'true';
    const storedProviderId = localStorage.getItem("providerId");

    if (storedView) {
      setView(Number(storedView));
    }
    setIsDub(storedIsDub);
    if (storedProviderId) {
      setProviderId(storedProviderId);
    }
  }, []);

  useEffect(() => {
    if (!providerId && providers) {
      setDefaultProvider(providers, setProviderId);
    }
  }, [providers, providerId]);

  return (
    <>
      <div className="flex flex-col gap-4 px-3">
        <div className="flex lg:flex-row flex-col gap-4 lg:gap-0 justify-between ">
          <div className="flex justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              {info && (
                <h1 className="text-[18px] lg:text-xl font-bold font-Archivo">
                  Episodes
                </h1>
              )}
              {info?.status !== "NOT_YET_RELEASED" && (
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="relative flex flex-col items-center w-4 h-4 group"
                >
                  <span className="absolute pointer-events-none z-40 opacity-0 -translate-y-8 group-hover:-translate-y-10 group-hover:opacity-100 font-Archivo shadow-tersier shadow-md whitespace-nowrap bg-secondary px-2 py-1 rounded transition-all duration-200 ease-out">
                    Refresh Episodes
                  </span>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={() => window.open('/epns?report=true', '_blank')}
                className="relative flex flex-col items-center w-4 h-4 group"
              >
                <span className="absolute pointer-events-none z-40 opacity-0 -translate-y-8 group-hover:-translate-y-10 group-hover:opacity-100 font-Archivo shadow-tersier shadow-md whitespace-nowrap bg-secondary px-2 py-1 rounded transition-all duration-200 ease-out">
                  Report Episodes not showing
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-1">
            {totalPages > 1 && (
                    <div className="relative flex gap-2 items-center">
                      <select
                        title="Episodes"
                        onChange={(e) =>
                          handlePageChange(Number(e.target.value))
                        }
                        className="flex items-center text-sm gap-5 rounded-[3px] bg-secondary py-1 px-2 pr-6 font-Archivo appearance-none cursor-pointer outline-none focus:ring-1 focus:ring-action hover:ring-1 hover:ring-action"
                      >
                        {[...Array(totalPages)].map((_, i) => {
                          const start = i * itemsPerPage + 1;
                          const end = Math.min((i + 1) * itemsPerPage, episodes.length);
                          return (
                            <option key={i} value={i + 1}>
                              {start}-{end}
                            </option>
                          );
                        })}
                      </select>
                      <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                    </div>
                  )}
              <div
                onClick={() => setIsDub((prev) => !prev)}
                className="flex lg:hidden flex-col items-center relative rounded-md bg-secondary py-1 px-2 font-Archivo text-sm hover:ring-1 ring-action cursor-pointer group"
              >
                {isDub ? "Dub" : "Sub"}

                <span className="absolute pointer-events-none z-40 opacity-0 -translate-y-8 group-hover:-translate-y-10 group-hover:opacity-100 font-Archivo shadow-tersier shadow-md whitespace-nowrap bg-secondary px-2 py-1 rounded transition-all duration-200 ease-out">
                  Switch to {isDub ? "Sub" : "Dub"}
                </span>
              </div>
              <div
                className="lg:hidden bg-secondary p-1 rounded-md cursor-pointer"
                onClick={() => setVisible(!visible)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div
            className={`flex lg:flex gap-3 items-center justify-between ${
              visible ? "" : "hidden"
            }`}
          >
            {providers && (
              <div
                onClick={() => setIsDub((prev) => !prev)}
                className="hidden lg:flex flex-col items-center relative rounded-[3px] bg-secondary py-1 px-2 font-Archivo text-sm hover:ring-1 ring-action cursor-pointer group"
              >
                {isDub ? "Dub" : "Sub"}
                <span className="absolute pointer-events-none z-40 opacity-0 -translate-y-8 group-hover:-translate-y-10 group-hover:opacity-100 font-Archivo shadow-tersier shadow-md whitespace-nowrap bg-secondary px-2 py-1 rounded transition-all duration-200 ease-out">
                  Switch to {isDub ? "Sub" : "Dub"}
                </span>
              </div>
            )}
            {providers && providers.length > 0 && (
              <>
                <div className="flex gap-3">
                  <div className="relative flex gap-2 items-center group">
                    <select
                      title="Providers"
                      onChange={handleChange}
                      value={providerId}
                      className="flex items-center text-sm gap-5 rounded-[3px] bg-secondary py-1 px-2 pr-6 font-Archivo appearance-none cursor-pointer outline-none focus:ring-1 focus:ring-action group-hover:ring-1 group-hover:ring-action"
                    >
                      {providers.map((provider) => (
                        <option
                          key={provider.providerId}
                          value={provider.providerId}
                        >
                          {provider.providerId}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
              </>
            )}

            <ViewSelector
              view={view}
              setView={setView}
              episode={currentEpisodes}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search episodes..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1 bg-secondary rounded-md pl-8 focus:outline-none focus:ring-1 focus:ring-action"
            />
            <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {bannerVisible && (
          <div className="bg-yellow-200 text-yellow-800 p-3 rounded-md flex justify-between items-center">
            <span>
              If the source doesn't work, please switch the provider.
            </span>
            <button onClick={() => setBannerVisible(false)} className="text-yellow-800 font-bold">
              ×
            </button>
          </div>
        )}
                
        {/* Episodes */}
        {loading ? ( 
          <div className="flex justify-center">
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : Array.isArray(providers) ? ( 
          providers.length > 0 ? (
            currentEpisodes.length > 0 ? (
              currentEpisodes.map((episode, index) => {
                return (
                  <Fragment key={index}>
                    {view === 1 && (
                      <ThumbnailOnly
                        key={index}
                        index={index}
                        info={info}
                        providerId={providerId}
                        episode={episode}
                        artStorage={artStorage}
                        progress={progress}
                        dub={isDub}
                      />
                    )}
                    {view === 2 && (
                      <ThumbnailDetail
                        key={index}
                        index={index}
                        epi={episode}
                        provider={providerId}
                        info={info}
                        artStorage={artStorage}
                        progress={progress}
                        dub={isDub}
                      />
                    )}
                    {view === 3 && (
                      <ListMode
                        key={index}
                        info={info}
                        episode={episode}
                        artStorage={artStorage}
                        providerId={providerId}
                        progress={progress}
                        dub={isDub}
                      />
                    )}
                  </Fragment>
                );
              })
            ) : (
              <div className="h-[20vh] lg:w-full flex-center flex-col gap-4">
                <p className="text-center font-Archivo font-bold lg:text-lg">
                  No episodes found matching your search.
                </p>
              </div>
            )
          ) : (
            <div className="h-[20vh] lg:w-full flex-center flex-col gap-4">
              <p className="text-center font-Archivo font-bold lg:text-lg">
                Oops!<br></br> It looks like this anime is not available.
              </p>
            </div>
          )
        ) : (
          <p>Error: {providers?.message || "Something went wrong."}</p> 
        )}
      </div>
    </>
  );
}