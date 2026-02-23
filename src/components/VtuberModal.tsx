"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, Twitter, Youtube, Instagram, Globe, ExternalLink } from "lucide-react";
import type { Vtuber } from "./VtuberCard";
import { getGenerationLabel } from "@/lib/utils";

interface VtuberModalProps {
  vtuber: Vtuber | null;
  onClose: () => void;
}

const SOCIAL_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  twitter: {
    icon: <Twitter className="w-4 h-4" />,
    label: "Twitter / X",
    color: "hover:bg-sky-500/20 hover:text-sky-400 hover:border-sky-500/30",
  },
  youtube: {
    icon: <Youtube className="w-4 h-4" />,
    label: "YouTube",
    color: "hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30",
  },
  instagram: {
    icon: <Instagram className="w-4 h-4" />,
    label: "Instagram",
    color: "hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/30",
  },
  website: {
    icon: <Globe className="w-4 h-4" />,
    label: "Website",
    color: "hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/30",
  },
};

export default function VtuberModal({ vtuber, onClose }: VtuberModalProps) {
  useEffect(() => {
    if (vtuber) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [vtuber]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!vtuber) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md glass-dark rounded-2xl border border-white/10 overflow-hidden animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg glass flex items-center justify-center text-light-base/60 hover:text-light-base transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header banner */}
        <div className="h-24 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-dark-2/80 to-transparent" />
        </div>

        {/* Avatar (overlapping) */}
        <div className="flex flex-col items-center -mt-12 px-6 pb-6 relative">
          <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-dark-2 mb-4">
            {vtuber.avatar_url ? (
              <Image
                src={vtuber.avatar_url}
                alt={vtuber.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-3xl font-bold text-white">
                {vtuber.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Name & generation badge */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-light-base">{vtuber.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium border border-primary/30">
                {getGenerationLabel(vtuber.generation)}
              </span>
              {vtuber.agency && (
                <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium border border-accent/30">
                  {vtuber.agency}
                </span>
              )}
            </div>
          </div>

          {/* Bio */}
          {vtuber.bio && (
            <div className="w-full glass rounded-xl p-4 mb-4">
              <p className="text-sm text-light-base/70 leading-relaxed">{vtuber.bio}</p>
            </div>
          )}

          {/* Social Links */}
          {vtuber.social_links && Object.keys(vtuber.social_links).length > 0 && (
            <div className="w-full">
              <p className="text-xs text-light-base/40 font-medium uppercase tracking-wider mb-2">
                Social Media
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(vtuber.social_links).map(([platform, url]) => {
                  const config = SOCIAL_CONFIG[platform] || {
                    icon: <Globe className="w-4 h-4" />,
                    label: platform,
                    color: "hover:bg-white/10",
                  };
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg glass border border-white/10 text-light-base/60 text-sm transition-all ${config.color}`}
                    >
                      {config.icon}
                      <span className="flex-1">{config.label}</span>
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
