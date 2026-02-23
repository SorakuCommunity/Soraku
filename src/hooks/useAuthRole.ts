"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import type { Role } from "@/lib/roles";

interface AuthRoleState {
  role: Role | null;
  isLoaded: boolean;
  isSignedIn: boolean;
}

export function useAuthRole(): AuthRoleState {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [roleLoaded, setRoleLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !userId) {
      setRole(null);
      setRoleLoaded(true);
      return;
    }

    const fetchRole = async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setRole(data.role as Role);
        } else {
          setRole("USER");
        }
      } catch {
        setRole("USER");
      } finally {
        setRoleLoaded(true);
      }
    };

    fetchRole();
  }, [isLoaded, isSignedIn, userId]);

  return { role, isLoaded: isLoaded && roleLoaded, isSignedIn: !!isSignedIn };
}
