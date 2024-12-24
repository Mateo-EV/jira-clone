import { db } from "@/lib/db"
import { tasksTable } from "@/lib/db/schema"
import { and, asc, eq, ilike, inArray, sql } from "drizzle-orm"

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

export async function getTaskById(
  taskId: string,
  columns?: ColumnsSelection<typeof tasksTable.$inferSelect>
) {
  return (
    (await db.query.tasksTable.findFirst({
      where: eq(tasksTable.id, taskId),
      columns
    })) ?? null
  )
}

export async function getTaskByIdWithAsigneeAndProject(
  taskId: string,
  columns?: ColumnsSelection<typeof tasksTable.$inferSelect>
) {
  return (
    (await db.query.tasksTable.findFirst({
      where: eq(tasksTable.id, taskId),
      columns,
      with: {
        project: true,
        assignee: { columns: { id: true, name: true, email: true } }
      }
    })) ?? null
  )
}

export async function deleteTaskById(taskId: string) {
  await db.delete(tasksTable).where(eq(tasksTable.id, taskId))
}

export async function updateTaskById(
  taskId: string,
  task: Undefine<typeof tasksTable.$inferSelect>
) {
  await db.update(tasksTable).set(task).where(eq(tasksTable.id, taskId))
}

interface GetTaskFilteredProps {
  workspaceId: string
  projectId?: string | null
  status?: number | null
  assigneeId?: string | null
  search?: string | null
  dueDate?: Date | null
}

export async function getTaskFilteredWithAsigneeAndProject({
  workspaceId,
  projectId,
  assigneeId,
  dueDate,
  search,
  status
}: GetTaskFilteredProps) {
  return await db.query.tasksTable.findMany({
    where: and(
      eq(tasksTable.workspaceId, workspaceId),
      projectId ? eq(tasksTable.projectId, projectId) : undefined,
      assigneeId ? eq(tasksTable.assigneeId, assigneeId) : undefined,
      status ? eq(tasksTable.status, status) : undefined,
      dueDate ? eq(tasksTable.dueDate, dueDate) : undefined,
      search ? ilike(tasksTable.name, sql`%${search}%`) : undefined
    ),
    with: {
      assignee: { columns: { id: true, name: true, email: true } },
      project: true
    }
  })
}

export async function getTasksByIds(taskIds: string[]) {
  return await db.query.tasksTable.findMany({
    where: inArray(tasksTable.id, taskIds)
  })
}
