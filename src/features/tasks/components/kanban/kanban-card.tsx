import { MoreHorizontalIcon } from "lucide-react"
import useGetTasks from "../../api/use-get-tasks"
import TaskActions from "../datatable/task-actions"
import DottedSeparator from "@/components/dotted-separator"
import MemberAvatar from "@/features/members/components/member-avatar"
import TaskDate from "../datatable/task-date"
import ProjectAvatar from "@/features/projects/components/project-avatar"

type KanbanCardProps = {
  task: NonNullable<ReturnType<typeof useGetTasks>["data"]>[number]
}

export default function KanbanCard({ task }: KanbanCardProps) {
  return (
    <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-x-2">
        <p className="truncate">{task.name}</p>
        <TaskActions id={task.id} projectId={task.projectId}>
          <MoreHorizontalIcon className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
        </TaskActions>
      </div>
      <DottedSeparator />
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar
          name={task.assignee.name}
          fallbackClassName="text-[10px]"
        />
        <div className="size-1 rounded-full bg-neutral-300" />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar
          name={task.project.name}
          image={task.project.image}
          fallbackClassName="text-[10px]"
        />
        <span className="text-xs">{task.project.name}</span>
      </div>
    </div>
  )
}
