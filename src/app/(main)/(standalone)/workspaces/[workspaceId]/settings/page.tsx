import { getSession } from "@/features/auth/server/next-session"
import { getMemberByUserAndWorkspace } from "@/features/members/service"
import EditWorkspaceForm from "@/features/workspaces/components/edit-workspace-form"
import { getWorkspaceById } from "@/features/workspaces/service"
import { notFound, redirect } from "next/navigation"

export default async function WorkspaceIdSettingsPage({
  params
}: {
  params: Promise<{ workspaceId: string }>
}) {
  const session = await getSession()

  if (!session) redirect("/sign-in")

  const { workspaceId } = await params

  const member = await getMemberByUserAndWorkspace(session.id, workspaceId)

  if (!member || member.role !== "admin") return notFound()

  const workspace = await getWorkspaceById(workspaceId)

  if (!workspace) return notFound()

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm workspace={workspace} />
    </div>
  )
}
