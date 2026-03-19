"use client";

import { useEffect, useState } from "react";

interface Stats {
  discord_members: number;
  discord_online:  number;
  event_count:     number;
  member_count:    number;
  founded_year:    number;
}

function CountUp({ to, duration = 1600 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * to));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to, duration]);
  return <>{val.toLocaleString("id-ID")}</>;
}

const STAT_DEFS = [
  {
    key:    "discord_members" as keyof Stats,
    icon:   "👥",
    label:  "Member Discord",
    suffix: "+",
    desc:   "Anggota aktif di server",
  },
  {
    key:    "event_count" as keyof Stats,
    icon:   "🗓️",
    label:  "Event Digelar",
    suffix: "+",
    desc:   "Sejak Soraku berdiri",
  },
  {
    key:    "founded_year" as keyof Stats,
    icon:   "🌸",
    label:  "Berdiri Sejak",
    suffix: "",
    desc:   "Non-profit selamanya",
  },
  {
    key:    "member_count" as keyof Stats,
    icon:   "🧩",
    label:  "Member Platform",
    suffix: "+",
    desc:   "Terdaftar di www.soraku.id",
  },
];

export function AboutStatsClient() {
  const [stats, setStats]   = useState<Stats | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d.data ?? d); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <section className="px-4 py-12 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STAT_DEFS.map(({ key, icon, label, suffix, desc }) => {
            const value = stats?.[key] ?? 0;
            return (
              <div key={key}
                className="glass-card flex flex-col gap-3 p-5 transition-all hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{icon}</span>
                </div>
                <div>
                  <p className="text-3xl font-black leading-none text-foreground sm:text-4xl">
                    {loaded ? (
                      <><CountUp to={value} />{suffix}</>
                    ) : (
                      <span className="animate-pulse text-muted-foreground/30">—</span>
                    )}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-foreground/80">{label}</p>
                  <p className="text-[11px] text-muted-foreground/50 mt-0.5">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
