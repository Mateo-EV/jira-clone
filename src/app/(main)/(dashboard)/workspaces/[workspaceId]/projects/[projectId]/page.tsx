import { Button } from "@/components/ui/button"
import { getSession } from "@/features/auth/server/next-session"
import { isUserMember } from "@/features/members/server/next-member"
import ProjectAvatar from "@/features/projects/components/project-avatar"
import { getProjectById } from "@/features/projects/service"
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher"
import { PencilIcon } from "lucide-react"
import { Link } from "next-view-transitions"
import { notFound, redirect } from "next/navigation"

export default async function ProjectPage({
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
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.image}
            className="size-8"
          />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${workspaceId}/projects/${project.id}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher />
    </div>
  )
}
