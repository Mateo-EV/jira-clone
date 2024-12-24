"use client"

import { RiAddCircleFill } from "react-icons/ri"
import useGetProjects from "../api/use-get-projects"
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id"
import useProjectId from "@/features/workspaces/hooks/use-project-id"
import { cn } from "@/lib/shadcn"
import useCreateProjectModal from "../hook/use-create-project-modal"
import ProjectAvatar from "./project-avatar"
import { Link } from "next-view-transitions"

export default function SidebarProjects() {
  const workspaceId = useWorkspaceId()
  const projectId = useProjectId()
  const { data: projects } = useGetProjects(workspaceId)

  const { setOpen } = useCreateProjectModal()

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <RiAddCircleFill
          onClick={() => setOpen(true)}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {projects?.map(project => {
        const isActive = projectId === project.id

        return (
          <Link
            href={`/workspaces/${workspaceId}/projects/${project.id}`}
            key={project.id}
          >
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <ProjectAvatar image={project.image} name={project.name} />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
