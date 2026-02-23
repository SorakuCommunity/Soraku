"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import VtuberCard, { type Vtuber } from "@/components/VtuberCard";
import VtuberModal from "@/components/VtuberModal";
import { getGenerationLabel } from "@/lib/utils";

export default function GenerationPage() {
  const params = useParams();
  const generationStr = params.generation as string;
  const generationNum = parseInt(generationStr.replace("generation-", ""));

  const [vtubers, setVtubers] = useState<Vtuber[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVtuber, setSelectedVtuber] = useState<Vtuber | null>(null);

  useEffect(() => {
    const fetchVtubers = async () => {
      try {
        const res = await fetch(`/api/vtuber?generation=${generationNum}`);
        const data = await res.json();
        setVtubers(data.vtubers || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVtubers();
  }, [generationNum]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back */}
        <Link
          href="/vtuber"
          className="inline-flex items-center gap-2 text-sm text-light-base/60 hover:text-primary mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali ke VTuber
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black gradient-text mb-2">
            {getGenerationLabel(generationNum)}
          </h1>
          <p className="text-light-base/50">
            {loading ? "Memuat..." : `${vtubers.length} VTuber`}
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl p-5 border border-white/10 animate-pulse">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white/10" />
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VTuber Grid */}
        {!loading && vtubers.length === 0 && (
          <div className="text-center py-20 text-light-base/40">
            <p className="text-lg">Belum ada VTuber di generasi ini.</p>
          </div>
        )}

        {!loading && vtubers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vtubers.map((vtuber) => (
              <VtuberCard
                key={vtuber.id}
                vtuber={vtuber}
                onClick={setSelectedVtuber}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        <VtuberModal
          vtuber={selectedVtuber}
          onClose={() => setSelectedVtuber(null)}
        />
      </div>
    </div>
  );
}
