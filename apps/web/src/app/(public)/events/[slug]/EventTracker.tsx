"use client";

import { useEffect } from "react";
import { trackTikTokViewContent } from "@/components/analytics/TikTokPixel";

export function EventTracker({ id, title }: { id: string; title: string }) {
  useEffect(() => {
    trackTikTokViewContent({ content_id: id, content_name: title, content_type: "product" });
  }, [id, title]);
  return null;
}
