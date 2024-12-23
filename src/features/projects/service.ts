import { db } from "@/lib/db"
import { projectsTable } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"

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
