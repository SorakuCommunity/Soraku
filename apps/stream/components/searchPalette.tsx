import { Fragment, useEffect, useRef, useState } from "react";
import { Combobox, Dialog, Menu, Transition } from "@headlessui/react";
import useDebounce from "@/lib/hooks/useDebounce";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSearch } from "@/lib/context/isOpenState";
import { ChevronDownIcon, ChevronRightIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { BookOpenIcon, PlayIcon } from "@heroicons/react/20/solid";
import { useAniList } from "@/lib/anilist/useAnilist";
import { getFormat } from "@/utils/getFormat";
import SearchByImage from "./search/searchByImage";

type SearchType = "ANIME" | "MANGA";

export interface DataTypes {
  id: number;
  title: Title;
  coverImage: CoverImage;
  type: string;
  format: string;
  bannerImage?: string;
  isLicensed: boolean;
  genres: string[];
  startDate: StartDate;
}

interface Title {
  english: string;
  romaji: string;
}

interface CoverImage {
  medium: string;
}

interface StartDate {
  year: number;
}

export default function SearchPalette() {
  const { isOpen, setIsOpen } = useSearch();
  const { quickSearch } = useAniList();

  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<DataTypes[] | null>(null);
  const debounceSearch = useDebounce(query, 500);
  const [loading, setLoading] = useState<boolean>(false);
  const [type, setType] = useState<SearchType>("ANIME");

  const [nextPage, setNextPage] = useState<boolean>(false);

  let focusInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function closeModal() {
    setIsOpen(false);
  }

  function handleChange(event: string): void {
    router.push(`/${type.toLowerCase()}/${event}`);
  }

  async function advance(): Promise<void> {
    setLoading(true);
    const res = await quickSearch({
      search: debounceSearch,
      type,
    });
    setData(res?.data?.Page?.results);
    setNextPage(res?.data?.Page?.pageInfo?.hasNextPage);
    setLoading(false);
  }

  useEffect(() => {
    advance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearch, type]);

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.code === "KeyS" && e.ctrlKey) {
        e.preventDefault();
        setIsOpen((prev: boolean) => !prev);
        setData(null);
        setQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[6969]"
        initialFocus={focusInput}
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/90" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl max-h-[70vh] transform overflow-hidden rounded-lg bg-primary p-4 text-left shadow-xl transition-all">
                <Combobox
                  as="div"
                  className="max-w-xl mx-auto rounded-lg shadow-lg relative flex flex-col"
                  onChange={(e: any) => {
                    handleChange(e);
                    setData(null);
                    setIsOpen(false);
                    setQuery("");
                  }}
                >
                  <div className="flex flex-col mb-3">
                    <h2 className="text-xl font-bold text-white mb-3">Search Anime & Manga</h2>
                    <div className="flex justify-between items-center mb-3">
                      <Menu as="div" className="relative inline-block text-left z-10">
                        <div>
                          <Menu.Button className="capitalize bg-secondary inline-flex w-full justify-center rounded px-2 py-1 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                            {type.toLowerCase()}
                            <ChevronDownIcon
                              className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute left-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                            <div className="px-1 py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    title="Anime"
                                    onClick={() => setType("ANIME")}
                                    className={`${
                                      active
                                        ? "bg-secondary text-white"
                                        : "text-white"
                                    } group flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm`}
                                  >
                                    <PlayIcon className="w-5 h-5" />
                                    <span>Anime</span>
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    title="Manga"
                                    onClick={() => setType("MANGA")}
                                    className={`${
                                      active
                                        ? "bg-secondary text-white"
                                        : "text-white"
                                    } group flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm`}
                                  >
                                    <BookOpenIcon className="w-5 h-5" />
                                    <span>Manga</span>
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                      <SearchByImage searchPalette={true} setIsOpen={setIsOpen} />
                    </div>
                  </div>
                  <div className="relative">
                    <Combobox.Input
                      ref={focusInput}
                      className="w-full p-3 text-lg text-white bg-secondary rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Search for anime or manga..."
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <Combobox.Options
                    static
                    className="mt-4 max-h-[50vh] overflow-y-auto rounded-lg bg-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    {!loading ? (
                      <Fragment>
                        {data && data?.length > 0
                          ? data?.map((i) => (
                              <Combobox.Option
                                key={i.id}
                                value={i.id}
                                className={({ active }) =>
                                  `flex items-center gap-2 p-4 ${
                                    active ? "bg-primary/40 cursor-pointer" : ""
                                  }`
                                }
                              >
                                <div className="shrink-0">
                                  <Image
                                    src={i.coverImage.medium}
                                    alt="coverImage"
                                    width={80}
                                    height={80}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                </div>
                                <div className="flex flex-col w-full h-full">
                                  <h3 className="font-Archivo font-semibold">
                                    {i.title.english} | {i.title.romaji}
                                  </h3>
                                  <p className="text-sm text-white/50">
                                    {i.startDate.year} {getFormat(i.format)}
                                  </p>
                                </div>
                              </Combobox.Option>
                            ))
                          : !loading &&
                            debounceSearch !== "" && (
                              <p className="flex-center font-Archivo gap-3 p-4">
                                No results found.
                              </p>
                            )}
                        {nextPage && (
                          <button
                            type="button"
                            title="View More"
                            onClick={() => {
                              router.push(
                                `/search/${type.toLowerCase()}/${
                                  query !== "" ? `?search=${query}` : ""
                                }`
                              );
                              setIsOpen(false);
                              setQuery("");
                            }}
                            className="flex-center font-Archivo gap-2 py-3 hover:bg-primary/30 cursor-pointer"
                          >
                            <span>View More</span>
                            <ChevronRightIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          title="Advanced Search"
                          onClick={() => {
                            router.push(`/search/${type.toLowerCase()}`);
                            setIsOpen(false);
                            setQuery("");
                          }}
                          className="flex-center font-Archivo gap-2 py-3 hover:bg-primary/30 cursor-pointer"
                        >
                          <span>✨ can't find what you're looking for? try Advanced Search ➡️</span>
                        </button>
                      </Fragment>
                    ) : (
                      <div className="flex-center gap-3 p-4">
                        <div className="flex justify-center">
                          <div className="lds-ellipsis">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Combobox.Options>
                  <div className="mt-4 text-sm text-gray-400">
                    <p>Quick access: <kbd className="px-2 py-1 bg-secondary rounded">Ctrl</kbd> + <kbd className="px-2 py-1 bg-secondary rounded">S</kbd></p>
                  </div>
                  <div className="mt-4 text-sm text-gray-400">
                    <p>Command Prompt: <kbd className="px-2 py-1 bg-secondary rounded">/</kbd></p>
                  </div>
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
