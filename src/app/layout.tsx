import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soraku Community",
  description: "Platform komunitas VTuber Indonesia – Soraku Community",
  keywords: ["VTuber", "Indonesia", "Soraku", "Community", "Virtual YouTuber"],
  openGraph: {
    title: "Soraku Community",
    description: "Platform komunitas VTuber Indonesia",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen bg-dark-base text-light-base flex flex-col antialiased">
        <ClerkProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
