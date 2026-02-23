import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";

async function getGenerations() {
  const { data } = await supabaseAdmin
    .from("vtubers")
    .select("generation")
    .order("generation");

  if (!data) return [];
  const unique = Array.from(new Set(data.map((v: { generation: number }) => v.generation)));
  return unique;
}

async function getVtuberCounts() {
  const { data } = await supabaseAdmin.from("vtubers").select("generation");
  if (!data) return {};
  const counts: Record<number, number> = {};
  data.forEach((v: { generation: number }) => {
    counts[v.generation] = (counts[v.generation] || 0) + 1;
  });
  return counts;
}

export default async function VtuberPage() {
  const [generations, counts] = await Promise.all([getGenerations(), getVtuberCounts()]);

  const generationColors = [
    "from-blue-500/20 to-primary/20",
    "from-purple-500/20 to-accent/20",
    "from-green-500/20 to-teal-500/20",
    "from-yellow-500/20 to-orange-500/20",
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4">
            <span className="gradient-text">VTuber</span> Soraku
          </h1>
          <p className="text-light-base/60 max-w-xl mx-auto">
            Kenali para virtual idol dari setiap generasi Soraku. Klik generasi untuk melihat semua talent!
          </p>
        </div>

        {/* Generation cards */}
        {generations.length === 0 ? (
          <div className="text-center py-20 text-light-base/40">
            <p className="text-lg">Belum ada VTuber yang terdaftar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {generations.map((gen, idx) => (
              <Link
                key={gen}
                href={`/vtuber/generation-${gen}`}
                className="group glass rounded-2xl p-8 border border-white/10 hover:border-primary/40 card-hover transition-all duration-300 relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${generationColors[idx % generationColors.length]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="text-5xl font-black text-white/10 mb-2 group-hover:text-primary/20 transition-colors">
                    G{gen}
                  </div>
                  <h2 className="text-xl font-bold text-light-base group-hover:text-primary transition-colors mb-2">
                    Generasi {gen}
                  </h2>
                  <p className="text-light-base/50 text-sm">
                    {counts[gen] || 0} VTuber
                  </p>
                  <div className="flex items-center gap-1 mt-4 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Lihat Semua <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
