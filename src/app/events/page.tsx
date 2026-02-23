import { supabaseAdmin } from "@/lib/supabase";
import EventCard from "@/components/EventCard";

async function getEvents() {
  const { data } = await supabaseAdmin
    .from("events")
    .select("*")
    .order("start_date", { ascending: true });
  return data || [];
}

export default async function EventsPage() {
  const events = await getEvents();

  const upcoming = events.filter((e: any) => e.status === "upcoming");
  const ongoing = events.filter((e: any) => e.status === "ongoing");
  const ended = events.filter((e: any) => e.status === "ended");

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4">
            <span className="gradient-text">Events</span> Soraku
          </h1>
          <p className="text-light-base/60">Ikuti event seru bersama komunitas Soraku</p>
        </div>

        {ongoing.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Berlangsung Sekarang
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoing.map((event: any) => <EventCard key={event.id} event={event} />)}
            </div>
          </section>
        )}

        {upcoming.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Segera Hadir</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((event: any) => <EventCard key={event.id} event={event} />)}
            </div>
          </section>
        )}

        {ended.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-light-base/40 mb-4">Sudah Selesai</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ended.map((event: any) => <EventCard key={event.id} event={event} />)}
            </div>
          </section>
        )}

        {events.length === 0 && (
          <div className="text-center py-20 text-light-base/40">
            <p className="text-lg">Belum ada event yang dijadwalkan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
