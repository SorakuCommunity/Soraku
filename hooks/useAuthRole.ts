"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import type { Role } from "@/types";
import { hasRole } from "@/lib/roles";

export function useAuthRole() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState<Role>("USER");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        const res = await fetch("/api/auth/role");
        if (res.ok) {
          const data = await res.json();
          setRole(data.role ?? "USER");
        }
      } catch {
        setRole("USER");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user, isLoaded]);

  return {
    role,
    loading,
    isLoggedIn: !!user,
    isUser: hasRole(role, "USER"),
    isAdmin: hasRole(role, "ADMIN"),
    isAgensi: hasRole(role, "AGENSI"),
    isManager: hasRole(role, "MANAGER"),
    isSuperAdmin: hasRole(role, "SUPERADMIN"),
  };
}
