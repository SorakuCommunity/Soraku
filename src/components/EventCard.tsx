import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  banner_image: string | null;
  start_date: string;
  end_date: string | null;
  status: "upcoming" | "ongoing" | "ended";
}

const STATUS_CONFIG = {
  upcoming: { label: "Segera", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  ongoing: { label: "Berlangsung", color: "text-green-400 bg-green-400/10 border-green-400/30" },
  ended: { label: "Selesai", color: "text-gray-400 bg-gray-400/10 border-gray-400/30" },
};

export default function EventCard({ event }: { event: Event }) {
  const status = STATUS_CONFIG[event.status];

  return (
    <article className="group glass rounded-2xl overflow-hidden border border-white/10 hover:border-primary/30 card-hover transition-all duration-300">
      {/* Banner */}
      <div className="aspect-video relative overflow-hidden bg-dark-3">
        {event.banner_image ? (
          <Image
            src={event.banner_image}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center">
            <div className="text-4xl opacity-20">🎉</div>
          </div>
        )}
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={cn("px-2 py-1 rounded-lg text-xs font-medium border", status.color)}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-light-base group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {event.title}
        </h3>
        <p className="text-sm text-light-base/60 line-clamp-2 mb-4">
          {truncate(event.description, 100)}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-xs text-light-base/40 space-y-1">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(event.start_date)}
            </div>
            {event.end_date && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                s/d {formatDate(event.end_date)}
              </div>
            )}
          </div>
          <Link
            href={`/events/${event.slug}`}
            className="flex items-center gap-1 text-xs text-primary font-medium hover:gap-2 transition-all"
          >
            Detail <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
