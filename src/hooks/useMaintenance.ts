"use client";

import { useState, useEffect } from "react";

export function useMaintenance() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const res = await fetch("/api/settings/maintenance");
        if (res.ok) {
          const data = await res.json();
          setIsMaintenanceMode(data.enabled);
        }
      } catch {
        // Ignore
      } finally {
        setLoading(false);
      }
    };

    checkMaintenance();
  }, []);

  const toggleMaintenance = async (enabled: boolean) => {
    const res = await fetch("/api/settings/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
    if (res.ok) {
      setIsMaintenanceMode(enabled);
    }
  };

  return { isMaintenanceMode, loading, toggleMaintenance };
}
