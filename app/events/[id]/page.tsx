import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Detail Event" };

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="anime-bg min-h-screen pt-32 px-4 pb-20">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Kembali ke Events
        </Link>

        <div className="glass-card overflow-hidden">
          <div className="h-56 bg-gradient-to-br from-accent/10 to-primary/5 flex items-center justify-center">
            <Calendar size={60} className="text-accent/30" />
          </div>

          <div className="p-8">
            <span className="badge text-xs bg-blue-500/20 text-blue-400 border-blue-500/30 mb-4 inline-flex">
              Akan Datang
            </span>

            <h1 className="font-display text-3xl text-white mb-4">
              Detail Event #{id}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-secondary text-sm mb-8">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                19:00 WIB
              </span>
            </div>

            <p className="text-secondary leading-relaxed mb-8">
              Detail event ini akan dimuat dari database Supabase. 
              Buat dan kelola event melalui admin panel.
            </p>

            <button className="btn-primary">Daftar Event</button>
          </div>
        </div>
      </div>
    </div>
  );
}
