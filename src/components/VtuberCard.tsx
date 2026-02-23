"use client";

import Image from "next/image";
import { Twitter, Youtube, Instagram, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Vtuber {
  id: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  generation: number;
  slug: string;
  agency: string | null;
  social_links: Record<string, string> | null;
}

interface VtuberCardProps {
  vtuber: Vtuber;
  onClick: (vtuber: Vtuber) => void;
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  twitter: <Twitter className="w-3.5 h-3.5" />,
  youtube: <Youtube className="w-3.5 h-3.5" />,
  instagram: <Instagram className="w-3.5 h-3.5" />,
  website: <Globe className="w-3.5 h-3.5" />,
};

export default function VtuberCard({ vtuber, onClick }: VtuberCardProps) {
  return (
    <button
      onClick={() => onClick(vtuber)}
      className={cn(
        "group relative w-full text-left rounded-2xl glass card-hover glow-hover",
        "border border-white/10 hover:border-primary/40 transition-all duration-300",
        "overflow-hidden"
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-5 flex flex-col items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-white/10 group-hover:ring-primary/50 transition-all duration-300">
            {vtuber.avatar_url ? (
              <Image
                src={vtuber.avatar_url}
                alt={vtuber.name}
                width={80}
                height={80}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-2xl font-bold text-white">
                {vtuber.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full ring-2 ring-dark-base flex items-center justify-center">
            <span className="text-[9px] font-bold text-white">{vtuber.generation}</span>
          </div>
        </div>

        {/* Info */}
        <div className="text-center">
          <h3 className="font-semibold text-light-base group-hover:text-primary transition-colors">
            {vtuber.name}
          </h3>
          {vtuber.agency && (
            <p className="text-xs text-light-base/50 mt-0.5">{vtuber.agency}</p>
          )}
          {vtuber.bio && (
            <p className="text-xs text-light-base/60 mt-2 line-clamp-2">
              {vtuber.bio}
            </p>
          )}
        </div>

        {/* Social icons */}
        {vtuber.social_links && Object.keys(vtuber.social_links).length > 0 && (
          <div className="flex gap-2">
            {Object.entries(vtuber.social_links).map(([platform]) => (
              <div
                key={platform}
                className="w-6 h-6 rounded-md glass flex items-center justify-center text-light-base/40"
              >
                {SOCIAL_ICONS[platform] || <Globe className="w-3.5 h-3.5" />}
              </div>
            ))}
          </div>
        )}

        {/* View more hint */}
        <span className="text-[11px] text-primary/0 group-hover:text-primary/70 transition-colors">
          Lihat Profil →
        </span>
      </div>
    </button>
  );
}
