"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const PIXEL_ID = "D6UQBU3C77UFTE0HO0R0";

// ─── SPA page tracker ─────────────────────────────────────────────────────────
function TikTokPageTracker() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const ttq = (window as any).ttq;
    if (!ttq) return;
    ttq.page();
    // Juga kirim ke server-side untuk deduplicate
    sendS2S("PageView");
  }, [pathname, searchParams]);

  return null;
}

// ─── Root component — inject ke layout ───────────────────────────────────────
export function TikTokPixel() {
  return (
    <>
      <Script id="tiktok-pixel" strategy="afterInteractive">
        {`
!function(w,d,t){
  w.TiktokAnalyticsObject=t;
  var ttq=w[t]=w[t]||[];
  ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
  ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
  for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
  ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
  ttq.load=function(e,n){
    var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;
    ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
    n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;
    e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)
  };
  ttq.load('${PIXEL_ID}');
  ttq.page();
}(window,document,'ttq');
        `}
      </Script>
      <Suspense fallback={null}>
        <TikTokPageTracker />
      </Suspense>
    </>
  );
}

// ─── Server-side (S2S) sender ─────────────────────────────────────────────────
// Kirim event ke /api/analytics/tiktok yang akan forward ke TikTok Events API
// Dual tracking: pixel (client) + S2S (server) → lebih akurat, deduplicate via event_id

async function sendS2S(
  event: string,
  properties?: {
    content_id?:   string;
    content_name?: string;
    content_type?: string;
    query?:        string;
    value?:        number;
    currency?:     string;
  },
  eventId?: string
) {
  try {
    await fetch("/api/analytics/tiktok", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, event_id: eventId, properties }),
    });
  } catch {
    // silent fail — jangan ganggu UX
  }
}

// ─── Public tracking helpers ──────────────────────────────────────────────────

/** Track register — dipanggil setelah register berhasil */
export function trackRegistration() {
  const eventId = `register-${Date.now()}`;
  const ttq = (window as any).ttq;
  if (ttq) ttq.track("CompleteRegistration", {}, { event_id: eventId });
  sendS2S("CompleteRegistration", undefined, eventId);
}

/** Track view konten (event page / blog) */
export function trackViewContent(params: {
  content_id: string;
  content_name: string;
  content_type?: string;
}) {
  const eventId = `view-${params.content_id}-${Date.now()}`;
  const ttq = (window as any).ttq;
  if (ttq) ttq.track("ViewContent", {
    contents: [{ content_id: params.content_id, content_name: params.content_name }],
    content_type: params.content_type ?? "article",
  }, { event_id: eventId });
  sendS2S("ViewContent", { ...params }, eventId);
}

/** Track subscribe / donasi */
export function trackSubscribe(value?: number) {
  const eventId = `subscribe-${Date.now()}`;
  const ttq = (window as any).ttq;
  if (ttq) ttq.track("Subscribe", { value: value ?? 0, currency: "IDR" }, { event_id: eventId });
  sendS2S("Subscribe", { value, currency: "IDR" }, eventId);
}

/** Track search */
export function trackSearch(query: string) {
  const ttq = (window as any).ttq;
  if (ttq) ttq.track("Search", { query });
  sendS2S("Search", { query });
}

// Alias untuk backward compatibility
export const trackTikTokRegistration  = trackRegistration;
export const trackTikTokViewContent   = trackViewContent;
export const trackTikTokSubscribe     = trackSubscribe;
export const trackTikTokSearch        = trackSearch;
