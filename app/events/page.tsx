import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Events",
  description: "Event komunitas Soraku - nonton bareng, lomba, dan aktivitas seru lainnya.",
};

const MOCK_EVENTS = [
  {
    id: "1",
    title: "Soraku Anime Watch Party",
    description: "Nonton bareng anime terbaru bersama komunitas secara online via Discord. Semua season terbaru akan ditonton bersama!",
    start_date: new Date(Date.now() + 7 * 86400000).toISOString(),
    end_date: new Date(Date.now() + 7 * 86400000 + 3600000 * 3).toISOString(),
    status: "upcoming",
  },
  {
    id: "2",
    title: "Fan Art Contest: Spring 2025",
    description: "Kompetisi fan art berhadiah menarik dengan tema bunga sakura dan musim semi Jepang.",
    start_date: new Date(Date.now() + 14 * 86400000).toISOString(),
    end_date: new Date(Date.now() + 21 * 86400000).toISOString(),
    status: "upcoming",
  },
  {
    id: "3",
    title: "Soraku Anniversary Celebration",
    description: "Rayakan ulang tahun Soraku! Ada giveaway, event spesial, dan kolaborasi menarik.",
    start_date: new Date(Date.now() + 30 * 86400000).toISOString(),
    end_date: new Date(Date.now() + 32 * 86400000).toISOString(),
    status: "upcoming",
  },
  {
    id: "4",
    title: "Manga Reading Club — Chainsaw Man",
    description: "Baca bareng dan diskusi manga Chainsaw Man chapter terbaru.",
    start_date: new Date(Date.now() - 3 * 86400000).toISOString(),
    end_date: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: "completed",
  },
];

const STATUS_STYLES = {
  upcoming: { text: "Akan Datang", cls: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  ongoing: { text: "Berlangsung", cls: "bg-green-500/20 text-green-400 border-green-500/30" },
  completed: { text: "Selesai", cls: "bg-secondary/20 text-secondary border-secondary/30" },
  cancelled: { text: "Dibatalkan", cls: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export default function EventsPage() {
  return (
    <div className="anime-bg min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(232,194,168,0.1) 0%, transparent 55%)",
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-accent/30 text-xs text-accent font-semibold mb-6">
            🗓️ Community Events
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">
            Event <span className="gradient-text">Soraku</span>
          </h1>
          <p className="text-secondary text-lg max-w-xl mx-auto">
            Ikuti berbagai event seru dari komunitas. Dari nonton bareng hingga kompetisi fan art!
          </p>
        </div>
      </section>

      {/* Events */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 gap-5">
            {MOCK_EVENTS.map((event) => {
              const status = STATUS_STYLES[event.status as keyof typeof STATUS_STYLES];
              return (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <article className="glass-card p-6 flex flex-col sm:flex-row gap-6 group cursor-pointer">
                    {/* Date indicator */}
                    <div className="sm:w-32 shrink-0">
                      <div className="glass rounded-xl p-4 text-center border border-accent/20">
                        <div className="text-accent text-xs font-semibold mb-1">
                          {new Date(event.start_date).toLocaleDateString("id-ID", { month: "short" })}
                        </div>
                        <div className="font-display text-3xl text-white">
                          {new Date(event.start_date).getDate()}
                        </div>
                        <div className="text-secondary text-xs">
                          {new Date(event.start_date).getFullYear()}
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`badge text-xs ${status.cls}`}>
                          {status.text}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-secondary text-sm mb-4">{event.description}</p>

                      <div className="flex items-center gap-4 text-secondary text-xs">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {new Date(event.start_date).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} />
                          {new Date(event.start_date).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} WIB
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={20} />
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
