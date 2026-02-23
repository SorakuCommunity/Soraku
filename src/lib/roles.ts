export type Role = "MANAGER" | "AGENSI" | "ADMIN" | "USER";

export const ROLES: Role[] = ["MANAGER", "AGENSI", "ADMIN", "USER"];

export const ROLE_HIERARCHY: Record<Role, number> = {
  MANAGER: 4,
  AGENSI: 3,
  ADMIN: 2,
  USER: 1,
};

export const ROLE_COLORS: Record<Role, string> = {
  MANAGER: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  AGENSI: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  ADMIN: "text-primary bg-primary/10 border-primary/30",
  USER: "text-gray-400 bg-gray-400/10 border-gray-400/30",
};

export const PERMISSIONS = {
  // Blog
  blog_create: ["MANAGER", "ADMIN"] as Role[],
  blog_edit: ["MANAGER", "ADMIN"] as Role[],
  blog_delete: ["MANAGER"] as Role[],

  // Events
  event_create: ["MANAGER", "AGENSI"] as Role[],
  event_edit: ["MANAGER", "AGENSI"] as Role[],
  event_delete: ["MANAGER"] as Role[],

  // Vtuber
  vtuber_create: ["MANAGER", "AGENSI"] as Role[],
  vtuber_edit: ["MANAGER", "AGENSI"] as Role[],
  vtuber_delete: ["MANAGER"] as Role[],
  vtuber_view: ["MANAGER", "AGENSI", "ADMIN", "USER"] as Role[],

  // Gallery
  gallery_approve: ["MANAGER", "ADMIN"] as Role[],
  gallery_delete: ["MANAGER", "ADMIN"] as Role[],
  gallery_upload: ["MANAGER", "AGENSI", "ADMIN", "USER"] as Role[],

  // Settings
  settings_maintenance: ["MANAGER"] as Role[],
  settings_roles: ["MANAGER"] as Role[],

  // Admin panel access
  admin_access: ["MANAGER", "AGENSI", "ADMIN"] as Role[],
};

export function hasPermission(role: Role, permission: keyof typeof PERMISSIONS): boolean {
  return PERMISSIONS[permission].includes(role);
}

export function canAccessAdmin(role: Role): boolean {
  return PERMISSIONS.admin_access.includes(role);
}
