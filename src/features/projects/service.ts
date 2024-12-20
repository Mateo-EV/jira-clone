import { db } from "@/lib/db"
import { projectsTable, tasksTable } from "@/lib/db/schema"
import { and, desc, eq, ilike, sql } from "drizzle-orm"

export async function getProjectsByWorkspace(
  workspaceId: string,
  columns?: ColumnsSelection<typeof projectsTable.$inferSelect>
) {
  return await db.query.projectsTable.findMany({
    where: eq(projectsTable.workspaceId, workspaceId),
    columns,
    orderBy: desc(projectsTable.lastModifiedAt)
  })
}

export async function createProject(
  project: typeof projectsTable.$inferInsert
) {
  await db.insert(projectsTable).values(project)
}

export async function getProjectById(
  projectId: string,
  columns?: ColumnsSelection<typeof projectsTable.$inferSelect>
) {
  return (
    (await db.query.projectsTable.findFirst({
      where: eq(projectsTable.id, projectId),
      columns
    })) ?? null
  )
}

export async function updateProjectById(
  projectId: string,
  project: Undefine<typeof projectsTable.$inferSelect>
) {
  await db
    .update(projectsTable)
    .set(project)
    .where(eq(projectsTable.id, projectId))
}

export async function deleteProjectById(projectId: string) {
  await db.delete(projectsTable).where(eq(projectsTable.id, projectId))
}

interface GetTaskFilteredProps {
  workspaceId: string
  projectId?: string | null
  status?: number | null
  assigneeId?: string | null
  search?: string | null
  dueDate?: Date | null
}

export async function getTaskFilteredWithAsigneesAndMembers({
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
