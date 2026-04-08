import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";
import * as communitySchema from "./schema";

function createDb(url: string | undefined) {
  if (!url) return null;
  const client = postgres(url, { prepare: false });
  return drizzle(client, { schema: communitySchema });
}

export const db = createDb(env.DB_URL);
export const streamDb = createDb(env.DB_STREAM_URL);
