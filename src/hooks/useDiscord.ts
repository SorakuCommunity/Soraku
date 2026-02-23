"use client";

import { useState, useEffect } from "react";

interface DiscordStats {
  totalMembers: number;
  onlineMembers: number;
  guildName: string;
  guildIcon: string | null;
  cachedAt: number;
}

export function useDiscord(refreshInterval = 60000) {
  const [stats, setStats] = useState<DiscordStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
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
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { stats, loading, error, refetch: fetchStats };
}
