"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import {
  Menu,
  X,
  Home,
  Users,
  BookOpen,
  Calendar,
  Image,
  Play,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useAuthRole } from "@/hooks/useAuthRole";

const NAV_LINKS = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/community", label: "Komunitas", icon: Users },
  { href: "/vtuber", label: "Vtuber", icon: Play },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/gallery", label: "Gallery", icon: Image },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const { isAdmin } = useAuthRole();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-strong shadow-glass"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:glow-primary transition-all duration-300">
              <span className="font-display text-white text-sm font-bold">S</span>
            </div>
            <span className="font-display text-xl text-white tracking-wider">
              SORA<span className="text-primary">KU</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-primary bg-primary/10"
                      : "text-secondary hover:text-light-base hover:bg-white/5"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-accent border border-accent/30 hover:bg-accent/10 transition-all"
              >
                <Settings size={14} />
                Admin
              </Link>
            )}

            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 border-2 border-primary/50",
                  },
                }}
              />
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <SignInButton mode="modal">
                  <button className="btn-ghost text-sm py-1.5 px-4">
                    Masuk
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn-primary text-sm py-1.5 px-4">
                    Daftar
                  </button>
                </SignUpButton>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-secondary hover:text-light-base"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden glass-strong rounded-xl mt-2 mb-4 p-4 animate-slide-up">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "text-primary bg-primary/10"
                        : "text-secondary hover:text-light-base hover:bg-white/5"
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-accent hover:bg-accent/10"
                >
                  <Settings size={16} />
                  Admin Panel
                </Link>
              )}

              {!isSignedIn && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-white/10">
                  <SignInButton mode="modal">
                    <button className="flex-1 btn-ghost text-sm py-2">Masuk</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="flex-1 btn-primary text-sm py-2">Daftar</button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
