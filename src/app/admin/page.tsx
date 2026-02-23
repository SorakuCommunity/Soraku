import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getCurrentUserRole } from "@/lib/clerk";
import { canAccessAdmin, ROLE_COLORS } from "@/lib/roles";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users2,
  Image,
  Settings,
  MessageCircle,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const role = await getCurrentUserRole();
  if (!canAccessAdmin(role)) redirect("/");

  const adminLinks = [
    { href: "/admin/blog", label: "Kelola Blog", icon: <FileText className="w-5 h-5" />, roles: ["MANAGER", "ADMIN"] },
    { href: "/admin/events", label: "Kelola Events", icon: <Calendar className="w-5 h-5" />, roles: ["MANAGER", "AGENSI"] },
    { href: "/admin/vtuber", label: "Kelola VTuber", icon: <Users2 className="w-5 h-5" />, roles: ["MANAGER", "AGENSI", "ADMIN"] },
    { href: "/admin/gallery", label: "Approval Gallery", icon: <Image className="w-5 h-5" />, roles: ["MANAGER", "ADMIN"] },
    { href: "/admin/settings", label: "Pengaturan", icon: <Settings className="w-5 h-5" />, roles: ["MANAGER"] },
  ].filter((link) => link.roles.includes(role));

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-light-base">Admin Panel</h1>
            <p className="text-light-base/50 mt-1">Soraku Community Management</p>
          </div>
          <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${ROLE_COLORS[role]}`}>
            {role}
          </span>
        </div>

        {/* Quick stats */}
        <div className="mb-8">
          <StatsCard />
        </div>

        {/* Navigation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group glass rounded-2xl p-6 border border-white/10 hover:border-primary/40 card-hover transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 text-primary transition-colors">
                {link.icon}
              </div>
              <h3 className="font-semibold text-light-base group-hover:text-primary transition-colors">
                {link.label}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
