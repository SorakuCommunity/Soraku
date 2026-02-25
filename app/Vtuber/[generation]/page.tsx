import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ generation: string }>;
}): Promise<Metadata> {
  const { generation } = await params;
  return {
    title: `Vtuber ${generation}`,
  };
}

export default async function VtuberGenerationPage({
  params,
}: {
  params: Promise<{ generation: string }>;
}) {
  const { generation } = await params;

  return (
    <div className="anime-bg min-h-screen pt-32 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/vtuber"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Kembali ke Vtuber
        </Link>
        <h1 className="font-display text-4xl text-white mb-4">
          Generasi: <span className="gradient-text capitalize">{generation.replace(/-/g, " ")}</span>
        </h1>
        <p className="text-secondary mb-10">
          Semua talent dari generasi ini.
        </p>
        <div className="glass-card p-8 text-center">
          <p className="text-secondary">
            Data talent akan dimuat dari database. Hubungkan ke Supabase untuk melihat data lengkap.
          </p>
        </div>
      </div>
    </div>
  );
}
