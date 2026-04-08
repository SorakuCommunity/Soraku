import { BookOpen, Image, Star, Users } from "lucide-react";
import Link from "next/link";

const QUICK_STATS = [
  { label: "Postingan", value: "0", icon: BookOpen, href: "/dashboard/posts" },
  { label: "Karya Galeri", value: "0", icon: Image, href: "/dashboard/gallery" },
  { label: "Poin Komunitas", value: "0", icon: Star, href: "#" },
];

const QUICK_LINKS = [
  { label: "Edit Profil", href: "/dashboard/profile", desc: "Update bio, avatar, dan info akun" },
  { label: "Upload Galeri", href: "/gallery/upload", desc: "Bagikan karya ke komunitas" },
  { label: "Lihat Event", href: "/events", desc: "Cek event & gathering terbaru" },
  { label: "Gabung Discord", href: "https://discord.gg/qm3XJvRa6B", desc: "Chat langsung dengan komunitas" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Selamat datang kembali di Soraku Community! 🌸</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {QUICK_STATS.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="glass-card p-4 hover:-translate-y-0.5 transition-transform group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Welcome banner */}
      <div className="glass-card px-6 py-8 relative overflow-hidden">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-7xl opacity-5 select-none">空</div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-2">Member Soraku</p>
        <h2 className="text-xl font-bold mb-2">Akun kamu aktif! ✨</h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          Mulai eksplorasi komunitas — baca blog, ikut event, dan bagikan karya kamu ke galeri.
        </p>
        <Link href="/events"
          className="inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 transition-colors">
          Lihat Event Terdekat →
        </Link>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Aksi Cepat</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {QUICK_LINKS.map(({ label, href, desc }) => (
            <Link key={label} href={href}
              className="glass-card flex items-center justify-between p-4 hover:-translate-y-0.5 hover:border-primary/30 transition-all group">
              <div>
                <p className="text-sm font-medium group-hover:text-primary transition-colors">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
              <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
