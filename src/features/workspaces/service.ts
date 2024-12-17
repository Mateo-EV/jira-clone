import "server-only"

import { db } from "@/lib/db"
import { membersTable, workspacesTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function createWorkspace(
  workspace: typeof workspacesTable.$inferInsert
) {
  await db.insert(workspacesTable).values(workspace)
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

export async function getFirstWorkspaceByUser(userId: string) {
  const [workspace] = await db
    .select({
      id: workspacesTable.id,
      name: workspacesTable.name,
      image: workspacesTable.image
    })
    .from(workspacesTable)
    .innerJoin(membersTable, eq(membersTable.workspaceId, workspacesTable.id))
    .where(eq(membersTable.userId, userId))
    .limit(1)

  return (workspace ?? null) as typeof workspace | null
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

export async function getWorkspaceById(
  workspaceId: string,
  columns?: ColumnsSelection<typeof workspacesTable.$inferSelect>
) {
  return (
    (await db.query.workspacesTable.findFirst({
      where: eq(workspacesTable.id, workspaceId),
      columns
    })) ?? null
  )
}

export async function updateWorkspaceById(
  workspaceId: string,
  workspace: Undefine<typeof workspacesTable.$inferSelect>
) {
  await db
    .update(workspacesTable)
    .set(workspace)
    .where(eq(workspacesTable.id, workspaceId))
}

export async function deleteWorkspaceById(workspaceId: string) {
  await db.delete(workspacesTable).where(eq(workspacesTable.id, workspaceId))
}
