"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const PIXEL_ID = "D6UQBU3C77UFTE0HO0R0";

// Track pageview on route change
function TikTokPageTracker() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ttq = (window as any).ttq;
    if (!ttq) return;
    ttq.page();
  }, [pathname, searchParams]);

  return null;
}

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

      {/* Track page views on SPA navigation */}
      <Suspense fallback={null}>
        <TikTokPageTracker />
      </Suspense>
    </>
  );
}

// ─── Helper functions untuk tracking events ──────────────────────────────────
// Bisa dipanggil dari komponen manapun

/** Track event pendaftaran — dipanggil saat user submit form daftar */
export function trackTikTokRegistration(params?: { email?: string; phone?: string }) {
  const ttq = (window as any).ttq;
  if (!ttq) return;
  ttq.track("CompleteRegistration", {
    ...(params?.email && { email: params.email }),
    ...(params?.phone && { phone_number: params.phone }),
  });
}

/** Track event view konten (blog, event page) */
export function trackTikTokViewContent(params: { content_id: string; content_name: string; content_type?: string }) {
  const ttq = (window as any).ttq;
  if (!ttq) return;
  ttq.track("ViewContent", {
    contents: [{ content_id: params.content_id, content_name: params.content_name }],
    content_type: params.content_type ?? "article",
  });
}

/** Track event search */
export function trackTikTokSearch(query: string) {
  const ttq = (window as any).ttq;
  if (!ttq) return;
  ttq.track("Search", { query });
}

/** Track subscribe/donasi */
export function trackTikTokSubscribe(value?: number) {
  const ttq = (window as any).ttq;
  if (!ttq) return;
  ttq.track("Subscribe", { value: value ?? 0, currency: "IDR" });
}
