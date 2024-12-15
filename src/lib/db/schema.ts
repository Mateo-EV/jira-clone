import { createId } from "@paralleldrive/cuid2"
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core"

const id = varchar("id", { length: 30 })
  .primaryKey()
  .$defaultFn(() => createId())

export const usersTable = pgTable("users", {
  id,
  name: varchar("name", { length: 191 }).notNull(),
  email: varchar("email", { length: 191 }).notNull().unique(),
  password: varchar("password", { length: 191 }).notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
    precision: 0
  })
    .notNull()
    .defaultNow()
})
