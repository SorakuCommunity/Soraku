import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  params: { slug: string };
}

const STATUS_CONFIG = {
  upcoming: { label: "Segera", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  ongoing: { label: "Berlangsung", color: "text-green-400 bg-green-400/10 border-green-400/30" },
  ended: { label: "Selesai", color: "text-gray-400 bg-gray-400/10 border-gray-400/30" },
};

async function getEvent(slug: string) {
  const { data } = await supabaseAdmin
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getEvent(params.slug);
  if (!event) notFound();

  const status = STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.upcoming;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-light-base/60 hover:text-primary mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali ke Events
        </Link>

        <article className="glass rounded-2xl border border-white/10 overflow-hidden">
          {event.banner_image && (
            <div className="aspect-video relative">
              <Image src={event.banner_image} alt={event.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-2/60 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className={cn("px-3 py-1 rounded-lg text-sm font-medium border", status.color)}>
                  {status.label}
                </span>
              </div>
            </div>
          )}

          <div className="p-8">
            {!event.banner_image && (
              <span className={cn("inline-block px-3 py-1 rounded-lg text-sm font-medium border mb-4", status.color)}>
                {status.label}
              </span>
            )}
            <h1 className="text-3xl font-black text-light-base mb-4">{event.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-light-base/50 mb-6 pb-6 border-b border-white/10">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                Mulai: {formatDate(event.start_date)}
              </span>
              {event.end_date && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  Selesai: {formatDate(event.end_date)}
                </span>
              )}
            </div>

            <div className="text-light-base/80 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
