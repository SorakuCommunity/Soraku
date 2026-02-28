"use client";

import { useState } from "react";
import { Music2, ExternalLink, Play, Pause, Search } from "lucide-react";

interface Track {
  id: string;
  name: string;
  artist: string;
  albumArt: string;
  previewUrl?: string;
  externalUrl: string;
}

const FEATURED_TRACKS: Track[] = [
  {
    id: "1",
    name: "Shinzou wo Sasageyo",
    artist: "Linked Horizon",
    albumArt: "",
    previewUrl: undefined,
    externalUrl: "https://open.spotify.com",
  },
  {
    id: "2",
    name: "Gurenge",
    artist: "LiSA",
    albumArt: "",
    previewUrl: undefined,
    externalUrl: "https://open.spotify.com",
  },
  {
    id: "3",
    name: "Unravel",
    artist: "TK from Ling tosite sigure",
    albumArt: "",
    previewUrl: undefined,
    externalUrl: "https://open.spotify.com",
  },
];

export default function SpotifyPlayer() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#1DB954]/20 flex items-center justify-center">
          <Music2 size={20} className="text-[#1DB954]" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Soraku Playlist</h3>
          <p className="text-secondary text-xs">Musik anime yang lagi hits</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
        <input
          type="text"
          placeholder="Cari lagu anime..."
          className="input-glass pl-9 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Track List */}
      <div className="flex flex-col gap-2">
        {FEATURED_TRACKS.map((track) => (
          <div
            key={track.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
          >
            {/* Album Art */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1DB954]/30 to-primary/20 flex items-center justify-center shrink-0">
              <Music2 size={16} className="text-[#1DB954]/60" />
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{track.name}</div>
              <div className="text-secondary text-xs truncate">{track.artist}</div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setPlaying(playing === track.id ? null : track.id)}
                className="p-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
              >
                {playing === track.id ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <a
                href={track.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-[#1DB954]/20 text-[#1DB954] hover:bg-[#1DB954]/30 transition-colors"
              >
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Playing indicator */}
            {playing === track.id && (
              <div className="flex items-end gap-0.5 h-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#1DB954] rounded-sm animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s`, height: `${50 + i * 25}%` }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-[#1DB954] text-sm hover:underline"
        >
          Buka di Spotify
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
