import { AlertTriangle } from "lucide-react";

export default function MaintenanceBanner() {
  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";
  if (!maintenanceMode) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm glass-dark rounded-xl p-4 border border-yellow-500/30">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-400">Maintenance Mode</p>
          <p className="text-xs text-light-base/60 mt-0.5">
            Platform sedang dalam mode maintenance
          </p>
        </div>
      </div>
    </div>
  );
}
