"use client";

import Image from "next/image";
import { User, Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  uploader_name: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

const STATUS_ICON = {
  pending: <Clock className="w-3 h-3 text-yellow-400" />,
  approved: <Check className="w-3 h-3 text-green-400" />,
  rejected: <X className="w-3 h-3 text-red-400" />,
};

export default function GalleryCard({
  item,
  showStatus = false,
  onApprove,
  onReject,
}: {
  item: GalleryItem;
  showStatus?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}) {
  return (
    <div className="group relative glass rounded-xl overflow-hidden border border-white/10 hover:border-primary/30 card-hover transition-all duration-300">
      <div className="aspect-square relative overflow-hidden bg-dark-3">
        <Image
          src={item.image_url}
          alt={item.caption || "Gallery image"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-3 left-3 right-3">
            {item.caption && (
              <p className="text-white text-xs font-medium line-clamp-2">{item.caption}</p>
            )}
            {item.uploader_name && (
              <div className="flex items-center gap-1 mt-1">
                <User className="w-3 h-3 text-white/60" />
                <span className="text-white/60 text-xs">{item.uploader_name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status badge */}
      {showStatus && (
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-light-base/60">
              {STATUS_ICON[item.status]}
              <span className="capitalize">{item.status}</span>
            </div>
            {item.status === "pending" && onApprove && onReject && (
              <div className="flex gap-2">
                <button
                  onClick={() => onApprove(item.id)}
                  className="px-2 py-1 rounded-md bg-green-500/20 text-green-400 text-xs hover:bg-green-500/30 transition-colors"
                >
                  Setuju
                </button>
                <button
                  onClick={() => onReject(item.id)}
                  className="px-2 py-1 rounded-md bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors"
                >
                  Tolak
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
