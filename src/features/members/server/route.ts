import { sessionMiddleware } from "@/features/auth/server/session"
import { getWorkspaceById } from "@/features/workspaces/service"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import {
  deleteMemberByUserAndWorkspace,
  getMemberByUserAndWorkspace,
  getMembersWithUserByWorkspace,
  updateMember
} from "../service"

const memberRouter = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async c => {
      const user = c.get("user")
      const { workspaceId } = c.req.valid("query")

      const member = await getMemberByUserAndWorkspace(user.id, workspaceId)

      if (!member) throw new HTTPException(401, { message: "Unauthorized" })

      const members = await getMembersWithUserByWorkspace(workspaceId)

      return c.json({ data: members })
    }
  )
  .delete("/:workspaceId/:memberId", sessionMiddleware, async c => {
    const user = c.get("user")
    const { memberId: memberIdToDelete, workspaceId } = c.req.param()

    const workspace = await getWorkspaceById(workspaceId, { creatorId: true })

    if (!workspace) throw new HTTPException(404, { message: "Not found" })

    const member = await getMemberByUserAndWorkspace(user.id, workspaceId)

    if (!member) throw new HTTPException(401, { message: "Unauthorized" })

    const isAdmin = member.role === "admin"
    const isSamePerson = member.userId !== memberIdToDelete

    if (!isAdmin && !isSamePerson)
      throw new HTTPException(401, { message: "Unauthorized" })

    if (!isSamePerson && workspace.creatorId !== member.userId) {
      const memberToDelete = await getMemberByUserAndWorkspace(
        memberIdToDelete,
        workspaceId
      )

      if (!memberToDelete)
        throw new HTTPException(404, { message: "Not member found" })

      if (memberToDelete.role === "admin") {
        throw new HTTPException(401, { message: "Unauthorized" })
      }
    }

    if (isAdmin && isSamePerson && workspace.creatorId === member.userId) {
      throw new HTTPException(400, {
        message: "Cannot delete yourself from your proper workspace"
      })
    }

    await deleteMemberByUserAndWorkspace(memberIdToDelete, workspaceId)

    return c.json({ success: true })
  })
  .patch(
    "/:workspaceId/:memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.enum(["admin", "member"]) })),
    async c => {
      const user = c.get("user")
      const { memberId: memberIdToUpdate, workspaceId } = c.req.param()
      const { role } = c.req.valid("json")

      const workspace = await getWorkspaceById(workspaceId, { creatorId: true })

      if (!workspace) throw new HTTPException(404, { message: "Not found" })

      const member = await getMemberByUserAndWorkspace(user.id, workspaceId)

      if (!member || member.role !== "admin")
        throw new HTTPException(401, { message: "Unauthorized" })

      const isCreator = workspace.creatorId === member.userId

      if (!isCreator) {
        const memberToUpdate = await getMemberByUserAndWorkspace(
          memberIdToUpdate,
          workspaceId
        )

        if (!memberToUpdate)
          throw new HTTPException(404, { message: "Not member found" })

        if (memberToUpdate.role === "admin") {
          throw new HTTPException(401, { message: "Unauthorized" })
        }
      } else if (memberIdToUpdate === member.userId) {
        throw new HTTPException(400, {
          message: "Cannot update your proper role"
        })
      }

      await updateMember(member.userId, workspaceId, { role })

      return c.json({ data: { role } })
    }
  )

export default memberRouter
