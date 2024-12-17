import { getSession } from "@/features/auth/server/next-session"
import { getFirstWorkspaceByUser } from "@/features/workspaces/service"
import { redirect, RedirectType } from "next/navigation"

export default async function MainPage() {
  const session = await getSession()

  if (!session) redirect("/sign-in")

  const workspace = await getFirstWorkspaceByUser(session.id)

  if (workspace) {
    redirect(`/workspaces/${workspace.id}`, RedirectType.replace)
  } else {
    redirect("/workspaces/create", RedirectType.replace)
  }
}
