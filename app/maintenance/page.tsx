import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Maintenance",
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center px-4">
      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(79,163,209,0.08) 0%, transparent 55%), radial-gradient(ellipse at 70% 30%, rgba(232,194,168,0.05) 0%, transparent 50%)",
        }}
      />

      <div className="relative text-center max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="font-display text-white text-xl font-bold">S</span>
          </div>
          <span className="font-display text-3xl text-white tracking-wider">
            SORA<span className="text-primary">KU</span>
          </span>
        </div>

        {/* Icon */}
        <div className="text-8xl mb-8 animate-bounce-soft">🔧</div>

        <h1 className="font-display text-4xl text-white mb-4">
          Under <span className="gradient-text">Maintenance</span>
        </h1>

        <p className="text-secondary text-lg mb-8 leading-relaxed">
          Soraku sedang dalam pemeliharaan untuk meningkatkan pengalaman kamu. 
          Kami akan kembali sebentar lagi!
        </p>

        <div className="glass-card p-6 mb-8 text-left">
          <p className="text-secondary text-sm leading-relaxed">
            Sementara itu, kamu masih bisa bergabung di Discord kami untuk update terbaru dan diskusi komunitas.
          </p>
        </div>

        <a
          href="https://discord.gg/soraku"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 btn-primary text-base px-8 py-3 rounded-xl"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.101 18.08.113 18.1.132 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
          </svg>
          Join Discord
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
