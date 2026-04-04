import { getHeaders, getRandomId } from "@/utils/imageUtils";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export function LeftBar({
  data,
  page,
  info,
  currentId,
  setSeekPage,
  mediaId,
  providerId,
}) {
  const router = useRouter();
  function goBack() {
    router.push(`/manga/${info.id}`);
  }

  return (
    <div className="hidden lg:block shrink-0 w-[16rem] h-screen overflow-y-auto bg-primary relative group">
      <div className="flex flex-col p-4">
        <button
          type="button"
          onClick={goBack}
          className="flex items-center p-2 gap-2 bg-secondary rounded-md hover:bg-secondary/80 transition"
        >
          <ArrowLeftIcon className="w-5 h-5 text-white" />
          <h1 className="font-semibold text-sm xl:text-base text-white">
            {info?.title?.romaji}
          </h1>
        </button>

        <div className="mt-4">
          <h1 className="font-bold text-lg text-white">Provider</h1>
          <p className="bg-secondary text-sm xl:text-base capitalize rounded-md py-2 px-3 text-white">
            {data.providerId}
          </p>
        </div>

        <div className="mt-4">
          <h1 className="font-bold text-lg text-white">Chapters</h1>
          <div className="h-[30vh] bg-secondary rounded-md overflow-auto scrollbar-thin scrollbar-thumb-[#363639] scrollbar-thumb-rounded-md hover:scrollbar-thumb-[#424245]">
            {data?.chapters?.map((x, index) => (
              <Link
                key={getRandomId()}
                href={`/manga/read/${data.providerId}?id=${mediaId}&chapterId=${encodeURIComponent(x.id)}${info?.id?.length > 6 ? "" : `&anilist=${info?.id}`}&num=${x.number}`}
                className={`block py-2 px-3 hover:bg-[#424245] rounded-md ${x.id === currentId ? "text-action" : "text-white"}`}
              >
                <h1 className="line-clamp-1">
                  <span className="font-bold">{x.number || index + 1}.</span> {x.title || `Chapter ${x.number || index + 1}`}
                </h1>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h1 className="font-bold text-lg text-white">Pages</h1>
          <div className="h-[30vh] bg-secondary rounded-md overflow-auto scrollbar-thin scrollbar-thumb-[#363639] scrollbar-thumb-rounded-md hover:scrollbar-thumb-[#424245]">
            {Array.isArray(page) ? (
              <div className="grid grid-cols-2 gap-4 p-4">
                {page.map((x, index) => (
                  <div key={getRandomId()} className="flex flex-col items-center cursor-pointer" onClick={() => setSeekPage(index)}>
                    <Image
                      src={`https://m3u8-proxy-cors-c1i6.vercel.app/cors?url=${encodeURIComponent(x.url)}${x?.headers?.Referer ? `&headers=${encodeURIComponent(JSON.stringify(x?.headers))}` : `&headers=${encodeURIComponent(JSON.stringify(getHeaders(providerId)))}`}`}
                      alt="chapter image"
                      width={100}
                      height={200}
                      className="w-full h-[120px] object-contain scale-90"
                    />
                    <h1 className="text-white">Page {index + 1}</h1>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-white">{page?.error || "No Pages."}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
