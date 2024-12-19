import { sessionMiddleware } from "@/features/auth/server/session"
import { getMemberByUserAndWorkspace } from "@/features/members/service"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import {
  createProject,
  deleteProjectById,
  getProjectById,
  getProjectsByWorkspace,
  updateProjectById
} from "../service"
import { createProjectSchema, updateProjectSchema } from "../schemas"
import { deleteFile, uploadFile } from "@/lib/uploadthing"
import { createId } from "@paralleldrive/cuid2"

const projectRouter = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async c => {
      const user = c.get("user")

      const { workspaceId } = c.req.valid("query")

      const member = await getMemberByUserAndWorkspace(user.id, workspaceId)

      if (!member) throw new HTTPException(401, { message: "Unauthorized" })

      const projects = await getProjectsByWorkspace(workspaceId, {
        id: true,
        name: true,
        image: true
      })

      return c.json({ data: projects })
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    zValidator("form", createProjectSchema),
    async c => {
      const user = c.get("user")

      const { name, image } = c.req.valid("form")
      const { workspaceId } = c.req.valid("query")

      const member = await getMemberByUserAndWorkspace(user.id, workspaceId)

      if (!member) throw new HTTPException(401, { message: "Unauthorized" })

      let imageUrl = null
      if (image) {
        const { data } = await uploadFile(image)

        if (!data)
          throw new HTTPException(500, { message: "Internal server error" })

        imageUrl = data.url
      }

      const projectData = {
        id: createId(),
        name,
        image: imageUrl,
        workspaceId,
        lastModifiedAt: new Date()
      }

      await createProject(projectData)

      return c.json({ data: { ...projectData } })
    }
  )
  .put(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", updateProjectSchema),
    async c => {
      const user = c.get("user")

      const { projectId } = c.req.param()

      const { name, image } = c.req.valid("form")

      const project = await getProjectById(projectId, {
        id: true,
        image: true,
        workspaceId: true
      })

      if (!project) throw new HTTPException(404, { message: "Not found" })

      const member = await getMemberByUserAndWorkspace(
        user.id,
        project.workspaceId
      )

      if (!member) throw new HTTPException(401, { message: "Unauthorized" })

      let imageUrl = undefined
      if (image) {
        if (project.image) {
          const { success } = await deleteFile(project.image.split("/f/")[1])

          if (!success)
            throw new HTTPException(500, { message: "Internal server error" })
        }

        const { data } = await uploadFile(image)

        if (!data)
          throw new HTTPException(500, { message: "Internal server error" })

        imageUrl = data.url
      }

      const projectData = {
        name,
        image: imageUrl
      }

      await updateProjectById(projectId, projectData)

      return c.json({
        data: {
          id: projectId,
          ...projectData,
          workspaceId: project.workspaceId,
          image: imageUrl ?? project.image
        }
      })
    }
  )
  .delete("/:projectId", sessionMiddleware, async c => {
    const user = c.get("user")

    const { projectId } = c.req.param()

    const project = await getProjectById(projectId, {
      id: true,
      image: true,
      workspaceId: true
    })

    if (!project) throw new HTTPException(404, { message: "Not found" })

    const member = await getMemberByUserAndWorkspace(
      user.id,
      project.workspaceId
    )

    if (!member) throw new HTTPException(401, { message: "Unauthorized" })

    if (project.image) {
      const { success } = await deleteFile(project.image.split("/f/")[1])

      if (!success)
        throw new HTTPException(500, { message: "Internal server error" })
    }

    await deleteProjectById(projectId)

    return c.json({ data: { workspaceId: project.workspaceId, projectId } })
  })

export default projectRouter
