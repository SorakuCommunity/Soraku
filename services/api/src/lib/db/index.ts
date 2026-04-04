import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";
import * as communitySchema from "./schema";

// Community DB (soraku-komunitas project: jrgknsxqwuygcoocnnnb)
const communityClient = postgres(env.DATABASE_URL, { prepare: false });
export const db = drizzle(communityClient, { schema: communitySchema });

// Streaming DB (soraku-streaming project: qrplumamxikcxvaerlug)
// Only initialize if STREAMING_DATABASE_URL is provided
let streamingClient: ReturnType<typeof postgres> | null = null;
let streamingDb: ReturnType<typeof drizzle> | null = null;

if (env.STREAMING_DATABASE_URL) {
  streamingClient = postgres(env.STREAMING_DATABASE_URL, { prepare: false });
  streamingDb = drizzle(streamingClient, { schema: communitySchema });
}

export const streamDb = streamingDb;
