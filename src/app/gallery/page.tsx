"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Upload, Loader2 } from "lucide-react";
import GalleryCard, { type GalleryItem } from "@/components/GalleryCard";

export default function GalleryPage() {
  const { isSignedIn } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery?status=approved");
      const data = await res.json();
      setItems(data.items || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: imageUrl, caption }),
      });
      if (res.ok) {
        setImageUrl("");
        setCaption("");
        setShowUpload(false);
        alert("Foto berhasil dikirim! Menunggu persetujuan admin.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black gradient-text mb-2">Gallery</h1>
            <p className="text-light-base/60">Koleksi foto komunitas Soraku</p>
          </div>
          {isSignedIn && (
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Upload className="w-4 h-4" /> Upload Foto
            </button>
          )}
        </div>

        {/* Upload form */}
        {showUpload && isSignedIn && (
          <div className="glass rounded-2xl p-6 border border-white/10 mb-8">
            <h3 className="font-semibold text-light-base mb-4">Upload Foto</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-light-base/60 mb-1">URL Foto *</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-light-base/60 mb-1">Caption (opsional)</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Deskripsi foto..."
                  className="w-full px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kirim untuk Review"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="px-4 py-2 glass border border-white/10 text-light-base/60 rounded-lg text-sm hover:text-light-base transition-colors"
                >
                  Batal
                </button>
              </div>
              <p className="text-xs text-light-base/40">
                * Foto akan direview oleh admin sebelum ditampilkan
              </p>
            </form>
          </div>
        )}

        {/* Gallery grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square glass rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-light-base/40">
            <p className="text-lg">Belum ada foto yang disetujui.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
