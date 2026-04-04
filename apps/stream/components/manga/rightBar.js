import {
  ChevronDownIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useAniList } from "../../lib/anilist/useAnilist";
import AniList from "../media/aniList";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function RightBar({
  id,
  hasRun,
  session,
  data,
  currentChapter,
  paddingX,
  setPaddingX,
  layout,
  setLayout,
  setIsKeyOpen,
  scaleImg,
  setScaleImg,
}) {
  const { markProgress } = useAniList(session);

  const [status, setStatus] = useState("CURRENT");
  const [progress, setProgress] = useState(0);
  const [volumeProgress, setVolumeProgress] = useState(0);

  useEffect(() => {
    if (currentChapter?.number) {
      setProgress(currentChapter.number);
    }
  }, [currentChapter]);

  const saveProgress = async () => {
    if (session) {
      const parsedProgress = parseFloat(progress);
      const parsedVolumeProgress = parseFloat(volumeProgress);

      if (
        parsedProgress === parseInt(parsedProgress) &&
        parsedVolumeProgress === parseInt(parsedVolumeProgress)
      ) {
        markProgress({ mediaId: id, progress, stats: status, volumeProgress });
        hasRun.current = true;
      } else {
        toast.error("Progress must be a whole number!");
      }
    }
  };

  const changeMode = (e) => {
    setLayout(Number(e.target.value));
  };

  return (
    <div className="hidden lg:flex flex-col gap-5 shrink-0 w-[16rem] bg-primary py-5 px-4 relative rounded-lg shadow-lg">
      <div
        className="fixed right-5 bottom-5 group cursor-pointer"
        title="Keyboard Shortcuts"
        onClick={() => setIsKeyOpen(true)}
      >
        <ExclamationCircleIcon className="w-6 h-6 text-secondary transition-transform transform hover:scale-110" />
      </div>
      {Array.isArray(data) && (
        <div className="flex flex-col gap-3 w-full">
          <h1 className="font-Archivo font-bold xl:text-lg text-secondary">Reading Mode</h1>
          <div className="flex relative">
            <select
              className="bg-secondary text-sm xl:text-base cursor-pointer w-full p-2 font-Archivo rounded-md appearance-none border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
              defaultValue={layout}
              onChange={changeMode}
            >
              <option value={1}>Vertical</option>
              <option value={2}>Right to Left</option>
              <option value={3}>Right to Left (1 Page)</option>
            </select>
            <ChevronDownIcon className="w-5 h-5 text-white absolute inset-0 my-auto mx-52" />
          </div>
        </div>
      )}
      {/* Zoom */}
      <div className="flex flex-col gap-3 w-full">
        <h1 className="font-Archivo font-bold xl:text-lg text-secondary">Scale Image</h1>
        <div className="grid grid-cols-3 text-sm xl:text-base gap-5 place-content-evenly justify-items-center">
          <button
            type="button"
            onClick={() => {
              setPaddingX(paddingX - 50);
              setScaleImg(scaleImg + 0.1);
            }}
            className="bg-secondary w-full flex-center p-2 rounded-md text-white transition-transform transform hover:scale-110"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => {
              setPaddingX(paddingX + 50);
              setScaleImg(scaleImg - 0.1);
            }}
            className="bg-secondary w-full flex-center p-2 rounded-md text-white transition-transform transform hover:scale-110"
          >
            -
          </button>
          <button
            type="button"
            onClick={() => {
              setPaddingX(208);
              setScaleImg(1);
            }}
            className="bg-secondary w-full flex-center p-2 rounded-md text-white transition-transform transform hover:scale-110"
          >
            Reset
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <h1 className="font-Archivo font-bold xl:text-lg text-secondary">Tracking</h1>
        {session ? (
          id?.length > 6 ? (
            <p className="flex-center w-full py-2 font-Archivo text-secondary">
              Not available on AniList
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="space-y-1">
                <label className="font-Archivo font-semibold text-gray-500 text-xs">
                  Status
                </label>
                <div className="relative">
                  <select
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-2 py-1 font-Archivo rounded-md bg-secondary appearance-none text-sm text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="CURRENT">Reading</option>
                    <option value="PLANNING">Plan to Read</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="REPEATING">Rereading</option>
                    <option value="PAUSED">Paused</option>
                    <option value="DROPPED">Dropped</option>
                  </select>
                  <ChevronDownIcon className="w-5 h-5 text-white absolute inset-0 my-auto mx-52" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-Archivo font-semibold text-gray-500 text-xs">
                  Chapter Progress
                </label>
                <input
                  id="chapter-progress"
                  type="number"
                  placeholder="0"
                  min={0}
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  className="w-full px-2 py-1 rounded-md bg-secondary text-sm text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <div className="space-y-1">
                <label className="font-Archivo font-semibold text-gray-500 text-xs">
                  Volume Progress
                </label>
                <input
                  type="number"
                  placeholder="0"
                  min={0}
                  onChange={(e) => setVolumeProgress(e.target.value)}
                  className="w-full px-2 py-1 rounded-md bg-secondary text-sm text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <button
                type="button"
                onClick={saveProgress}
                className="w-full bg-secondary py-2 my-5 rounded-md text-white text-sm xl:text-base shadow-md font-Archivo font-semibold transition-transform transform hover:scale-110"
              >
                Save Progress
              </button>
              <button
                type="button"
                onClick={() => window.open('https://mangapin.com', '_blank')}
                className="w-full bg-[#cd6308] py-2 my-5 rounded-md text-white text-sm xl:text-base shadow-md font-Archivo font-semibold transition-transform transform hover:scale-110"
              >
                Read with MangaPin!
                <span className="absolute text-sm z-50 w-20 text-center bottom-11 text-white shadow-lg opacity-0 bg-secondary p-1 rounded-md font-Archivo font-light invisible group-hover:visible group-hover:opacity-100 duration-300 transition-all">
                  Better UI, Full-screen, and more!
                </span>
              </button>
            </div>
          )
        ) : (
          <button
            type="button"
            onClick={() => signIn("AniListProvider")}
            className="flex-center gap-2 bg-secondary hover:bg-secondary/50 text-white hover:text-txt p-2 rounded-md cursor-pointer shadow-md transition-transform transform hover:scale-110"
          >
            <span className="font-Archivo">Login to AniList</span>
            <div className="flex-center w-5 h-5">
              <AniList />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
