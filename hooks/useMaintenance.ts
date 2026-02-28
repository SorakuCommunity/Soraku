"use client";

import { useState, useEffect } from "react";

export function useMaintenance() {
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    fetch("/api/maintenance")
      .then((r) => r.json())
      .then((d) => setIsMaintenance(d.maintenance ?? false))
      .catch(() => {});
  }, []);

  return { isMaintenance };
}
