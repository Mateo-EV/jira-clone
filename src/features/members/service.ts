import { db } from "@/lib/db"
import { membersTable } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"

export async function createMember(member: typeof membersTable.$inferInsert) {
  await db.insert(membersTable).values(member)
}

export async function getMemberByUserAndWorkspace(
  userId: string,
  workspaceId: string
) {
  return (
    (await db.query.membersTable.findFirst({
      where: and(
        eq(membersTable.userId, userId),
        eq(membersTable.workspaceId, workspaceId)
      )
    })) ?? null
  )
}

export async function getMembersWithUserByWorkspace(workspaceId: string) {
  return await db.query.membersTable.findMany({
    where: eq(membersTable.workspaceId, workspaceId),
    with: { user: { columns: { name: true, email: true } } }
  })
}

export async function deleteMemberByUserAndWorkspace(
  userId: string,
  workspaceId: string
) {
  await db
    .delete(membersTable)
    .where(
      and(
        eq(membersTable.userId, userId),
        eq(membersTable.workspaceId, workspaceId)
      )
    )
}

export async function updateMember(
  userId: string,
  workspaceId: string,
  member: Undefine<typeof membersTable.$inferSelect>
) {
  await db
    .update(membersTable)
    .set(member)
    .where(
      and(
        eq(membersTable.userId, userId),
        eq(membersTable.workspaceId, workspaceId)
      )
    )
}
