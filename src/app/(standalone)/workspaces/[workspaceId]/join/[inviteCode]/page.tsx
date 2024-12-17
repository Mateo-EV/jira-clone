import { getSession } from "@/features/auth/server/next-session"
import { getMemberByUserAndWorkspace } from "@/features/members/service"
import JoinWorkspaceForm from "@/features/workspaces/components/join-workspace-form"
import { getWorkspaceById } from "@/features/workspaces/service"
import { notFound, redirect } from "next/navigation"

export default async function WorkspaceJoinPage({
  params
}: {
  params: Promise<{ workspaceId: string }>
}) {
  const session = await getSession()

  if (!session) redirect("/sign-in")

  const { workspaceId } = await params

  const workspace = await getWorkspaceById(workspaceId, { name: true })

  if (!workspace) return notFound()

  const member = await getMemberByUserAndWorkspace(session.id, workspaceId)

  if (member) return redirect(`/workspaces/${workspaceId}`)

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm name={workspace.name} />
    </div>
  )
}
