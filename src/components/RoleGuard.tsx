"use client";

import { useAuthRole } from "@/hooks/useAuthRole";
import type { Role } from "@/lib/roles";
import { hasPermission, PERMISSIONS } from "@/lib/roles";

interface RoleGuardProps {
  allowedRoles?: Role[];
  permission?: keyof typeof PERMISSIONS;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export default function RoleGuard({
  allowedRoles,
  permission,
  fallback = null,
  children,
}: RoleGuardProps) {
  const { role, isLoaded } = useAuthRole();

  if (!isLoaded) return null;
  if (!role) return <>{fallback}</>;

  const hasAccess = permission
    ? hasPermission(role, permission)
    : allowedRoles?.includes(role) ?? false;

  if (!hasAccess) return <>{fallback}</>;

  return <>{children}</>;
}
