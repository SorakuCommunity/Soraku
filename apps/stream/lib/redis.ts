import { Redis } from "ioredis";

const REDIS_URL: string | undefined = process.env.REDIS_URL;
const REDIS_TOKEN: string | undefined = process.env.REDIS_TOKEN;

let redisInstance: Redis | null = null;
let isRedisAvailable = false;

function createRedisClient(): Redis | null {
  if (!REDIS_URL || !REDIS_TOKEN) {
    return null;
  }

  const client = new Redis({
    url: REDIS_URL,
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) {
        console.error("Redis connection failed after 3 retries");
        return null;
      }
      return Math.min(times * 100, 1000);
    },
    enableOfflineQueue: false,
    connectTimeout: 5000,
    commandTimeout: 3000,
    lazyConnect: true
  });

  client.on("error", (err: Error) => {
    console.error("Redis error: ", err.message);
    isRedisAvailable = false;
  });

  client.on("connect", () => {
    console.log("Redis connected");
    isRedisAvailable = true;
  });

  client.on("ready", () => {
    isRedisAvailable = true;
  });

  client.on("close", () => {
    isRedisAvailable = false;
  });

  return client;
}

if (REDIS_URL && REDIS_TOKEN) {
  redisInstance = createRedisClient();
} else {
  console.warn(
    "REDIS_URL or REDIS_TOKEN is not defined. Redis caching will be disabled."
  );
}

// Safe wrapper that mimics Redis interface but won't crash
const safeRedis = {
  async get(key: string): Promise<string | null> {
    if (!redisInstance || !isRedisAvailable) return null;
    try {
      if (redisInstance.status === "wait" || redisInstance.status === "end") {
        return null;
      }
      return await redisInstance.get(key);
    } catch (error) {
      console.error("Redis get error:", error);
      return null;
    }
  },

  async set(
    key: string,
    value: string,
    mode?: string,
    expireSeconds?: number
  ): Promise<boolean> {
    if (!redisInstance || !isRedisAvailable) return false;
    try {
      if (redisInstance.status === "wait" || redisInstance.status === "end") {
        return false;
      }
      if (mode === "EX" && expireSeconds) {
        await redisInstance.setex(key, expireSeconds, value);
      } else {
        await redisInstance.set(key, value);
      }
      return true;
    } catch (error) {
      console.error("Redis set error:", error);
      return false;
    }
  },

  async del(key: string): Promise<boolean> {
    if (!redisInstance || !isRedisAvailable) return false;
    try {
      if (redisInstance.status === "wait" || redisInstance.status === "end") {
        return false;
      }
      await redisInstance.del(key);
      return true;
    } catch (error) {
      console.error("Redis del error:", error);
      return false;
    }
  }
};

// Export safeRedis as redis for backward compatibility
// This ensures that any code calling redis.get() or redis.set() won't crash
export { safeRedis as redis, isRedisAvailable };

// Also export individual safe functions for explicit usage
export const safeRedisGet = safeRedis.get;
export const safeRedisSet = safeRedis.set;
export const safeRedisDel = safeRedis.del;
