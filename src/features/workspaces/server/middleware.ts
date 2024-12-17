import { Session } from "@/features/auth/server/session"
import { getMemberByUserAndWorkspace } from "@/features/members/service"
import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"

export const memberIsAdminMiddleware = createMiddleware(async (c, next) => {
  const user = c.get("user") as Session
  const workspaceId = c.req.param("workspaceId")!

  const member = await getMemberByUserAndWorkspace(user.id, workspaceId)

  if (!member || member.role !== "admin") {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  await next()
})
