import "server-only"

import { db } from "@/lib/db"
import { membersTable, workspacesTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function createWorkspace(
  workspace: typeof workspacesTable.$inferInsert
) {
  await db.insert(workspacesTable).values(workspace)
}

export async function createMember(member: typeof membersTable.$inferInsert) {
  await db.insert(membersTable).values(member)
}

export async function getWorkspacesByUser(userId: string) {
  return await db
    .select({
      id: workspacesTable.id,
      name: workspacesTable.name,
      image: workspacesTable.image
    })
    .from(workspacesTable)
    .innerJoin(membersTable, eq(membersTable.workspaceId, workspacesTable.id))
    .where(eq(membersTable.userId, userId))
}

export function generateInviteCode(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}
