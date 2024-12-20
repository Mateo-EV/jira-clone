import { drizzle } from "drizzle-orm/neon-serverless"
import { Pool } from "@neondatabase/serverless"

import * as schema from "./schema"
import { env } from "@/data/env"

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: Pool | undefined
}

import { type Logger } from "drizzle-orm/logger"

class CustomLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log({ query, params })
  }
}

const conn =
  globalForDb.conn ?? new Pool({ connectionString: env.DATABASE_URL })
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn

export const db = drizzle(conn, {
  schema,
  logger: process.env.NODE_ENV !== "production" ? new CustomLogger() : false
})
