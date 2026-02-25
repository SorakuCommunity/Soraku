import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";

const MOCK_EVENTS = [
  {
    id: "1",
    title: "Soraku Anime Watch Party",
    description: "Nonton bareng anime terbaru bersama komunitas secara online via Discord.",
    start_date: new Date(Date.now() + 7 * 86400000).toISOString(),
    status: "upcoming",
    banner_image: null,
  },
  {
    id: "2",
    title: "Fan Art Contest: Spring 2025",
    description: "Kompetisi fan art berhadiah menarik dengan tema bunga sakura.",
    start_date: new Date(Date.now() + 14 * 86400000).toISOString(),
    status: "upcoming",
    banner_image: null,
  },
];

const STATUS_COLORS = {
  upcoming: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ongoing: "bg-green-500/20 text-green-400 border-green-500/30",
  completed: "bg-secondary/20 text-secondary border-secondary/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

const STATUS_LABELS = {
  upcoming: "Akan Datang",
  ongoing: "Berlangsung",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export default function EventsPreview() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-2">
              Events <span className="gradient-text">Mendatang</span>
            </h2>
            <p className="text-secondary">Jangan sampai ketinggalan event seru komunitas Soraku</p>
          </div>
          <Link href="/events" className="hidden sm:flex items-center gap-2 text-primary text-sm hover:gap-3 transition-all">
            Lihat Semua
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {MOCK_EVENTS.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <article className="glass-card p-6 flex flex-col gap-4 group h-full">
                {/* Banner placeholder */}
                <div className="h-40 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center">
                  <Calendar size={40} className="text-primary/30" />
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`badge text-xs ${STATUS_COLORS[event.status as keyof typeof STATUS_COLORS]}`}
                  >
                    {STATUS_LABELS[event.status as keyof typeof STATUS_LABELS]}
                  </span>
                </div>

                <h3 className="text-white font-semibold text-lg group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <p className="text-secondary text-sm flex-1">{event.description}</p>

                <div className="flex items-center gap-1.5 text-secondary text-xs mt-auto">
                  <Clock size={12} />
                  <span>
                    {new Date(event.start_date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
