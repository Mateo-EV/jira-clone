import { getSession } from "@/features/auth/server/next-session"
import { isUserMember } from "@/features/members/server/next-member"
import EditProjectForm from "@/features/projects/components/edit-project-form"
import { getProjectById } from "@/features/projects/service"
import { notFound, redirect } from "next/navigation"

export default async function ProjectSettingsPage({
  params
}: {
  params: Promise<{ projectId: string; workspaceId: string }>
}) {
  const session = await getSession()

  if (!session) redirect("/sign-in")

  const { projectId, workspaceId } = await params

  const isMember = await isUserMember(workspaceId)

  if (!isMember) notFound()

  const project = await getProjectById(projectId, {
    id: true,
    name: true,
    image: true
  })

  if (!project) notFound()

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm project={project} />
    </div>
  )
}
