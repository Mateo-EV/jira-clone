import { sessionMiddleware } from "@/features/auth/server/session"
import { getMemberByUserAndWorkspace } from "@/features/members/service"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { createProject, getProjectsByWorkspace } from "../service"
import { createProjectSchema } from "../schemas"
import { uploadFile } from "@/lib/uploadthing"
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

      const projectData = { id: createId(), name, image: imageUrl, workspaceId }

      await createProject(projectData)

      return c.json({ data: projectData })
    }
  )

export default projectRouter
