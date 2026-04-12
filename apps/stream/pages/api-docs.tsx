"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Globe2,
  Film,
  BookOpen,
  Search,
  TrendingUp,
  Calendar,
  Users,
  Database,
  Shield,
  Code2,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Navbar } from "@/components/shared/NavBar";
import Footer from "@/components/shared/footer";

const API_SECTIONS = [
  {
    id: "anime",
    name: "Anime",
    icon: Film,
    color: "text-blue-400",
    endpoints: [
      {
        method: "GET",
        path: "/api/v2/info/[id]",
        desc: "Get anime metadata and episodes"
      },
      {
        method: "GET",
        path: "/api/v2/episode/[id]",
        desc: "Get episode streaming sources"
      },
      {
        method: "GET",
        path: "/api/v2/source",
        desc: "Get sources from Consumet/Anify"
      },
      {
        method: "GET",
        path: "/api/v2/etc/recent/[page]",
        desc: "Get recent episodes"
      },
      {
        method: "GET",
        path: "/api/v2/etc/schedule",
        desc: "Get anime release schedule"
      }
    ]
  },
  {
    id: "manga",
    name: "Manga",
    icon: BookOpen,
    color: "text-purple-400",
    endpoints: [
      {
        method: "GET",
        path: "/api/v2/info/[id]",
        desc: "Get manga metadata and chapters"
      },
      {
        method: "GET",
        path: "/api/v2/pages/[...id]",
        desc: "Get manga pages for reading"
      }
    ]
  },
  {
    id: "discover",
    name: "Discovery",
    icon: Search,
    color: "text-emerald-400",
    endpoints: [
      {
        method: "GET",
        path: "/api/v2/etc/status",
        desc: "API status and health"
      },
      {
        method: "GET",
        path: "/api/v2/badges",
        desc: "Get all available badges"
      },
      {
        method: "GET",
        path: "/api/v2/badges/verify/[id]",
        desc: "Verify user badge"
      }
    ]
  },
  {
    id: "user",
    name: "User",
    icon: Users,
    color: "text-amber-400",
    endpoints: [
      { method: "GET", path: "/api/user/profile", desc: "Get user profile" },
      {
        method: "POST",
        path: "/api/user/update/episode",
        desc: "Update watch progress"
      },
      { method: "POST", path: "/api/user/update/al", desc: "Sync with AniList" }
    ]
  },
  {
    id: "admin",
    name: "Admin",
    icon: Shield,
    color: "text-red-400",
    endpoints: [
      {
        method: "POST",
        path: "/api/v2/admin/broadcast",
        desc: "Send broadcast"
      },
      {
        method: "POST",
        path: "/api/v2/admin/meta",
        desc: "Update metadata cache"
      },
      {
        method: "POST",
        path: "/api/v2/admin/bug-report",
        desc: "Submit bug report"
      }
    ]
  }
];

const SOURCES = [
  { name: "Consumet", desc: "Multi-provider anime meta", status: "active" },
  { name: "Anify", desc: "Streaming sources & metadata", status: "active" },
  { name: "AniList", desc: "User lists & tracking", status: "active" },
  { name: "MyAnimeList", desc: "Alternative metadata", status: "active" }
];

export default function ApiDocsPage() {
  const [openSection, setOpenSection] = useState<string | null>("anime");

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const baseUrl = "https://stream.soraku.id";

  return (
    <>
      <Head>
        <title>API Documentation | Soraku Stream</title>
        <meta
          name="description"
          content="REST API documentation for Soraku Stream - Anime & Manga streaming platform"
        />
      </Head>

      <div className="min-h-screen bg-[#0f1117]">
        <Navbar />

        <main className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#4FA3D1]/10 mb-4">
              <Code2 className="h-8 w-8 text-[#4FA3D1]" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">
              API Documentation
            </h1>
            <p className="text-[#6E8FA6]">
              REST API endpoints for anime streaming, manga reading, and more.
            </p>
          </div>

          <div className="bg-[#1a1d24] rounded-2xl border border-white/[0.06] p-4 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Globe2 className="h-4 w-4 text-[#4FA3D1]" />
              <span className="text-[#D9DDE3] font-bold text-sm">Base URL</span>
            </div>
            <code className="text-[#6E8FA6] text-sm font-mono">{baseUrl}</code>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {["anime", "manga", "discover", "user", "admin"].map((tab) => (
              <Link
                key={tab}
                href={`#${tab}`}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6E8FA6] hover:text-white hover:bg-white/5 capitalize transition-colors"
              >
                {tab}
              </Link>
            ))}
          </div>

          <div className="space-y-4 mb-12">
            {API_SECTIONS.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="bg-[#1a1d24] rounded-2xl border border-white/[0.06] overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <section.icon className={`h-5 w-5 ${section.color}`} />
                    <span className="text-[#D9DDE3] font-bold">
                      {section.name}
                    </span>
                    <span className="text-[#6E8FA6] text-xs">
                      ({section.endpoints.length} endpoints)
                    </span>
                  </div>
                  {openSection === section.id ? (
                    <ChevronDown className="h-5 w-5 text-[#6E8FA6]" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-[#6E8FA6]" />
                  )}
                </button>

                {openSection === section.id && (
                  <div className="border-t border-white/[0.06]">
                    {section.endpoints.map((ep, i) => (
                      <div
                        key={i}
                        className="p-4 border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ep.method === "GET"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : ep.method === "POST"
                                  ? "bg-blue-500/10 text-blue-400"
                                  : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {ep.method}
                          </span>
                          <code className="text-[#D9DDE3] text-sm font-mono">
                            {ep.path}
                          </code>
                        </div>
                        <p className="text-[#6E8FA6] text-xs ml-10">
                          {ep.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="text-lg font-bold text-[#D9DDE3] mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-[#4FA3D1]" />
              Data Sources
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {SOURCES.map((source) => (
                <div
                  key={source.name}
                  className="bg-[#1a1d24] rounded-xl border border-white/[0.06] p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[#D9DDE3] font-semibold text-sm">
                      {source.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        source.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {source.status}
                    </span>
                  </div>
                  <p className="text-[#6E8FA6] text-xs mt-1">{source.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-lg font-bold text-[#D9DDE3] mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#4FA3D1]" />
              Features
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Anime Streaming (Multi-source)",
                "Manga Reading",
                "AniList Integration",
                "Real-time Schedules",
                "Redis Caching",
                "PWA Support"
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-[#6E8FA6] text-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4FA3D1]" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-[#4FA3D1] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#4FA3D1]/90 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 border border-white/[0.08] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/[0.05] transition-colors"
            >
              About
            </Link>
            <a
              href="https://github.com/wotakumoe/wotaku"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-white/[0.08] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/[0.05] transition-colors"
            >
              Wotaku Wiki Source
            </a>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
