declare module "cron" {
  export class CronJob {
    constructor(
      time: string | Date,
      onTick: () => void,
      onComplete?: () => void,
      start?: boolean,
      timezone?: string,
      context?: any
    );
    start(): void;
    stop(): void;
  }
  export function cron(time: string, onTick: () => void): CronJob;
}
