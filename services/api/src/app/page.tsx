export const dynamic = "force-dynamic"

const DISCORD_INVITE = "https://discord.gg/qm3XJvRa6B"
const WEB_URL        = "https://www.soraku.id"
const API_VERSION    = "0.1.0"

const ENDPOINTS = [
  { method: "GET",   path: "/api",                         desc: "Health check & daftar endpoint" },
  { method: "GET",   path: "/api/users/:username",         desc: "Profil publik user" },
  { method: "PATCH", path: "/api/users/:username",         desc: "Update profil (auth)" },
  { method: "GET",   path: "/api/premium",                 desc: "Status subscriber user login" },
  { method: "GET",   path: "/api/premium?leaderboard=true",desc: "Top donatur publik" },
  { method: "GET",   path: "/api/vtubers",                 desc: "Daftar VTuber Soraku" },
  { method: "GET",   path: "/api/vtubers/:slug",           desc: "Detail VTuber" },
  { method: "GET",   path: "/api/events",                  desc: "Daftar events komunitas" },
  { method: "GET",   path: "/api/events/:slug",            desc: "Detail event" },
  { method: "GET",   path: "/api/blog",                    desc: "Daftar artikel blog" },
  { method: "GET",   path: "/api/blog/:slug",              desc: "Detail artikel" },
  { method: "GET",   path: "/api/gallery",                 desc: "Galeri karya komunitas" },
  { method: "GET",   path: "/api/stream",                  desc: "VTuber stream content" },
  { method: "GET",   path: "/api/stream?anime=true&q=:q",  desc: "Cari anime (GogoAnime, HiAnime, Animekai, AniBaru)" },
  { method: "GET",   path: "/api/stream/:slug",            desc: "Detail stream / episode HLS" },
  { method: "GET",   path: "/api/stream/sources",          desc: "Status provider anime (online/offline)" },
  { method: "POST",  path: "/api/donate/xendit/create",    desc: "Buat invoice donasi (Xendit)" },
  { method: "POST",  path: "/api/donate/xendit/webhook",   desc: "Webhook konfirmasi Xendit" },
  { method: "POST",  path: "/api/donate/trakteer",         desc: "Webhook donasi Trakteer" },
]

const METHOD_COLOR: Record<string, string> = {
  GET:   "#22c55e",
  POST:  "#3b82f6",
  PATCH: "#f59e0b",
  DELETE:"#ef4444",
}

export default function ApiLandingPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 50%, #0f1a2e 100%)",
      color: "#e2e8f0",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(124,58,237,0.3)",
        background: "rgba(124,58,237,0.05)",
        backdropFilter: "blur(10px)",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 900,
        }}>空</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Soraku API</div>
          <div style={{ fontSize: 11, color: "#7c3aed" }}>v{API_VERSION} · Central REST API</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <span style={{
            background: "rgba(34,197,94,0.15)", color: "#22c55e",
            border: "1px solid rgba(34,197,94,0.3)",
            padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
          }}>● ONLINE</span>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: 20, padding: "6px 16px", fontSize: 12, color: "#a78bfa",
            marginBottom: 24, fontWeight: 600,
          }}>
            🚀 Soraku Ecosystem API · Open Beta
          </div>

          <h1 style={{
            fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 900,
            margin: "0 0 16px",
            background: "linear-gradient(135deg, #fff 30%, #a78bfa 70%, #60a5fa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            lineHeight: 1.1,
          }}>
            Soraku API
          </h1>

          <p style={{
            fontSize: 17, color: "#94a3b8", maxWidth: 560,
            margin: "0 auto 12px", lineHeight: 1.7,
          }}>
            Central REST API untuk seluruh ekosistem platform{" "}
            <span style={{ color: "#a78bfa", fontWeight: 600 }}>Soraku Community</span>{" "}
            — komunitas anime, manga, VTuber, dan budaya Jepang Indonesia.
          </p>

          <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 36px" }}>
            Satu endpoint. Terhubung ke Web, Stream, Mobile, dan Discord Bot.
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#5865F2", color: "#fff",
              padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(88,101,242,0.4)",
              transition: "transform 0.15s",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.086.118 18.114.136 18.13a19.923 19.923 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
              Discord Soraku
            </a>

            <a href={WEB_URL} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(124,58,237,0.2)", color: "#a78bfa",
              border: "1px solid rgba(124,58,237,0.4)",
              padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700,
              textDecoration: "none",
            }}>
              🌐 Soraku Community
            </a>
          </div>
        </div>

        {/* Consumer cards */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
            Terhubung ke
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            {[
              { icon: "🌐", label: "Web Komunitas",   sub: "apps/web · Next.js",      color: "#7c3aed" },
              { icon: "🎬", label: "Web Streaming",   sub: "apps/stream · Next.js",   color: "#3b82f6" },
              { icon: "📱", label: "Mobile App",      sub: "apps/mobile · Expo",      color: "#22c55e" },
              { icon: "🤖", label: "Discord Bot",     sub: "services/bot · Railway",  color: "#f59e0b" },
            ].map(c => (
              <div key={c.label} style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid rgba(255,255,255,0.08)`,
                borderRadius: 12, padding: "16px",
                borderLeft: `3px solid ${c.color}`,
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{c.label}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Endpoints */}
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
            Endpoints ({ENDPOINTS.length})
          </h2>
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, overflow: "hidden",
          }}>
            {ENDPOINTS.map((ep, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 20px",
                borderBottom: i < ENDPOINTS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 800, fontFamily: "monospace",
                  color: METHOD_COLOR[ep.method] ?? "#e2e8f0",
                  background: `${METHOD_COLOR[ep.method] ?? "#fff"}18`,
                  border: `1px solid ${METHOD_COLOR[ep.method] ?? "#fff"}30`,
                  padding: "2px 7px", borderRadius: 5, minWidth: 46, textAlign: "center",
                  flexShrink: 0,
                }}>
                  {ep.method}
                </span>
                <code style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace", flex: 1, wordBreak: "break-all" }}>
                  {ep.path}
                </code>
                <span style={{ fontSize: 12, color: "#64748b", textAlign: "right", flexShrink: 0, maxWidth: 220 }}>
                  {ep.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 56, textAlign: "center", color: "#475569", fontSize: 12 }}>
          <p style={{ margin: "0 0 8px" }}>
            <span style={{ color: "#7c3aed", fontWeight: 700 }}>Soraku API</span> v{API_VERSION} · Built by{" "}
            <span style={{ color: "#94a3b8" }}>Sora (AI)</span> ·{" "}
            <span style={{ color: "#94a3b8" }}>Kaizo (Back-end)</span>
          </p>
          <p style={{ margin: 0 }}>
            © 2026 Soraku Community · Indonesia 🇮🇩
          </p>
        </div>
      </div>
    </div>
  )
}
