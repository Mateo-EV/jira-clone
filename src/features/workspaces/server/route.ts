import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { createWorkspaceSchema } from "../schemas"
import { sessionMiddleware } from "@/features/auth/server/session"
import {
  createMember,
  createWorkspace,
  generateInviteCode,
  getWorkspacesByUser
} from "../service"
import { createId } from "@paralleldrive/cuid2"
import { utapi } from "@/lib/uploadthing"
import { HTTPException } from "hono/http-exception"

const workspaceRouter = new Hono()
  .get("/", sessionMiddleware, async c => {
    const user = c.get("user")

    const workspaces = await getWorkspacesByUser(user.id)

    return c.json({ data: workspaces })
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createWorkspaceSchema),
    async c => {
      const { name, image } = c.req.valid("form")
      const user = c.get("user")

      let imageUrl = null
      if (image) {
        const { data } = await utapi.uploadFiles(image)

        if (!data)
          throw new HTTPException(500, { message: "Internal server error" })

        imageUrl = data.url
      }

      const workspaceId = createId()
      const workspaceData = {
        id: workspaceId,
        name,
        image: imageUrl,
        creatorId: user.id,
        inviteCode: generateInviteCode(10)
      }

      await createWorkspace(workspaceData)

      await createMember({ userId: user.id, workspaceId, role: "admin" })

      return c.json({ data: workspaceData })
    }
  )

export default workspaceRouter
