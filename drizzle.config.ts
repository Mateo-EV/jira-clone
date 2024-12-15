import { env } from "@/data/env"
import { type Config } from "drizzle-kit"

export default {
  schema: "./src/lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL
  }
} satisfies Config
