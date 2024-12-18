import { getSession } from "@/features/auth/server/next-session"
import { cache } from "react"
import { getMemberByUserAndWorkspace } from "../service"

export const isUserMember = cache(async (workspaceId: string) => {
  const session = await getSession()

  if (!session) return false

  const member = await getMemberByUserAndWorkspace(session.id, workspaceId)

  return Boolean(member)
})
