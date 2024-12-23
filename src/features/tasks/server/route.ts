import { sessionMiddleware } from "@/features/auth/server/session"
import { getMemberByUserAndWorkspace } from "@/features/members/service"
import { getProjectById } from "@/features/projects/service"
import { zValidator } from "@hono/zod-validator"
import { createId } from "@paralleldrive/cuid2"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { TASK_STATUS } from "../constant"
import { createTaskSchema } from "../schemas"
import {
  createTask,
  deleteTaskById,
  getHighestPositionTaskByWorkspaceIdAndStatus,
  getTaskById,
  getTaskByIdWithAsigneeAndProject,
  getTaskFilteredWithAsigneeAndProject,
  updateTaskById
} from "../service"

const taskRouter = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.coerce
          .number()
          .int()
          .refine(e => TASK_STATUS[e] !== undefined, {
            message: "Invalid status"
          })
          .nullish(),
        search: z.string().nullish(),
        dueDate: z.coerce.date().nullish()
      })
    ),
    async c => {
      const user = c.get("user")
      const { workspaceId, projectId, assigneeId, status, search, dueDate } =
        c.req.valid("query")

      const member = await getMemberByUserAndWorkspace(user.id, workspaceId)

      if (!member) throw new HTTPException(401, { message: "Unauthorized" })

      const tasksFiltered = await getTaskFilteredWithAsigneeAndProject({
        workspaceId,
        projectId,
        assigneeId,
        dueDate,
        search,
        status
      })

      return c.json({ data: tasksFiltered })
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async c => {
      const user = c.get("user")

      const { name, status, description, assigneeId, dueDate, projectId } =
        c.req.valid("json")

      const project = await getProjectById(projectId, {
        id: true,
        workspaceId: true
      })

      if (!project) throw new HTTPException(404, { message: "Not found" })

      const member = await getMemberByUserAndWorkspace(
        user.id,
        project.workspaceId
      )

      if (!member) throw new HTTPException(401, { message: "Unauthorized" })

      const assigneeMember = await getMemberByUserAndWorkspace(
        assigneeId,
        project.workspaceId
      )

      if (!assigneeMember)
        throw new HTTPException(400, { message: "Invalid assigned member" })

      const highestPositionTask =
        await getHighestPositionTaskByWorkspaceIdAndStatus(
          project.workspaceId,
          status
        )

      const newPosition = highestPositionTask
        ? highestPositionTask + 1000
        : 1000

      const taskData = {
        id: createId(),
        name,
        status,
        description,
        dueDate,
        assigneeId,
        position: newPosition,
        workspaceId: project.workspaceId,
        projectId
      }

      await createTask(taskData)

      return c.json({ data: taskData })
    }
  )
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async c => {
      const user = c.get("user")

      const { taskId } = c.req.param()

      const { name, status, description, assigneeId, dueDate, projectId } =
        c.req.valid("json")

      const task = await getTaskById(taskId, { workspaceId: true })

      if (!task) throw new HTTPException(404, { message: "Not found" })

      if (projectId) {
        const project = await getProjectById(projectId, {
          id: true,
          workspaceId: true
        })

        if (!project) throw new HTTPException(404, { message: "Not found" })

        if (task.workspaceId !== project.workspaceId)
          throw new HTTPException(403, { message: "Forbidden" })

        const member = await getMemberByUserAndWorkspace(
          user.id,
          project.workspaceId
        )

        if (!member) throw new HTTPException(401, { message: "Unauthorized" })
      } else {
        const member = await getMemberByUserAndWorkspace(
          user.id,
          task.workspaceId
        )

        if (!member) throw new HTTPException(401, { message: "Unauthorized" })
      }

      if (assigneeId) {
        const assigneeMember = await getMemberByUserAndWorkspace(
          assigneeId,
          task.workspaceId
        )

        if (!assigneeMember)
          throw new HTTPException(400, { message: "Invalid assigned member" })
      }

      const taskData = {
        name,
        status,
        description,
        dueDate,
        assigneeId,
        projectId
      }

      await updateTaskById(taskId, taskData)

      return c.json({ data: { ...taskData, workspaceId: task.workspaceId } })
    }
  )
  .get("/:taskId", sessionMiddleware, async c => {
    const user = c.get("user")

    const { taskId } = c.req.param()

    const task = await getTaskByIdWithAsigneeAndProject(taskId)

    if (!task) throw new HTTPException(404, { message: "Not found" })

    const member = await getMemberByUserAndWorkspace(user.id, task.workspaceId)

    if (!member) throw new HTTPException(404, { message: "Unauthorized" })

    return c.json({ data: task })
  })
  .delete("/:taskId", sessionMiddleware, async c => {
    const user = c.get("user")

    const { taskId } = c.req.param()

    const task = await getTaskById(taskId, { workspaceId: true })

    if (!task) throw new HTTPException(404, { message: "Not found" })

    const member = await getMemberByUserAndWorkspace(user.id, task.workspaceId)

    if (!member) throw new HTTPException(404, { message: "Unauthorized" })

    await deleteTaskById(taskId)

    return c.json({ success: true, data: { workspaceId: task.workspaceId } })
  })

export default taskRouter
