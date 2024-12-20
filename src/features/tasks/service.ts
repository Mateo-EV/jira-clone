import { db } from "@/lib/db"
import { tasksTable } from "@/lib/db/schema"
import { and, asc, eq } from "drizzle-orm"

export async function getHighestPositionTaskByWorkspaceIdAndStatus(
  workspaceId: string,
  status: number
) {
  return (
    (
      await db.query.tasksTable.findFirst({
        where: and(
          eq(tasksTable.workspaceId, workspaceId),
          eq(tasksTable.status, status)
        ),
        orderBy: asc(tasksTable.position),
        columns: { position: true }
      })
    )?.position ?? null
  )
}

export async function createTask(task: typeof tasksTable.$inferInsert) {
  await db.insert(tasksTable).values(task)
}
