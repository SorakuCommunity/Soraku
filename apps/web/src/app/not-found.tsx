'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">

      {/* 🔥 Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: "url('/404.png')", // simpan gambar tadi di public/images
        }}
      />

      {/* 🔥 Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

      {/* 🔥 Content */}
      <div className="relative z-10 text-center px-4">

        {/* 404 Glitch */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[5rem] md:text-[7rem] font-black tracking-widest relative"
        >
          <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            404
          </span>

          {/* glitch layer */}
          <span className="absolute left-0 top-0 text-red-500 opacity-70 animate-glitch">
            404
          </span>
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-xl md:text-2xl font-bold"
        >
          Halaman tidak ditemukan
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-sm text-gray-300"
        >
          Sepertinya kamu nyasar ke dimensi lain 🌀
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black shadow-lg transition-all hover:scale-105 hover:bg-yellow-400"
          >
            Kembali ke Beranda
          </Link>
        </motion.div>
      </div>

      {/* 🔥 Noise / Grain Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay bg-[url('/noise.png')]" />
    </section>
  )
}