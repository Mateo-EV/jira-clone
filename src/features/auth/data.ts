import { db } from "@/lib/db"
import { usersTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function createUser(user: typeof usersTable.$inferInsert) {
  await db.insert(usersTable).values(user)
}

export async function existsUserEmail(email: string) {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
    columns: { id: true }
  })

  return Boolean(user?.id)
}

export async function getUserByEmail(email: string) {
  return await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
    columns: { id: true, name: true, password: true }
  })
}
