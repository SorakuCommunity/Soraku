import type { Metadata } from "next";
import { SignInButton } from "@clerk/nextjs";
import { Upload, Image as ImageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Gallery foto dan karya visual komunitas Soraku.",
};

const MOCK_GALLERY = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  caption: `Karya ${i + 1} - Komunitas Soraku`,
  status: "approved",
  user: { username: `user_${i + 1}` },
}));

export default function GalleryPage() {
  return (
    <div className="anime-bg min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(232,194,168,0.08) 0%, transparent 55%)",
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative">
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">
            Community <span className="gradient-text">Gallery</span>
          </h1>
          <p className="text-secondary text-lg max-w-xl mx-auto mb-8">
            Koleksi foto dan karya visual dari seluruh anggota komunitas Soraku.
          </p>

          <SignInButton mode="modal">
            <button className="btn-primary flex items-center gap-2 mx-auto">
              <Upload size={16} />
              Upload Karya
            </button>
          </SignInButton>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {MOCK_GALLERY.map((item) => (
              <div
                key={item.id}
                className="glass-card overflow-hidden group cursor-pointer aspect-square"
              >
                <div className="h-full bg-gradient-to-br from-primary/5 to-secondary/5 flex flex-col items-center justify-center p-4 relative">
                  <ImageIcon size={32} className="text-primary/20 mb-2" />
                  <p className="text-secondary text-xs text-center line-clamp-2">
                    {item.caption}
                  </p>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-dark-base/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                    <p className="text-white text-xs font-medium text-center line-clamp-2">
                      {item.caption}
                    </p>
                    <p className="text-secondary text-xs">@{item.user.username}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
