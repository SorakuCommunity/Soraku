// @soraku/scheduler — Automation, cron jobs, dan background tasks
// Usage:
//   import { registerJob, getAllJobs } from "@/lib/scheduler"

import type { SorakuApiClient } from "@soraku/utils";

// ── Job Interface ──────────────────────────────────────────────────

export interface ScheduledJob {
  name: string;
  description: string;
  cron: string; // cron expression
  handler: (api: SorakuApiClient) => Promise<void>;
  enabled: boolean;
}

// ── Scheduler ─────────────────────────────────────────────────────

const jobs = new Map<string, ScheduledJob>();

export function registerJob(job: ScheduledJob) {
  jobs.set(job.name, job);
}

export function getJob(name: string): ScheduledJob | undefined {
  return jobs.get(name);
}

export function getAllJobs(): ScheduledJob[] {
  return Array.from(jobs.values());
}

export function getEnabledJobs(): ScheduledJob[] {
  return Array.from(jobs.values()).filter((job) => job.enabled);
}

// ── Predefined Jobs ──────────────────────────────────────────────

export const SUPPORTER_EXPIRY_JOB: ScheduledJob = {
  name: "supporter-expiry-check",
  description: "Check expired supporters and downgrade roles",
  cron: "0 0 * * *", // Daily at midnight
  handler: async (api) => {
    console.log("[Scheduler] Checking supporter expiry...");
    // TODO: Implement via API call
  },
  enabled: true,
};

export const ANALYTICS_SYNC_JOB: ScheduledJob = {
  name: "analytics-sync",
  description: "Sync Discord stats, member counts",
  cron: "0 */6 * * *", // Every 6 hours
  handler: async (api) => {
    console.log("[Scheduler] Syncing analytics...");
    // TODO: Implement via API call
  },
  enabled: true,
};

export const CLEANUP_NOTIFICATIONS_JOB: ScheduledJob = {
  name: "cleanup-old-notifications",
  description: "Delete notifications older than 90 days",
  cron: "0 3 * * 0", // Weekly on Sunday at 3 AM
  handler: async (api) => {
    console.log("[Scheduler] Cleaning up old notifications...");
    // TODO: Implement via API call
  },
  enabled: true,
};

// Auto-register jobs
registerJob(SUPPORTER_EXPIRY_JOB);
registerJob(ANALYTICS_SYNC_JOB);
registerJob(CLEANUP_NOTIFICATIONS_JOB);
