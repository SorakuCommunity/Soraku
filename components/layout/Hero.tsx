"use client";

import Link from "next/link";
import { ArrowRight, Users, Star, Zap } from "lucide-react";

const STATS = [
  { label: "Members", value: "10K+", icon: Users },
  { label: "Konten", value: "5K+", icon: Star },
  { label: "Events", value: "200+", icon: Zap },
];

// Floating particle component
function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full bg-primary/30 animate-float"
      style={style}
    />
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, rgba(79,163,209,0.12) 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, rgba(232,194,168,0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 10%, rgba(110,143,166,0.07) 0%, transparent 40%)",
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(79,163,209,1) 1px, transparent 1px), linear-gradient(90deg, rgba(79,163,209,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Floating particles */}
        <Particle style={{ width: 6, height: 6, top: "20%", left: "15%", animationDelay: "0s" }} />
        <Particle style={{ width: 4, height: 4, top: "60%", left: "80%", animationDelay: "1s" }} />
        <Particle style={{ width: 8, height: 8, top: "75%", left: "25%", animationDelay: "2s" }} />
        <Particle style={{ width: 5, height: 5, top: "35%", right: "20%", animationDelay: "3s" }} />
        <Particle style={{ width: 3, height: 3, top: "50%", left: "50%", animationDelay: "1.5s" }} />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/30 text-xs text-primary font-semibold mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Komunitas Anime & Manga Terbesar di Indonesia
        </div>

        {/* Heading */}
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-white mb-6 leading-tight animate-slide-up">
          Selamat Datang di{" "}
          <span className="gradient-text text-glow">SORAKU</span>
        </h1>

        <p className="text-secondary text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed">
          Tempat para pecinta anime, manga, dan kultur digital Jepang berkumpul, 
          berbagi, dan berkreasi. Bergabunglah dengan komunitas kami sekarang!
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in">
          <Link href="/community">
            <button className="btn-primary flex items-center gap-2 text-base px-8 py-3 rounded-xl">
              Jelajahi Komunitas
              <ArrowRight size={18} />
            </button>
          </Link>
          <Link
            href="https://discord.gg/soraku"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="btn-ghost flex items-center gap-2 text-base px-8 py-3 rounded-xl">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.101 18.08.113 18.1.132 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Join Discord
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 sm:gap-10 animate-fade-in">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 text-primary">
                <Icon size={16} />
                <span className="font-display text-2xl sm:text-3xl text-white">{value}</span>
              </div>
              <span className="text-secondary text-xs sm:text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-base to-transparent pointer-events-none" />
    </section>
  );
}
