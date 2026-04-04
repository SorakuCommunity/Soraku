import Image from "next/image";
import { cubicBezier, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { MdChevronRight } from "react-icons/md"; // Import MdChevronRight
import Loading from "@/components/shared/loading";
import { timeStamptoAMPM, timeStamptoHour } from "@/utils/getTimes";
import {
  filterFormattedSchedule,
  sortScheduleByDay,
  transformSchedule
} from "@/utils/schedulesUtils";

const isAired = (timestamp: number | null) => {
  if (!timestamp) return false;
  const currentTime = Math.floor(Date.now() / 1000);
  return timestamp <= currentTime;
};

const AnimeSchedule = ({ schedule }: { schedule: any }) => {
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const sortedSchedule = sortScheduleByDay(schedule);
  const formattedSchedule = transformSchedule(schedule);
  const today = new Date().toLocaleString('en-US', { weekday: 'long' }); // Get current day

  return (
    <div className="bg-primary rounded-lg shadow-lg p-2 sm:p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="flex items-center">
          <Link href="/schedule" className="flex items-center hover:underline">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 mr-2">Today's Anime Schedule</h2>
            <MdChevronRight className="ml-1 w-6 h-6 text-white" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loading />
        </div>
      ) : (
        <div 
          className="overflow-x-auto scrollbar-hide" 
          ref={scrollContainerRef} 
          style={{ cursor: 'grab' }} 
          onMouseDown={() => scrollContainerRef.current?.classList.add('grabbing')} 
          onMouseUp={() => scrollContainerRef.current?.classList.remove('grabbing')}
          onTouchStart={() => scrollContainerRef.current?.classList.add('grabbing')} 
          onTouchEnd={() => scrollContainerRef.current?.classList.remove('grabbing')}
        >
          {Object.entries(filterFormattedSchedule(formattedSchedule, today)).map(([day, timeSlots]) => (
            <div key={`section_${day}`} className="mb-4">
              <h3 className="text-md sm:text-lg font-bold text-white mb-2">{day}</h3>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                  ease: cubicBezier(0.35, 0.17, 0.3, 0.86)
                }}
                className="flex gap-2"
              >
                {Object.entries(timeSlots).map(([time, animeList]) => (
                  animeList.map((s) => { // Show all anime
                    const m = s.media;
                    return (
                      <Link
                        key={m.id}
                        href={`/${m.type.toLowerCase()}/${m.id}`}
                        className="bg-secondary rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 ease-out w-[100px] flex-shrink-0"
                      >
                        <div className="relative pb-[56.25%]">
                          <Image
                            src={m.coverImage.extraLarge}
                            alt={m.title.english || m.title.romaji} // Use Romaji title as a backup
                            layout="fill"
                            objectFit="cover"
                            className="absolute top-0 left-0"
                          />
                        </div>
                        <div className="p-1">
                          <h4 className="font-semibold text-white mb-1 line-clamp-1 text-xs">{m.title.english || m.title.romaji}</h4> {/* Use Romaji title as a backup */}
                          <p className="text-xs text-gray-300">
                            Ep {s?.episode} - {timeStamptoHour(Number(s.airingAt))}
                          </p>
                        </div>
                      </Link>
                    );
                  })
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimeSchedule;