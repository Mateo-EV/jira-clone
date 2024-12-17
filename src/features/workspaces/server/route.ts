import { sessionMiddleware } from "@/features/auth/server/session"
import { deleteFile, uploadFile } from "@/lib/uploadthing"
import { zValidator } from "@hono/zod-validator"
import { createId } from "@paralleldrive/cuid2"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas"
import {
  createWorkspace,
  deleteWorkspaceById,
  generateInviteCode,
  getWorkspaceById,
  getWorkspacesByUser,
  updateWorkspaceById
} from "../service"
import { memberIsAdminMiddleware } from "./middleware"
import {
  createMember,
  getMemberByUserAndWorkspace
} from "@/features/members/service"

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

      const workspaceId = createId()

      let imageUrl = null
      if (image) {
        const { data } = await uploadFile(image)

        if (!data)
          throw new HTTPException(500, { message: "Internal server error" })

        imageUrl = data.url
      }
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
  .put(
    "/:workspaceId",
    sessionMiddleware,
    memberIsAdminMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async c => {
      const { workspaceId } = c.req.param()

      const { name, image } = c.req.valid("form")

      const workspace = await getWorkspaceById(workspaceId, { image: true })

      if (!workspace) throw new HTTPException(404, { message: "Not found" })

      let imageUrl = undefined
      if (image) {
        if (workspace.image) {
          const { success } = await deleteFile(workspace.image.split("/f/")[1])

          if (!success)
            throw new HTTPException(500, { message: "Internal server error" })
        }

        const { data } = await uploadFile(image)

        if (!data)
          throw new HTTPException(500, { message: "Internal server error" })

        imageUrl = data.url
      }

      const workspaceData = {
        id: workspaceId,
        name,
        image: imageUrl
      }

      await updateWorkspaceById(workspaceId, { name, image: imageUrl })

      return c.json({ data: workspaceData })
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async c => {
    const user = c.get("user")

    const { workspaceId } = c.req.param()

    const workspace = await getWorkspaceById(workspaceId, {
      id: true,
      creatorId: true,
      image: true
    })

    if (!workspace) throw new HTTPException(404, { message: "Not found" })

    if (workspace.creatorId !== user.id)
      throw new HTTPException(404, { message: "Not found" })

    if (workspace.image) {
      const { success } = await deleteFile(workspace.image.split("/f/")[1])

      if (!success)
        throw new HTTPException(500, { message: "Internal server error" })
    }

    await deleteWorkspaceById(workspaceId)

    return c.json({ success: true })
  })
  .patch(
    "/:workspaceId/reset-invite-code",
    sessionMiddleware,
    memberIsAdminMiddleware,
    async c => {
      const { workspaceId } = c.req.param()

      const inviteCode = generateInviteCode(10)

      await updateWorkspaceById(workspaceId, { inviteCode })

      return c.json({ data: { inviteCode } })
    }
  )
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async c => {
      const { workspaceId } = c.req.param()

      const { code } = c.req.valid("json")
      const user = c.get("user")

      const workspace = await getWorkspaceById(workspaceId, {
        id: true,
        inviteCode: true
      })

      if (!workspace)
        throw new HTTPException(404, { message: "Workspace not found" })

      if (workspace.inviteCode !== code)
        throw new HTTPException(404, { message: "Invalid invite code" })

      const member = await getMemberByUserAndWorkspace(user.id, workspaceId)

      if (member) throw new HTTPException(400, { message: "Already a member" })

      const memberData = {
        userId: user.id,
        workspaceId,
        role: "member"
      } as const

      await createMember(memberData)

      return c.json({ data: memberData })
    }
  )

export default workspaceRouter
