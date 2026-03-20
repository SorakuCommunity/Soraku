import type { Metadata } from "next"
import "@/styles/globals.css"
import { Navbar } from "@/components/layout/Navbar"

export const metadata: Metadata = {
  title:       { default: "Soraku Live — Streaming Anime", template: "%s · Soraku Live" },
  description: "Tonton anime gratis di Soraku Live. Sub Indonesia & English, Watch Party, tanpa iklan.",
  metadataBase: new URL("https://soraku.live"),
  openGraph: { siteName: "Soraku Live", type: "website", locale: "id_ID" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-[#0f0f0f] text-zinc-200 antialiased">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 pb-16 pt-4">{children}</main>
      </body>
    </html>
  )
}
