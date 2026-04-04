import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { CalendarIcon, HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type MobileNavProps = {
  hideProfile?: boolean;
};

export function MobileNav({ hideProfile = false }: MobileNavProps) {
  const { data: sessions }: { data: any } = useSession();
  const [isVisible, setIsVisible] = useState(false);

  const handleShowClick = () => {
    setIsVisible(true);
  };

  const handleHideClick = () => {
    setIsVisible(false);
  };
  return (
    <>
      {/* NAVBAR */}
      <div className="z-[1000]">
        {!isVisible && (
          <button
            onClick={handleShowClick}
            className="fixed bottom-[30px] right-[20px] z-[100] flex h-[45px] w-[45px] cursor-pointer items-center justify-center rounded-[8px] bg-secondary shadow-lg lg:hidden"
            id="bars"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[36px] w-[36px] text-white/60 fill-purple-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <div className={`transition-all duration-150 subpixel-antialiased z-[500]`}>
        {isVisible && sessions && !hideProfile && (
          <Link
            href={`/profile/${sessions?.user?.name}`}
            className="fixed lg:hidden bottom-[90px] w-[50px] h-[50px] flex items-center justify-center right-[20px] rounded-full z-50 bg-secondary"
          >
            <Image
              src={sessions?.user?.image}
              alt="user avatar"
              width={50}
              height={50}
              className="object-cover w-[50px] h-[50px] rounded-full"
            />
          </Link>
        )}
        {isVisible && (
          <div className="fixed bottom-[30px] right-[20px] z-[500] flex h-[45px] px-4 items-center justify-center gap-6 rounded-[8px] text-[10px] bg-secondary shadow-lg lg:hidden">
            <div className="flex items-center gap-4">
              <button className="group flex flex-col items-center">
                <Link href="/">
                  <HomeIcon className="w-5 h-5 group-hover:text-action" />
                </Link>
                <Link
                  href="/"
                  className="font-karla font-bold text-white/60 group-hover:text-action"
                >
                  home
                </Link>
              </button>
              <button className="group flex flex-col items-center gap-[1px]">
                <Link href="/schedule">
                  <CalendarIcon className="w-5 h-5 group-hover:text-action" />
                </Link>
                <Link
                  href="/schedule"
                  className="font-karla font-bold text-white/60 group-hover:text-action"
                >
                  schedule
                </Link>
              </button>
              <button className="group flex gap-[1px] flex-col items-center">
                <Link href="/search/anime">
                  <MagnifyingGlassIcon className="w-5 h-5 group-hover:text-action" />
                </Link>
                <Link
                  href="/search/anime"
                  className="font-karla font-bold text-white/60 group-hover:text-action"
                >
                  search
                </Link>
              </button>
              <button className="group flex gap-[1.5px] flex-col items-center">
                <Link href="/me">
                  <UserIcon className="w-5 h-5 group-hover:text-action" />
                </Link>
                <Link
                  href="/me"
                  className="font-karla font-bold text-white/60 group-hover:text-action"
                >
                  more
                </Link>
              </button>
              {sessions ? (
                <button
                  onClick={() => signOut({ redirect: true })}
                  className="group flex gap-[1.5px] flex-col items-center "
                >
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 96 960 960"
                      className="group-hover:fill-action w-5 h-5 fill-txt"
                    >
                      <path d="M186.666 936q-27 0-46.833-19.833T120 869.334V282.666q0-27 19.833-46.833T186.666 216H474v66.666H186.666v586.668H474V936H186.666zm470.668-176.667l-47-48 102-102H370v-66.666h341.001l-102-102 46.999-48 184 184-182.666 182.666z"></path>
                    </svg>
                  </div>
                  <h1 className="font-karla font-bold text-white/60 group-hover:text-action">
                    logout
                  </h1>
                </button>
              ) : (
                <button
                  onClick={() => signIn("AniListProvider")}
                  className="group flex gap-[1.5px] flex-col items-center "
                >
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 96 960 960"
                      className="group-hover:fill-action w-5 h-5 fill-txt mr-2"
                    >
                      <path d="M486 936v-66.666h287.334V282.666H486V216h287.334q27 0 46.833 19.833T840 282.666v586.668q0 27-19.833 46.833T773.334 936H486zm-78.666-176.667l-47-48 102-102H120v-66.666h341l-102-102 47-48 184 184-182.666 182.666z"></path>
                    </svg>
                  </div>
                  <h1 className="font-karla font-bold text-white/60 group-hover:text-action">
                    login
                  </h1>
                </button>
              )}
            </div>
            <button onClick={handleHideClick}>
              <svg
                width="20"
                height="21"
                className="fill-purple-500"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2.44043"
                  y="0.941467"
                  width="23.5842"
                  height="3.45134"
                  rx="1.72567"
                  transform="rotate(45 2.44043 0.941467)"
                />
                <rect
                  x="19.1172"
                  y="3.38196"
                  width="23.5842"
                  height="3.45134"
                  rx="1.72567"
                  transform="rotate(135 19.1172 3.38196)"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}