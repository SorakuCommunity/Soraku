export function isMaintenanceMode(): boolean {
  return process.env.MAINTENANCE_MODE === "true";
}

export async function checkMaintenanceFromDB(): Promise<boolean> {
  // Could be extended to check a DB flag for dynamic toggling
  return isMaintenanceMode();
}
