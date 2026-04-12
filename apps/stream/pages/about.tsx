import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/shared/NavBar";
import Footer from "@/components/shared/footer";

export default function About() {
  return (
    <>
      <Head>
        <title>About | Soraku Stream</title>
        <meta
          name="description"
          content="Discover Soraku Stream - your ultimate destination for anime streaming and manga reading. Built with passion by Soraku Community."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar withNav toTop shrink bgHover scrollP={110} paddingY={"py-1"} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-[#0f1117]"
      >
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#4FA3D1]/10 mb-6">
              <div className="h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-[#1a1c20]">
                <Image
                  src="/logo.png"
                  alt="Soraku"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
            </div>
            <h1 className="text-3xl font-black text-white mb-4">
              Tentang Soraku Stream
            </h1>
            <p className="text-[#6E8FA6] max-w-xl mx-auto">
              Platform streaming anime dan manga yang dibangun dengan cinta oleh
              komunitas Soraku.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <section className="bg-[#1a1d24] rounded-2xl border border-white/[0.06] p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Apa itu Soraku Stream?
              </h2>
              <p className="text-[#6E8FA6] leading-relaxed">
                Soraku Stream adalah platform streaming anime dan manga yang
                menyediakan akses ke berbagai konten dari berbagai sumber. Kami
                menghubungkan pengguna ke layanan pihak ketiga yang menyediakan
                konten tersebut.
              </p>
            </section>

            <section className="bg-[#1a1d24] rounded-2xl border border-white/[0.06] p-6">
              <h2 className="text-xl font-bold text-white mb-4">Fitur Utama</h2>
              <ul className="space-y-3 text-[#6E8FA6]">
                <li className="flex items-start gap-3">
                  <span className="text-[#4FA3D1]">•</span> Streaming anime dari
                  berbagai provider (Consumet, Anify, dll)
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#4FA3D1]">•</span> Membaca manga dari
                  berbagai sumber
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#4FA3D1]">•</span> Jadwal tayang anime
                  harian dan real-time
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#4FA3D1]">•</span> Integrasi AniList
                  untuk tracking progress
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#4FA3D1]">•</span> Mode offline dan
                  instalasi sebagai PWA
                </li>
              </ul>
            </section>

            <section className="bg-[#1a1d24] rounded-2xl border border-white/[0.06] p-6">
              <h2 className="text-xl font-bold text-white mb-4">Disclaimer</h2>
              <p className="text-[#6E8FA6] leading-relaxed">
                Soraku Stream tidak menyimpan file apa pun di server kami. Kami
                hanya menghubungkan ke layanan pihak ketiga yang menyediakan
                konten. Semua konten adalah milik masing-masing pemilik dan
                distributor.
              </p>
            </section>

            <section className="bg-[#1a1d24] rounded-2xl border border-white/[0.06] p-6">
              <h2 className="text-xl font-bold text-white mb-4">Komunitas</h2>
              <p className="text-[#6E8FA6] leading-relaxed mb-4">
                Soraku Stream adalah bagian dari Soraku Community - komunitas
                non-profit budaya pop Jepang di Indonesia. Kami terbuka untuk
                kontribusi dan feedback dari pengguna.
              </p>
              <div className="flex gap-3">
                <Link
                  href="https://discord.gg/qm3XJvRa6B"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#5865F2] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#5865F2]/90 transition-colors"
                >
                  Join Discord
                </Link>
                <Link
                  href="/contact"
                  className="border border-white/[0.08] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/[0.05] transition-colors"
                >
                  Contact
                </Link>
              </div>
            </section>
          </div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
}
