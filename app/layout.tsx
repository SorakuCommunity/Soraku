import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Soraku — Komunitas Anime, Manga & Kultur Digital Jepang",
    template: "%s | Soraku",
  },
  description:
    "Soraku adalah komunitas anime, manga, dan kultur digital Jepang terbesar di Indonesia. Bergabung sekarang!",
  keywords: ["anime", "manga", "vtuber", "komunitas", "jepang", "soraku"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Soraku",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="id" className="dark">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body className="bg-dark-base text-light-base font-body antialiased">
          <div className="relative min-h-screen flex flex-col">
            {/* Global ambient glow */}
            <div
              className="fixed inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 10% 20%, rgba(79,163,209,0.04) 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(232,194,168,0.03) 0%, transparent 50%)",
              }}
            />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
