export default function AdminSettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-white mb-1">Pengaturan</h1>
        <p className="text-secondary">Konfigurasi platform Soraku.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-2xl">
        <div className="glass-card p-6">
          <h3 className="text-white font-semibold mb-4">Environment Variables</h3>
          <p className="text-secondary text-sm mb-4">
            Konfigurasi berikut dikelola melalui environment variables. 
            Edit melalui Vercel Dashboard untuk production.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { key: "MAINTENANCE_MODE", desc: "Toggle maintenance mode" },
              { key: "DISCORD_BOT_TOKEN", desc: "Token bot Discord" },
              { key: "SPOTIFY_CLIENT_ID", desc: "Client ID Spotify" },
              { key: "CLERK_SECRET_KEY", desc: "Secret key Clerk Auth" },
            ].map(({ key, desc }) => (
              <div key={key} className="glass p-3 rounded-xl flex items-center justify-between">
                <div>
                  <code className="text-primary text-xs font-mono">{key}</code>
                  <p className="text-secondary text-xs mt-0.5">{desc}</p>
                </div>
                <span className="text-xs text-secondary">••••••••</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-white font-semibold mb-4">Tentang Platform</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-secondary">Versi</span>
              <span className="text-white font-mono">v1.0.0-alpha.2</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-secondary">Framework</span>
              <span className="text-white">Next.js 15</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-secondary">Auth</span>
              <span className="text-white">Clerk</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-secondary">Database</span>
              <span className="text-white">Supabase PostgreSQL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
