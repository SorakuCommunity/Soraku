import { useState, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { AniListInfoTypes } from "types/info/AnilistInfoTypes";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface ListEditorProps {
  animeId: number;
  session: any; // replace 'any' with the appropriate type
  stats?: string;
  prg?: number;
  max?: number;
  info?: AniListInfoTypes; // replace 'any' with the appropriate type
  close: () => void;
}

const ListEditor: React.FC<ListEditorProps> = ({
  animeId,
  session,
  stats = "CURRENT",
  prg = 0,
  max,
  info = undefined,
  close,
}) => {
  const [status, setStatus] = useState<string | null>(stats ?? null);
  const [progress, setProgress] = useState<number | null>(prg ?? null);
  const [score, setScore] = useState<number | null>(null);
  const [rewatches, setRewatches] = useState<number | null>(0); // New state for total rewatches
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const isAnime: boolean = info?.type === "ANIME";

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const mutation = `
        mutation (
          $mediaId: Int!,
          $status: MediaListStatus,
          $score: Float,
          $progress: Int,
          $rewatches: Int,
          $startedAt: FuzzyDateInput,
          $completedAt: FuzzyDateInput,
          $notes: String
        ) {
          SaveMediaListEntry (
            mediaId: $mediaId,
            status: $status,
            score: $score,
            progress: $progress,
            rewatches: $rewatches,
            startedAt: $startedAt,
            completedAt: $completedAt,
            notes: $notes
          ) {
            id
            status
            score
            progress
            rewatches
            startedAt {
              year
              month
              day
            }
            completedAt {
              year
              month
              day
            }
            notes
          }
        }
      `;
      
      const variables: { [key: string]: any } = {
        mediaId: animeId,
        status: status,
        score: score !== null ? parseFloat((score * 2).toFixed(1)) : null,
        progress: progress,
        rewatches: rewatches,
        startedAt: startDate ? parseDateString(startDate) : undefined,
        completedAt: endDate ? parseDateString(endDate) : undefined,
        notes: notes || undefined,
      };

      Object.keys(variables).forEach(key => (variables[key] === undefined || variables[key] === null) && delete variables[key]);

      const response = await fetch("https://graphql.anilist.co/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({
          query: mutation,
          variables: variables,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (result.data && result.data.SaveMediaListEntry) {
        toast.success("Media list entry saved");
        close();
        router.reload();
      } else {
        throw new Error("Failed to save media list entry");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const parseDateString = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return { year, month, day };
  };

  const getKitsuLink = (title: string) => {
    const encodedTitle = encodeURIComponent(title.replace(/[\s:.]+/g, '-').toLowerCase());
    return `https://kitsu.io/${info?.type.toLowerCase()}/${encodedTitle}`;
  };

  const handleStarClick = (rating: number) => {
    setScore(rating);
  };

  return (
    <div className="bg-secondary rounded-lg shadow-lg p-4 max-w-sm mx-auto" onClick={close}> {/* Updated styling for a smaller modal */}
      <div className="relative" onClick={(e) => e.stopPropagation()}> {/* Prevent click event from closing modal */}
        {info && info.bannerImage && (
          <div className="mb-2 rounded-lg overflow-hidden">
            <Image
              src={info.bannerImage}
              alt={`${info.title.romaji} banner`}
              width={300}
              height={100}
              className="w-full object-cover rounded-lg"
            />
          </div>
        )}
        <h2 className="text-xl font-bold mb-2 text-white">List Editor</h2>
        {loading ? (
          <Skeleton count={4} height={20} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-white">Status:</label>
              <select
                name="status"
                id="status"
                value={status || ""}
                onChange={(e) => setStatus(e.target.value || null)}
                className="mt-1 block w-full bg-gray-700 rounded-md border-gray-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
              >
                <option value="">Select status</option>
                <option value="CURRENT">{isAnime ? "Watching" : "Reading"}</option>
                <option value="COMPLETED">Completed</option>
                <option value="PAUSED">Paused</option>
                <option value="DROPPED">Dropped</option>
                <option value="PLANNING">Plan to {isAnime ? "watch" : "read"}</option>
              </select>
            </div>
            <div>
              <label htmlFor="progress" className="block text-sm font-medium text-white">Progress:</label>
              <input
                type="number"
                name="progress"
                id="progress"
                value={progress ?? ""}
                max={max}
                onChange={(e) => setProgress(e.target.value ? Number(e.target.value) : null)}
                className="mt-1 block w-full bg-gray-700 rounded-md border-gray-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="rewatches" className="block text-sm font-medium text-white">Total Rewatches:</label>
              <input
                type="number"
                name="rewatches"
                id="rewatches"
                value={rewatches ?? ""}
                onChange={(e) => setRewatches(e.target.value ? Number(e.target.value) : null)}
                className="mt-1 block w-full bg-gray-700 rounded-md border-gray-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Score:</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className={`text-xl ${score && score >= star * 2 ? 'text-yellow-500' : 'text-gray-400'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-white">Start Date:</label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full bg-gray-700 rounded-md border-gray-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-white">End Date:</label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full bg-gray-700 rounded-md border-gray-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-white">Notes:</label>
              <textarea
                name="notes"
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 block w-full bg-gray-700 rounded-md border-gray-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
                rows={2}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-md py-1 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save
            </button>
          </form>
        )}
        {info ? (
          <div className="flex justify-center space-x-2 mt-2">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://anilist.co/${info.type.toLowerCase()}/${info.id}`}
              className="flex-center group relative w-6 h-6 bg-gray-700 rounded-full"
            >
              <span className="absolute pointer-events-none z-40 opacity-0 -translate-y-8 group-hover:-translate-y-10 group-hover:opacity-100 font-Archivo shadow-tersier shadow-md whitespace-nowrap bg-gray-700 px-1 py-1 rounded transition-all duration-200 ease-out">
                See on AniList
              </span>
              <Image
                className="scale-[60%] pb-[1px]"
                src="/svg/anilist-icon.svg"
                alt="anilist_icon"
                width={16}
                height={16}
              />
            </a>
            {info.idMal && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://myanimelist.net/${info.type.toLowerCase()}/${info.idMal}`}
                className="flex-center group relative w-6 h-6 bg-gray-700 rounded-full"
              >
                <span className="absolute pointer-events-none z-40 opacity-0 -translate-y-8 group-hover:-translate-y-10 group-hover:opacity-100 font-Archivo shadow-tersier shadow-md whitespace-nowrap bg-gray-700 px-1 py-1 rounded transition-all duration-200 ease-out">
                  See on MyAnimeList
                </span>
                <Image
                  className="scale-[60%] pb-[1px]"
                  src="/svg/mal.svg"
                  alt="mal_icon"
                  width={16}
                  height={16}
                />
              </a>
            )}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={getKitsuLink(info.title.romaji)}
              className="flex-center group relative w-6 h-6 bg-gray-700 rounded-full"
            >
              <span className="absolute pointer-events-none z-40 opacity-0 -translate-y-8 group-hover:-translate-y-10 group-hover:opacity-100 font-Archivo shadow-tersier shadow-md whitespace-nowrap bg-gray-700 px-1 py-1 rounded transition-all duration-200 ease-out">
                See on Kitsu
              </span>
              <Image
                className="scale-[60%] pb-[1px]"
                src="https://m3u8-proxy-cors-c1i6.vercel.app/cors?url=https://kitsu.app/favicon-194x194-2f4dbec5ffe82b8f61a3c6d28a77bc6e.png"
                alt="kitsu_icon"
                width={16}
                height={16}
              />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://simkl.com/${info.type.toLowerCase()}/${encodeURIComponent(info.title.romaji)}`}
              className="flex-center group relative w-6 h-6 bg-gray-700 rounded-full"
            >
              <span className="absolute pointer-events-none z-40 opacity-0 -translate-y-8 group-hover:-translate-y-10 group-hover:opacity-100 font-Archivo shadow-tersier shadow-md whitespace-nowrap bg-gray-700 px-1 py-1 rounded transition-all duration-200 ease-out">
                See on SIMKL
              </span>
              <Image
                className="scale-[60%] pb-[1px]"
                src="https://m3u8-proxy-cors-c1i6.vercel.app/cors?url=https://eu.simkl.in/img_favicon/v2/favicon-32x32.png"
                alt="simkl_icon"
                width={16}
                height={16}
              />
            </a>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default ListEditor;
