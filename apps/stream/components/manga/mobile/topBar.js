import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function TopBar({ info }) {
  return (
    <div className="fixed lg:hidden flex items-center justify-between px-4 py-3 z-50 top-0 w-full bg-secondary shadow-md">
      {info && (
        <>
          <Link
            href={`/manga/${info.id}`}
            className="flex items-center gap-2 text-white hover:text-gray-300 transition"
          >
            <ArrowLeftIcon className="w-6 h-6" />
            <span className="font-semibold">Back</span>
          </Link>
          <h1 className="line-clamp-1 text-white text-lg font-medium text-right flex-1">{info.title.romaji}</h1>
        </>
      )}
    </div>
  );
}
