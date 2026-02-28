"use client";

import { useState, useEffect, useCallback } from "react";
import type { DiscordStats } from "@/types";

const REFRESH_INTERVAL = 60_000;

export function useDiscord() {
  const [stats, setStats] = useState<DiscordStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/discord/stats");
      if (!res.ok) throw new Error("Failed to fetch Discord stats");
      const data = await res.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, loading, error, refresh: fetchStats };
}
