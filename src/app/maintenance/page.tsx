import Link from "next/link";
import { Wrench, MessageCircle } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-24 h-24 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-8">
          <Wrench className="w-12 h-12 text-primary" />
        </div>

        <h1 className="text-4xl font-black text-light-base mb-4">
          Sedang{" "}
          <span className="gradient-text">Maintenance</span>
        </h1>

        <p className="text-light-base/60 mb-8">
          Platform Soraku sedang dalam proses pemeliharaan untuk memberikan pengalaman terbaik. Kami akan kembali segera!
        </p>

        {/* Progress bar */}
        <div className="w-full bg-dark-3 rounded-full h-2 mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            style={{ width: "70%", animation: "pulse 2s ease-in-out infinite" }}
          />
        </div>

        <a
          href="https://discord.gg/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4f59d9] text-white rounded-xl font-semibold transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Join Discord untuk Update
        </a>

        <p className="text-light-base/30 text-xs mt-8">
          Soraku Community Platform
        </p>
      </div>
    </div>
  );
}
